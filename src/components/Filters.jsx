// src/components/Filters.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useMovies } from "../context/MoviesContext";
import { fetchGenres } from "../api/tmdb"; // uses /cache/genres.json via proxy

export default function Filters({
  query,
  setQuery,
  genre,
  setGenre,
  year,
  setYear,
  sortBy,
  setSortBy,
}) {
  const { movies } = useMovies();

  const [genreList, setGenreList] = useState([]); // [{ id, name }]
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [genresError, setGenresError] = useState(null);

  // Fetch genres from proxy on mount
  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoadingGenres(true);
      setGenresError(null);

      try {
        const data = await fetchGenres(); // { genres: [...] } or [...]
        const rawList = Array.isArray(data) ? data : data?.genres || [];

        const normalized = rawList
          .map((g) => ({
            id: Number(g.id),
            name: String(g.name || "").trim(),
          }))
          .filter((g) => !Number.isNaN(g.id) && g.name.length > 0)
          .sort((a, b) => a.name.localeCompare(b.name));

        if (!mounted) return;
        setGenreList(normalized);
      } catch (err) {
        console.error("Failed to load genres from proxy", err);
        if (!mounted) return;
        setGenresError(err?.message || String(err));
        setGenreList([]);
      } finally {
        if (mounted) setLoadingGenres(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Build a contiguous descending list of years (max -> min) from movies.
  const years = useMemo(() => {
    const nums = [];

    for (const m of movies || []) {
      if (!m) continue;
      const d = m.release_date || m.first_air_date || "";
      if (!d) continue;
      const y = parseInt(d.split("-")[0], 10);
      if (!Number.isNaN(y) && y > 1800) {
        nums.push(y);
      }
    }

    if (nums.length === 0) return [];

    const min = Math.min(...nums);
    const max = Math.max(...nums);

    const arr = [];
    for (let y = max; y >= min; y--) {
      arr.push(y);
    }
    return arr;
  }, [movies]);

  return (
    <div className="rounded-xl p-4 space-y-3 bg-white/60 backdrop-blur-md shadow-lg border border-white/40">
      {/* Search on its own row */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search title or description..."
        className="w-full p-2 rounded-lg bg-white/40 border border-transparent
                   focus:outline-none focus:ring-2 focus:ring-white/80
                   focus:bg-white/80 shadow-sm transition"
      />

      {/* Row: Genres, Years, Sort (sit side-by-side, also on mobile as long as width allows) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Genres */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-2 rounded-lg text-sm bg-white/40 border-transparent appearance-none
                     focus:outline-none focus:ring-0 focus:border-none
                     focus:bg-white/70 shadow-sm transition"
        >
          <option key="all-genres" value="">
            All genres
          </option>

          {loadingGenres && (
            <option key="loading" value="">
              Loading...
            </option>
          )}

          {!loadingGenres && genresError && (
            <option key="error" value="">
              Failed to load genres
            </option>
          )}

          {!loadingGenres &&
            !genresError &&
            genreList.map((g) => (
              <option key={g.id} value={String(g.id)}>
                {g.name}
              </option>
            ))}
        </select>

        {/* Years */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="p-2 rounded-lg text-sm bg-white/40 border border-transparent
                     focus:outline-none focus:ring-2 focus:ring-white/80
                     focus:bg-white/80 shadow-sm transition"
        >
          <option key="all-years" value="">
            All years
          </option>
          {years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/40 shadow-sm">
          <label className="text-sm opacity-70">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-1 rounded-lg text-sm bg-white/0 border border-transparent
                       focus:outline-none focus:ring-0 focus:border-none"
          >
            <option value="vote.desc">Rating High → Low</option>
            <option value="vote.asc">Rating Low → High</option>
            <option value="title.asc">Title A → Z</option>
            <option value="title.desc">Title Z → A</option>
            <option value="year.desc">Year New → Old</option>
            <option value="year.asc">Year Old → New</option>
          </select>
        </div>
      </div>
    </div>
  );
}
