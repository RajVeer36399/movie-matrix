// src/components/MovieGrid.jsx
import React from "react";
import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";

export default function MovieGrid({
  items,
  layout,
  onSelect,
  favorites,
  toggleFav,
  loading,
}) {
  // 1) While loading → show skeleton cards
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // 2) No results
  if (!items || items.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        No movies found
      </div>
    );
  }

  // 3) List layout (if you ever bring it back)
  if (layout === "list") {
    return (
      <div className="space-y-3">
        {items.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            onSelect={onSelect}
            isFav={favorites.includes(m.id)}
            toggleFav={toggleFav}
          />
        ))}
      </div>
    );
  }

  // 4) Default: grid layout
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((m) => (
        <MovieCard
          key={m.id}
          movie={m}
          onSelect={onSelect}
          isFav={favorites.includes(m.id)}
          toggleFav={toggleFav}
        />
      ))}
    </div>
  );
}
