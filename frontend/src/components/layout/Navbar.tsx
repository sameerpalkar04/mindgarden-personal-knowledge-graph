import { useNavigate } from "react-router-dom";
import { BookOpen, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return <header className="topbar">
    <a href="/dashboard" className="brand"><span className="brand-mark"><BookOpen size={18} /></span> Mindgarden</a>
    <div className="topbar-right"><span className="avatar">M</span><button className="logout" onClick={logout}><LogOut size={15} /> <span>Sign out</span></button></div>
  </header>;
}
