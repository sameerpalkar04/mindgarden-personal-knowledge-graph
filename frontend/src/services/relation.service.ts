import api from "./api";

export function createRelation(
  sourceNoteId: number,
  targetNoteId: number
) {
  return api.post("/relations", {
    sourceNoteId,
    targetNoteId,
  });
}