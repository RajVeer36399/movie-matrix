// src/api/tmdbProxy.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export async function fetchPopular(page = 1) {
  const res = await fetch(`${API_BASE}/popular?page=${page}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return await res.json();
}

export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${API_BASE}/search?query=${encodeURIComponent(query)}&page=${page}`
  );
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return await res.json();
}

export async function fetchMovieDetails(id) {
  if (!id) throw new Error("id required");
  const res = await fetch(`${API_BASE}/movie/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return await res.json();
}

// 👇 NEW: one big list of all cached popular movies
export async function fetchAllPopular() {
  const res = await fetch(`${API_BASE}/all-popular`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return await res.json();
}

export default {
  fetchPopular,
  searchMovies,
  fetchMovieDetails,
  fetchAllPopular,
};
