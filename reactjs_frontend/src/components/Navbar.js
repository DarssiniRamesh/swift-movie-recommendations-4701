import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

// PUBLIC_INTERFACE
/**
 * Navbar - main app navigation/topbar
 */
const Navbar = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="navbar" style={navbarStyle}>
      <Link to="/" className="logo">
        🎬 MovieLightning
      </Link>
      <form onSubmit={handleSearch} className="search-form" style={searchFormStyle}>
        <input
          type="text"
          placeholder="Search movies…"
          value={searchQuery}
          aria-label="search"
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInputStyle}
        />
        <button type="submit" className="btn" aria-label="submit search" style={buttonStyle}>
          🔍
        </button>
      </form>
      <div className="nav-links" style={navLinksStyle}>
        <Link to="/recommendations" style={linkStyle}>
          Recommendations
        </Link>
        {user && (
          <>
            <Link to="/favorites" style={linkStyle}>Favorites ⭐</Link>
            <Link to="/account" style={linkStyle}>Account</Link>
            <button className="btn" style={logoutBtnStyle} onClick={logout}>Logout</button>
          </>
        )}
        {!user && (
          <Link to="/login" style={linkStyle}>Login</Link>
        )}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
};

// Inline styles for minimalism (replace with CSS classes if desired)
const navbarStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: 12, background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)", position: "sticky", top: 0, zIndex: 10 };
const navLinksStyle = { display: "flex", alignItems: "center", gap: 14 };
const linkStyle = { color: "var(--text-primary)", textDecoration: "none", fontWeight: 500, margin: "0 4px" };
const buttonStyle = { marginLeft: 8, background: "var(--button-bg)", color: "var(--button-text)", border: "none", borderRadius: 4, padding: "5px 10px", cursor: "pointer" };
const logoutBtnStyle = { ...buttonStyle, background: "#e57373" };
const searchFormStyle = { display: "flex", alignItems: "center" };
const searchInputStyle = { padding: 5, borderRadius: 4, border: "1px solid var(--border-color)", width: 180, marginRight: 5 };

export default Navbar;
