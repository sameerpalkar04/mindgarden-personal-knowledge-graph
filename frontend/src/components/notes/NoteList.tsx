import { BookOpen } from "lucide-react";
import type { Note } from "../../types/note";
import NoteCard from "./NoteCard";
import type { NoteView } from "../../services/note.service";
import type { NoteRelation } from "../../types/relation";

interface Props { notes: Note[]; relations: NoteRelation[]; hasNotes?: boolean; view: NoteView; onDelete: (id: number) => void; onEdit: (note: Note) => void; onPin: (id: number, pinned: boolean) => void; onArchive: (id: number, archived: boolean) => void; onRestore: (id: number) => void; onPurge: (id: number) => void; onStatsChange: () => void; }

export default function NoteList({ notes, relations, hasNotes = false, view, onDelete, onEdit, onPin, onArchive, onRestore, onPurge, onStatsChange }: Props) {
  if (notes.length === 0) return <div className="empty-state"><BookOpen size={27} style={{ color: "#315d48", marginBottom: 10 }} /><h3>{hasNotes ? "No notes match that search" : view === "trash" ? "Your trash is empty" : view === "archive" ? "Nothing archived yet" : "No notes here yet"}</h3><p>{hasNotes ? "Try another title or phrase." : view === "trash" ? "Deleted notes will stay here until you restore or permanently delete them." : view === "archive" ? "Archive notes you want to keep without seeing in your main list." : "Save a thought and start building your personal knowledge graph."}</p></div>;
  return <div className="note-grid">{notes.map(note => <NoteCard key={note.id} note={note} view={view} relations={relations} onDelete={onDelete} onEdit={onEdit} onPin={onPin} onArchive={onArchive} onRestore={onRestore} onPurge={onPurge} onStatsChange={onStatsChange} />)}</div>;
}
