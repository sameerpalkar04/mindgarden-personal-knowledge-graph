import { NavLink } from "react-router-dom";
import { BookOpen, LayoutDashboard, Network } from "lucide-react";

export default function Sidebar() {
  return <aside className="sidebar"><div className="side-label">YOUR SPACE</div>
    <NavLink to="/dashboard" className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}><LayoutDashboard size={17} /> Notes</NavLink>
    <NavLink to="/graph" className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}><Network size={17} /> Knowledge graph</NavLink>
    <NavLink to="/guide" className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}><BookOpen size={17} /> User guide</NavLink>
  </aside>;
}
