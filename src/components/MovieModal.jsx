// src/components/MovieModal.jsx
import React, { useEffect, useState, useMemo } from "react";
import { posterUrl } from "../api/tmdb";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export default function MovieModal({ movie, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load cached detailed info (movie_<id>.json) if available
  useEffect(() => {
    if (!movie) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/cache/movie_${movie.id}.json`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          if (!cancelled) setDetails(null);
          return;
        }

        const data = await res.json();
        if (!cancelled) setDetails(data);
      } catch (err) {
        if (!cancelled) setDetails(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [movie]);

  if (!movie) return null;

  // Prefer detailed JSON if we have it
  const d = details || movie;

  const title =
    d.title || d.name || movie.title || movie.name || "Untitled";

  const date =
    d.release_date ||
    d.first_air_date ||
    movie.release_date ||
    movie.first_air_date ||
    "";

  const runtime = d.runtime || null;

  const rating =
    d.vote_average ?? movie.vote_average ?? null;

  const voteCount =
    d.vote_count ?? movie.vote_count ?? null;

  const tagline = d.tagline || "";

  const overview =
    d.overview || movie.overview || "No overview available.";

  const genres = Array.isArray(d.genres) ? d.genres : [];

  const posterPath = d.poster_path || movie.poster_path;

  const originalLanguage = d.original_language || "";
  const status = d.status || "";
  const budget = d.budget || 0;
  const revenue = d.revenue || 0;

  // Derive directors & cast from credits if present
  const { directors, cast } = useMemo(() => {
    const res = { directors: [], cast: [] };
    if (!details || !details.credits) return res;

    const credits = details.credits;

    if (Array.isArray(credits.crew)) {
      res.directors = credits.crew
        .filter((p) => p.job === "Director")
        .map((p) => p.name);
    }

    if (Array.isArray(credits.cast)) {
      res.cast = credits.cast.slice(0, 5); // top 5 cast
    }

    return res;
  }, [details]);

  const formatMoney = (n) =>
    n && n > 0 ? "$" + n.toLocaleString("en-US") : null;

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-5xl bg-[#f2f2f2] rounded-lg shadow-lg overflow-auto max-h-[90vh] border border-white/60">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0" style={{ width: 220 }}>
            {posterPath ? (
              <img
                src={posterUrl(posterPath, "w500")}
                alt={title}
                className="w-full rounded"
              />
            ) : (
              <div className="w-full h-72 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                No image
              </div>
            )}
          </div>

          {/* Right side content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">{title}</h2>

                {/* meta row: date • runtime • ★ rating */}
                <div className="text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {date && <span>{date}</span>}
                  {runtime ? <span>&bull; {runtime} min</span> : null}
                  {rating != null && (
                    <span>
                       ★ {rating.toFixed(1)}
                      {voteCount ? ` (${voteCount})` : ""}
                    </span>
                  )}
                </div>

                {genres.length > 0 && (
                  <div className="mt-1 text-sm text-gray-700">
                    {genres.map((g) => g.name).join(", ")}
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="px-3 py-1 rounded bg-gray-100 border text-sm"
              >
                Close
              </button>
            </div>

            {tagline && (
              <div className="mt-2 italic text-gray-600 text-sm">
                “{tagline}”
              </div>
            )}

            <div className="mt-4 text-gray-800 text-sm leading-relaxed">
              {loading && <div>Loading extra details…</div>}
              {!loading && <p>{overview}</p>}
            </div>

            {/* Extra info: director, cast, production, etc. */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
              <div className="space-y-1">
                {directors.length > 0 && (
                  <div>
                    <span className="font-semibold">Director: </span>
                    {directors.join(", ")}
                  </div>
                )}

                {cast.length > 0 && (
                  <div>
                    <span className="font-semibold">Top cast: </span>
                    {cast.map((c) => c.name).join(", ")}
                  </div>
                )}

                {originalLanguage && (
                  <div>
                    <span className="font-semibold">Original language: </span>
                    {originalLanguage.toUpperCase()}
                  </div>
                )}

                {status && (
                  <div>
                    <span className="font-semibold">Status: </span>
                    {status}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                {formatMoney(budget) && (
                  <div>
                    <span className="font-semibold">Budget: </span>
                    {formatMoney(budget)}
                  </div>
                )}

                {formatMoney(revenue) && (
                  <div>
                    <span className="font-semibold">Revenue: </span>
                    {formatMoney(revenue)}
                  </div>
                )}

                {Array.isArray(d.production_companies) &&
                  d.production_companies.length > 0 && (
                    <div>
                      <span className="font-semibold">Production: </span>
                      {d.production_companies
                        .map((p) => p.name)
                        .join(", ")}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
