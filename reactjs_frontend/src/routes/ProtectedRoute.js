import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

// PUBLIC_INTERFACE
/**
 * Restricts route access to authenticated users.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ margin: "2rem" }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}
