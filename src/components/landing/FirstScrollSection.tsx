import React, { useState } from "react";
import { motion } from "motion/react";
import { AlertCircle, UserCheck, Video, CheckCircle2, ArrowRight } from "lucide-react";

export const FirstScrollSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      key: "problem",
      tag: "STEP 01",
      title: "Problem",
      subtitle: "The Critical Blocker",
      description: "You hit an edge-case memory leak, an unfamiliar distributed locks bug, or need architectural validation before a major release.",
      metric: "Avg. triage: < 2 min",
      icon: AlertCircle,
      visualBadge: "Diagnostic Blocker",
      accent: "#C96A3E",
      previewContent: {
        headline: "React 19 Server Actions Race Condition",
        context: "Optimistic mutations desynchronize under flaky 3G mobile networks. Logs show duplicate key updates.",
        category: "Software Engineering"
      }
    },
    {
      key: "expert",
      tag: "STEP 02",
      title: "Expert",
      subtitle: "Accredited Specialist",
      description: "Browse verified senior practitioners who have solved your exact challenge dozens of times in production.",
      metric: "100% Vetted practitioners",
      icon: UserCheck,
      visualBadge: "Direct Match",
      accent: "#77806D",
      previewContent: {
        headline: "Dr. Elena Rostova",
        context: "Principal Distributed Systems Architect · Ex-Google, YC Alum · 14 yrs React & Distributed Concurrency",
        category: "Available Now"
      }
    },
    {
      key: "conversation",
      tag: "STEP 03",
      title: "Conversation",
      subtitle: "5–15 Min Micro-Sprint",
      description: "Join a dedicated consultation room with synchronized countdown, peer WebRTC video, and document inspection.",
      metric: "Focused 10 min window",
      icon: Video,
      visualBadge: "Encrypted Room",
      accent: "#B89152",
      previewContent: {
        headline: "Live Diagnostic Room #409",
        context: "Shared IDE view · Peer WebRTC · Real-time breakdown of transactional boundary isolation pattern.",
        category: "Screen & Audio Sync"
      }
    },
    {
      key: "resolution",
      tag: "STEP 04",
      title: "Resolution",
      subtitle: "Definitive Clarity",
      description: "Walk away with an actionable diagnostic solution, summary review, and zero retainer commitments.",
      metric: "Escrow released on satisfaction",
      icon: CheckCircle2,
      visualBadge: "Problem Solved",
      accent: "#332A24",
      previewContent: {
        headline: "Root Cause Resolved",
        context: "Implemented idempotent mutation tokens and client mutation queue rollback. 100% test pass verified.",
        category: "Actionable Outcome"
      }
    }
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-[#F4EEE5] text-[#332A24] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A3E] block mb-2">
              The Consultation Model
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[52px] text-[#332A24] font-normal tracking-tight leading-[1.08]">
              Expertise, <br className="hidden sm:inline" />
              <span className="italic text-[#C96A3E]">when you need it.</span>
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#5A4E45] mt-4 leading-relaxed max-w-2xl">
              Sometimes a complete project isn't what you need. You need ten minutes with someone who has already solved the problem.
            </p>
          </motion.div>
        </div>

        {/* 4-Step Interactive Horizontal Flow: Problem → Expert → Conversation → Resolution */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setActiveStep(idx)}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-[22px] border transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? "bg-[#FFF9F2] border-[#C96A3E] shadow-[0_8px_24px_-4px_rgba(51,42,36,0.08)]"
                    : "bg-[#EDE3D5]/60 border-[#E2D5C3] hover:bg-[#FFF9F2] hover:border-[#D8CBBA]"
                }`}
                style={{
                  transform: isSelected ? "translateY(-3px)" : "none"
                }}
              >
                {/* Step Marker & Arrow on desktop */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] font-bold tracking-wider text-[#77806D]">
                      {step.tag}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#FFF9F2] shadow-sm transition-transform group-hover:scale-105"
                      style={{ backgroundColor: step.accent }}
                    >
                      <Icon size={15} strokeWidth={2.2} />
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#332A24] mb-1">
                    {step.title}
                  </h3>
                  <div className="font-sans text-xs font-semibold text-[#C96A3E] mb-2.5">
                    {step.subtitle}
                  </div>
                  <p className="font-sans text-xs text-[#5A4E45] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Metric Pill */}
                <div className="pt-4 mt-4 border-t border-[#E2D5C3]/70 flex items-center justify-between">
                  <span className="font-mono text-[10.5px] font-medium text-[#77806D]">
                    {step.metric}
                  </span>
                  {idx < steps.length - 1 && (
                    <ArrowRight size={13} className="text-[#C96A3E] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Scenario Preview Showcase (Active Step Detailed Simulation) */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 p-5 sm:p-7 rounded-[24px] bg-[#FFF9F2] border border-[#E2D5C3] shadow-[0_4px_20px_-4px_rgba(51,42,36,0.06)]"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#C96A3E]/10 text-[#C96A3E] font-mono text-[10px] font-bold uppercase tracking-wider">
                  {steps[activeStep].visualBadge}
                </span>
                <span className="text-xs text-[#77806D] font-mono">
                  {steps[activeStep].previewContent.category}
                </span>
              </div>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#332A24]">
                {steps[activeStep].previewContent.headline}
              </h4>
              <p className="font-sans text-xs sm:text-sm text-[#5A4E45]">
                {steps[activeStep].previewContent.context}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <div className="flex -space-x-1.5">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                      activeStep === i
                        ? "bg-[#C96A3E] scale-125"
                        : "bg-[#DFCEBA] hover:bg-[#C96A3E]/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
