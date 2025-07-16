import React, { useEffect, useState } from "react";
import { useMovies } from "./MovieProvider";
import { useLocation, Link } from "react-router-dom";

const MovieCard = ({ movie }) => (
  <div style={cardStyle}>
    <Link to={`/movie/${movie.id}`}>
      <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : ""} alt={movie.title} style={imgStyle} />
      <div style={titleStyle}>{movie.title}</div>
      <div style={yearStyle}>{movie.release_date?.slice(0, 4)}</div>
    </Link>
  </div>
);

// PUBLIC_INTERFACE
export default function MoviesHome() {
  const { popular, trending, loading, searchMovies } = useMovies();
  const loc = useLocation();
  const [results, setResults] = useState(null);

  // Parse ?q= query param
  useEffect(() => {
    const params = new URLSearchParams(loc.search);
    const q = params.get("q");
    if (!q) setResults(null);
    else {
      (async () => {
        setResults(await searchMovies(q));
      })();
    }
  }, [loc, searchMovies]);

  return (
    <div style={{ maxWidth: 1200, margin: "32px auto", padding: 8 }}>
      {loading && <div style={{ margin: 40 }}>Loading movies…</div>}
      {!loading && results && results.length === 0 && (
        <div>No results!</div>
      )}
      {!loading && results && results.length > 0 && (
        <>
          <h2>Search Results</h2>
          <MovieGrid list={results} />
        </>
      )}
      {!loading && !results && (
        <>
          <h2>Trending This Week</h2>
          <MovieGrid list={trending} />
          <h2>Popular Movies</h2>
          <MovieGrid list={popular} />
        </>
      )}
    </div>
  );
}

function MovieGrid({ list }) {
  if (!list) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 22 }}>
      {list.map((movie) =>
        <MovieCard key={movie.id} movie={movie} />
      )}
    </div>
  );
}

const cardStyle = { borderRadius: 8, background: "var(--bg-secondary)", padding: 0, margin: 0, boxShadow: "0 3px 10px rgba(0,0,0,0.11)", transition: "box-shadow 0.2s", overflow: "hidden", cursor: "pointer" };
const imgStyle = { width: "100%", minHeight: 240, objectFit: "cover" };
const titleStyle = { fontWeight: 600, fontSize: 16, margin: "0.8em 0 0 0", color: "var(--text-primary)" };
const yearStyle = { fontSize: 13, color: "var(--text-secondary)", marginBottom: "1em" };
