import React from "react";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie, isInWatchlist, onAdd, onRemove }) {
    const poster = movie.poster_path ? IMG_BASE + movie.poster_path : null;
    return (
        <article className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-[1.02] transition duration-200">
            <div className="relative h-72 bg-gray-100 flex items-center justify-center">
                {poster ? (
                    <img src={poster} alt={movie.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="text-gray-400">No image</div>
                )}
            </div>
            <div className="p-3">
                <h3 className="font-semibold text-lg truncate">{movie.title}</h3>
                <p className="text-sm text-gray-500">{movie.release_date ? movie.release_date.slice(0, 4) : "—"}</p>
                <div className="mt-3 flex gap-2">
                    {!isInWatchlist ? (
                        <button
                            onClick={() => onAdd(movie)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
                        >
                            + Watchlist
                        </button>
                    ) : (
                        <button
                            onClick={() => onRemove(movie)}
                            className="px-3 py-1 border border-indigo-600 text-indigo-600 rounded-md text-sm hover:bg-indigo-50 transition"
                        >
                            Remove
                        </button>
                    )}
                    <a
                        href={`https://www.themoviedb.org/movie/${movie.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto text-sm text-gray-600 hover:underline"
                    >
                        Details ↗
                    </a>
                </div>
            </div>
        </article>
    );
}

export default MovieCard;