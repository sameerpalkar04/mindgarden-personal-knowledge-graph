import { useEffect, useState } from "react";
import type { Note } from "../../types/note";

interface Props {
  selectedNote: Note | null;
  onCreate: (title: string, content: string) => void;
  onUpdate: (id: number, title: string, content: string) => void;
}

export default function NoteEditor({
  selectedNote,
  onCreate,
  onUpdate,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [selectedNote]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (selectedNote) {
      onUpdate(selectedNote.id, title, content);
    } else {
      onCreate(title, content);
    }

    setTitle("");
    setContent("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "30px",
      }}
    >
      <h2>
        {selectedNote ? "Edit Note" : "Create Note"}
      </h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          boxSizing: "border-box",
        }}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        placeholder="Content"
        style={{
          width: "100%",
          padding: "10px",
          boxSizing: "border-box",
        }}
      />

      <br />
      <br />

      <button type="submit">
        {selectedNote ? "Update Note" : "Create Note"}
      </button>
    </form>
  );
}