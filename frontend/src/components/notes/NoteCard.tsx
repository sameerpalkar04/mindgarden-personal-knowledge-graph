import { useEffect, useState } from "react";

import type { Note } from "../../types/note";
import type { Tag } from "../../types/tag";

import {
  getTags,
  getTagsForNote,
  createTag,
  attachTag,
} from "../../services/tag.service";

import { createRelation } from "../../services/relation.service";
import { getNotes } from "../../services/note.service";

import TagList from "../tags/TagList";

interface Props {
  note: Note;
  onDelete: (id: number) => void;
  onEdit: (note: Note) => void;
}

export default function NoteCard({
  note,
  onDelete,
  onEdit,
}: Props) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);

  const [newTag, setNewTag] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedNote, setSelectedNote] = useState("");

  async function loadData() {
    try {
      const noteTags = await getTagsForNote(note.id);
      setTags(noteTags.data.data);

      const tags = await getTags();
      setAllTags(tags.data.data);

      const notes = await getNotes();

      setAllNotes(
        notes.data.data.filter(
          (n: Note) => n.id !== note.id
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadData();
  }, [note.id]);

  async function handleCreateTag() {
    if (!newTag.trim()) return;

    try {
      const response = await createTag(newTag);

      await attachTag(note.id, response.data.data.id);

      setNewTag("");

      loadData();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAttachTag() {
    if (!selectedTag) return;

    try {
      await attachTag(
        note.id,
        Number(selectedTag)
      );

      setSelectedTag("");

      loadData();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreateRelation() {
    if (!selectedNote) return;

    try {
      await createRelation(
        note.id,
        Number(selectedNote)
      );

      alert("Relation created!");

      setSelectedNote("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        marginBottom: "20px",
      }}
    >
      <h2>{note.title}</h2>

      <p>{note.content}</p>

      <h4>Tags</h4>

      <TagList tags={tags} />

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          placeholder="New Tag"
          value={newTag}
          onChange={(e) =>
            setNewTag(e.target.value)
          }
        />

        <button onClick={handleCreateTag}>
          Create Tag
        </button>
      </div>

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          gap: "10px",
        }}
      >
        <select
          value={selectedTag}
          onChange={(e) =>
            setSelectedTag(e.target.value)
          }
        >
          <option value="">
            Select Existing Tag
          </option>

          {allTags.map((tag) => (
            <option
              key={tag.id}
              value={tag.id}
            >
              {tag.name}
            </option>
          ))}
        </select>

        <button onClick={handleAttachTag}>
          Attach Tag
        </button>
      </div>

      <hr
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      />

      <h4>Create Relation</h4>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <select
          value={selectedNote}
          onChange={(e) =>
            setSelectedNote(e.target.value)
          }
        >
          <option value="">
            Select Note
          </option>

          {allNotes.map((n) => (
            <option
              key={n.id}
              value={n.id}
            >
              {n.title}
            </option>
          ))}
        </select>

        <button
          onClick={handleCreateRelation}
        >
          Link Notes
        </button>
      </div>

      <br />

      <small>
        Created:{" "}
        {new Date(
          note.createdAt
        ).toLocaleDateString()}
      </small>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => onEdit(note)}
          style={{
            padding: "8px 16px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Edit
        </button>

        <button
          onClick={() =>
            onDelete(note.id)
          }
          style={{
            padding: "8px 16px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}