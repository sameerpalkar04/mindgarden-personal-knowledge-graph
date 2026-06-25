import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div
      style={{
        height: "70px",
        background: "#1f2937",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
      }}
    >
      <h2
        style={{
          color: "white",
        }}
      >
        Personal Knowledge Graph
      </h2>

      <button
        onClick={logout}
        style={{
          padding: "10px 18px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}