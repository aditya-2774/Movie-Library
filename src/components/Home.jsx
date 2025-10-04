import React, { useState, useEffect } from "react";
import MoviesGrid from "./MoviesGrid";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
function Home({ onAdd, onRemove, watchlistMap }) {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadPopular() {
            if (!API_KEY) {
                setError("Missing TMDB API key. Set VITE_TMDB_API_KEY or REACT_APP_TMDB_API_KEY in .env");
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${TMDB_BASE}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
                const json = await res.json();
                if (res.ok) {
                    setMovies(json.results || []);
                } else {
                    setError(json.status_message || "Failed to fetch.");
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        loadPopular();
    }, [page]);

    return (
        <main className="container mx-auto">
            <div className="flex items-center justify-between p-6">
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">Popular Movies</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-3 py-1 rounded-md border"
                        disabled={page === 1}
                    >
                        ◀
                    </button>
                    <span className="text-sm text-gray-600">Page {page}</span>
                    <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded-md border">▶</button>
                </div>
            </div>
            {loading && <div className="p-6 text-center">Loading…</div>}
            {error && <div className="p-6 text-center text-red-500">{error}</div>}
            <MoviesGrid movies={movies} watchlistMap={watchlistMap} onAdd={onAdd} onRemove={onRemove} />
        </main>
    );
}

export default Home;