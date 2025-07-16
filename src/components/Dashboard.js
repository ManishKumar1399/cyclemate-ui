// src/components/Dashboard.jsx
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [message, setMessage] = useState("Checking...");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setMessage("✅ Logged in successfully!");
    } else {
      setMessage("❌ No token found. Please login again.");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={styles.container}>
      <h2>🚴‍♂️ CycleMate Dashboard</h2>
      <p>{message}</p>

      {token && (
        <>
          <p style={styles.tokenTitle}>JWT Token (debug):</p>
          <textarea
            style={styles.tokenBox}
            rows={5}
            readOnly
            value={token}
          />
        </>
      )}

      <button style={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    margin: "50px auto",
    width: "90%",
    maxWidth: "600px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
  },
  tokenTitle: {
    marginTop: "20px",
    fontWeight: "bold",
  },
  tokenBox: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    fontFamily: "monospace",
    fontSize: "0.9rem",
  },
  logoutBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
