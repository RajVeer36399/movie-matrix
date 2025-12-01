import React from "react";
import { posterUrl } from "../api/tmdb";
import { Heart } from "lucide-react";

export default function MovieCard({ movie, onSelect, isFav, toggleFav }) {
  // Use a reasonable default size for thumbnails
  const posterPath = movie.poster_path || movie.poster;
  const poster = posterUrl(posterPath, "w342");

  return (
    <article className="bg-[white] rounded-lg shadow p-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Poster with hover zoom */}
      <div className="h-56 w-full bg-[slate-100] rounded-lg overflow-hidden group shadow-sm">
        {posterPath ? (
          <img
            src={poster}
            srcSet={`
              ${posterUrl(posterPath, "w185")} 185w,
              ${posterUrl(posterPath, "w342")} 342w,
              ${posterUrl(posterPath, "w500")} 500w
            `}
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 200px"
            alt={movie.title || movie.name || "Movie poster"}
            loading="lazy"
            decoding="async"
            width={300}
            height={450}
            className="w-full h-full object-cover object-top transform transition-transform duration-300 ease-out group-hover:scale-105 opacity-0"
            onLoad={(e) => {
              // fade in
              try {
                e.currentTarget.style.opacity = 1;
              } catch (err) {}
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="mt-3 flex-1 flex flex-col">
        {/* Title + year */}
        <h3 className="text-lg font-semibold">{movie.title}</h3>

        <p className="text-sm text-slate-500">{(movie.release_date || "")
          .slice(0, 4)}</p>

        {/* Genres */}
        <p className="text-sm text-slate-600 mt-1">
          {(movie.genre_names || movie.genres || [])
            .map((g) => (g && g.name ? g.name : g))
            .filter(Boolean)
            .join(", ")}
        </p>

        {/* Rating */}
        <p className="text-sm text-slate-700 mt-1 flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1">
            {(movie.vote_average || movie.rating || 0).toFixed(1)}
          </span>
        </p>

        {/* Description */}
        <p className="text-sm text-slate-700 mt-2 line-clamp-3">
          {movie.overview || movie.description || "No description available."}
        </p>

        {/* Bottom buttons */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          {/* Details */}
          <button
            onClick={() => onSelect(movie)}
            className="text-sm px-3 py-1 border rounded hover:bg-slate-50 transition"
          >
            Details
          </button>

          {/* Heart icon — NO background circle */}
          <button
            onClick={() => toggleFav(movie)}
            className="transition-transform hover:scale-110"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={22}
              className={
                isFav
                  ? "text-red-600 fill-red-600 transition"
                  : "text-slate-700 transition"
              }
            />
          </button>
        </div>
      </div>
    </article>
  );
}
