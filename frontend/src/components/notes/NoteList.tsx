import { BookOpen } from "lucide-react";
import type { Note } from "../../types/note";
import NoteCard from "./NoteCard";

interface Props { notes: Note[]; hasNotes?: boolean; onDelete: (id: number) => void; onEdit: (note: Note) => void; onStatsChange: () => void; }

export default function NoteList({ notes, hasNotes = false, onDelete, onEdit, onStatsChange }: Props) {
  if (notes.length === 0) return <div className="empty-state"><BookOpen size={27} style={{ color: "#315d48", marginBottom: 10 }} /><h3>{hasNotes ? "No notes match that search" : "No notes here yet"}</h3><p>{hasNotes ? "Try another title or phrase." : "Save a thought and start building your personal knowledge graph."}</p></div>;
  return <div className="note-grid">{notes.map(note => <NoteCard key={note.id} note={note} onDelete={onDelete} onEdit={onEdit} onStatsChange={onStatsChange} />)}</div>;
}
