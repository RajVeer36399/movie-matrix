// src/context/MoviesContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const MoviesContext = createContext();
export const useMovies = () => useContext(MoviesContext);

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

// Maximum number of cached pages we *might* have.
// We'll stop early as soon as we hit the first 404.
const MAX_CACHE_PAGES = 500;

// Load all cached popular pages directly from /cache/popular_page_<n>.json
  async function loadAllFromCache() {
    const all = [];

  // Load pages in parallel (much faster)
  const requests = [];
  for (let page = 1; page <= MAX_CACHE_PAGES; page++) {
    const url = `${API_BASE}/cache/popular_page_${page}.json`;
    requests.push(fetch(url).then(r => (r.ok ? r.json() : null)));
  }

  const results = await Promise.all(requests);

  for (const data of results) {
    if (!data || !Array.isArray(data.results)) continue;
    all.push(...data.results);
  }

  // De-duplicate by movie.id
  // De-duplicate by movie.id
  const seen = new Set();
  const uniq = [];

  for (const m of all) {
    if (!m || m.id == null) continue;

    // 👇 NEW: skip movies without a poster
    if (!m.poster_path) continue;

    if (seen.has(m.id)) continue;
    seen.add(m.id);
    uniq.push(m);
  }


  console.log(
    `[movies] Loaded ${all.length} raw entries, ${uniq.length} unique movies from cache.`
  );

  return uniq;
}

export function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function init() {
    setLoading(true);
    setError(null);
    try {
      const allMovies = await loadAllFromCache();
      setMovies(allMovies);
    } catch (err) {
      console.error("Failed to load movies from cache", err);
      setError(err?.message || "Failed to load movies");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <MoviesContext.Provider
      value={{
        movies,
        loading,
        error,
        reload: init,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
}
