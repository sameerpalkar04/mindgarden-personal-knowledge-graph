import api from "./api";

export function getTags() {
  return api.get("/tags");
}

export function createTag(name: string) {
  return api.post("/tags", {
    name,
  });
}

export function attachTag(noteId: number, tagId: number) {
  return api.post(`/tags/${noteId}`, {
    tagId,
  });
}

export function getTagsForNote(noteId: number) {
  return api.get(`/tags/${noteId}`);
}