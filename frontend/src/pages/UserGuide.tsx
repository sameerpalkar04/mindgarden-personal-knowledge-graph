import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, BookOpen, FilePlus2, Link2, Network, Tags } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../auth-guides.css";
import "../user-guide.css";

const steps = [
  { number: "01", title: "Create a note", icon: FilePlus2, text: "From Notes, choose New note. Give your thought a short title, add the details, then save it." },
  { number: "02", title: "Add a tag", icon: Tags, text: "On the note card, choose the link icon to open its tools. Create a tag or attach one you already use." },
  { number: "03", title: "Connect ideas", icon: Link2, text: "In the same note tools, choose another note and select Link. Repeat anywhere you see a useful connection." },
  { number: "04", title: "Explore your graph", icon: Network, text: "Open Knowledge graph to see notes as nodes and their connections as lines. Drag nodes to arrange the view." },
];

export default function UserGuide() {
  return <div className="app-shell"><Navbar/><div className="workspace"><Sidebar/><main className="main user-guide-main"><div className="eyebrow">Your first few minutes</div><h1 className="user-guide-title">A simple path from thought to connection</h1><p className="page-subtitle">Follow these four steps to build a useful little knowledge garden.</p>
    <ol className="guide-diagram">{steps.map((step, index) => { const Icon = step.icon; return <li className="guide-step-card" key={step.number}><div className="guide-step-top"><span className="guide-step-number">{step.number}</span><span className="guide-step-icon"><Icon size={21}/></span></div><h2>{step.title}</h2><p>{step.text}</p>{index < steps.length - 1 && <><ArrowRight className="guide-connector guide-connector-right" size={19}/><ArrowDown className="guide-connector guide-connector-down" size={19}/></>}</li>; })}</ol>
    <section className="guide-finish"><div><span className="guide-finish-icon"><BookOpen size={19}/></span><div><strong>That’s the whole loop.</strong><p>Capture what matters, add context, then follow the connections as your notes grow.</p></div></div><Link className="primary-btn" to="/dashboard"><FilePlus2 size={16}/> Go to your notes</Link></section>
  </main></div></div>;
}
