import React, { Suspense, lazy, useEffect, useState } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import Navbar from "./components/Navbar";
import Routes from "./routes/Routes";
import { MovieProvider } from "./movies/MovieProvider";

// PUBLIC_INTERFACE
/**
 * App Root
 * Sets up Providers and core layout.
 */
function MovieAppRoot() {
  const [theme, setTheme] = useState("light");

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));

  return (
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
  );
}

export default MovieAppRoot;
