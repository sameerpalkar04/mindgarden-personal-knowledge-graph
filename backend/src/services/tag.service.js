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

async function attachTagToNote(noteId, tagId) {
  return await prisma.noteTag.create({
    data: {
      noteId: Number(noteId),
      tagId: Number(tagId),
    },
  });
}

async function getTagsForNote(noteId) {
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

async function removeTagFromNote(noteId, tagId) {
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