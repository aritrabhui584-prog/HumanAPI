import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EASE, DURATIONS } from "../../lib/motion";

interface RevealTextProps {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  amount?: number;
  once?: boolean;
}

/**
 * RevealText Component
 * 
 * Masked line-by-line typographic reveal with robust parent-level IntersectionObserver.
 * Observes the unclipped parent container to guarantee reliable triggering,
 * then stagger-animates children up from y: 100% to 0%.
 */
export const RevealText: React.FC<RevealTextProps> = ({
  lines,
  as: Component = "h2",
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.09,
  amount = 0.15,
  once = true
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
    return (
      <Component className={className}>
        {lines.map((line, idx) => (
          <span key={idx} className={`block ${lineClassName}`}>
            {line}
          </span>
        ))}
      </Component>
    );
  }

  const MotionComponent = (motion as any)[Component] || motion.h2;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  };

  const lineVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: DURATIONS.slow,
        ease: EASE
      }
    }
  };

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={containerVariants}
      className={className}
    >
      {lines.map((line, idx) => (
        <div key={idx} className="overflow-hidden py-0.5">
          <motion.span
            variants={lineVariants}
            className={`block ${lineClassName}`}
          >
            {line}
          </motion.span>
        </div>
      ))}
    </MotionComponent>
  );
};

export default RevealText;
