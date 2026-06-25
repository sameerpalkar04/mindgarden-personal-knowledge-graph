import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import NoteEditor from "../components/notes/NoteEditor";
import NoteList from "../components/notes/NoteList";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/note.service";

import { getGraph } from "../services/graph.service";

import type { Note } from "../types/note";

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [relationCount, setRelationCount] = useState(0);

  async function loadDashboard() {
    try {
      const noteResponse = await getNotes();
      setNotes(noteResponse.data.data);

      const graphResponse = await getGraph();

      setRelationCount(
        graphResponse.data.data.edges.length
      );
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleCreate(
    title: string,
    content: string
  ) {
    try {
      await createNote(title, content);
      await loadDashboard();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdate(
    id: number,
    title: string,
    content: string
  ) {
    try {
      await updateNote(id, title, content);

      setSelectedNote(null);

      await loadDashboard();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteNote(id);

      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }

      await loadDashboard();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <div
        style={{
          display: "flex",
        }}
      >
        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "30px",
          }}
        >
          <h1>Dashboard</h1>

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "20px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                width: "180px",
              }}
            >
              <h3>Notes</h3>
              <h1>{notes.length}</h1>
            </div>

            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                width: "180px",
              }}
            >
              <h3>Tags</h3>
              <h1>-</h1>
            </div>

            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                width: "180px",
              }}
            >
              <h3>Relations</h3>
              <h1>{relationCount}</h1>
            </div>
          </div>

          <NoteEditor
            selectedNote={selectedNote}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
          />

          <div
            style={{
              marginTop: "30px",
            }}
          >
            <NoteList
              notes={notes}
              onDelete={handleDelete}
              onEdit={setSelectedNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
}