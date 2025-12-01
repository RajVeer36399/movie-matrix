// src/api/tmdb.js
// Helpers for TMDb image URLs and genres (using the local tmdb-proxy cache).

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

// Base URL for TMDb images
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";

/**
 * Build a full poster URL from a TMDb poster_path.
 * Usage: posterUrl(movie.poster_path) in MovieCard.jsx
 */
export function posterUrl(path, size = "w500") {
  if (!path) return "";
  return `${TMDB_IMAGE_BASE}${size}${path}`;
}

/**
 * Fetch genres from the proxy's cached genres.json file.
 * Response shape is typically: { genres: [ { id, name }, ... ] }
 */
export async function fetchGenres() {
  const res = await fetch(`${API_BASE}/cache/genres.json`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  const data = await res.json();
  return data; // Filters.jsx can read data.genres
}

export default { posterUrl, fetchGenres };
