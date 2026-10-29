const prisma = require("../config/prisma");

async function createRelation(sourceNoteId, targetNoteId, userId, label = "related") {
  sourceNoteId = Number(sourceNoteId);
  targetNoteId = Number(targetNoteId);

  const source = await prisma.note.findFirst({
    where: {
      id: sourceNoteId,
      userId,
    },
  });

  if (!source) {
    throw new Error("Source note not found");
  }

  const target = await prisma.note.findFirst({
    where: {
      id: targetNoteId,
      userId,
    },
  });

  if (!target) {
    throw new Error("Target note not found");
  }

  return prisma.noteRelation.upsert({
    where: {
      sourceNoteId_targetNoteId: {
        sourceNoteId,
        targetNoteId,
      },
    },
    update: { label: String(label || "related").trim().slice(0, 50) || "related" },
    create: {
      sourceNoteId,
      targetNoteId,
      label: String(label || "related").trim().slice(0, 50) || "related",
    },
  });
}

async function getRelations(userId) {
  return prisma.noteRelation.findMany({
    where: {
      sourceNote: {
        userId,
      },
    },
    include: {
      sourceNote: true,
      targetNote: true,
    },
  });
}

async function deleteRelation(sourceNoteId, targetNoteId) {
  await prisma.noteRelation.delete({
    where: {
      sourceNoteId_targetNoteId: {
        sourceNoteId: Number(sourceNoteId),
        targetNoteId: Number(targetNoteId),
      },
    },
  });

  return {
    message: "Relation deleted successfully",
  };
}

module.exports = {
  createRelation,
  getRelations,
  deleteRelation,
};
