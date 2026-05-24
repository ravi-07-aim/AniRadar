import { useState } from "react";

export default function AnimeCard({ name, genre, rating, image_url, index = 0 }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const ratingColor = rating >= 8 ? "#22c55e" : rating >= 7 ? "#eab308" : "#ef4444";

  return (
    <div
      className="group relative h-[360px] w-full max-w-[280px] [perspective:2000px] cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative h-full w-full [transform-style:preserve-3d] transition-all duration-700 ${
          isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'
        }`}
      >
        {/* Front */}
        <div className={`absolute inset-0 h-full w-full [transform:rotateY(0deg)] [backface-visibility:hidden] overflow-hidden rounded-2xl border border-zinc-800/50 shadow-xl transition-all duration-700 group-hover:border-indigo-500/30 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>

          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800 flex flex-col items-center justify-center gap-2 px-6">
              {[60, 80, 70, 90, 65].map((w, i) => (
                <div
                  key={i}
                  className="h-2 rounded-sm bg-gradient-to-r from-indigo-500/20 via-purple-500/30 to-indigo-500/20 animate-pulse"
                  style={{ width: `${w}%`, animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 border border-white/10 z-10">
            <span className="text-yellow-400 text-xs">★</span>
            <span style={{ color: ratingColor }} className="text-xs font-bold">{rating}</span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <h3 className="text-white font-semibold text-lg leading-snug tracking-tight transition-all duration-500 group-hover:translate-y-[-4px] line-clamp-2">
              {name}
            </h3>
            <p className="text-zinc-300 text-xs mt-1 transition-all duration-500 delay-[50ms] group-hover:translate-y-[-4px]">
              Hover to see details
            </p>
          </div>
        </div>

        {/* Back */}
        <div className={`absolute inset-0 h-full w-full [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-2xl p-5 bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800 border border-zinc-800 shadow-xl flex flex-col transition-all duration-700 group-hover:border-indigo-500/30 ${!isFlipped ? 'opacity-0' : 'opacity-100'}`}>

          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />

          <div className="relative z-10 flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0">
                <span className="text-white text-xs">🎬</span>
              </div>
              <h3 className="text-white font-semibold text-base leading-snug line-clamp-2">
                {name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-yellow-400">★★★★★</span>
              <span style={{ color: ratingColor }} className="font-bold text-lg">{rating}</span>
              <span className="text-zinc-500 text-sm">/ 10</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {genre.split(', ').map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-auto border-t border-zinc-800 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-xs">AniRadar Pick</span>
              <span className="text-indigo-400 text-xs">🎯</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}