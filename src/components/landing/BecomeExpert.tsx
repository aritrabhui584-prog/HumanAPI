import React from "react";
import { useApp } from "../../context/AppContext";
import { ArrowRight, Check } from "lucide-react";
import { SectionTransition } from "../motion/SectionTransition";
import { Reveal } from "../motion/Reveal";

export const BecomeExpert: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section id="become-expert" className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24 scroll-mt-[100px] bg-[#F6F0E7] text-[#342A24] border-t border-[#342A24]/[0.08] select-none">
      <SectionTransition className="max-w-[1200px] mx-auto w-full flex flex-col justify-center h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Headline, Description, and CTA */}
          <Reveal yOffset={30} duration={0.75} amount={0.2} className="lg:col-span-7 flex flex-col items-start">
            <span className="text-[12px] font-semibold text-[#C96F42] uppercase tracking-[0.14em] block mb-2.5">
              For Practitioners
            </span>
            <h2 className="text-[32px] sm:text-[44px] lg:text-[48px] font-semibold text-[#342A24] tracking-[-0.035em] leading-[1.08] mb-4">
              Your experience can help someone move forward.
            </h2>
            <p className="text-[16px] sm:text-[17px] text-[#7B6C60] leading-relaxed max-w-xl mb-8">
              Share what you know through focused one-to-one conversations. Set your own rate, control your availability, and get paid directly with zero long-term commitments.
            </p>

            <button
              onClick={() => navigate("become-expert")}
              className="group inline-flex items-center gap-2 h-[46px] sm:h-[48px] px-6 sm:px-7 rounded-[12px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFFCF7] text-[15px] font-medium transition-all duration-200 shadow-2xs hover:shadow-warm-xs hover:-translate-y-[2px] select-none"
              id="become-expert-section-cta"
            >
              <span>Become an Expert</span>
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
            </button>
          </Reveal>

          {/* Right Column: Clean Editorial Value Showcase */}
          <Reveal yOffset={30} delay={0.12} duration={0.75} amount={0.2} className="lg:col-span-5">
            <div className="p-7 sm:p-8 rounded-[22px] bg-[#FFF9F2] border border-[#342A24]/10 shadow-[0_12px_32px_rgba(52,42,36,0.05)]">
              <span className="text-[11px] font-semibold text-[#7B6C60] uppercase tracking-wider block mb-3">
                Practitioner Autonomy
              </span>
              <div className="space-y-4 text-[14.5px]">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#77816C]/10 text-[#77816C] flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={2.5} />
                  </div>
                  <span className="text-[#342A24] font-medium">Set your own rates per 5, 10, or 15 minutes</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#77816C]/10 text-[#77816C] flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={2.5} />
                  </div>
                  <span className="text-[#342A24] font-medium">Toggle instant availability or take calendar bookings</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#77816C]/10 text-[#77816C] flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={2.5} />
                  </div>
                  <span className="text-[#342A24] font-medium">Hard timers prevent unexpected session overruns</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#77816C]/10 text-[#77816C] flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={2.5} />
                  </div>
                  <span className="text-[#342A24] font-medium">Direct payouts automatically transferred on completion</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionTransition>
    </section>
  );
};

export default BecomeExpert;
