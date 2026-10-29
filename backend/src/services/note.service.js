const prisma = require("../config/prisma");

async function createNote(userId, noteData) {
  const { title, content } = noteData;

  const note = await prisma.note.create({
    data: {
      title,
      content,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return note;
}

async function getNotes(userId, view = "active") {
  const where = { userId };
  if (view === "archive") {
    where.archivedAt = { not: null };
    where.deletedAt = null;
  } else if (view === "trash") {
    where.deletedAt = { not: null };
  } else {
    where.archivedAt = null;
    where.deletedAt = null;
  }
  return await prisma.note.findMany({
    where,
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
  });
}

async function getNoteById(userId, noteId) {
  return await prisma.note.findFirst({
    where: {
      id: Number(noteId),
      userId,
    },
  });
}

async function updateNote(userId, noteId, noteData) {
  const note = await prisma.note.findFirst({
    where: {
      id: Number(noteId),
      userId,
    },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  return await prisma.note.update({
    where: {
      id: Number(noteId),
    },
    data: {
      title: noteData.title,
      content: noteData.content,
    },
  });
}

async function deleteNote(userId, noteId) {
  const note = await prisma.note.findFirst({
    where: {
      id: Number(noteId),
      userId,
    },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  return await prisma.note.update({
    where: {
      id: Number(noteId),
    },
    data: { deletedAt: new Date() },
  });
}

async function setNotePinned(userId, noteId, isPinned) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), userId, deletedAt: null } });
  if (!note) throw new Error("Note not found");
  return prisma.note.update({ where: { id: note.id }, data: { isPinned: Boolean(isPinned) } });
}

async function setNoteArchived(userId, noteId, archived) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), userId, deletedAt: null } });
  if (!note) throw new Error("Note not found");
  return prisma.note.update({ where: { id: note.id }, data: { archivedAt: archived ? new Date() : null } });
}

async function restoreNote(userId, noteId) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), userId, deletedAt: { not: null } } });
  if (!note) throw new Error("Trashed note not found");
  return prisma.note.update({ where: { id: note.id }, data: { deletedAt: null, archivedAt: null } });
}

async function permanentlyDeleteNote(userId, noteId) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), userId, deletedAt: { not: null } } });
  if (!note) throw new Error("Trashed note not found");
  await prisma.note.delete({ where: { id: note.id } });

  return { message: "Note permanently deleted" };
}

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  setNotePinned,
  setNoteArchived,
  restoreNote,
  permanentlyDeleteNote,
};
