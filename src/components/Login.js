// import React, { useState } from "react";
// import axios from "../api/axiosInstance";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("/login", { email, password });

//       // ✅ Save token and refresh token to localStorage
//       const { token, refreshToken } = res.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("refreshToken", refreshToken);
//       console.log("TOKEN:", token);
//       console.log("REFRESH:", refreshToken);

//       console.log("Login successful! Tokens saved.");
//       navigate("/dashboard"); // go to dashboard
//     } catch (error) {
//       console.error("Login failed:", error);
//       alert("Invalid login");
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <h2>Login</h2>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       /><br/>
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       /><br/>
//       <button type="submit">Login</button>
//     </form>
//   );
// }
