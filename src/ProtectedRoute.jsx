import React, { useState } from "react";

export default function ProtectedRoute({ children }) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const correctPassword = "abhivynqe";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <div
      style={{
        height: "100vh",
        background: "#0b0b0b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "Inter, sans-serif"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#141414",
          padding: "32px",
          borderRadius: "10px",
          width: "280px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          border: "1px solid #222"
        }}
      >
        <h3 style={{ margin: 0, fontWeight: 500, fontSize: "16px", textAlign: "center" }}>
          Live Dashboard Access
        </h3>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            background: "#0f0f0f",
            border: "1px solid #2a2a2a",
            borderRadius: "6px",
            color: "#fff",
            outline: "none"
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#ffffff",
            color: "#000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500
          }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}