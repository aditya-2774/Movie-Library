import React from "react";
import { Link } from "react-router-dom";
import { Film } from "lucide-react";

function Header({ onSearch, searchValue }) {
    return (
        <header className="bg-gradient-to-r from-sky-700 to-indigo-700 p-4 shadow-md sticky top-0 z-30">
            <div className="container mx-auto flex items-center gap-4">
                {/* Logo / Title */}
                <Link
                    to="/"
                    // Added a fallback text-white here for the whole link
                    className="flex items-center gap-2 font-bold text-2xl text-white"
                >
                    <Film className="w-7 h-7 text-white" />
                    <span className="text-white">MOVIE LIBRARY</span>
                </Link>

                <nav className="ml-6 flex gap-6">
                    <Link
                        to="/"
                        className="!text-white font-medium hover:text-yellow-300 transition-colors"
                    >
                        Browse
                    </Link>
                    <Link
                        to="/watchlist"
                        className="!text-white font-medium hover:text-yellow-300 transition-colors"
                    >
                        Watchlist
                    </Link>
                </nav>

                <div className="flex-1" />

                {/* Search Bar */}
                <div className="w-full max-w-md">
                    <input
                        aria-label="Search movies"
                        value={searchValue}
                        onChange={(e) => onSearch(e.target.value)}
                        // Search bar input background is white, which is correct.
                        className="w-full rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300 placeholder-gray-500"
                        placeholder="Search movies by title..."
                    />
                </div>
            </div>
        </header>
    );
}

export default Header;