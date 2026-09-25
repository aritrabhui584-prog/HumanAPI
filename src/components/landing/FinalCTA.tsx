import React from "react";
import { ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SectionTransition } from "../motion/SectionTransition";
import { Reveal } from "../motion/Reveal";
import { DURATIONS } from "../../lib/motion";

export const FinalCTA: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section
      id="final-cta"
      className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24 scroll-mt-[100px] bg-[#342A24] text-[#FFFCF7] select-none"
    >
      {/* Subtle radial warmth in background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 35%, rgba(201, 111, 66, 0.18), transparent 60%)"
        }}
        aria-hidden="true"
      />

      <SectionTransition className="relative z-10 max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Eyebrow */}
        <Reveal yOffset={16} duration={DURATIONS.slow} amount={0.25}>
          <span className="text-[12px] font-semibold text-[#C96F42] uppercase tracking-[0.16em] block mb-3.5">
            Direct Access
          </span>
        </Reveal>

        {/* Headline */}
        <Reveal yOffset={20} delay={0.08} duration={DURATIONS.slow} amount={0.25}>
          <h2
            className="text-[36px] sm:text-[48px] md:text-[56px] font-semibold text-[#FFFCF7] tracking-[-0.04em] leading-[1.08] max-w-2xl mx-auto mb-5"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Get unstuck with the right person.
          </h2>
        </Reveal>

        {/* Supporting text */}
        <Reveal yOffset={16} delay={0.16} duration={DURATIONS.slow} amount={0.25}>
          <p className="text-[16px] sm:text-[17px] text-[#FFFCF7]/70 max-w-lg mx-auto leading-relaxed mb-8 sm:mb-9 font-normal">
            Skip days of searching and outdated tutorials. Have a focused 5, 10, or 15-minute consultation today.
          </p>
        </Reveal>

        {/* CTA buttons */}
        <Reveal yOffset={14} delay={0.24} duration={DURATIONS.slow} amount={0.25}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => navigate("experts")}
              className="group inline-flex items-center justify-center gap-2 h-[48px] px-8 rounded-[12px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFFCF7] text-[15px] font-medium transition-all duration-200 shadow-warm-xs hover:shadow-warm-sm hover:-translate-y-[2px] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white w-full sm:w-auto select-none"
              id="final-cta-find-expert"
            >
              <span>Find an Expert</span>
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
            </button>

            <button
              onClick={() => navigate("become-expert")}
              className="inline-flex items-center justify-center h-[48px] px-7 rounded-[12px] border border-white/20 bg-transparent hover:bg-white/[0.06] text-[#FFFCF7] text-[15px] font-medium transition-all duration-200 hover:-translate-y-[1px] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white w-full sm:w-auto select-none"
              id="final-cta-become-expert"
            >
              Become an Expert
            </button>
          </div>
        </Reveal>

        <Reveal yOffset={10} delay={0.32} duration={DURATIONS.slow} amount={0.25}>
          <div className="flex items-center justify-center gap-6 mt-12 pt-8 border-t border-white/10 text-[13px] text-[#FFFCF7]/60 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={14} className="text-[#77816C]" /> Satisfaction Escrow Protected
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={14} className="text-[#C96F42]" /> 5, 10, or 15-Minute Formats
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span>Zero Long-Term Commitments</span>
          </div>
        </Reveal>
      </SectionTransition>
    </section>
  );
};

export default FinalCTA;
