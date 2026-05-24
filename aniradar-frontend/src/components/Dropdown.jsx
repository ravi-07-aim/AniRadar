import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cn = (...args) => args.filter(Boolean).join(" ");

export default function Dropdown({ label, options, selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
          "bg-zinc-900/80 border border-zinc-700/50 text-zinc-300",
          "hover:border-indigo-500/50 hover:text-white backdrop-blur-lg"
        )}
      >
        {label}: <span className="text-indigo-400">{selected}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 z-50 min-w-[140px] rounded-xl bg-zinc-900 border border-zinc-700/50 shadow-xl backdrop-blur-lg overflow-hidden"
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => { onSelect(option); setIsOpen(false); }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm transition-all duration-150",
                  selected === option
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                )}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}