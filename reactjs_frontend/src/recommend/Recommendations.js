import React, { useEffect } from "react";
import { useMovies } from "../movies/MovieProvider";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Recommendations() {
  const { recommendations, fetchRecommendations, loading } = useMovies();

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div style={{ margin: 40 }}>Loading recommendations…</div>;
  if (!recommendations.length) return <div style={{ margin: 40 }}>No recommendations yet. Add some favorites!</div>;

  return (
    <div style={{ maxWidth: 1100, margin: "32px auto" }}>
      <h2>Recommended for You</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 22 }}>
        {recommendations.map((m) =>
          <div key={m.id} style={cardStyle}>
            <Link to={`/movie/${m.id}`}>
              <img src={m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : ""} alt={m.title} style={imgStyle} />
              <div style={titleStyle}>{m.title}</div>
              <div style={yearStyle}>{m.release_date?.slice(0, 4)}</div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
const cardStyle = { borderRadius: 8, background: "var(--bg-secondary)", padding: 0, margin: 0, boxShadow: "0 3px 10px rgba(0,0,0,0.11)", transition: "box-shadow 0.2s", overflow: "hidden", cursor: "pointer" };
const imgStyle = { width: "100%", minHeight: 240, objectFit: "cover" };
const titleStyle = { fontWeight: 600, fontSize: 16, margin: "0.8em 0 0 0", color: "var(--text-primary)" };
const yearStyle = { fontSize: 13, color: "var(--text-secondary)", marginBottom: "1em" };
