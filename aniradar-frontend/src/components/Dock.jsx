import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const cn = (...args) => args.filter(Boolean).join(" ");

const DockItem = ({ mouseX, children }) => {
  const ref = useRef(null);
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });
  const iconScale = useTransform(width, [40, 80], [1, 1.5]);
  const iconSpring = useSpring(iconScale, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square w-10 rounded-full bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center hover:border-indigo-500/50 transition-colors"
    >
      <motion.div
        style={{ scale: iconSpring }}
        className="flex items-center justify-center w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const AnimatedDock = ({ className, items }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-16 items-end gap-4 rounded-2xl bg-zinc-900/80 border border-zinc-700/50 shadow-lg backdrop-blur-lg px-4 pb-3",
        className
      )}
    >
      {items.map((item, index) => (
  <DockItem key={index} mouseX={mouseX}>
    
    <a  href={item.link}
      title={item.label}
      onClick={(e) => { e.preventDefault(); item.onClick?.(); }}
      className="flex items-center justify-center w-full h-full text-zinc-300 hover:text-white transition-colors"
    >
      {item.Icon}
    </a>
  </DockItem>
))}
    </motion.div>
  );
};