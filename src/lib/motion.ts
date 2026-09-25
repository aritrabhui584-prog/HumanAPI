import { Variants } from "framer-motion";

/**
 * Global Motion Tokens for HumanAPI
 * 
 * Easing: cubic-bezier(0.16, 1, 0.3, 1)
 * Standard durations and animation variants for consistent premium feel.
 */
export const EASE = [0.16, 1, 0.3, 1] as const;

export const DURATIONS = {
  micro: 0.2,       // Micro-interactions (hover, active) - 180-220ms
  fast: 0.35,      // Quick transitions - 350ms
  normal: 0.45,    // Standard content reveals - 450ms
  slow: 0.7,       // Section & hero reveals - 700ms
  cinematic: 0.9   // Welcome / initial screen - 900ms
} as const;

export const STAGGER = {
  fast: 0.06,      // 60ms
  normal: 0.08,    // 80ms
  slow: 0.1        // 100ms
} as const;

/**
 * Common Motion Variants
 */
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: DURATIONS.normal, ease: EASE }
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.fast, ease: EASE }
  }
};

export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.slow, ease: EASE }
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: DURATIONS.fast, ease: EASE }
  }
};

export const maskRevealVariants: Variants = {
  initial: { y: "100%", opacity: 0 },
  animate: {
    y: "0%",
    opacity: 1,
    transition: { duration: DURATIONS.slow, ease: EASE }
  }
};

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.fast, ease: EASE }
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: DURATIONS.fast, ease: EASE }
  }
};

export const containerStaggerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: STAGGER.normal,
      delayChildren: 0.05
    }
  }
};

export const itemStaggerVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.normal, ease: EASE }
  }
};
