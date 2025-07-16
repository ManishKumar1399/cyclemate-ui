import { useState } from "react";
import axios from "../api/axiosInstance";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", age: "", weight: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/users/register", form);
      alert("Registered successfully");
    } catch (err) {
      alert("Registration failed: " + err.response?.data || "Unknown error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {["name", "email", "password", "age", "weight"].map((field) => (
        <input
          key={field}
          placeholder={field}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        />
      ))}
      <button type="submit">Register</button>
    </form>
  );
}
