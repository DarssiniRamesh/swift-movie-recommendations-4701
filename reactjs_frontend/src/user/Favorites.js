import React, { useEffect, useState } from "react";
import { useMovies } from "../movies/MovieProvider";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Favorites() {
  const { favorites, getMovieDetail, removeFavorite } = useMovies();
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    if (!favorites.length) { setMovies([]); return; }
    // Fetch all detail for favorites
    (async () => {
      const arr = []; for (let id of favorites) {
        const m = await getMovieDetail(id);
        if (m) arr.push(m);
      }
      setMovies(arr);
    })();
  }, [favorites, getMovieDetail]);
  if (!favorites.length) return <div style={{ margin: 40 }}>No favorites yet.</div>;
  return (
    <div style={{ maxWidth: 800, margin: "32px auto" }}>
      <h2>Favorite Movies</h2>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {movies.map(m =>
          <li key={m.id} style={favStyle}>
            <Link to={`/movie/${m.id}`} style={titleStyle}>
              <img src={m.poster_path ? `https://image.tmdb.org/t/p/w92${m.poster_path}` : ""} alt={m.title} style={imgStyle} />
              {m.title}
            </Link>
            <button className="btn" style={removeStyle} onClick={() => removeFavorite(m.id)}>Remove</button>
          </li>
        )}
      </ul>
    </div>
  );
}
const favStyle = { display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #eee", padding: 5, justifyContent: "space-between" };
const titleStyle = { flex: 1, display: "flex", alignItems: "center", color: "var(--text-primary)", textDecoration: "none", fontWeight: 500 };
const imgStyle = { width: 42, borderRadius: 6, marginRight: 10 };
const removeStyle = { background: "#e57373", color: "white", border: "none", borderRadius: 4, padding: "4px 12px", marginLeft: 18 };
