export interface NoteDraft {
  noteId: number | null;
  title: string;
  content: string;
  updatedAt: string;
}

function storageKey() {
  const token = localStorage.getItem("token") || "anonymous";
  return `mindgarden:drafts:${token.slice(-12)}`;
}

export function getDrafts(): NoteDraft[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(storageKey()) || "[]");
    return Array.isArray(parsed) ? parsed as NoteDraft[] : [];
  } catch { return []; }
}

export function findDraft(noteId: number | null): NoteDraft | undefined {
  return getDrafts().find(draft => draft.noteId === noteId);
}

export function saveDraft(draft: NoteDraft) {
  const drafts = getDrafts().filter(existing => existing.noteId !== draft.noteId);
  drafts.unshift(draft);
  try {
    localStorage.setItem(storageKey(), JSON.stringify(drafts.slice(0, 30)));
    window.dispatchEvent(new Event("mindgarden:drafts-change"));
  } catch { /* Keep the editor usable when browser storage is unavailable. */ }
}

export function removeDraft(noteId: number | null) {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(getDrafts().filter(draft => draft.noteId !== noteId)));
    window.dispatchEvent(new Event("mindgarden:drafts-change"));
  } catch { /* The saved note is still valid if draft cleanup fails. */ }
}
