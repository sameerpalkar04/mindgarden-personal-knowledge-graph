import { useRef, useState } from "react";
import { Database, Download, FileDown, Upload } from "lucide-react";
import { exportNotes, importNotes } from "../../services/backup.service";

export default function NoteDataTools({ onImported }: { onImported: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function handleExport(format: "json" | "csv" | "md") {
    setBusy(true); setStatus("");
    try { await exportNotes(format); setStatus(`Your ${format.toUpperCase()} export is ready.`); }
    catch { setStatus("Export failed. Check your connection and try again."); }
    finally { setBusy(false); }
  }

  async function handleImport(file: File | undefined) {
    if (!file) return;
    setBusy(true); setStatus("");
    try { const count = await importNotes(file); setStatus(`Imported ${count} ${count === 1 ? "note" : "notes"}.`); onImported(); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Import failed. Check the file and try again."); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  return <div className="data-tools-wrap"><button className="secondary-btn guide-action" type="button" aria-expanded={open} onClick={() => setOpen(!open)}><Database size={15}/> Data tools</button>{open && <div className="data-tools-panel"><strong>Import & export</strong><p>JSON backups include tags, links, and note folders.</p><button type="button" disabled={busy} onClick={() => void handleExport("json")}><Download size={14}/> Export backup (JSON)</button><button type="button" disabled={busy} onClick={() => void handleExport("csv")}><FileDown size={14}/> Export CSV</button><button type="button" disabled={busy} onClick={() => void handleExport("md")}><FileDown size={14}/> Export Markdown</button><button type="button" disabled={busy} onClick={() => fileRef.current?.click()}><Upload size={14}/> Import file</button><input ref={fileRef} type="file" accept=".json,.csv,.md,.markdown,application/json,text/csv,text/markdown" hidden onChange={event => void handleImport(event.target.files?.[0])}/>{status && <p className="data-tools-status" role="status">{status}</p>}</div>}</div>;
}
