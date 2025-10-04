import React from "react";
import MovieCard from "./MovieCard";
function MoviesGrid({ movies, watchlistMap, onAdd, onRemove }) {
    if (!movies || movies.length === 0) {
        return <div className="p-8 text-center text-gray-500">No movies to show.</div>;
    }
    return (
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((m) => (
                <MovieCard
                    key={m.id}
                    movie={m}
                    isInWatchlist={Boolean(watchlistMap[m.id])}
                    onAdd={onAdd}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}

export default MoviesGrid;