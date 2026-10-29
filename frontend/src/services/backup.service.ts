import { getNotes, createNote, setNoteArchived, setNotePinned, deleteNote } from "./note.service";
import { getRelations, createRelation } from "./relation.service";
import { createTag, attachTag } from "./tag.service";

interface BackupNote {
  id?: number;
  title?: unknown;
  content?: unknown;
  tags?: unknown;
  isPinned?: boolean;
  archivedAt?: string | null;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

function tagNamesFrom(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(entry => {
    if (typeof entry === "string") return entry;
    if (typeof entry === "object" && entry !== null && "tag" in entry) {
      const tag = entry.tag;
      if (typeof tag === "object" && tag !== null && "name" in tag && typeof tag.name === "string") return tag.name;
    }
    return "";
  }).filter(Boolean);
}

function downloadFile(name: string, content: string, mimeType: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function parseCsv(source: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const text = source.replace(/^\uFEFF/, "");
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"' && quoted && text[index + 1] === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

export async function exportNotes(format: "json" | "csv" | "md") {
  const [active, archive, trash, relations] = await Promise.all([getNotes("active"), getNotes("archive"), getNotes("trash"), getRelations()]);
  const notes = [...active.data.data, ...archive.data.data, ...trash.data.data] as BackupNote[];
  if (format === "json") {
    downloadFile(`mindgarden-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ format: "mindgarden-backup", version: 1, exportedAt: new Date().toISOString(), notes, relations: relations.data.data }, null, 2), "application/json");
  } else if (format === "csv") {
    const header = ["title", "content", "tags", "isPinned", "archived", "trashed", "createdAt", "updatedAt"];
    const rows = notes.map(note => [note.title, note.content, tagNamesFrom(note.tags).join("|"), note.isPinned, Boolean(note.archivedAt), Boolean(note.deletedAt), note.createdAt, note.updatedAt]);
    downloadFile("mindgarden-notes.csv", [header, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n"), "text/csv;charset=utf-8");
  } else {
    const markdown = notes.map(note => `# ${note.title}\n\n${note.content}\n\n${tagNamesFrom(note.tags).length ? `**Tags:** ${tagNamesFrom(note.tags).join(", ")}\n\n` : ""}---`).join("\n\n");
    downloadFile("mindgarden-notes.md", markdown, "text/markdown;charset=utf-8");
  }
}

export async function importNotes(file: File) {
  if (file.size > 20 * 1024 * 1024) throw new Error("Please choose a file smaller than 20 MB.");
  const text = await file.text();
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "md" || extension === "markdown") {
    const title = file.name.replace(/\.(markdown|md)$/i, "").replaceAll("-", " ");
    await createNote(title || "Imported note", text);
    return 1;
  }

  let importedNotes: BackupNote[];
  let importedRelations: Array<{ sourceNoteId?: number; targetNoteId?: number; label?: string }> = [];
  if (extension === "csv") {
    const [header = [], ...rows] = parseCsv(text);
    const index = new Map(header.map((key, column) => [key.trim().toLowerCase(), column]));
    importedNotes = rows.filter(row => row.some(Boolean)).map(row => ({
      title: row[index.get("title") ?? -1] || "Imported note",
      content: row[index.get("content") ?? -1] || "",
      tags: (row[index.get("tags") ?? -1] || "").split("|").map(tag => tag.trim()).filter(Boolean),
      isPinned: row[index.get("ispinned") ?? -1] === "true",
      archivedAt: row[index.get("archived") ?? -1] === "true" ? new Date().toISOString() : null,
      deletedAt: row[index.get("trashed") ?? -1] === "true" ? new Date().toISOString() : null,
    }));
  } else {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null) throw new Error("This JSON file isn’t a Mindgarden backup or note list.");
    const record = parsed as { format?: string; notes?: unknown; relations?: unknown };
    if (record.format === "mindgarden-backup" && Array.isArray(record.notes)) {
      importedNotes = record.notes as BackupNote[];
      importedRelations = Array.isArray(record.relations) ? record.relations as typeof importedRelations : [];
    } else if (Array.isArray(parsed)) importedNotes = parsed as BackupNote[];
    else throw new Error("This JSON file isn’t a Mindgarden backup or note list.");
  }

  const importedIds = new Map<number, number>();
  for (const item of importedNotes) {
    if (typeof item.title !== "string" || typeof item.content !== "string") continue;
    const response = await createNote(item.title, item.content);
    const newId = response.data.data.id as number;
    if (typeof item.id === "number" && Number.isFinite(item.id)) importedIds.set(item.id, newId);
    const tagNames = tagNamesFrom(item.tags);
    for (const name of tagNames) {
      const tagResponse = await createTag(name);
      await attachTag(newId, tagResponse.data.data.id);
    }
    if (item.isPinned) await setNotePinned(newId, true);
    if (item.archivedAt) await setNoteArchived(newId, true);
    if (item.deletedAt) await deleteNote(newId);
  }
  for (const relation of importedRelations) {
    if (typeof relation.sourceNoteId !== "number" || typeof relation.targetNoteId !== "number") continue;
    const sourceId = importedIds.get(relation.sourceNoteId);
    const targetId = importedIds.get(relation.targetNoteId);
    if (sourceId && targetId) await createRelation(sourceId, targetId, relation.label || "related");
  }
  return importedIds.size || importedNotes.length;
}
