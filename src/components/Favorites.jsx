import React from "react";

export default function Favorites({ items = [], onSelect }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl p-4 bg-white/60 backdrop-blur-md shadow-lg border border-white/40">
        <h4 className="font-semibold">Favorites</h4>
        <p className="text-sm text-slate-500 mt-2">No favorites yet</p>
      </div>
    );
  }

  // helper to get a safe year string (or null)
  const getYear = (m) => {
    if (!m) return null;
    if (m.year) return String(m.year);
    if (m.release_date && typeof m.release_date === "string") {
      return m.release_date.slice(0, 4);
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 space-y-2">
      <h4 className="font-semibold">Favorites</h4>

      {items.map((m) => {
        const year = getYear(m);
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect && onSelect(m)}
            className="w-full text-left text-sm p-2 rounded hover:bg-slate-50 transition"
          >
            <span>{m.title}</span>
            {year ? (
              <span className="text-xs text-slate-500"> ({year})</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
