import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../auth/AuthProvider";

// PUBLIC_INTERFACE
// Diagnostic test: Ensures Navbar (and its useNavigate usage) never throws outside Router context
describe("Navbar context and render tree integration", () => {
  // Mock AuthProvider (minimal for test)
  const mockAuthProvider = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it("renders Navbar under router context without error", () => {
    render(
      <MemoryRouter>
        <mockAuthProvider>
          <Navbar theme="light" toggleTheme={() => {}} />
        </mockAuthProvider>
      </MemoryRouter>
    );
    // Check for MovieLightning logo to assert render did not error
    expect(screen.getByText("🎬 MovieLightning")).toBeInTheDocument();
  });

  it("throws error if Navbar is rendered outside router (simulating dev mistake)", () => {
    // Silence expected error
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <mockAuthProvider>
          <Navbar theme="light" toggleTheme={() => {}} />
        </mockAuthProvider>
      )
    ).toThrow();
    spy.mockRestore();
  });
});
