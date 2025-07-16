import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

// PUBLIC_INTERFACE
export default function Login() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (tab === "login") {
        await login(email, password);
        navigate("/");
      } else {
        await signup(email, password);
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Error");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>{tab === "login" ? "Login" : "Sign Up"}</h2>
      <div style={{ marginBottom: 10 }}>
        <button className="btn" onClick={() => setTab("login")} disabled={tab === "login"}>
          Login
        </button>{" "}
        <button className="btn" onClick={() => setTab("signup")} disabled={tab === "signup"}>
          Sign Up
        </button>
      </div>
      <form onSubmit={handleAction}>
        <input required type="email" placeholder="Email" value={email} autoComplete="username" onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input required type="password" placeholder="Password" value={password} autoComplete="current-password" onChange={e => setPassword(e.target.value)} style={inputStyle} />
        <button className="btn" style={buttonStyle} type="submit">{tab === "login" ? "Login" : "Sign Up"}</button>
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      </form>
    </div>
  );
}
const containerStyle = { maxWidth: 340, margin: "50px auto", background: "var(--bg-secondary)", padding: 24, borderRadius: 12, boxShadow: "0 3px 16px rgba(0,0,0,0.10)" };
const inputStyle = { width: "100%", padding: "9px", marginBottom: "14px", borderRadius: 5, border: "1px solid var(--border-color)" };
const buttonStyle = { width: "100%" };
