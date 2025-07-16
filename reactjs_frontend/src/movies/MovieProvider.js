import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

// CHANGE THIS to your actual TMDB API KEY or set REACT_APP_TMDB_KEY
const TMDB_KEY = process.env.REACT_APP_TMDB_KEY || "REPLACE_ME_WITH_TMDB_API_KEY";
const TMDB_BASE = "https://api.themoviedb.org/3";

// Returns search result or list from TMDB API
async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE}/${endpoint}`);
  url.searchParams.append("api_key", TMDB_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const resp = await fetch(url.toString());
  if (!resp.ok) throw new Error("TMDB API error");
  return await resp.json();
}

// PUBLIC_INTERFACE
const MovieContext = createContext();

/**
 * MovieProvider - manages global movie/search/favorites state
 */
export function MovieProvider({ children }) {
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, supabase } = useAuth();

  // Load on startup: popular, trending and [if authed] favorites
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Trending
        const trendingData = await tmdbFetch("trending/movie/week");
        setTrending(trendingData.results || []);
        // Popular
        const popularData = await tmdbFetch("movie/popular");
        setPopular(popularData.results || []);
      } catch (e) {
        setPopular([]);
        setTrending([]);
      }
      setLoading(false);
    })();
  }, []);

  // Load favorites from Supabase+localStorage when user changes
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    (async () => {
      setLoading(true);
      let fav = [];
      try {
        // Try localStorage cache for fast reloads
        const local = window.localStorage.getItem(`favMovies:${user.id}`);
        if (local) {
          fav = JSON.parse(local);
        }
        // Always try to fetch latest from Supabase
        const { data } = await supabase
          .from("favorites")
          .select("movie_id")
          .eq("user_id", user.id);
        const fids = (data || []).map(f => f.movie_id);
        setFavorites(fids);
        window.localStorage.setItem(`favMovies:${user.id}`, JSON.stringify(fids));
      } catch (e) {
        setFavorites(fav);
      }
      setLoading(false);
    })();
  }, [user, supabase]);

  // PUBLIC_INTERFACE
  const addFavorite = async (movieId) => {
    if (!user || !supabase) return;
    setFavorites(prev => prev.includes(movieId) ? prev : [...prev, movieId]);
    window.localStorage.setItem(`favMovies:${user.id}`, JSON.stringify([...favorites, movieId]));
    await supabase.from("favorites").upsert([{ user_id: user.id, movie_id: movieId }], { onConflict: ["user_id", "movie_id"] });
  };

  // PUBLIC_INTERFACE
  const removeFavorite = async (movieId) => {
    if (!user || !supabase) return;
    setFavorites(prev => prev.filter(id => id !== movieId));
    window.localStorage.setItem(`favMovies:${user.id}`, JSON.stringify(favorites.filter(id => id !== movieId)));
    await supabase.from("favorites").delete().eq("user_id", user.id).eq("movie_id", movieId);
  };

  // PUBLIC_INTERFACE
  // Fetch recommendations based on favorites+search (simplified - can be refined)
  const fetchRecommendations = async () => {
    // For now, fetch recommendations for up to 3 favorite movies (or popular if none)
    setLoading(true);
    let rec = [];
    try {
      if (favorites.length) {
        for (let movieId of favorites.slice(0, 3)) {
          const { results } = await tmdbFetch(`movie/${movieId}/recommendations`);
          rec = rec.concat(results || []);
        }
      } else {
        // Fallback to trending if user has no favorites
        rec = trending;
      }
      // Remove duplicates
      const seen = {};
      rec = rec.filter(m => (seen[m.id] ? false : (seen[m.id] = true)));
      setRecommendations(rec);
    } catch {
      setRecommendations([]);
    }
    setLoading(false);
  };

  // PUBLIC_INTERFACE
  const searchMovies = async (query) => {
    if (!query) return [];
    try {
      const { results } = await tmdbFetch("search/movie", { query });
      return results;
    } catch {
      return [];
    }
  };

  // PUBLIC_INTERFACE
  // Fetches detail for a movie
  const getMovieDetail = async (id) => {
    try {
      return await tmdbFetch(`movie/${id}`);
    } catch {
      return null;
    }
  };

  const ctx = {
    popular,
    trending,
    favorites,
    recommendations,
    loading,
    fetchRecommendations,
    addFavorite,
    removeFavorite,
    searchMovies,
    getMovieDetail,
    TMDB_KEY
  };
  return (
    <MovieContext.Provider value={ctx}>
      {children}
    </MovieContext.Provider>
  );
}

// PUBLIC_INTERFACE
export const useMovies = () => useContext(MovieContext);
