// src/components/LoginForm.jsx
import React, { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/users/login", { email, password });
      const { token, refreshToken } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      setErrorMsg("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg("Invalid credentials or server error");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get responsive styles based on window width
  const getResponsiveStyles = () => {
    // Check if window is available (for SSR compatibility)
    if (typeof window === 'undefined') return {};
    
    const width = window.innerWidth;
    const isMobile = width < 768;
    
    return {
      pageContainer: {
        display: isMobile ? 'flex' : 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height: '100vh',
        width: '100%',
        overflow: isMobile ? 'auto' : 'hidden',
      },
      leftPanel: {
        flex: isMobile ? 'none' : '1',
        height: isMobile ? '30vh' : 'auto',
        backgroundImage: "url('https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1470&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      },
      formContainer: {
        flex: isMobile ? 'none' : '1',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: isMobile ? '2rem 1rem' : '0',
      },
      formWrapper: {
        width: isMobile ? '100%' : '80%',
        maxWidth: "400px",
        padding: isMobile ? '1rem' : '2rem',
      },
      heading: {
        fontSize: isMobile ? '1.5rem' : '2rem',
      },
      brandName: {
        fontSize: isMobile ? '2.5rem' : '3.5rem',
      },
      tagline: {
        fontSize: isMobile ? '1.2rem' : '1.5rem',
      },
    };
  };

  // Get responsive styles
  const responsiveStyles = getResponsiveStyles();

  return (
    <div style={{...styles.pageContainer, ...responsiveStyles.pageContainer}}>
      <div style={{...styles.leftPanel, ...responsiveStyles.leftPanel}}>
        <div style={styles.overlay}>
          <h1 style={{...styles.brandName, ...responsiveStyles.brandName}}>CycleMate</h1>
          <p style={{...styles.tagline, ...responsiveStyles.tagline}}>Your perfect cycling companion</p>
        </div>
      </div>
      
      <div style={{...styles.formContainer, ...responsiveStyles.formContainer}}>
        <div style={{...styles.formWrapper, ...responsiveStyles.formWrapper}}>
          <h2 style={{...styles.heading, ...responsiveStyles.heading}}>Welcome Back</h2>
          <p style={styles.subheading}>Log in to track your rides and discover new routes</p>
          
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            
            <button 
              type="submit" 
              style={styles.button}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
            
            {errorMsg && <p style={errorMsg.includes("successful") ? styles.successMsg : styles.errorMsg}>{errorMsg}</p>}
            
            <div style={styles.registerPrompt}>
              Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    // Base styles that will be overridden by responsive styles
    display: "flex",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
  },
  leftPanel: {
    // Base styles that will be overridden by responsive styles
    flex: "1",
    backgroundImage: "url('https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1470&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  brandName: {
    // Base styles that will be overridden by responsive styles
    color: "white",
    fontWeight: "bold",
    marginBottom: "1rem",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  },
  tagline: {
    // Base styles that will be overridden by responsive styles
    color: "white",
    textAlign: "center",
    maxWidth: "80%",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
  },
  formContainer: {
    // Base styles that will be overridden by responsive styles
    flex: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  formWrapper: {
    // Base styles that will be overridden by responsive styles
    width: "80%",
    maxWidth: "400px",
    padding: "2rem",
  },
  heading: {
    // Base styles that will be overridden by responsive styles
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#333",
  },
  subheading: {
    color: "#666",
    marginBottom: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontWeight: "500",
    color: "#555",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    transition: "border-color 0.3s",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "14px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background-color 0.3s",
    marginTop: "1rem",
    width: "100%",
  },
  errorMsg: {
    color: "#d32f2f",
    textAlign: "center",
    marginTop: "0.5rem",
  },
  successMsg: {
    color: "#388e3c",
    textAlign: "center",
    marginTop: "0.5rem",
  },
  registerPrompt: {
    textAlign: "center",
    marginTop: "1.5rem",
    color: "#666",
  },
  link: {
    color: "#4CAF50",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default LoginForm;
