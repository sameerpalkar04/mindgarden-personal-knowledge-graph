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

async function getNotes(userId) {
  return await prisma.note.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
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

  await prisma.note.delete({
    where: {
      id: Number(noteId),
    },
  });

  return {
    message: "Note deleted successfully",
  };
}

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};