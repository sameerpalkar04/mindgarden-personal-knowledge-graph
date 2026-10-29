const { randomUUID } = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const prisma = require("../config/prisma");

const uploadDirectory = path.join(__dirname, "../../uploads");
const maxBytes = 8 * 1024 * 1024;

async function assertNoteOwner(userId, noteId) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), userId } });
  if (!note) throw new Error("Note not found");
  return note;
}

async function listAttachments(userId, noteId) {
  await assertNoteOwner(userId, noteId);
  return prisma.noteAttachment.findMany({
    where: { noteId: Number(noteId) },
    select: { id: true, fileName: true, mimeType: true, size: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

async function createAttachment(userId, noteId, payload) {
  const note = await assertNoteOwner(userId, noteId);
  if (typeof payload.dataBase64 !== "string" || payload.dataBase64.length > Math.ceil(maxBytes * 4 / 3) + 8) {
    throw new Error("Attachments must be smaller than 8 MB");
  }
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(payload.dataBase64)) throw new Error("Attachment data is invalid");
  const data = Buffer.from(payload.dataBase64, "base64");
  if (!data.length || data.length > maxBytes) throw new Error("Attachments must be smaller than 8 MB");
  const fileName = path.basename(String(payload.fileName || "attachment")).replace(/[^\w.() -]/g, "_").slice(0, 150);
  const mimeType = String(payload.mimeType || "application/octet-stream").slice(0, 120);
  const storageKey = randomUUID();
  await fs.mkdir(uploadDirectory, { recursive: true });
  const filePath = path.join(uploadDirectory, storageKey);
  await fs.writeFile(filePath, data, { flag: "wx" });
  try {
    return await prisma.noteAttachment.create({
      data: { noteId: note.id, fileName: fileName || "attachment", mimeType, size: data.length, storageKey },
      select: { id: true, fileName: true, mimeType: true, size: true, createdAt: true },
    });
  } catch (error) {
    await fs.unlink(filePath).catch(() => {});
    throw error;
  }
}

async function findAttachment(userId, noteId, attachmentId) {
  await assertNoteOwner(userId, noteId);
  const attachment = await prisma.noteAttachment.findFirst({
    where: { id: Number(attachmentId), noteId: Number(noteId) },
  });
  if (!attachment) throw new Error("Attachment not found");
  return { ...attachment, filePath: path.join(uploadDirectory, attachment.storageKey) };
}

async function removeAttachment(userId, noteId, attachmentId) {
  const attachment = await findAttachment(userId, noteId, attachmentId);
  await prisma.noteAttachment.delete({ where: { id: attachment.id } });
  await fs.unlink(attachment.filePath).catch(() => {});
  return { message: "Attachment deleted" };
}

module.exports = { listAttachments, createAttachment, findAttachment, removeAttachment };
