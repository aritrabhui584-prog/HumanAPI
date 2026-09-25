import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EASE, DURATIONS } from "../../lib/motion";

interface FadeImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  delay?: number;
  duration?: number;
}

/**
 * FadeImage Component
 * 
 * Premium image / media reveal with overflow-hidden mask.
 * Subtle scale (1.04 -> 1.0) and opacity fade (0.8 -> 1.0) over 0.8s.
 */
export const FadeImage: React.FC<FadeImageProps> = ({
  src,
  alt,
  className = "",
  imageClassName = "",
  delay = 0,
  duration = 0.8
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
      <div className={`overflow-hidden ${className}`}>
        <img src={src} alt={alt} className={`w-full h-full object-cover ${imageClassName}`} />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0.8, scale: 1.04 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration,
          delay,
          ease: EASE
        }}
        className={`w-full h-full object-cover ${imageClassName}`}
      />
    </div>
  );
};

export default FadeImage;
