import { useState, useRef } from "react";
import Background from "./components/Background";
import SearchBar from "./components/SearchBar";
import AnimeCard from "./components/AnimeCard";
import { EmptyState } from "./components/EmptyState";
import { AnimatedDock } from "./components/Dock";
import Dropdown from "./components/Dropdown";
import GenreTags from "./components/GenreTags";
import { Home, Search, Star, Tv } from "lucide-react";

export default function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState("Rating");
  const [showCount, setShowCount] = useState("10");

  const searchRef = useRef(null);
  const genreRef = useRef(null);
  const topRef = useRef(null);

  const handleSearch = async (query = "") => {
    if (!query.trim() && selectedGenres.length === 0) return;
    setLoading(true);
    setSearched(true);

    try {
      let url = "";
      if (query.trim()) {
        url = `https://aniradar-r8f9.onrender.com/recommend?anime=${query}`;
        if (selectedGenres.length > 0) {
          url += `&genre=${selectedGenres[0]}`;
        }
      } else {
        url = `https://aniradar-r8f9.onrender.com/recommend?genre=${selectedGenres[0]}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        setResults([]);
      } else {
        let recs = data.recommendations;

        // Filter by all selected genres
        if (selectedGenres.length > 1) {
          recs = recs.filter(r =>
            selectedGenres.every(g =>
              r.genre.toLowerCase().includes(g.toLowerCase())
            )
          );
        }

        if (sortBy === "Rating") {
          recs = recs.sort((a, b) => b.rating - a.rating);
        } else {
          recs = recs.sort((a, b) => a.name.localeCompare(b.name));
        }

        setResults(recs.slice(0, parseInt(showCount)));
      }
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleTopRated = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`https://aniradar-r8f9.onrender.com/recommend?genre=action`);
      const data = await res.json();
      let recs = data.recommendations.sort((a, b) => b.rating - a.rating);
      setResults(recs.slice(0, parseInt(showCount)));
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const DOCK_ITEMS = [
    {
      link: "#",
      label: "Home",
      Icon: <Home size={18} />,
      onClick: () => {
        setResults([]);
        setSearched(false);
        setSelectedGenres([]);
        topRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      link: "#",
      label: "Search",
      Icon: <Search size={18} />,
      onClick: () => {
        searchRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      link: "#",
      label: "Top Rated",
      Icon: <Star size={18} />,
      onClick: handleTopRated
    },
    {
      link: "#",
      label: "Genres",
      Icon: <Tv size={18} />,
      onClick: () => {
        genreRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <Background />

      <div ref={topRef} className="relative z-10 flex flex-col items-center min-h-screen px-4 py-16 gap-10">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-rose-300 tracking-tight">
            AniRadar
          </h1>
          <p className="text-zinc-400 text-sm tracking-wide">
            Discover your next favourite anime 🎯
          </p>
        </div>

        {/* Search */}
        <div ref={searchRef}>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Genre Tags */}
        <div ref={genreRef} className="w-full flex flex-col items-center gap-3">
          <GenreTags selectedGenres={selectedGenres} onSelect={handleGenreSelect} />
          {selectedGenres.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 text-xs">
                {selectedGenres.length} genre{selectedGenres.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedGenres([])}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Clear all
              </button>
              {selectedGenres.length > 0 && (
                <button
                  onClick={() => handleSearch("")}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/30 transition-all"
                >
                  Search by genre →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex gap-4">
          <Dropdown
            label="Sort by"
            options={["Rating", "Name"]}
            selected={sortBy}
            onSelect={setSortBy}
          />
          <Dropdown
            label="Show"
            options={["5", "10", "15"]}
            selected={showCount}
            onSelect={setShowCount}
          />
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-zinc-400 text-sm animate-pulse">
            Scanning the anime universe... 🔍
          </div>
        ) : searched && results.length === 0 ? (
          <EmptyState
            variant="error"
            title="No anime found"
            description="Try a different name or select different genres"
            icons={["🔍", "😅", "🎌"]}
            action={{ label: "Try Again", onClick: () => { setSearched(false); setSelectedGenres([]); } }}
            className="w-full max-w-md"
          />
        ) : !searched ? (
          <EmptyState
            variant="default"
            title="Start searching"
            description="Type an anime name or select genres to discover anime you'll love"
            icons={["🎬", "🎯", "⭐"]}
            className="w-full max-w-md"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl pb-24">
            {results.map((anime, index) => (
              <AnimeCard
                key={index}
                index={index}
                name={anime.name}
                genre={anime.genre}
                rating={anime.rating}
                image_url={anime.image_url}
              />
            ))}
          </div>
        )}

        {/* Dock */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <AnimatedDock items={DOCK_ITEMS} />
        </div>
      </div>
    </div>
  );
}