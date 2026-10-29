import type { Note } from "./note";

export interface NoteRelation {
  sourceNoteId: number;
  targetNoteId: number;
  sourceNote: Note;
  targetNote: Note;
}
