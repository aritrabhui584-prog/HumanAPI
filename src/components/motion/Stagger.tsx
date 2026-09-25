import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { EASE, DURATIONS, STAGGER } from "../../lib/motion";

interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  amount?: number;
  once?: boolean;
  className?: string;
}

/**
 * Stagger Container & StaggerItem
 * 
 * Provides coordinated staggered reveals for grid items, lists, and cards.
 */
export const Stagger: React.FC<StaggerProps> = ({
  children,
  staggerDelay = STAGGER.normal,
  delayChildren = 0.05,
  amount = 0.2,
  once = true,
  className = ""
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps {
  children: React.ReactNode;
  yOffset?: number;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  yOffset = 18,
  className = ""
}) => {
  const itemVariants: Variants = {
    initial: { opacity: 0, y: yOffset },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATIONS.normal, ease: EASE }
    }
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

export default Stagger;
