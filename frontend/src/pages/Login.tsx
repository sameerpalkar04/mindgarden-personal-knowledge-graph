import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginUser } from "../services/auth.service";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    try {
      const response = await loginUser({
        email,
        password,
      });

      login(response.data.data.token);

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          width: "400px",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          Personal Knowledge Graph
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}