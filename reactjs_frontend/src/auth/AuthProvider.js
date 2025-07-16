import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./supabaseConfig";

/**
 * AuthContext manages user authentication state and Supabase session.
 */
const AuthContext = createContext();

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// PUBLIC_INTERFACE
/**
 * AuthProvider
 * - Provides user auth state to children.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore Supabase session if present
  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setUser(data?.user ?? null);
    setLoading(false);
    if (error) throw error;
    return data.user;
  };

  // PUBLIC_INTERFACE
  const signup = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setUser(data?.user ?? null);
    setLoading(false);
    if (error) throw error;
    return data.user;
  };

  // PUBLIC_INTERFACE
  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  const value = { user, loading, login, signup, logout, supabase };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export const useAuth = () => useContext(AuthContext);
