import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
      }}
    >
      <h1
        style={{
          fontSize: "80px",
          margin: 0,
        }}
      >
        404
      </h1>

      <h2>Page Not Found</h2>

      <Link
        to="/"
        style={{
          marginTop: "20px",
        }}
      >
        Go to Login
      </Link>
    </div>
  );
}