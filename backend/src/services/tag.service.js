const prisma = require("../config/prisma");

async function createTag(name) {
  return await prisma.tag.upsert({
    where: {
      name,
    },
    update: {},
    create: {
      name,
    },
  });
}

async function getTags() {
  return await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

async function attachTagToNote(noteId, tagId, userId) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), userId } });
  if (!note) throw new Error("Note not found");
  return await prisma.noteTag.create({
    data: {
      noteId: Number(noteId),
      tagId: Number(tagId),
    },
  });
}

async function getTagsForNote(noteId, userId) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), OR: [{ userId }, { shares: { some: { userId } } }] } });
  if (!note) throw new Error("Note not found");
  const noteTags = await prisma.noteTag.findMany({
    where: {
      noteId: Number(noteId),
    },
    include: {
      tag: true,
    },
  });

  return noteTags.map((nt) => nt.tag);
}

async function removeTagFromNote(noteId, tagId, userId) {
  const note = await prisma.note.findFirst({ where: { id: Number(noteId), userId } });
  if (!note) throw new Error("Note not found");
  await prisma.noteTag.delete({
    where: {
      noteId_tagId: {
        noteId: Number(noteId),
        tagId: Number(tagId),
      },
    },
  });

  return {
    message: "Tag removed successfully",
  };
}

module.exports = {
  createTag,
  getTags,
  attachTagToNote,
  getTagsForNote,
  removeTagFromNote,
};
