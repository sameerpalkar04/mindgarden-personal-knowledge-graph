import { useRef } from "react";
import { Check, X } from "lucide-react";
import type { Note } from "../../types/note";

interface Props {
  selectedNote: Note | null;
  onCreate: (title: string, content: string) => void;
  onUpdate: (id: number, title: string, content: string) => void;
  onCancel: () => void;
}

export default function NoteEditor({
  selectedNote,
  onCreate,
  onUpdate,
  onCancel,
}: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const title = titleRef.current?.value.trim() ?? "";
    const content = contentRef.current?.value.trim() ?? "";
    if (!title || !content) return;

    if (selectedNote) {
      onUpdate(selectedNote.id, title, content);
    } else {
      onCreate(title, content);
    }

  }

  return (
    <form
      onSubmit={handleSubmit}
      className="editor"
    >
      <h2>
        {selectedNote ? "Edit note" : "A new note"}
      </h2>

      <input
        ref={titleRef}
        defaultValue={selectedNote?.title ?? ""}
        className="field"
        aria-label="Note title"
        placeholder="Give this note a title…"
        required
      />

      <textarea
        ref={contentRef}
        defaultValue={selectedNote?.content ?? ""}
        rows={6}
        className="field"
        aria-label="Note content"
        placeholder="Start writing. You can add tags and connections after saving."
        required
      />
      <div className="editor-actions"><button type="button" className="secondary-btn" onClick={onCancel}><X size={15}/> Cancel</button><button type="submit" className="primary-btn"><Check size={15}/>{selectedNote ? "Save changes" : "Save note"}</button></div>
    </form>
  );
}
