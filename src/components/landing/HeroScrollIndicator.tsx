import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroScrollIndicatorProps {
  targetId?: string;
  label?: string;
}

export const HeroScrollIndicator: React.FC<HeroScrollIndicatorProps> = ({
  targetId = "intro",
  label = "Scroll to explore"
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Track scroll threshold to smoothly auto-hide when scrolling away from top
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const heroThreshold = window.innerHeight * 0.25;
      if (window.scrollY > heroThreshold) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window === "undefined") return;

    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Default fallback: scroll past hero height (100dvh)
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 z-20 pointer-events-auto transition-all duration-300 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      style={{
        bottom: "calc(28px + env(safe-area-inset-bottom, 0px))"
      }}
    >
      <button
        type="button"
        onClick={handleScrollDown}
        aria-label={`Scroll down to explore HumanAPI section`}
        className="group flex flex-col items-center gap-1.5 min-w-[44px] min-h-[44px] p-2 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C96F42]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 transition-all"
      >
        {/* Editorial Text Cue */}
        <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.22em] uppercase text-[#FFF9F2]/80 group-hover:text-[#FFF9F2] transition-colors select-none font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          {label}
        </span>

        {/* Animated Chevron & Hairline Accent */}
        <div className="flex flex-col items-center text-[#FFF9F2]/75 group-hover:text-[#FFF9F2] transition-colors">
          <motion.div
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [0, 5, 0],
                    opacity: [0.75, 1, 0.75]
                  }
            }
            transition={{
              duration: 2.0,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="flex flex-col items-center gap-1"
          >
            <ChevronDown size={16} strokeWidth={2} className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
            <div className="w-5 h-[1px] bg-[#FFF9F2]/30 group-hover:bg-[#FFF9F2]/70 transition-colors shadow-sm" />
          </motion.div>
        </div>
      </button>
    </div>
  );
};

export default HeroScrollIndicator;
