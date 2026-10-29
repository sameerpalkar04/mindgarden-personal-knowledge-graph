import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Braces, LockKeyhole } from "lucide-react";
import "../auth-guides.css";

const endpoints = [
  { group: "Authentication", method: "POST", path: "/auth/register", auth: false, description: "Create an account. Body: { username, email, password }." },
  { group: "Authentication", method: "POST", path: "/auth/login", auth: false, description: "Sign in. Body: { email, password }. Returns a JWT in data.token." },
  { group: "Notes", method: "GET", path: "/notes", auth: true, description: "List the signed-in user’s notes." },
  { group: "Notes", method: "POST", path: "/notes", auth: true, description: "Create a note. Body: { title, content }." },
  { group: "Notes", method: "GET", path: "/notes/:id", auth: true, description: "Fetch one of the signed-in user’s notes." },
  { group: "Notes", method: "PUT", path: "/notes/:id", auth: true, description: "Update a note. Body may include title and content." },
  { group: "Notes", method: "DELETE", path: "/notes/:id", auth: true, description: "Delete a note and its attached tags and links." },
  { group: "Tags", method: "GET", path: "/tags", auth: true, description: "List tags attached to the signed-in user’s notes." },
  { group: "Tags", method: "POST", path: "/tags", auth: true, description: "Create or reuse a tag. Body: { name }." },
  { group: "Tags", method: "GET", path: "/tags/:noteId", auth: true, description: "List tags attached to a note owned by the signed-in user." },
  { group: "Tags", method: "POST", path: "/tags/:noteId", auth: true, description: "Attach a tag to a note. Body: { tagId }." },
  { group: "Tags", method: "DELETE", path: "/tags/:noteId/:tagId", auth: true, description: "Remove a tag from a note." },
  { group: "Relations", method: "GET", path: "/relations", auth: true, description: "List note-to-note connections." },
  { group: "Relations", method: "POST", path: "/relations", auth: true, description: "Connect two owned notes. Body: { sourceNoteId, targetNoteId }." },
  { group: "Relations", method: "DELETE", path: "/relations/:sourceId/:targetId", auth: true, description: "Remove a connection between two owned notes." },
  { group: "Graph", method: "GET", path: "/graph", auth: true, description: "Return React Flow nodes and edges for the signed-in user’s notes." },
];

export default function DeveloperGuide() {
  return <div className="docs-page"><header className="docs-header"><Link to="/" className="brand"><span className="brand-mark"><BookOpen size={18}/></span> Mindgarden</Link><Link to="/" className="docs-back"><ArrowLeft size={15}/> Back to home</Link></header><main className="docs-main"><div className="eyebrow">For builders</div><h1>Developer guide</h1><p className="docs-intro">Mindgarden’s API is a JSON REST service. The backend defaults to <code>http://localhost:3000</code>; set <code>VITE_API_URL</code> in the frontend environment to use another address.</p><section className="docs-callout"><LockKeyhole size={18}/><div><strong>Authentication</strong><p>Register and sign in without a token. For every other endpoint, send <code>Authorization: Bearer &lt;token&gt;</code>. Responses use a JSON envelope with <code>success</code> and, on success, <code>data</code>.</p></div></section><h2><Braces size={18}/> API reference</h2><div className="endpoint-list">{endpoints.map(endpoint => <article className="endpoint" key={`${endpoint.method}-${endpoint.path}`}><div className="endpoint-top"><span className={`method method-${endpoint.method.toLowerCase()}`}>{endpoint.method}</span><code>{endpoint.path}</code><span className="endpoint-group">{endpoint.group}</span>{endpoint.auth && <LockKeyhole className="endpoint-lock" size={14} aria-label="Requires authentication"/>}</div><p>{endpoint.description}</p></article>)}</div><section className="docs-notes"><h2>Data and local setup</h2><p>PostgreSQL stores users, notes, tags, and relations through Prisma. Configure <code>DATABASE_URL</code>, <code>JWT_SECRET</code>, and <code>FRONTEND_ORIGIN</code> in <code>backend/.env</code>. Apply migrations with <code>npx prisma migrate deploy</code> from the backend folder.</p><p>For the full setup walkthrough, see <code>README.md</code> in the project root.</p></section></main></div>;
}
