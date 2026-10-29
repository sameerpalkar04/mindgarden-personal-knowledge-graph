import api from "./api";

export type NoteView = "active" | "archive" | "trash";

export function getNotes(view: NoteView = "active") {
  return api.get("/notes", { params: { view } });
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

export function setNotePinned(id: number, isPinned: boolean) {
  return api.post(`/notes/${id}/pin`, { isPinned });
}

export function setNoteArchived(id: number, archived: boolean) {
  return api.post(`/notes/${id}/archive`, { archived });
}

export function restoreNote(id: number) {
  return api.post(`/notes/${id}/restore`);
}

export function permanentlyDeleteNote(id: number) {
  return api.delete(`/notes/${id}/permanent`);
}
