import api from "./api";

export interface NoteAttachment {
  id: number;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

function toBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}

export function getAttachments(noteId: number) {
  return api.get(`/notes/${noteId}/attachments`);
}

export async function uploadAttachment(noteId: number, file: File) {
  return api.post(`/notes/${noteId}/attachments`, {
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    dataBase64: toBase64(await file.arrayBuffer()),
  });
}

export async function downloadAttachment(noteId: number, attachment: NoteAttachment) {
  const response = await api.get(`/notes/${noteId}/attachments/${attachment.id}`, { responseType: "blob" });
  const url = URL.createObjectURL(response.data as Blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = attachment.fileName;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function deleteAttachment(noteId: number, attachmentId: number) {
  return api.delete(`/notes/${noteId}/attachments/${attachmentId}`);
}
