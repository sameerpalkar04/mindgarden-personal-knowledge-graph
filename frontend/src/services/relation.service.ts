import api from "./api";

export function getRelations() {
  return api.get("/relations");
}

export function createRelation(
  sourceNoteId: number,
  targetNoteId: number
) {
  return api.post("/relations", {
    sourceNoteId,
    targetNoteId,
  });
}
