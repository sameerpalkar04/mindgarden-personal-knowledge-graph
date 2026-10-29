import type { Note } from "./note";

export interface NoteRelation {
  sourceNoteId: number;
  targetNoteId: number;
  label: string;
  sourceNote: Note;
  targetNote: Note;
}
