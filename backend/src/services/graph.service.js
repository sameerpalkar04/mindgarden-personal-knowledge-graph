const prisma = require("../config/prisma");

async function getGraph(userId) {
  const notes = await prisma.note.findMany({
    where: {
      userId,
      archivedAt: null,
      deletedAt: null,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  const relations = await prisma.noteRelation.findMany({
    where: {
      sourceNote: { userId, archivedAt: null, deletedAt: null },
      targetNote: { userId, archivedAt: null, deletedAt: null },
    },
  });

  const nodes = notes.map((note) => ({
    id: note.id.toString(),
    data: {
      label: note.title,
      content: note.content,
      tags: note.tags.map((t) => t.tag.name),
    },
    position: {
      x: 0,
      y: 0,
    },
  }));

  const edges = relations.map((relation) => ({
    id: `${relation.sourceNoteId}-${relation.targetNoteId}`,
    source: relation.sourceNoteId.toString(),
    target: relation.targetNoteId.toString(),
    label: relation.label,
  }));

  return {
    nodes,
    edges,
  };
}

module.exports = {
  getGraph,
};
