import api from "./api";

export interface NoteShare {
  id: number;
  createdAt: string;
  user: { id: number; email: string; username: string };
}

export function getNoteShares(noteId: number) {
  return api.get(`/notes/${noteId}/shares`);
}

export function shareNote(noteId: number, email: string) {
  return api.post(`/notes/${noteId}/shares`, { email });
}

export function revokeNoteShare(noteId: number, shareId: number) {
  return api.delete(`/notes/${noteId}/shares/${shareId}`);
}
