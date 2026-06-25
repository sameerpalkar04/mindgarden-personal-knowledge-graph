import type { Note } from "../../types/note";
import NoteCard from "./NoteCard";

interface Props {
  notes: Note[];
  onDelete: (id: number) => void;
  onEdit: (note: Note) => void;
}

export default function NoteList({ notes, onDelete, onEdit }: Props) {
  if (notes.length === 0) {
    return <h3>No Notes Found</h3>;
  }

  return (
    <>
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </>
  );
}