import { useEffect, useState } from "react";
import { Archive, ArrowUpRight, Link2, Pencil, Pin, PinOff, Plus, RotateCcw, Tag as TagIcon, Trash2 } from "lucide-react";
import type { Note } from "../../types/note";
import type { Tag } from "../../types/tag";
import { getTags, getTagsForNote, createTag, attachTag } from "../../services/tag.service";
import { createRelation } from "../../services/relation.service";
import { getNotes } from "../../services/note.service";
import MarkdownPreview from "./MarkdownPreview";
import "../../markdown.css";
import type { NoteView } from "../../services/note.service";

interface Props { note: Note; view: NoteView; onDelete: (id: number) => void; onEdit: (note: Note) => void; onPin: (id: number, pinned: boolean) => void; onArchive: (id: number, archived: boolean) => void; onRestore: (id: number) => void; onPurge: (id: number) => void; onStatsChange: () => void; }

export default function NoteCard({ note, view, onDelete, onEdit, onPin, onArchive, onRestore, onPurge, onStatsChange }: Props) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [newTag, setNewTag] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedNote, setSelectedNote] = useState("");
  const [showTools, setShowTools] = useState(false);

  async function loadData() {
    try {
      const [noteTags, tagsResponse, notesResponse] = await Promise.all([getTagsForNote(note.id), getTags(), getNotes()]);
      setTags(noteTags.data.data);
      setAllTags(tagsResponse.data.data);
      setAllNotes(notesResponse.data.data.filter((item: Note) => item.id !== note.id));
    } catch { /* The note remains readable if optional metadata fails. */ }
  }
  useEffect(() => {
    let active = true;
    Promise.all([getTagsForNote(note.id), getTags(), getNotes()]).then(([noteTags, tagsResponse, notesResponse]) => {
      if (!active) return;
      setTags(noteTags.data.data);
      setAllTags(tagsResponse.data.data);
      setAllNotes(notesResponse.data.data.filter((item: Note) => item.id !== note.id));
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
    try { await createRelation(note.id, Number(selectedNote)); setSelectedNote(""); setShowTools(false); onStatsChange(); }
    catch { window.alert("This connection couldn’t be created."); }
  }

  return <article className="note-card">
    <h3>{note.title || "Untitled note"}</h3>
    <div className="note-content markdown-card-content"><MarkdownPreview content={note.content}/></div>
    {tags.length > 0 && <div className="tag-row">{tags.map(tag => <span className="tag-chip" key={tag.id}><TagIcon size={11} style={{ verticalAlign: "-2px", marginRight: 4 }}/>{tag.name}</span>)}</div>}
    <div className="note-meta"><span>{new Date(note.updatedAt || note.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span><div className="note-actions">
      {view === "trash" ? <><button className="icon-btn" title="Restore note" aria-label="Restore note" onClick={() => onRestore(note.id)}><RotateCcw size={15}/></button><button className="icon-btn" title="Delete permanently" aria-label="Delete permanently" onClick={() => onPurge(note.id)}><Trash2 size={15}/></button></> : <><button className="icon-btn" title="Add tags or connections" aria-label="Add tags or connections" onClick={() => setShowTools(!showTools)}><Link2 size={16}/></button><button className="icon-btn" title="Edit note" aria-label="Edit note" onClick={() => onEdit(note)}><Pencil size={15}/></button><button className="icon-btn" title={note.isPinned ? "Unpin note" : "Pin note"} aria-label={note.isPinned ? "Unpin note" : "Pin note"} onClick={() => onPin(note.id, !note.isPinned)}>{note.isPinned ? <PinOff size={15}/> : <Pin size={15}/>}</button><button className="icon-btn" title={view === "archive" ? "Restore from archive" : "Archive note"} aria-label={view === "archive" ? "Restore from archive" : "Archive note"} onClick={() => onArchive(note.id, view !== "archive")}><Archive size={15}/></button><button className="icon-btn" title="Move to trash" aria-label="Move to trash" onClick={() => onDelete(note.id)}><Trash2 size={15}/></button></>}
    </div></div>
    {showTools && <div className="note-tools">
      <div className="tool-row"><input className="field" value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="New tag" aria-label="New tag" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); void handleCreateTag(); } }} /><button className="secondary-btn" onClick={() => void handleCreateTag()}><Plus size={14}/> Add</button></div>
      {allTags.length > 0 && <div className="tool-row"><select className="field" value={selectedTag} onChange={e => setSelectedTag(e.target.value)} aria-label="Choose an existing tag"><option value="">Choose a tag…</option>{allTags.filter(tag => !tags.some(existing => existing.id === tag.id)).map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)}</select><button className="secondary-btn" onClick={() => void handleAttachTag()}>Attach</button></div>}
      {allNotes.length > 0 && <div className="tool-row"><select className="field" value={selectedNote} onChange={e => setSelectedNote(e.target.value)} aria-label="Choose a note to connect"><option value="">Connect to a note…</option>{allNotes.map(item => <option key={item.id} value={item.id}>{item.title || "Untitled note"}</option>)}</select><button className="secondary-btn" onClick={() => void handleCreateRelation()}><ArrowUpRight size={14}/> Link</button></div>}
    </div>}
  </article>;
}
