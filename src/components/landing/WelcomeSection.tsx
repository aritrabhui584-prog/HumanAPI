import React, { useRef, useState, useEffect } from "react";
import { WelcomeVideo } from "./WelcomeVideo";
import { HeroScrollIndicator } from "./HeroScrollIndicator";

/**
 * WelcomeSection (Cinematic Welcome Hero)
 * 
 * Full-bleed video background hero.
 * Clean, pristine hero presentation with centered HeroScrollIndicator.
 */
export const WelcomeSection: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
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

  return (
    <section
      ref={containerRef}
      id="welcome"
      aria-label="HumanAPI Hero"
      className="hero welcome-section relative w-full w-vw max-w-none m-0 p-0 h-[100dvh] min-h-[100dvh] overflow-hidden select-none"
      style={{ backgroundColor: "#160706" }}
    >
      {/* 1. CINEMATIC RED WALLPAPER BACKDROP (z-index: 0) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{
          background: `radial-gradient(
            circle at 58% 45%,
            #C84A24 0%,
            #A92A18 38%,
            #6F160D 72%,
            #3A0B08 100%
          )`
        }}
      />

      {/* 2. BACKGROUND MASTER VIDEO LAYER (z-index: 1 - UNTOUCHED & CRISP) */}
      <div className="hero-video absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-1">
        <WelcomeVideo
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>

      {/* 3. CENTERED EDITORIAL SCROLL GUIDANCE ELEMENT */}
      <HeroScrollIndicator targetId="intro" label="Scroll to explore" />
    </section>
  );
};

export default WelcomeSection;
