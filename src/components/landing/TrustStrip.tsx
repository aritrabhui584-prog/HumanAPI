import React from "react";
import { Check } from "lucide-react";

/**
 * TrustStrip
 * 
 * Restrained horizontal product truths strip immediately below hero.
 * Features:
 * - 4 concise product truths: Verified experts, 5/10/15 min sessions, Direct expert conversations, Built-in video + chat
 * - Small typography, no giant cards, no excessive icons, subtle separators
 */
export const TrustStrip: React.FC = () => {
  const truths = [
    { label: "Verified experts", desc: "Top-tier practitioners" },
    { label: "5 / 10 / 15 min sessions", desc: "Pay only for what you need" },
    { label: "Direct expert conversations", desc: "No retainers or middle layers" },
    { label: "Built-in video + chat", desc: "Private browser-based room" }
  ];

  return (
    <section className="w-full border-y border-[#342A24]/[0.08] bg-[#FFF9F2]/70 py-5 sm:py-6 select-none">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          {truths.map((truth, idx) => (
            <div
              key={truth.label}
              className={`flex items-center gap-3 justify-start md:justify-center ${
                idx !== 0 ? "md:border-l md:border-[#342A24]/[0.08] md:pl-6" : ""
              } ${idx !== truths.length - 1 ? "md:pr-6" : ""}`}
            >
              <div className="w-5 h-5 rounded-full bg-[#C96F42]/10 text-[#C96F42] flex items-center justify-center shrink-0">
                <Check size={12} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[13.5px] font-semibold text-[#342A24] tracking-[-0.01em] leading-tight">
                  {truth.label}
                </span>
                <span className="font-sans text-[12px] text-[#7B6C60] leading-tight mt-0.5">
                  {truth.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
