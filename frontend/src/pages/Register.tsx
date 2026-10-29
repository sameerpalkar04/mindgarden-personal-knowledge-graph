import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Check, Circle } from "lucide-react";
import type { AxiosError } from "axios";
import PasswordInput from "../components/auth/PasswordInput";
import { register } from "../services/auth.service";
import "../auth-guides.css";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordChecks = [
    { label: "At least 8 characters", passed: password.length >= 8 },
    { label: "One uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "One number", passed: /\d/.test(password) },
    { label: "One special character", passed: /[^A-Za-z0-9]/.test(password) },
  ];
  const passwordValid = passwordChecks.every(check => check.passed);
  const passwordsMatch = confirmation.length > 0 && password === confirmation;
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!passwordValid) { setError("Please meet all password requirements."); return; }
    if (password !== confirmation) { setError("Your passwords don’t match yet."); return; }
    setLoading(true);
    try { await register({ username, email, password }); navigate("/"); }
    catch (err) { const message = (err as AxiosError<{ message?: string }>).response?.data?.message; setError(message || "We couldn’t create your account. Please try again."); }
    finally { setLoading(false); }
  }
  return <div className="auth-page"><section className="auth-aside"><div className="brand"><span className="brand-mark"><BookOpen size={18}/></span> Mindgarden</div><div><div className="eyebrow" style={{ color: "#c2d5c5" }}>Start with one thought</div><h1>Build a little more clarity, one note at a time.</h1><p>Capture what matters today. Your ideas will be easier to find tomorrow.</p></div><small style={{ color: "#c2d5c5" }}>Your personal knowledge space</small></section><main className="auth-content"><form className="auth-card" onSubmit={handleSubmit}><h2>Create your space</h2><p>A few details, then you’re ready to begin.</p><label htmlFor="username">Your name</label><input className="field" id="username" autoComplete="name" required placeholder="How should we call you?" value={username} onChange={e => setUsername(e.target.value)}/><label htmlFor="email">Email address</label><input className="field" id="email" type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}/><label htmlFor="password">Password</label><PasswordInput id="password" autoComplete="new-password" placeholder="Choose a strong password" value={password} onChange={setPassword}/><ul className="password-checks" aria-label="Password requirements">{passwordChecks.map(check => <li className={check.passed ? "passed" : ""} key={check.label}>{check.passed ? <Check size={14}/> : <Circle size={13}/>}<span>{check.label}</span></li>)}</ul><label htmlFor="confirm-password">Confirm password</label><PasswordInput id="confirm-password" autoComplete="new-password" placeholder="Enter your password again" value={confirmation} onChange={setConfirmation}/>{confirmation && <p className={`match-message ${passwordsMatch ? "passed" : ""}`} aria-live="polite">{passwordsMatch ? "Passwords match" : "Passwords don’t match yet"}</p>}{error && <p className="notice" role="alert">{error}</p>}<button className="primary-btn" type="submit" disabled={loading || !passwordValid || !passwordsMatch}>{loading ? "Creating your space…" : "Create account"}</button><div className="auth-switch">Already have an account? <Link to="/">Sign in</Link></div></form></main></div>;
}
