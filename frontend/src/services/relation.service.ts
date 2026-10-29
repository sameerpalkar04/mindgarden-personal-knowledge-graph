import api from "./api";

export function getRelations() {
  return api.get("/relations");
}

export function createRelation(
  sourceNoteId: number,
  targetNoteId: number,
  label = "related",
) {
  return api.post("/relations", {
    sourceNoteId,
    targetNoteId,
    label,
  });
}
