import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import type { AxiosError } from "axios";
import PasswordInput from "../components/auth/PasswordInput";
import { login as loginUser } from "../services/auth.service";
import useAuth from "../hooks/useAuth";
import "../auth-guides.css";
import "../user-guide.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try { const response = await loginUser({ email, password }); login(response.data.data.token); navigate("/dashboard"); }
    catch (err) { const message = (err as AxiosError<{ message?: string }>).response?.data?.message; setError(message || "We couldn’t sign you in. Check your details and try again."); }
    finally { setLoading(false); }
  }
  return <div className="auth-page"><section className="auth-aside"><div className="brand"><span className="brand-mark"><BookOpen size={18}/></span> Mindgarden</div><div><div className="eyebrow" style={{ color: "#c2d5c5" }}>A home for what you learn</div><h1>Good ideas grow when they find each other.</h1><p>Keep your notes close, connect the dots, and make space for your next big thought.</p></div><small style={{ color: "#c2d5c5" }}>Your personal knowledge space · <Link to="/developers" style={{ color: "#c2d5c5", textDecoration: "underline" }}>Developer guide</Link></small></section><main className="auth-content auth-login-content"><form className="auth-card" onSubmit={handleSubmit}><h2>Welcome back</h2><p>Sign in to continue tending your ideas.</p><label htmlFor="email">Email address</label><input className="field" id="email" type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}/><label htmlFor="password">Password</label><PasswordInput id="password" autoComplete="current-password" placeholder="Your password" value={password} onChange={setPassword}/>{error && <p className="notice" role="alert">{error}</p>}<button className="primary-btn" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button><div className="auth-switch">New to Mindgarden? <Link to="/register">Create an account</Link></div></form></main></div>;
}
