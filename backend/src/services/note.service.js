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
  const where = { OR: [{ userId }, { shares: { some: { userId } } }] };
  if (view === "archive") {
    where.archivedAt = { not: null };
    where.deletedAt = null;
  } else if (view === "trash") {
    where.deletedAt = { not: null };
  } else {
    where.archivedAt = null;
    where.deletedAt = null;
  }
  const notes = await prisma.note.findMany({
    where,
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    include: { tags: { include: { tag: true } } },
  });
  return notes.map(note => ({ ...note, isShared: note.userId !== userId }));
}

async function getNoteById(userId, noteId) {
  const note = await prisma.note.findFirst({
    where: {
      id: Number(noteId),
      OR: [{ userId }, { shares: { some: { userId } } }],
    },
  });
  return note ? { ...note, isShared: note.userId !== userId } : null;
}

async function shareNote(userId, noteId, email) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), userId, deletedAt: null } });
  if (!note) throw new Error("Note not found");
  const recipient = await prisma.user.findFirst({ where: { email: { equals: String(email || "").trim(), mode: "insensitive" } } });
  if (!recipient) throw new Error("No Mindgarden account was found for that email");
  if (recipient.id === userId) throw new Error("You already own this note");
  return prisma.noteShare.upsert({
    where: { noteId_userId: { noteId: note.id, userId: recipient.id } },
    update: {},
    create: { noteId: note.id, userId: recipient.id },
    include: { user: { select: { id: true, email: true, username: true } } },
  });
}

async function getNoteShares(userId, noteId) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), userId } });
  if (!note) throw new Error("Note not found");
  return prisma.noteShare.findMany({ where: { noteId: note.id }, include: { user: { select: { id: true, email: true, username: true } } }, orderBy: { createdAt: "asc" } });
}

async function revokeNoteShare(userId, noteId, shareId) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), userId } });
  if (!note) throw new Error("Note not found");
  const result = await prisma.noteShare.deleteMany({ where: { id: Number(shareId), noteId: note.id } });
  if (!result.count) throw new Error("Share not found");
  return { message: "Access removed" };
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

  if (note.title !== noteData.title || note.content !== noteData.content) {
    await prisma.noteRevision.create({ data: { noteId: note.id, title: note.title, content: note.content } });
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

async function getNoteHistory(userId, noteId) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), userId } });
  if (!note) throw new Error("Note not found");
  return prisma.noteRevision.findMany({ where: { noteId: note.id }, orderBy: { createdAt: "desc" } });
}

async function restoreNoteRevision(userId, noteId, revisionId) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), userId } });
  if (!note) throw new Error("Note not found");
  const revision = await prisma.noteRevision.findFirst({ where: { id: Number(revisionId), noteId: note.id } });
  if (!revision) throw new Error("Revision not found");
  await prisma.noteRevision.create({ data: { noteId: note.id, title: note.title, content: note.content } });
  return prisma.note.update({ where: { id: note.id }, data: { title: revision.title, content: revision.content } });
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

async function getOrCreateDailyNote(userId, dateValue) {
  const dayText = dateValue || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayText)) throw new Error("Date must use YYYY-MM-DD format");
  const dailyDate = new Date(`${dayText}T00:00:00.000Z`);
  if (Number.isNaN(dailyDate.getTime()) || dailyDate.toISOString().slice(0, 10) !== dayText) throw new Error("Invalid date");
  return prisma.note.upsert({
    where: { userId_dailyDate: { userId, dailyDate } },
    update: {},
    create: {
      userId,
      dailyDate,
      title: `Daily note · ${dayText}`,
      content: "## What’s on your mind today?\n\n## One thing I learned\n\n## Tomorrow\n- [ ] ",
    },
  });
}

async function setNoteReminder(userId, noteId, reminderAt) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), userId, deletedAt: null } });
  if (!note) throw new Error("Note not found");
  const parsed = reminderAt ? new Date(reminderAt) : null;
  if (parsed && Number.isNaN(parsed.getTime())) throw new Error("Invalid reminder date");
  return prisma.note.update({ where: { id: note.id }, data: { reminderAt: parsed } });
}

async function getReminders(userId) {
  return prisma.note.findMany({
    where: { userId, reminderAt: { not: null }, archivedAt: null, deletedAt: null },
    orderBy: { reminderAt: "asc" },
  });
}

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  shareNote,
  getNoteShares,
  revokeNoteShare,
  updateNote,
  getNoteHistory,
  restoreNoteRevision,
  deleteNote,
  setNotePinned,
  setNoteArchived,
  restoreNote,
  permanentlyDeleteNote,
  getOrCreateDailyNote,
  setNoteReminder,
  getReminders,
};
