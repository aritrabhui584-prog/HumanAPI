import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

/**
 * SectionTransition
 * 
 * Passive, non-disruptive, restrained entrance reveal for landing sections.
 * Animates smoothly when the section enters the viewport:
 * - Desktop y: 28px -> 0
 * - Tablet y: 22px -> 0
 * - Mobile y: 16px -> 0
 * - Opacity 0 -> 1 over 600ms with cubic-bezier(0.22, 1, 0.36, 1)
 * Respects prefers-reduced-motion.
 */
export const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  className = "",
  id,
  delay = 0
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [revealDistance, setRevealDistance] = useState(28);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);

      const updateDistance = () => {
        const w = window.innerWidth;
        if (w < 640) {
          setRevealDistance(16);
        } else if (w < 1024) {
          setRevealDistance(22);
        } else {
          setRevealDistance(28);
        }
      };

      updateDistance();
      window.addEventListener("resize", updateDistance);

      return () => {
        mediaQuery.removeEventListener("change", listener);
        window.removeEventListener("resize", updateDistance);
      };
    }
  }, []);

  return (
    <div id={id} className={`w-full ${className}`}>
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: revealDistance }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{
          duration: 0.6,
          delay,
          ease: EASE_EDITORIAL
        }}
        className="w-full flex flex-col items-center justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SectionTransition;
