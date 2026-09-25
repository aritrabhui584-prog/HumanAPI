import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EASE, DURATIONS } from "../../lib/motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  amount?: number;
  once?: boolean;
  className?: string;
}

/**
 * Reveal Component
 * 
 * Reusable viewport entrance reveal wrapper for major section components and elements.
 * Uses Framer Motion whileInView with cubic-bezier(0.16, 1, 0.3, 1) easing.
 * Respects prefers-reduced-motion preference.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  duration = DURATIONS.slow,
  yOffset = 24,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: EASE
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
