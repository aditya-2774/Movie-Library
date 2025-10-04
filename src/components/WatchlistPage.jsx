import React from "react";
import MoviesGrid from "./MoviesGrid";
function WatchlistPage({ watchlist, onRemove }) {
    return (
        <main className="min-h-screen w-full flex flex-col bg-gray-50 flex-grow">
            <div className="container mx-auto p-6 flex-1 w-full">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Watchlist</h2>

                {watchlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-gray-500 w-full min-h-[70vh]">
                        <p className="text-lg text-center">
                            Your watchlist is empty. Add movies from Browse.
                        </p>
                    </div>
                ) : (
                    <MoviesGrid
                        movies={watchlist}
                        watchlistMap={watchlist.reduce((acc, m) => {
                            acc[m.id] = m;
                            return acc;
                        }, {})}
                        onAdd={() => { }}
                        onRemove={onRemove}
                    />
                )}
            </div>
        </main>
    );
}

export default WatchlistPage;