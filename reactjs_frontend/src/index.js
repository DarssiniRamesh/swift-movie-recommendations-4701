import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// <App> already wraps everything in <Router>, so we must not double-wrap
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Diagnostic for dev: warn if router context is missing in dev
if (process.env.NODE_ENV === "development") {
  // Slight delay to wait for mount
  setTimeout(() => {
    // Try to detect if Router context is present by checking for .navbar useNavigate context
    const nav = document.querySelector('.navbar');
    if (nav && !window.location) {
      // This shouldn't actually happen in browser, but place a dev warning.
      // Real detection is with useRoutes error boundary or try-catch inside Navbar, which is handled by React
      // but we keep this diagnostic for reminder.
      // eslint-disable-next-line
      console.warn("[DEV] No window.location detected; Router context may be missing.");
    }
  }, 1000);
}
