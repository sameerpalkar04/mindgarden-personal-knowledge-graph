import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "220px",
        background: "#374151",
        minHeight: "calc(100vh - 70px)",
        padding: "20px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <Link
          to="/dashboard"
          style={{
            color: "white",
            textDecoration: "none",
            display: "block",
            textAlign: "left",
            fontSize: "18px",
            fontWeight: "500",
          }}
        >
          Dashboard
        </Link>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Link
          to="/graph"
          style={{
            color: "white",
            textDecoration: "none",
            display: "block",
            textAlign: "left",
            fontSize: "18px",
            fontWeight: "500",
          }}
        >
          Knowledge Graph
        </Link>
      </div>
    </div>
  );
}