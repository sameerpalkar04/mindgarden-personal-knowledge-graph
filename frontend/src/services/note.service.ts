import api from "./api";

export function getNotes() {
  return api.get("/notes");
}

export function getNote(id: number) {
  return api.get(`/notes/${id}`);
}

export function createNote(title: string, content: string) {
  return api.post("/notes", {
    title,
    content,
  });
}

export function updateNote(
  id: number,
  title: string,
  content: string
) {
  return api.put(`/notes/${id}`, {
    title,
    content,
  });
}

export function deleteNote(id: number) {
  return api.delete(`/notes/${id}`);
}
