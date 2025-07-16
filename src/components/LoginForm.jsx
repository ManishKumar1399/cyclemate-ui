// src/components/LoginForm.jsx
import React, { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate(); // 🔥

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/users/login", { email, password });
      const { token, refreshToken } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      setErrorMsg("Login successful!");
      navigate("/dashboard"); // 🔥 navigate to dashboard
    } catch (err) {
      setErrorMsg("Invalid credentials or server error");
    }
  };

  return (
    <div style={styles.container}>
      <h2>CycleMate Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
        <p>{errorMsg}</p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default LoginForm;
