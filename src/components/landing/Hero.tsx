import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import { ArrowRight } from "lucide-react";



/**
 * Hero
 * 
 * Clean, focused, and professional Hero component for HumanAPI.
 * Features:
 * - Controlled typography hierarchy with Manrope sans-serif (no decorative serifs)
 * - Headline desktop: clamp(48px, 5vw, 76px), line-height: 1.02, letter-spacing: -0.045em
 * - Second sentence in warm accent #C96F42
 * - Supporting copy: 16-18px desktop, line-height 1.55, max-w-[560px], #7B6C60
 * - Refined CTA buttons (Find an Expert → and How It Works)
 * - Prepared for future humanapi-hero.mp4 background video
 * - Subtle radial lighting background: #F6F0E7 with subtle warm spotlight
 * - Staggered motion entrance with prefers-reduced-motion support
 */
export const Hero: React.FC = () => {
  const { navigate } = useApp();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  const handleScrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Easing specified: cubic-bezier(0.16, 1, 0.3, 1)
  const customEase = [0.16, 1, 0.3, 1] as const;

  const eyebrowVariants = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: customEase } }
  };

  const headlineVariants = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1, ease: customEase } }
  };

  const descriptionVariants = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.55, delay: 0.18, ease: customEase } }
  };

  const ctaVariants = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.26, ease: customEase } }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-24 overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(circle at 50% 22%, rgba(201, 111, 66, 0.08), transparent 42%), #F6F0E7"
      }}
    >


      {/* HERO CONTENT: Controlled left/center-aligned block */}
      <div className="relative z-10 w-full max-w-[960px] mx-auto text-center flex flex-col items-center">
        {/* SMALL EYEBROW */}
        <motion.div
          variants={eyebrowVariants}
          initial="initial"
          animate="animate"
          className="mb-4 sm:mb-5"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9F2] border border-[#342A24]/10 text-[#7B6C60] text-[12px] sm:text-[13px] font-medium tracking-[0.02em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C96F42]" />
            Human expertise, on demand
          </span>
        </motion.div>

        {/* MAIN HEADLINE & ACCENT SECOND SENTENCE (Both strictly Manrope sans-serif) */}
        <motion.div
          variants={headlineVariants}
          initial="initial"
          animate="animate"
          className="max-w-[880px] mx-auto mb-5 sm:mb-6"
        >
          <h1
            className="font-sans font-semibold text-[#342A24] tracking-[-0.045em] leading-[1.02] text-[38px] sm:text-[54px] md:text-[64px] lg:text-[72px]"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            You don't always need to hire an expert.{" "}
            <span className="text-[#C96F42] block sm:inline font-semibold">
              Sometimes you just need to ask one.
            </span>
          </h1>
        </motion.div>

        {/* SUPPORTING TEXT: Max-w 560px, #7B6C60, Line-height 1.55 */}
        <motion.p
          variants={descriptionVariants}
          initial="initial"
          animate="animate"
          className="font-sans text-[16px] sm:text-[17px] md:text-[18px] text-[#7B6C60] leading-[1.55] max-w-[560px] mx-auto mb-8 sm:mb-9 font-normal"
        >
          Get focused advice from verified experts in 5, 10, or 15 minutes.
        </motion.p>

        {/* REFINED CTA BUTTONS */}
        <motion.div
          variants={ctaVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          {/* Primary CTA: Find an Expert → */}
          <button
            onClick={() => navigate("experts")}
            className="group inline-flex items-center justify-center gap-2 h-[46px] sm:h-[48px] px-6 sm:px-7 rounded-[13px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFFCF7] text-[15px] font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-[1px] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C96F42] w-full sm:w-auto select-none"
            id="hero-primary-cta"
          >
            <span>Find an Expert</span>
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Secondary CTA: How It Works */}
          <button
            onClick={handleScrollToHowItWorks}
            className="inline-flex items-center justify-center h-[46px] sm:h-[48px] px-6 sm:px-7 rounded-[13px] border border-[#342A24]/15 bg-transparent hover:bg-[#FFF9F2] text-[#342A24] text-[15px] font-medium transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C96F42] w-full sm:w-auto select-none"
            id="hero-secondary-cta"
          >
            How It Works
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
