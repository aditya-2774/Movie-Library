/*
Movie Library - Single-file React App (App.jsx)

Instructions:
1. Create a React app (Vite or Create React App). Example with Vite:
   npm create vite@latest movie-library -- --template react
   cd movie-library
2. Install dependencies:
   npm install react-router-dom
3. Save this file as src/App.jsx (replace the existing App.jsx).
4. Create .env in project root with:
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
5. Start dev server: npm run dev (Vite) or npm start (CRA)

Notes on API keys and security:
- This frontend uses TMDB (The Movie Database). The key is stored in an env variable and will be bundled into the client at build time. For production or more secure handling, put the key on a backend proxy.

Features implemented in this App:
- Fetch popular movies on load from TMDB
- Search movies by title (debounced)
- Grid display of movies with poster & title
- Add/Remove from Watchlist (persisted to localStorage)
- Client-side routing: Home (browse) and Watchlist views
- Reusable MovieCard component
- TailwindCSS styling and transition effects


*/

import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

import Header from "./components/Header";
import WatchlistPage from "./components/WatchlistPage";
import MoviesGrid from "./components/MoviesGrid";
import Home from "./components/Home";
import Footer from "./components/Footer";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
console.log("TMDB Key:", import.meta.env.VITE_TMDB_API_KEY);

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const WATCHLIST_KEY = "movie_library_watchlist_v1";

function useLocalStorageState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      console.error("localStorage read failed", e);
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error("localStorage write failed", e);
    }
  }, [key, state]);
  return [state, setState];
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [watchlist, setWatchlist] = useLocalStorageState(WATCHLIST_KEY, []);
  const watchlistMap = useMemo(() => {
    const map = {};
    for (const m of watchlist) map[m.id] = m;
    return map;
  }, [watchlist]);

  // Debounce search input (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    async function doSearch() {
      if (!debounced) {
        setSearchResults([]);
        setSearchError(null);
        setSearchLoading(false);
        return;
      }
      if (!API_KEY) {
        setSearchError("Missing TMDB API key. Set VITE_TMDB_API_KEY or REACT_APP_TMDB_API_KEY in .env");
        return;
      }
      setSearchLoading(true);
      setSearchError(null);
      try {
        const q = encodeURIComponent(debounced);
        const res = await fetch(`${TMDB_BASE}/search/movie?api_key=${API_KEY}&language=en-US&query=${q}&page=1&include_adult=false`);
        const json = await res.json();
        if (res.ok) setSearchResults(json.results || []);
        else setSearchError(json.status_message || "Search failed");
      } catch (e) {
        setSearchError(e.message);
      } finally {
        setSearchLoading(false);
      }
    }
    doSearch();
  }, [debounced]);

  function addToWatchlist(movie) {
    setWatchlist((prev) => {
      if (prev.find((p) => p.id === movie.id)) return prev;
      return [movie, ...prev].slice(0, 200); // cap to 200 items
    });
  }
  function removeFromWatchlist(movie) {
    setWatchlist((prev) => prev.filter((p) => p.id !== movie.id));
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white">
        <Header onSearch={setSearchTerm} searchValue={searchTerm} />

        {/* Search results overlay */}
        <div className="container mx-auto p-4">
          {searchLoading && <div className="mb-4 text-gray-600">Searching…</div>}
          {searchError && <div className="mb-4 text-red-500">{searchError}</div>}
          {debounced && !searchLoading && (
            <section className="bg-white rounded-xl shadow p-4 mb-4">
              <h4 className="font-semibold mb-3">Search results for “{debounced}”</h4>
              <MoviesGrid movies={searchResults} watchlistMap={watchlistMap} onAdd={addToWatchlist} onRemove={removeFromWatchlist} />
            </section>
          )}
        </div>

        <Routes>
          <Route path="/" element={<Home onAdd={addToWatchlist} onRemove={removeFromWatchlist} watchlistMap={watchlistMap} />} />
          <Route path="/watchlist" element={<WatchlistPage watchlist={watchlist} onRemove={removeFromWatchlist} />} />
          <Route path="*" element={<div className="p-8 text-center">404 — Page not found. <Link to="/" className="text-indigo-600">Go home</Link></div>} />
        </Routes>

        <Footer />
      </div>


    </Router>
  );
}
