import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE, DURATIONS, pageTransitionVariants } from "../../lib/motion";

interface PageTransitionProps {
  children: React.ReactNode;
  routeKey: string;
  className?: string;
}

/**
 * PageTransition
 * 
 * Global page transition wrapper.
 * Provides smooth, non-disruptive navigation between route views using AnimatePresence mode="wait".
 * 
 * Outgoing: opacity 1 -> 0, y 0 -> -6px (duration 200ms)
 * Incoming: opacity 0 -> 1, y 8px -> 0 (duration 350-450ms)
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  routeKey,
  className = ""
}) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`w-full ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
