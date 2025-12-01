// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Filters from "./components/Filters";
import MovieGrid from "./components/MovieGrid";
import Pagination from "./components/Pagination";
import MovieModal from "./components/MovieModal";
import Favorites from "./components/Favorites";
import { useMovies } from "./context/MoviesContext";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

const PER_PAGE = 12; // 12 cards per UI page

// Helper: normalized title for sorting (ignore leading punctuation)
function sortTitle(m) {
  const raw = (m.title || m.name || "").trim();
  const cleaned = raw.replace(/^[^A-Za-z0-9]+/, ""); // strip leading non-alphanumeric
  return cleaned.toLowerCase();
}

export default function App() {
  const { movies, loading, error } = useMovies();

  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  // const [sortBy, setSortBy] = useState("year.desc"); // default: Year New → Old
  // const [sortBy, setSortBy] = useState("title.asc"); // default: Title A → Z
  const [sortBy, setSortBy] = useState("vote.desc");
  const [layout, setLayout] = useState("grid");

  // Force grid layout on screens < 768px
useEffect(() => {
  const updateLayout = () => {
    if (window.innerWidth < 768) {
      setLayout("grid");
    }
  };

  updateLayout(); // run instantly on load
  window.addEventListener("resize", updateLayout);
  return () => window.removeEventListener("resize", updateLayout);
}, []);

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favMovies") || "[]");
    } catch {
      return [];
    }
  });

  // persist favourites
  useEffect(() => {
    localStorage.setItem("favMovies", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFav = (movie) => {
    setFavorites((prev) =>
      prev.includes(movie.id)
        ? prev.filter((id) => id !== movie.id)
        : [...prev, movie.id]
    );
  };

  // Filters should always reset to page 1 when changed
  const handleSetQuery = (v) => {
    setQuery(v);
    setPage(1);
  };
  const handleSetGenre = (v) => {
    setGenre(v);
    setPage(1);
  };
  const handleSetYear = (v) => {
    setYear(v);
    setPage(1);
  };
  const handleSetSortBy = (v) => {
    setSortBy(v);
    // no need to reset page, but we can:
    // setPage(1);
  };

  // Core: filter + sort over the full movies list
  const filtered = useMemo(() => {
    let data = Array.isArray(movies) ? movies.slice() : [];

    // search: title + overview (case-insensitive)
    const q = query.trim().toLowerCase();
    if (q) {
      data = data.filter((m) => {
        const title = (m.title || m.name || "").toLowerCase();
        const overview = (m.overview || "").toLowerCase();
        return title.includes(q) || overview.includes(q);
      });
    }

    // genre filter
    if (genre) {
      const gId = Number(genre);
      if (!Number.isNaN(gId)) {
        data = data.filter((m) =>
          (m.genre_ids || []).some((id) => id === gId)
        );
      }
    }

    // year filter
    if (year) {
      data = data.filter((m) => {
        const d = m.release_date || m.first_air_date || "";
        return String(d).startsWith(String(year));
      });
    }

    // sorting
    switch (sortBy) {
      case "title.asc":
        data.sort((a, b) => sortTitle(a).localeCompare(sortTitle(b)));
        break;
      case "title.desc":
        data.sort((a, b) => sortTitle(b).localeCompare(sortTitle(a)));
        break;
      case "vote.desc":
        data.sort(
          (a, b) => (b.vote_average || 0) - (a.vote_average || 0)
        );
        break;
      case "vote.asc":
        data.sort(
          (a, b) => (a.vote_average || 0) - (b.vote_average || 0)
        );
        break;
      case "year.desc":
        data.sort((a, b) => {
          const ay = parseInt(
            (a.release_date || a.first_air_date || "").slice(0, 4),
            10
          );
          const by = parseInt(
            (b.release_date || b.first_air_date || "").slice(0, 4),
            10
          );
          return (by || 0) - (ay || 0);
        });
        break;
      case "year.asc":
        data.sort((a, b) => {
          const ay = parseInt(
            (a.release_date || a.first_air_date || "").slice(0, 4),
            10
          );
          const by = parseInt(
            (b.release_date || b.first_air_date || "").slice(0, 4),
            10
          );
          return (ay || 0) - (by || 0);
        });
        break;
      default:
      // no-op
    }

    return data;
  }, [movies, query, genre, year, sortBy]);

  // Pagination based on filtered list
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PER_PAGE)
  );

  // Clamp page when filtered results shrink
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const showItems = filtered.slice(start, end);

  const favoriteObjects = movies.filter((m) =>
    favorites.includes(m.id)
  );

  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      <Header />
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="flex items-start gap-6">
          <div className="flex-1 space-y-4">
            <Filters
              query={query}
              setQuery={handleSetQuery}
              genre={genre}
              setGenre={handleSetGenre}
              year={year}
              setYear={handleSetYear}
              sortBy={sortBy}
              setSortBy={handleSetSortBy}
              layout={layout}
              setLayout={setLayout}
            />

            {loading && null}

            {!error && (
            <>
              <MovieGrid
                items={showItems}
                layout={layout}
                onSelect={setSelected}
                favorites={favorites}
                toggleFav={toggleFav}
                loading={loading}
              />

              {!loading && (
                <Pagination
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                />
              )}
            </>
          )}

          </div>

          <aside className="w-80 hidden lg:block">
            <Favorites
              items={favoriteObjects}
              onSelect={setSelected}
            />
          </aside>
        </div>
      </main>

      {selected && (
        <MovieModal
          movie={selected}
          onClose={() => setSelected(null)}
        />
      )}

      <Footer />
      <ScrollToTop />
    </div>
  );
}
