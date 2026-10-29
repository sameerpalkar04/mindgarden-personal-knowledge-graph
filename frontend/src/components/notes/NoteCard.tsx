import { useEffect, useMemo, useState } from "react";
import { Archive, ArrowDownToLine, ArrowUpRight, Bell, Link2, Paperclip, Pencil, Pin, PinOff, Plus, RotateCcw, Sparkles, Tag as TagIcon, Trash2, X } from "lucide-react";
import type { Note } from "../../types/note";
import type { Tag } from "../../types/tag";
import { getTags, getTagsForNote, createTag, attachTag } from "../../services/tag.service";
import { createRelation } from "../../services/relation.service";
import { getNotes, setNoteReminder } from "../../services/note.service";
import MarkdownPreview from "./MarkdownPreview";
import "../../markdown.css";
import type { NoteView } from "../../services/note.service";
import type { NoteRelation } from "../../types/relation";
import { deleteAttachment, downloadAttachment, getAttachments, type NoteAttachment, uploadAttachment } from "../../services/attachment.service";

interface Props { note: Note; view: NoteView; relations: NoteRelation[]; onDelete: (id: number) => void; onEdit: (note: Note) => void; onPin: (id: number, pinned: boolean) => void; onArchive: (id: number, archived: boolean) => void; onRestore: (id: number) => void; onPurge: (id: number) => void; onStatsChange: () => void; }

function toLocalInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function NoteCard({ note, view, relations, onDelete, onEdit, onPin, onArchive, onRestore, onPurge, onStatsChange }: Props) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [newTag, setNewTag] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedNote, setSelectedNote] = useState("");
  const [relationType, setRelationType] = useState("related");
  const [customRelation, setCustomRelation] = useState("");
  const [attachments, setAttachments] = useState<NoteAttachment[]>([]);
  const [attachmentStatus, setAttachmentStatus] = useState("");
  const [showTools, setShowTools] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [reminderValue, setReminderValue] = useState(() => toLocalInput(note.reminderAt));
  const [reminderStatus, setReminderStatus] = useState("");
  const outgoing = relations.filter(relation => relation.sourceNoteId === note.id);
  const incoming = relations.filter(relation => relation.targetNoteId === note.id);
  const suggestions = useMemo(() => {
    const stopWords = new Set(["the", "and", "for", "with", "that", "this", "from", "are", "you", "your", "was", "were", "have", "has", "but", "not", "can"]);
    const words = (value: string) => new Set((value.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || []).filter(word => !stopWords.has(word)));
    const sourceWords = words(`${note.title} ${note.content}`);
    return allNotes.map(candidate => {
      const candidateWords = words(`${candidate.title} ${candidate.content}`);
      const sharedWords = [...sourceWords].filter(word => candidateWords.has(word));
      const candidateTags = candidate.tags?.map(item => item.tag.name) || [];
      const sharedTags = tags.map(tag => tag.name).filter(name => candidateTags.includes(name));
      const connected = relations.some(relation => (relation.sourceNoteId === note.id && relation.targetNoteId === candidate.id) || (relation.targetNoteId === note.id && relation.sourceNoteId === candidate.id));
      const similarity = Math.round((sharedWords.length / Math.max(1, new Set([...sourceWords, ...candidateWords]).size) * 75) + (sharedTags.length ? 25 : 0));
      return { note: candidate, sharedWords: sharedWords.slice(0, 3), sharedTags, connected, similarity };
    }).filter(item => !item.connected && item.similarity > 0).sort((a, b) => b.similarity - a.similarity).slice(0, 4);
  }, [allNotes, note, relations, tags]);

  async function loadData() {
    try {
      const [noteTags, tagsResponse, notesResponse, attachmentResponse] = await Promise.all([getTagsForNote(note.id), getTags(), getNotes(), getAttachments(note.id)]);
      setTags(noteTags.data.data);
      setAllTags(tagsResponse.data.data);
      setAllNotes(notesResponse.data.data.filter((item: Note) => item.id !== note.id));
      setAttachments(attachmentResponse.data.data);
    } catch { /* The note remains readable if optional metadata fails. */ }
  }
  useEffect(() => {
    let active = true;
    Promise.all([getTagsForNote(note.id), getTags(), getNotes(), getAttachments(note.id)]).then(([noteTags, tagsResponse, notesResponse, attachmentResponse]) => {
      if (!active) return;
      setTags(noteTags.data.data);
      setAllTags(tagsResponse.data.data);
      setAllNotes(notesResponse.data.data.filter((item: Note) => item.id !== note.id));
      setAttachments(attachmentResponse.data.data);
    }).catch(() => { /* The note remains readable if optional metadata fails. */ });
    return () => { active = false; };
  }, [note.id]);

  async function handleCreateTag() {
    if (!newTag.trim()) return;
    try { const response = await createTag(newTag.trim()); await attachTag(note.id, response.data.data.id); setNewTag(""); await loadData(); onStatsChange(); }
    catch { window.alert("This tag couldn’t be added. It may already be attached to this note."); }
  }
  async function handleAttachTag() {
    if (!selectedTag) return;
    try { await attachTag(note.id, Number(selectedTag)); setSelectedTag(""); await loadData(); onStatsChange(); }
    catch { window.alert("This tag couldn’t be attached to the note."); }
  }
  async function handleCreateRelation() {
    if (!selectedNote) return;
    const label = relationType === "custom" ? customRelation.trim() : relationType;
    if (!label) return;
    try { await createRelation(note.id, Number(selectedNote), label); setSelectedNote(""); setCustomRelation(""); setRelationType("related"); setShowTools(false); onStatsChange(); }
    catch { window.alert("This connection couldn’t be created."); }
  }

  async function linkSuggestion(candidateId: number) {
    try { await createRelation(note.id, candidateId); onStatsChange(); }
    catch { window.alert("This note couldn’t be linked right now."); }
  }

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { setAttachmentStatus("Files must be smaller than 8 MB."); return; }
    setAttachmentStatus("Uploading…");
    try {
      const response = await uploadAttachment(note.id, file);
      setAttachments(current => [response.data.data, ...current]);
      setAttachmentStatus("File attached.");
    } catch { setAttachmentStatus("Upload failed. Please try again."); }
  }

  async function handleDownload(attachment: NoteAttachment) {
    try { await downloadAttachment(note.id, attachment); }
    catch { setAttachmentStatus("This file couldn’t be downloaded."); }
  }

  async function handleDeleteAttachment(attachment: NoteAttachment) {
    if (!window.confirm(`Delete “${attachment.fileName}” permanently?`)) return;
    try { await deleteAttachment(note.id, attachment.id); setAttachments(current => current.filter(item => item.id !== attachment.id)); }
    catch { setAttachmentStatus("This file couldn’t be deleted."); }
  }

  async function saveReminder(value: string | null) {
    setReminderStatus("Saving…");
    try {
      await setNoteReminder(note.id, value ? new Date(value).toISOString() : null);
      setReminderValue(value || "");
      setReminderStatus(value ? "Reminder saved." : "Reminder cleared.");
      onStatsChange();
    } catch { setReminderStatus("Reminder couldn’t be saved."); }
  }

  return <article className="note-card">
    <h3>{note.title || "Untitled note"}</h3>
    <div className="note-content markdown-card-content"><MarkdownPreview content={note.content}/></div>
    {tags.length > 0 && <div className="tag-row">{tags.map(tag => <span className="tag-chip" key={tag.id}><TagIcon size={11} style={{ verticalAlign: "-2px", marginRight: 4 }}/>{tag.name}</span>)}</div>}
    {(outgoing.length > 0 || incoming.length > 0) && <div className="note-link-summary">{outgoing.length > 0 && <div><span>Links to</span>{outgoing.map(relation => <button key={`out-${relation.targetNoteId}`} onClick={() => onEdit(relation.targetNote)}>{relation.targetNote.title}<small>{relation.label}</small></button>)}</div>}{incoming.length > 0 && <div><span>Backlinks</span>{incoming.map(relation => <button key={`in-${relation.sourceNoteId}`} onClick={() => onEdit(relation.sourceNote)}>{relation.sourceNote.title}<small>{relation.label}</small></button>)}</div>}</div>}
    {suggestions.length > 0 && <div className="suggestion-section"><button className="suggestion-toggle" aria-expanded={showSuggestions} onClick={() => setShowSuggestions(!showSuggestions)}><Sparkles size={14}/> Related ideas <span>{suggestions.length}</span></button>{showSuggestions && <div className="suggestion-list">{suggestions.map(item => <div className="suggestion-item" key={item.note.id}><div><strong>{item.note.title}</strong><small>{item.sharedTags.length ? `Shares ${item.sharedTags.join(", ")}` : `Similar terms: ${item.sharedWords.join(", ")}`}</small></div><div className="suggestion-actions"><button className="suggestion-link" onClick={() => onEdit(item.note)}>Open</button><button className="suggestion-link" onClick={() => void linkSuggestion(item.note.id)}>Link</button></div></div>)}</div>}</div>}
    <div className="note-meta"><span>{new Date(note.updatedAt || note.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span><div className="note-actions">
      {view === "trash" ? <><button className="icon-btn" title="Restore note" aria-label="Restore note" onClick={() => onRestore(note.id)}><RotateCcw size={15}/></button><button className="icon-btn" title="Delete permanently" aria-label="Delete permanently" onClick={() => onPurge(note.id)}><Trash2 size={15}/></button></> : <><button className="icon-btn" title="Add tags or connections" aria-label="Add tags or connections" onClick={() => setShowTools(!showTools)}><Link2 size={16}/></button><button className="icon-btn" title="Edit note" aria-label="Edit note" onClick={() => onEdit(note)}><Pencil size={15}/></button><button className="icon-btn" title={note.isPinned ? "Unpin note" : "Pin note"} aria-label={note.isPinned ? "Unpin note" : "Pin note"} onClick={() => onPin(note.id, !note.isPinned)}>{note.isPinned ? <PinOff size={15}/> : <Pin size={15}/>}</button><button className="icon-btn" title={view === "archive" ? "Restore from archive" : "Archive note"} aria-label={view === "archive" ? "Restore from archive" : "Archive note"} onClick={() => onArchive(note.id, view !== "archive")}><Archive size={15}/></button><button className="icon-btn" title="Move to trash" aria-label="Move to trash" onClick={() => onDelete(note.id)}><Trash2 size={15}/></button></>}
    </div></div>
    {note.reminderAt && <div className="note-reminder"><Bell size={12}/> Reminder · {new Date(note.reminderAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</div>}
    {showTools && <div className="note-tools">
      <div className="reminder-tools"><label htmlFor={`reminder-${note.id}`}><Bell size={13}/> Remind me</label><div><input id={`reminder-${note.id}`} className="field" type="datetime-local" value={reminderValue} onChange={event => setReminderValue(event.target.value)}/><button className="secondary-btn" disabled={!reminderValue} onClick={() => void saveReminder(reminderValue)}>Save</button>{note.reminderAt && <button className="icon-btn" aria-label="Clear reminder" title="Clear reminder" onClick={() => void saveReminder(null)}><X size={14}/></button>}</div>{reminderStatus && <small role="status">{reminderStatus}</small>}</div>
      <div className="tool-row"><input className="field" value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="New tag" aria-label="New tag" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); void handleCreateTag(); } }} /><button className="secondary-btn" onClick={() => void handleCreateTag()}><Plus size={14}/> Add</button></div>
      <div className="attachment-section"><div className="attachment-heading"><span><Paperclip size={13}/> Attachments ({attachments.length})</span><label className="attachment-add" htmlFor={`attachment-${note.id}`}>Attach file</label><input id={`attachment-${note.id}`} type="file" hidden onChange={event => { void handleUpload(event.target.files?.[0]); event.target.value = ""; }}/></div>{attachments.map(attachment => <div className="attachment-row" key={attachment.id}><span title={attachment.fileName}>{attachment.fileName}<small>{(attachment.size / 1024).toFixed(0)} KB</small></span><button className="icon-btn" title={`Download ${attachment.fileName}`} aria-label={`Download ${attachment.fileName}`} onClick={() => void handleDownload(attachment)}><ArrowDownToLine size={14}/></button><button className="icon-btn" title={`Delete ${attachment.fileName}`} aria-label={`Delete ${attachment.fileName}`} onClick={() => void handleDeleteAttachment(attachment)}><X size={14}/></button></div>)}{attachmentStatus && <small className="attachment-status" role="status">{attachmentStatus}</small>}</div>
      {allTags.length > 0 && <div className="tool-row"><select className="field" value={selectedTag} onChange={e => setSelectedTag(e.target.value)} aria-label="Choose an existing tag"><option value="">Choose a tag…</option>{allTags.filter(tag => !tags.some(existing => existing.id === tag.id)).map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)}</select><button className="secondary-btn" onClick={() => void handleAttachTag()}>Attach</button></div>}
      {allNotes.length > 0 && <><div className="tool-row"><select className="field" value={selectedNote} onChange={e => setSelectedNote(e.target.value)} aria-label="Choose a note to connect"><option value="">Connect to a note…</option>{allNotes.map(item => <option key={item.id} value={item.id}>{item.title || "Untitled note"}</option>)}</select></div><div className="tool-row"><select className="field" value={relationType} onChange={e => setRelationType(e.target.value)} aria-label="Relationship type"><option value="related">Related</option><option value="supports">Supports</option><option value="contradicts">Contradicts</option><option value="inspired by">Inspired by</option><option value="references">References</option><option value="custom">Custom label…</option></select>{relationType === "custom" && <input className="field" maxLength={50} value={customRelation} onChange={e => setCustomRelation(e.target.value)} aria-label="Custom relationship label" placeholder="Your label"/>}<button className="secondary-btn" onClick={() => void handleCreateRelation()}><ArrowUpRight size={14}/> Link</button></div></>}
    </div>}
  </article>;
}
