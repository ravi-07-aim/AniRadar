import { motion } from "framer-motion";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Mystery", "Psychological", "Romance", "Sci-Fi",
  "Shounen", "Seinen", "Slice of Life", "Supernatural", "Thriller",
  "Sports", "Mecha", "Music", "Historical", "Isekai"
];

export default function GenreTags({ selectedGenres, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
      {GENRES.map((genre) => (
        <motion.button
          key={genre}
          onClick={() => onSelect(genre)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
            selectedGenres.includes(genre)
              ? "bg-indigo-500/30 border-indigo-500 text-indigo-300"
              : "bg-zinc-900/50 border-zinc-700/50 text-zinc-400 hover:border-indigo-500/50 hover:text-zinc-200"
          }`}
        >
          {genre}
        </motion.button>
      ))}
    </div>
  );
}