import React from "react";
import { useAuth } from "../auth/AuthProvider";

// PUBLIC_INTERFACE
export default function Account() {
  const { user } = useAuth();
  return (
    <div style={{ maxWidth: 500, margin: "48px auto", background: "var(--bg-secondary)", borderRadius: 14, padding: 32, boxShadow: "0 3px 11px rgba(0,0,0,0.08)" }}>
      <h2>My Account</h2>
      <div>Email: <strong>{user.email}</strong></div>
      <div>UserID: <code>{user.id}</code></div>
      <div style={{ marginTop: 25, color: "var(--text-secondary)" }}>
        Preference settings coming soon!
      </div>
    </div>
  )
}
