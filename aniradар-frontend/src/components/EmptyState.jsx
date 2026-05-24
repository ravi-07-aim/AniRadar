import { memo, useId, forwardRef } from 'react';
import { motion, LazyMotion, domAnimation } from 'framer-motion';

const ICON_VARIANTS = {
  left: {
    initial: { scale: 0.8, opacity: 0, x: 0, y: 0, rotate: 0 },
    animate: { scale: 1, opacity: 1, x: 0, y: 0, rotate: -6, transition: { duration: 0.4, delay: 0.1 } },
    hover: { x: -22, y: -5, rotate: -15, scale: 1.1, transition: { duration: 0.2 } }
  },
  center: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.4, delay: 0.2 } },
    hover: { y: -10, scale: 1.15, transition: { duration: 0.2 } }
  },
  right: {
    initial: { scale: 0.8, opacity: 0, x: 0, y: 0, rotate: 0 },
    animate: { scale: 1, opacity: 1, x: 0, y: 0, rotate: 6, transition: { duration: 0.4, delay: 0.3 } },
    hover: { x: 22, y: -5, rotate: 15, scale: 1.1, transition: { duration: 0.2 } }
  }
};

const CONTENT_VARIANTS = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.2 } },
};

const BUTTON_VARIANTS = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.3 } },
};

const cn = (...classes) => classes.filter(Boolean).join(' ');

const IconContainer = memo(({ children, variant }) => (
  <motion.div
    variants={ICON_VARIANTS[variant]}
    className="w-12 h-12 rounded-xl flex items-center justify-center relative shadow-lg bg-neutral-800 border border-neutral-700 group-hover:border-neutral-600 transition-all duration-300"
  >
    <div className="text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors duration-300">
      {children}
    </div>
  </motion.div>
));
IconContainer.displayName = "IconContainer";

const MultiIconDisplay = memo(({ icons }) => {
  if (!icons || icons.length < 3) return null;
  return (
    <div className="flex justify-center isolate relative">
      <IconContainer variant="left" className="left-2 top-1 z-10">{icons[0]}</IconContainer>
      <IconContainer variant="center" className="z-20">{icons[1]}</IconContainer>
      <IconContainer variant="right" className="right-2 top-1 z-10">{icons[2]}</IconContainer>
    </div>
  );
});
MultiIconDisplay.displayName = "MultiIconDisplay";

export const EmptyState = forwardRef(({
  title,
  description,
  icons,
  action,
  variant = 'default',
  className = '',
}, ref) => {
  const titleId = useId();
  const descriptionId = useId();

  const variantClasses = {
    default: "bg-neutral-900 border-dashed border-2 border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50",
    error: "bg-neutral-900 border border-red-800 bg-red-950/50 hover:bg-red-950/80",
  };

  return (
    <LazyMotion features={domAnimation}>
      <motion.section
        ref={ref}
        role="region"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn(
          "group transition-all duration-300 rounded-xl relative overflow-hidden text-center flex flex-col items-center justify-center p-8",
          variantClasses[variant],
          className
        )}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        <div className="relative z-10 flex flex-col items-center">
          {icons && (
            <div className="mb-6">
              <MultiIconDisplay icons={icons} />
            </div>
          )}
          <motion.div variants={CONTENT_VARIANTS} className="space-y-2 mb-6">
            <h2 id={titleId} className="text-lg text-neutral-100 font-semibold transition-colors duration-200">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-neutral-400 max-w-md leading-relaxed">
                {description}
              </p>
            )}
          </motion.div>
          {action && (
            <motion.div variants={BUTTON_VARIANTS}>
              <motion.button
                type="button"
                onClick={action.onClick}
                className="inline-flex items-center gap-2 border rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-200 text-sm px-4 py-2 border-neutral-600 bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                whileTap={{ scale: 0.98 }}
              >
                {action.icon && <div>{action.icon}</div>}
                <span>{action.label}</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.section>
    </LazyMotion>
  );
});
EmptyState.displayName = "EmptyState";