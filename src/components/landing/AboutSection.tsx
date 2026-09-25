import React from "react";
import { ShieldCheck, Zap, ArrowRight, Heart } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SectionTransition } from "../motion/SectionTransition";
import { Reveal } from "../motion/Reveal";

export const AboutSection: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section
      id="about"
      aria-label="About HumanAPI"
      className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24 scroll-mt-[100px] bg-[#F6F0E7] text-[#342A24] select-none"
    >
      <SectionTransition className="w-full max-w-[1240px] mx-auto flex flex-col justify-center h-full">
        {/* Header Region */}
        <Reveal className="text-center max-w-[780px] mx-auto mb-6 sm:mb-8 lg:mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#77816C]/10 text-[#77816C] text-[12px] font-semibold tracking-[0.02em] mb-2.5">
            <Heart size={14} className="text-[#C96F42]" /> The HumanAPI Philosophy
          </span>
          <h2 className="font-sans font-semibold text-[#342A24] tracking-[-0.04em] leading-[1.05] text-[32px] sm:text-[44px] lg:text-[52px] mb-2.5">
            Built Around One Simple Idea
          </h2>
          <p className="font-sans text-[15px] sm:text-[17px] text-[#342A24] leading-relaxed max-w-[660px] mx-auto font-medium italic">
            “You don't always need to hire an expert. Sometimes you just need to ask one.”
          </p>
        </Reveal>

        {/* 2 Philosophy Cards Region */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-[1100px] mx-auto w-full mb-6 lg:mb-8">
          <Reveal delay={0.08} className="p-6 sm:p-7 rounded-[22px] bg-[#FFF9F2] border border-[#342A24]/10 shadow-warm-xs space-y-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#C96F42]/10 text-[#C96F42] flex items-center justify-center font-bold">
              <Zap size={18} />
            </div>
            <h3 className="font-sans font-semibold text-xl sm:text-2xl text-[#342A24]">The 10-Minute Epiphany</h3>
            <p className="text-[13.5px] sm:text-[14px] text-[#7B6C60] leading-relaxed">
              When a senior architect reviews your state tree, they don't need 3 days. They need 4 minutes of targeted screen share. We unbundle high-leverage wisdom from long-term contracts.
            </p>
          </Reveal>

          <Reveal delay={0.16} className="p-6 sm:p-7 rounded-[22px] bg-[#FFF9F2] border border-[#342A24]/10 shadow-warm-xs space-y-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#77816C]/10 text-[#77816C] flex items-center justify-center font-bold">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-sans font-semibold text-xl sm:text-2xl text-[#342A24]">Accreditation Over Clout</h3>
            <p className="text-[13.5px] sm:text-[14px] text-[#7B6C60] leading-relaxed">
              Anyone can write a flattering bio on social media. HumanAPI tests candidates with practical, field-specific AI interviews and portfolio audits before unlocking paid sessions.
            </p>
          </Reveal>
        </div>

        {/* Lower Region: CTA */}
        <Reveal delay={0.24} className="text-center">
          <button
            onClick={() => navigate("experts")}
            className="inline-flex items-center gap-2 h-[46px] px-6 rounded-[13px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFFCF7] text-[14px] font-semibold transition-all shadow-xs hover:-translate-y-[1px]"
          >
            <span>Explore Verified Experts</span>
            <ArrowRight size={15} />
          </button>
        </Reveal>
      </SectionTransition>
    </section>
  );
};

export default AboutSection;
