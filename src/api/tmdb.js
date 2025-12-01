// src/api/tmdb.js
// Helpers for TMDb image URLs and genres (using the local tmdb-proxy cache).

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

// Base URL for TMDb images
// src/api/tmdb.js
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function posterUrl(path, size = "w342") {
  if (!path) return "";
  // allow size strings like "w185", "w342", "w500", or "original"
  const allowed = ["w92","w154","w185","w342","w500","w780","original"];
  const s = allowed.includes(size) ? size : "w342";
  return `${TMDB_IMAGE_BASE}/${s}${path}`;
}

// optional helper for backdrop if you use one
export function backdropUrl(path, size = "w780") {
  if (!path) return "";
  const allowed = ["w300","w780","w1280","original"];
  const s = allowed.includes(size) ? size : "w780";
  return `${TMDB_IMAGE_BASE}/${s}${path}`;
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
