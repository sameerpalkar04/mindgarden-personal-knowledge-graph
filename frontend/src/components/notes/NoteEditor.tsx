import { useEffect, useRef, useState } from "react";
import { Bold, Check, Code2, Eye, Heading2, List, ListChecks, Pencil, X } from "lucide-react";
import type { Note } from "../../types/note";
import MarkdownPreview from "./MarkdownPreview";
import "../../markdown.css";
import { findDraft, removeDraft, saveDraft } from "../../services/draft.service";

interface Props {
  selectedNote: Note | null;
  onCreate: (title: string, content: string) => Promise<void>;
  onUpdate: (id: number, title: string, content: string) => Promise<void>;
  onCancel: () => void;
}

const noteTemplates = [
  { id: "meeting", label: "Meeting notes", title: "Meeting notes", content: "# Meeting notes\n\n**Date:** \n**Attendees:** \n\n## Agenda\n- \n\n## Decisions\n- \n\n## Follow-ups\n- [ ] " },
  { id: "reading", label: "Reading notes", title: "Reading notes", content: "# Reading notes\n\n**Author:** \n**Source:** \n\n## Summary\n\n## Key ideas\n- \n\n## Questions\n- " },
  { id: "project", label: "Project plan", title: "Project plan", content: "# Project plan\n\n## Goal\n\n## Milestones\n- [ ] \n\n## Next steps\n- [ ] \n\n## Notes\n" },
  { id: "reflection", label: "Daily reflection", title: "Daily reflection", content: "# Daily reflection\n\n## What happened today?\n\n## One thing I learned\n\n## Tomorrow\n- [ ] " },
];

export default function NoteEditor({ selectedNote, onCreate, onUpdate, onCancel }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const noteId = selectedNote?.id ?? null;
  const [initialDraft] = useState(() => findDraft(noteId));
  const [title, setTitle] = useState(initialDraft?.title ?? selectedNote?.title ?? "");
  const [content, setContent] = useState(initialDraft?.content ?? selectedNote?.content ?? "");
  const [draftStatus, setDraftStatus] = useState(initialDraft ? "Restored unsaved draft" : "");
  const [preview, setPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!title.trim() && !content.trim()) return;
      setDraftStatus("Saving draft…");
      saveDraft({ noteId, title, content, updatedAt: new Date().toISOString() });
      setDraftStatus("Draft saved on this device");
    }, 650);
    return () => window.clearTimeout(timer);
  }, [title, content, noteId]);

  function insertMarkdown(prefix: string, suffix = "", placeholder = "text") {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end) || placeholder;
    textarea.setRangeText(`${prefix}${selected}${suffix}`, start, end, "select");
    setContent(textarea.value);
    textarea.focus();
  }

  function applyTemplate(templateId: string) {
    const template = noteTemplates.find(item => item.id === templateId);
    if (!template) { setSelectedTemplate(""); return; }
    if ((title.trim() || content.trim()) && !window.confirm("Replace the current draft with this template?")) return;
    setSelectedTemplate(templateId);
    setTitle(template.title);
    setContent(template.content);
    setPreview(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const noteTitle = titleRef.current?.value.trim() ?? "";
    if (!noteTitle || !content.trim()) return;
    try {
      if (selectedNote) await onUpdate(selectedNote.id, noteTitle, content.trim());
      else await onCreate(noteTitle, content.trim());
      removeDraft(noteId);
    } catch {
      setDraftStatus("Couldn’t sync yet. Your draft is safe on this device.");
    }
  }

  return <form onSubmit={handleSubmit} className="editor">
    <div className="editor-heading"><h2>{selectedNote ? "Edit note" : "A new note"}</h2><div className="editor-modes" role="tablist" aria-label="Note editing mode"><button type="button" role="tab" aria-selected={!preview} className={!preview ? "selected" : ""} onClick={() => setPreview(false)}><Pencil size={14}/> Write</button><button type="button" role="tab" aria-selected={preview} className={preview ? "selected" : ""} onClick={() => setPreview(true)}><Eye size={14}/> Preview</button></div></div>
    {!selectedNote && <label className="template-picker">Start with a template<select className="field" aria-label="Choose a note template" value={selectedTemplate} onChange={event => applyTemplate(event.target.value)}><option value="">Blank note</option>{noteTemplates.map(template => <option value={template.id} key={template.id}>{template.label}</option>)}</select></label>}
    <input ref={titleRef} value={title} onChange={event => setTitle(event.target.value)} className="field" aria-label="Note title" placeholder="Give this note a title…" required />
    {draftStatus && <p className="draft-status" role="status">{draftStatus}</p>}
    {!preview && <>
      <div className="markdown-toolbar" aria-label="Markdown formatting">
        <button type="button" title="Heading" aria-label="Insert heading" onClick={() => insertMarkdown("## ", "", "Heading")}><Heading2 size={16}/></button>
        <button type="button" title="Bold" aria-label="Bold text" onClick={() => insertMarkdown("**", "**")}><Bold size={15}/></button>
        <button type="button" title="Bullet list" aria-label="Insert bullet list" onClick={() => insertMarkdown("- ", "", "List item")}><List size={16}/></button>
        <button type="button" title="Checklist" aria-label="Insert checklist item" onClick={() => insertMarkdown("- [ ] ", "", "Task")}><ListChecks size={16}/></button>
        <button type="button" title="Inline code" aria-label="Insert inline code" onClick={() => insertMarkdown("`", "`", "code")}><Code2 size={15}/></button>
        <span className="markdown-hint">Markdown supported</span>
      </div>
      <textarea ref={contentRef} value={content} onChange={event => setContent(event.target.value)} rows={8} className="field markdown-source" aria-label="Note content in Markdown" placeholder="Start writing… Use # for headings, - for lists, **bold**, or `code`." required />
    </>}
    {preview && <div className="markdown-preview-frame"><MarkdownPreview content={content}/></div>}
    <div className="editor-actions"><button type="button" className="secondary-btn" onClick={onCancel}><X size={15}/> Cancel</button><button type="submit" className="primary-btn"><Check size={15}/>{selectedNote ? "Save changes" : "Save note"}</button></div>
  </form>;
}
