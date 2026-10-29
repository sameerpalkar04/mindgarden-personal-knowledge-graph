import { useEffect, useMemo, useState } from "react";
import { FileText, Network, Plus, Search, Tag as TagIcon } from "lucide-react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import NoteEditor from "../components/notes/NoteEditor";
import NoteList from "../components/notes/NoteList";
import { getNotes, createNote, updateNote, deleteNote } from "../services/note.service";
import { getNote } from "../services/note.service";
import { getDrafts, type NoteDraft } from "../services/draft.service";
import { getGraph } from "../services/graph.service";
import { getTags } from "../services/tag.service";
import type { Note } from "../types/note";
import "../user-guide.css";

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [relationCount, setRelationCount] = useState(0);
  const [tagCount, setTagCount] = useState(0);
  const [query, setQuery] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState<NoteDraft[]>(() => getDrafts());
  const [showDrafts, setShowDrafts] = useState(false);

  async function loadDashboard() {
    try {
      const [noteResponse, graphResponse, tagResponse] = await Promise.all([getNotes(), getGraph(), getTags()]);
      setNotes(noteResponse.data.data);
      setRelationCount(graphResponse.data.data.edges.length);
      setTagCount(tagResponse.data.data.length);
      setError("");
    } catch {
      setError("We couldn’t load your notes. Check your connection and try again.");
    }
  }
  useEffect(() => {
    let active = true;
    Promise.all([getNotes(), getGraph(), getTags()]).then(([noteResponse, graphResponse, tagResponse]) => {
      if (!active) return;
      setNotes(noteResponse.data.data);
      setRelationCount(graphResponse.data.data.edges.length);
      setTagCount(tagResponse.data.data.length);
    }).catch(() => { if (active) setError("We couldn’t load your notes. Check your connection and try again."); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const refreshDrafts = () => setDrafts(getDrafts());
    window.addEventListener("mindgarden:drafts-change", refreshDrafts);
    return () => window.removeEventListener("mindgarden:drafts-change", refreshDrafts);
  }, []);

  async function handleCreate(title: string, content: string) {
    try { await createNote(title, content); setShowEditor(false); await loadDashboard(); }
    catch (err) { setError("Your note couldn’t be saved. Please try again."); throw err; }
  }
  async function handleUpdate(id: number, title: string, content: string) {
    try { await updateNote(id, title, content); setSelectedNote(null); setShowEditor(false); await loadDashboard(); }
    catch (err) { setError("Your changes couldn’t be saved. Please try again."); throw err; }
  }
  async function handleDelete(id: number) {
    if (!window.confirm("Delete this note? This can’t be undone.")) return;
    try { await deleteNote(id); if (selectedNote?.id === id) setSelectedNote(null); await loadDashboard(); }
    catch { setError("The note couldn’t be deleted. Please try again."); }
  }
  const filteredNotes = useMemo(() => notes.filter(note => `${note.title} ${note.content}`.toLowerCase().includes(query.toLowerCase().trim())), [notes, query]);
  const greeting = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  async function resumeDraft(draft: NoteDraft) {
    if (draft.noteId !== null) {
      const existing = notes.find(note => note.id === draft.noteId);
      if (existing) setSelectedNote(existing);
      else {
        try { const response = await getNote(draft.noteId); setSelectedNote(response.data.data); }
        catch { setError("This note draft can’t be reopened. The original note may have been deleted."); return; }
      }
    } else setSelectedNote(null);
    setShowEditor(true);
    setShowDrafts(false);
  }

  return <div className="app-shell"><Navbar /><div className="workspace"><Sidebar /><main className="main">
    <div className="page-head"><div><div className="eyebrow">{greeting}</div><h1>Your thoughts, connected.</h1><p className="page-subtitle">A quiet place to collect ideas and see where they lead.</p></div><div className="dashboard-actions"><Link className="secondary-btn guide-action" to="/guide"><BookOpen size={16}/> How it works</Link>{drafts.length > 0 && <button className="secondary-btn guide-action" onClick={() => setShowDrafts(!showDrafts)}>Drafts ({drafts.length})</button>}<button className="primary-btn" onClick={() => { setSelectedNote(null); setShowEditor(!showEditor); }}><Plus size={17} /> New note</button></div></div>
    {showDrafts && <section className="drafts-panel"><div className="drafts-heading"><h2>Saved drafts</h2><button className="icon-btn" aria-label="Close drafts" onClick={() => setShowDrafts(false)}>×</button></div>{drafts.map((draft, index) => <button className="draft-item" key={`${draft.noteId ?? "new"}-${index}`} onClick={() => void resumeDraft(draft)}><span><strong>{draft.title || "Untitled draft"}</strong><small>{draft.noteId === null ? "New note" : "Unsaved note changes"}</small></span><time>{new Date(draft.updatedAt).toLocaleString()}</time></button>)}</section>}
    <section className="stats-grid" aria-label="Knowledge base overview">
      <div className="stat-card"><span className="stat-icon"><FileText size={18} /></span><div><div className="stat-label">Notes</div><div className="stat-value">{notes.length}</div></div></div>
      <div className="stat-card"><span className="stat-icon"><TagIcon size={18} /></span><div><div className="stat-label">Tags</div><div className="stat-value">{tagCount}</div></div></div>
      <div className="stat-card"><span className="stat-icon"><Network size={18} /></span><div><div className="stat-label">Connections</div><div className="stat-value">{relationCount}</div></div></div>
    </section>
    {error && <p className="notice" role="alert">{error}</p>}
    {(showEditor || selectedNote) && <NoteEditor key={selectedNote?.id ?? "new"} selectedNote={selectedNote} onCreate={handleCreate} onUpdate={handleUpdate} onCancel={() => { setShowEditor(false); setSelectedNote(null); }} />}
    <div className="toolbar"><h2 className="section-title" style={{ margin: 0 }}>Your notes <span style={{ color: "#9aa19a", fontWeight: 500 }}>({filteredNotes.length})</span></h2><div className="search-wrap"><Search size={16} className="search-icon"/><input className="field" aria-label="Search notes" placeholder="Search your notes…" value={query} onChange={e => setQuery(e.target.value)} /></div></div>
    <NoteList notes={filteredNotes} hasNotes={notes.length > 0} onDelete={handleDelete} onEdit={note => { setSelectedNote(note); setShowEditor(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} onStatsChange={() => void loadDashboard()} />
  </main></div></div>;
}
