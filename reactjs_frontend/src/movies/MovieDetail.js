import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMovies } from "./MovieProvider";

// PUBLIC_INTERFACE
export default function MovieDetail() {
  const { id } = useParams();
  const { getMovieDetail, favorites, addFavorite, removeFavorite } = useMovies();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    (async () => {
      setMovie(await getMovieDetail(id));
    })();
  }, [id, getMovieDetail]);

  if (!movie) return <div style={{ margin: 40 }}>Loading…</div>;
  const isFav = favorites.includes(movie.id);

  return (
    <div style={containerStyle}>
      <img
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : ""}
        alt={movie.title}
        style={imgStyle}
      />
      <div>
        <h2>{movie.title} <span style={{ fontWeight: 400, fontSize: 18, color: "#aaa" }}>({movie.release_date?.slice(0, 4)})</span></h2>
        <p style={{ color: "var(--text-secondary)" }}>{movie.tagline}</p>
        <div style={genresStyle}>{(movie.genres || []).map(g => <span key={g.id}>{g.name}</span>).reduce((prev, curr) => [prev, ', ', curr])}</div>
        <div style={overviewStyle}>{movie.overview}</div>
        <div>
          <button
            className="btn"
            style={isFav ? { background: "#e57373", color: "white" } : {}}
            onClick={() => isFav ? removeFavorite(movie.id) : addFavorite(movie.id)}
          >
            {isFav ? "Remove Favorite ⭐" : "Add to Favorites ⭐"}
          </button>
        </div>
      </div>
    </div>
  );
}

const containerStyle = { maxWidth: 800, margin: "32px auto", display: "flex", gap: 32, alignItems: "flex-start", background: "var(--bg-secondary)", borderRadius: 15, padding: 32 };
const imgStyle = { width: 220, borderRadius: 10, boxShadow: "0 3px 7px rgba(0,0,0,0.18)", marginRight: 16 };
const genresStyle = { fontSize: 15, color: "var(--text-secondary)", margin: "12px 0" };
const overviewStyle = { margin: "15px 0", fontSize: 16, color: "var(--text-primary)", opacity: 0.96 };
