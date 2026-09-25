import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { SectionTransition } from "../motion/SectionTransition";
import { Reveal } from "../motion/Reveal";
import { Stagger, StaggerItem } from "../motion/Stagger";
import { EASE, DURATIONS } from "../../lib/motion";

export const HowItWorks: React.FC = () => {
  const { navigate } = useApp();
  const [activeDuration, setActiveDuration] = useState<5 | 10 | 15>(10);

  const durationDetails = {
    5: {
      label: "5 min",
      title: "Quick Unblock",
      desc: "Fast answers for syntax roadblocks, parameter checks, or quick architectural validation from someone who has solved it before."
    },
    10: {
      label: "10 min",
      title: "Standard Consultation",
      desc: "The sweet spot for diagnosing tricky bugs, reviewing critical code, or evaluating career and design trade-offs."
    },
    15: {
      label: "15 min",
      title: "Deep Dive",
      desc: "Comprehensive strategy sessions, system design reviews, or detailed tear-downs of complex distributed issues."
    }
  };

  const steps = [
    {
      number: "01",
      title: "Describe the problem",
      desc: "Outline what you are stuck on in plain words. No lengthy forms or complex ticketing—just explain the blocker clearly."
    },
    {
      number: "02",
      title: "Find the right expert",
      desc: "Browse vetted specialists by domain, track record, and verified production experience. See real availability and pricing upfront."
    },
    {
      number: "03",
      title: "Talk and solve it",
      desc: "Connect directly in a purpose-built browser room with encrypted video, audio, screen share, and a synchronized countdown timer."
    }
  ];

  return (
    <section id="how-it-works" className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24 scroll-mt-[100px] bg-[#F6F0E7] text-[#342A24] select-none">
      <SectionTransition className="max-w-[1200px] mx-auto w-full flex flex-col justify-center h-full">
        {/* Section Header Reveal */}
        <Reveal amount={0.2} className="max-w-2xl mb-12 sm:mb-14">
          <span className="text-[12px] font-semibold text-[#C96F42] uppercase tracking-[0.14em] block mb-2.5">
            How It Works
          </span>
          <h2 className="text-[32px] sm:text-[42px] font-semibold text-[#342A24] tracking-[-0.035em] leading-[1.1]">
            A direct path to the right answer.
          </h2>
          <p className="text-[16px] text-[#7B6C60] mt-3 leading-relaxed">
            Eliminate multi-day email chains, expensive retainers, and generic forum advice. Talk directly to someone who knows.
          </p>
        </Reveal>

        {/* 3 Editorial Numbered Columns with Stagger Reveal */}
        <Stagger amount={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pb-12 sm:pb-14 border-b border-[#342A24]/[0.08]">
          {steps.map((step) => (
            <StaggerItem key={step.number} className="group flex flex-col cursor-default">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: DURATIONS.normal, ease: EASE }}
                className="font-sans text-[28px] sm:text-[34px] font-semibold text-[#C96F42] group-hover:text-[#B85D3D] transition-colors duration-200 mb-3 leading-none"
              >
                {step.number}
              </motion.span>
              <div className="transition-transform duration-200 group-hover:translate-x-[3px]">
                <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#342A24] tracking-[-0.02em] mb-2.5">
                  {step.title}
                </h3>
                <p className="text-[15px] text-[#7B6C60] leading-[1.6]">
                  {step.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Duration Selector */}
        <Reveal delay={0.1} amount={0.2} className="pt-10 sm:pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-2 text-[#7B6C60] text-[13px] font-medium mb-1.5">
              <Clock size={15} className="text-[#C96F42]" />
              <span>Choose your session length</span>
            </div>
            <div className="text-[18px] sm:text-[20px] font-semibold text-[#342A24] tracking-[-0.02em]">
              {durationDetails[activeDuration].title}
            </div>
            <p className="text-[14px] text-[#7B6C60] mt-1 max-w-xl leading-normal">
              {durationDetails[activeDuration].desc}
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-[#FFF9F2] border border-[#342A24]/10 rounded-[14px] shrink-0">
            {([5, 10, 15] as const).map((dur) => (
              <button
                key={dur}
                onClick={() => setActiveDuration(dur)}
                className={`px-4 py-2 rounded-[10px] text-[13.5px] font-medium transition-all duration-200 ${
                  activeDuration === dur
                    ? "bg-[#C96F42] text-[#FFFCF7] shadow-xs"
                    : "text-[#7B6C60] hover:text-[#342A24]"
                }`}
              >
                {dur} min
              </button>
            ))}
          </div>
        </Reveal>
      </SectionTransition>
    </section>
  );
};

export default HowItWorks;
