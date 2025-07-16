import React, { Suspense, lazy, useEffect, useState } from "react";
import "./App.css";
import { AuthProvider } from "./auth/AuthProvider";
import Navbar from "./components/Navbar";
import Routes from "./routes/Routes";
import { MovieProvider } from "./movies/MovieProvider";
import { BrowserRouter as Router } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * MovieAppRoot - Ensures ALL routed UI, including Navbar, always renders under <Router> context.
 * This prevents useNavigate and location errors regardless of lazy/conditional mounting, React 18 StrictMode,
 * and code splitting paths.
 */
function MovieAppRoot() {
  const [theme, setTheme] = useState("light");

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));

  // All providers, Navbar, and routed tree are wrapped in Router for full context.
  return (
    <Router>
      <AuthProvider>
        <MovieProvider>
          <div className="App">
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <main>
              <Suspense fallback={<div style={{ margin: "2rem" }}>Loading...</div>}>
                <Routes />
              </Suspense>
            </main>
          </div>
        </MovieProvider>
      </AuthProvider>
    </Router>
  );
}

export default MovieAppRoot;
