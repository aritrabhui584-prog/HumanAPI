import React from "react";
import { useApp } from "../../context/AppContext";
import { ArrowRight, Star, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedPrice } from "../../lib/currency";
import { SectionTransition } from "../motion/SectionTransition";
import { Reveal } from "../motion/Reveal";
import { Stagger, StaggerItem } from "../motion/Stagger";
import { EASE } from "../../lib/motion";

export const ExpertDiscovery: React.FC = () => {
  const { experts, navigate, openBookingModal } = useApp();
  const featured = experts.slice(0, 3); // 3 strong expert previews on desktop

  return (
    <section id="experts" className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24 scroll-mt-[100px] bg-[#FFF9F2] text-[#342A24] border-t border-[#342A24]/[0.08] select-none">
      <SectionTransition className="max-w-[1200px] mx-auto w-full flex flex-col justify-center h-full">
        {/* Header Reveal */}
        <Reveal amount={0.2} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <span className="text-[12px] font-semibold text-[#C96F42] uppercase tracking-[0.14em] block mb-2.5">
              Verified Practitioners
            </span>
            <h2 className="text-[32px] sm:text-[42px] font-semibold text-[#342A24] tracking-[-0.035em] leading-[1.1]">
              Consult senior practitioners who have solved it before.
            </h2>
            <p className="text-[16px] text-[#7B6C60] mt-3 leading-relaxed">
              Every expert on HumanAPI is an accredited veteran with verifiable industry track records.
            </p>
          </div>

          <button
            onClick={() => navigate("experts")}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#C96F42] hover:text-[#B85D3D] transition-colors self-start md:self-end group"
          >
            <span>Explore all specialists</span>
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </Reveal>

        {/* Horizontal Editorial Expert Rows with Stagger */}
        <Stagger amount={0.1} className="divide-y divide-[#342A24]/[0.08] border-y border-[#342A24]/[0.08]">
          {featured.map((expert) => (
            <StaggerItem key={expert.id}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="py-5 sm:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 hover:bg-[#F6F0E7]/40 px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-xl transition-colors duration-200 group"
              >
                {/* Left: Avatar & Identity */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative shrink-0 overflow-hidden rounded-full">
                    <motion.img
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.22, ease: EASE }}
                      src={expert.avatar}
                      alt={expert.name}
                      className="w-13 h-13 sm:w-15 sm:h-15 rounded-full object-cover border border-[#342A24]/10"
                    />
                    {expert.availableToday && (
                      <span
                        title="Available Today"
                        className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-[#FFF9F2]"
                      />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[17px] font-semibold text-[#342A24] tracking-[-0.01em] group-hover:text-[#C96F42] transition-colors duration-200">
                        {expert.name}
                      </span>
                      {expert.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#77816C] bg-[#77816C]/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={11} strokeWidth={2.5} />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] text-[#7B6C60] line-clamp-1 mt-0.5">
                      {expert.headline}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      {expert.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-[11.5px] text-[#7B6C60] bg-[#F6F0E7] px-2 py-0.5 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Metrics & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-8 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#342A24]/[0.06]">
                  {/* Rating & Experience */}
                  <div className="flex flex-col items-start md:items-end">
                    <div className="flex items-center gap-1 text-[14px] font-semibold text-[#342A24]">
                      <Star size={14} className="text-[#C96F42] fill-[#C96F42]" />
                      <span>{expert.rating.toFixed(1)}</span>
                      <span className="text-[12px] font-normal text-[#7B6C60]">({expert.reviewCount})</span>
                    </div>
                    <span className="text-[12px] text-[#7B6C60] mt-0.5">
                      {expert.experienceYears}+ years exp
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col items-start md:items-end min-w-[80px]">
                    <div className="text-[17px] font-semibold text-[#342A24]">
                      <AnimatedPrice amountInINR={expert.pricing.duration10} />
                    </div>
                    <span className="text-[11.5px] text-[#7B6C60]">per 10 min</span>
                  </div>

                  {/* Direct Action Button */}
                  <button
                    onClick={() => openBookingModal(expert, 10)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-[11px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFFCF7] text-[13.5px] font-medium transition-all duration-200 shadow-2xs hover:shadow-warm-xs group/btn"
                  >
                    <span>Book 10m</span>
                    <ArrowRight size={13} className="transition-transform duration-200 group-hover/btn:translate-x-[3px]" />
                  </button>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </SectionTransition>
    </section>
  );
};

export default ExpertDiscovery;
