import React, { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const MoviesHome = lazy(() => import("../movies/MoviesHome"));
const MovieDetail = lazy(() => import("../movies/MovieDetail"));
const Favorites = lazy(() => import("../user/Favorites"));
const Recommendations = lazy(() => import("../recommend/Recommendations"));
const Login = lazy(() => import("../auth/Login"));
const Account = lazy(() => import("../user/Account"));

// PUBLIC_INTERFACE
/**
 * App Routes
 */
export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MoviesHome />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        {/* Fallback */}
        <Route path="*" element={<div style={{ padding: 32 }}>Page not found.</div>} />
      </Routes>
    </Router>
  );
}
