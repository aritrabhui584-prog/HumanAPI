import React from "react";
import { CheckCircle2, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useCurrency } from "../../lib/currency";
import { SectionTransition } from "../motion/SectionTransition";
import { Reveal } from "../motion/Reveal";

export const PricingSection: React.FC = () => {
  const { navigate, openAuthModal } = useApp();
  const { formatAmount } = useCurrency();

  return (
    <section
      id="pricing"
      aria-label="HumanAPI Pricing"
      className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24 scroll-mt-[100px] bg-[#FFF9F2] text-[#342A24] select-none"
    >
      <SectionTransition className="w-full max-w-[1240px] mx-auto flex flex-col justify-center h-full">
        {/* Header */}
        <Reveal className="text-center max-w-[760px] mx-auto mb-6 sm:mb-8 lg:mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C96F42]/10 text-[#C96F42] text-[12px] font-semibold tracking-[0.02em] mb-2.5">
            <Clock size={14} /> Pay Only for the Minutes You Use
          </span>
          <h2 className="font-sans font-semibold text-[#342A24] tracking-[-0.04em] leading-[1.05] text-[32px] sm:text-[44px] lg:text-[52px] mb-2.5">
            Fair, Predictable & Frictionless Pricing
          </h2>
          <p className="font-sans text-[15px] sm:text-[16px] text-[#7B6C60] leading-relaxed max-w-[620px] mx-auto">
            No subscriptions. No placement fees. Verified experts set their own rates per minute. You pay only for the exact duration of your consultation.
          </p>
        </Reveal>

        {/* 3 Core Sprint Durations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-[1100px] mx-auto w-full mb-6 lg:mb-8">
          {/* 5 Min Sprint */}
          <Reveal delay={0.08} className="p-6 sm:p-7 rounded-[22px] bg-[#F6F0E7] border border-[#342A24]/10 shadow-warm-xs flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FFF9F2] text-[#7B6C60] text-[11px] font-semibold tracking-wider uppercase">
                Laser Diagnostic
              </span>
              <h3 className="font-sans font-semibold text-2xl text-[#342A24]">5-Minute Sprint</h3>
              <p className="text-[13px] text-[#7B6C60] leading-relaxed">
                Binary triage, rapid config check, architecture sanity check.
              </p>
              <div className="pt-1">
                <span className="text-[12px] text-[#7B6C60]">Typical Rate:</span>
                <div className="font-sans text-2xl font-bold text-[#342A24] mt-0.5">
                  {formatAmount(149)} – {formatAmount(299)}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("experts")}
              className="mt-6 w-full py-2.5 rounded-xl border border-[#342A24]/15 bg-[#FFF9F2] hover:bg-[#FFF9F2]/80 text-[#342A24] text-[13px] font-semibold transition-colors"
            >
              Browse 5-Min Experts
            </button>
          </Reveal>

          {/* 10 Min Sprint (Flagship) */}
          <Reveal delay={0.16} className="p-6 sm:p-7 rounded-[22px] bg-[#FFF9F2] border-2 border-[#C96F42] shadow-warm-md flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#C96F42] text-[#FFFCF7] text-[10px] font-bold uppercase tracking-wider shadow-warm-xs">
              MOST POPULAR SPRINT
            </div>
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C96F42]/10 text-[#C96F42] text-[11px] font-semibold tracking-wider uppercase">
                Root Cause Triage
              </span>
              <h3 className="font-sans font-semibold text-2xl text-[#342A24]">10-Minute Sprint</h3>
              <p className="text-[13px] text-[#7B6C60] leading-relaxed">
                Code teardowns, state debugging, Figma critique, roadmap tuning.
              </p>
              <div className="pt-1">
                <span className="text-[12px] text-[#7B6C60]">Typical Rate:</span>
                <div className="font-sans text-2xl font-bold text-[#C96F42] mt-0.5">
                  {formatAmount(299)} – {formatAmount(499)}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("experts")}
              className="mt-6 w-full py-2.5 rounded-xl bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFFCF7] text-[13px] font-semibold transition-colors shadow-xs"
            >
              Browse 10-Min Experts
            </button>
          </Reveal>

          {/* 15 Min Sprint */}
          <Reveal delay={0.24} className="p-6 sm:p-7 rounded-[22px] bg-[#F6F0E7] border border-[#342A24]/10 shadow-warm-xs flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#77816C]/10 text-[#77816C] text-[11px] font-semibold tracking-wider uppercase">
                Strategic Audit
              </span>
              <h3 className="font-sans font-semibold text-2xl text-[#342A24]">15-Minute Sprint</h3>
              <p className="text-[13px] text-[#7B6C60] leading-relaxed">
                Mock interviews, startup monetization audits, deep multi-service reviews.
              </p>
              <div className="pt-1">
                <span className="text-[12px] text-[#7B6C60]">Typical Rate:</span>
                <div className="font-sans text-2xl font-bold text-[#342A24] mt-0.5">
                  {formatAmount(449)} – {formatAmount(749)}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("experts")}
              className="mt-6 w-full py-2.5 rounded-xl border border-[#342A24]/15 bg-[#FFF9F2] hover:bg-[#FFF9F2]/80 text-[#342A24] text-[13px] font-semibold transition-colors"
            >
              Browse 15-Min Experts
            </button>
          </Reveal>
        </div>

        {/* Transparent Marketplace Economics Bar */}
        <Reveal delay={0.3} className="p-5 sm:p-6 rounded-[20px] bg-[#F6F0E7] border border-[#342A24]/10 max-w-[1100px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={22} className="text-[#77816C] shrink-0" />
            <div>
              <h4 className="text-[14px] font-semibold text-[#342A24]">Transparent Marketplace Economics</h4>
              <p className="text-[12px] text-[#7B6C60]">88% goes directly to the expert. 12% funds WebRTC signaling and platform ops.</p>
            </div>
          </div>
          <button
            onClick={() => openAuthModal("signup")}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#342A24] text-[#FFF9F2] text-[13px] font-semibold hover:bg-[#342A24]/90 transition-colors"
          >
            Get Started
          </button>
        </Reveal>
      </SectionTransition>
    </section>
  );
};

export default PricingSection;
