import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import { ArrowRight, Terminal, ShieldCheck, CheckCircle2 } from "lucide-react";
import { RevealText } from "../motion/RevealText";
import { SectionTransition } from "../motion/SectionTransition";
import { EASE, DURATIONS } from "../../lib/motion";

/**
 * IntroSection (Static DevOps / Deployment Diagnosis Mode)
 * 
 * Clean, single-domain hero presentation focusing exclusively on:
 * ⚙️ Deployment Diagnosis
 */
export const IntroSection: React.FC = () => {
  const { navigate } = useApp();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  return (
    <section
      id="intro"
      className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24 scroll-mt-[100px] select-none"
      style={{
        backgroundColor: "#F6F0E7",
        backgroundImage:
          "radial-gradient(circle at 50% 25%, rgba(201, 111, 66, 0.08), transparent 55%)"
      }}
    >
      <SectionTransition className="relative z-10 w-full max-w-[880px] mx-auto text-center flex flex-col items-center">
        {/* 1. EYEBROW */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: DURATIONS.normal, ease: EASE }}
          className="mb-4 sm:mb-5"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9F2] border border-[#342A24]/10 text-[#7B6C60] text-[12px] sm:text-[13px] font-semibold tracking-[0.02em] shadow-warm-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C96F42]" />
            Deployment Diagnosis Engine
          </span>
        </motion.div>

        {/* 2. PRIMARY QUESTION HEADLINE */}
        <div className="max-w-[820px] mx-auto mb-5 sm:mb-6">
          <RevealText
            as="h2"
            lines={[
              "What do you need",
              "help with?"
            ]}
            className="font-sans font-semibold text-[#342A24] tracking-[-0.045em] leading-[1.04] text-[38px] sm:text-[54px] md:text-[68px] lg:text-[74px]"
            lineClassName="first:text-[#342A24] last:text-[#C96F42]"
            delay={0.08}
            stagger={0.1}
          />
        </div>

        {/* 3. POSITIONING STATEMENT */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: DURATIONS.normal, delay: 0.28, ease: EASE }}
          className="font-sans text-[16px] sm:text-[18px] text-[#7B6C60] leading-[1.6] max-w-[620px] mx-auto mb-10 sm:mb-12 font-normal"
        >
          HumanAPI understands your software deployment problem before connecting you with the right DevOps expert.
        </motion.div>

        {/* 4. SINGLE ACTIVE DEPLOYMENT DIAGNOSIS OPTION CARD */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: DURATIONS.normal, delay: 0.36, ease: EASE }}
          className="w-full max-w-[680px] text-left"
        >
          <div className="group relative bg-[#FFF9F2] border border-[#E8DCCB] hover:border-[#C96F42] rounded-[24px] p-6 sm:p-8 md:p-9 shadow-warm-md hover:shadow-warm-lg transition-all duration-250 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-14 h-14 rounded-[18px] bg-[#C96F42]/10 border border-[#C96F42]/20 flex items-center justify-center text-[#C96F42] group-hover:scale-105 transition-transform">
                  <Terminal size={28} />
                </span>
                <span className="text-[12px] font-semibold text-[#C96F42] uppercase tracking-wider bg-[#C96F42]/10 px-3.5 py-1.5 rounded-full border border-[#C96F42]/20">
                  ⚙️ Active Focus
                </span>
              </div>

              <h3 className="text-[24px] sm:text-[28px] font-semibold text-[#342A24] mb-2 tracking-[-0.02em]">
                ⚙️ Deployment Diagnosis
              </h3>

              <p className="text-[15px] font-medium text-[#342A24] mb-2">
                Diagnose your software deployment problem before connecting with a DevOps expert.
              </p>

              <p className="text-[13px] sm:text-[14px] text-[#7B6C60] leading-relaxed mb-8">
                Understand your repository, CI/CD pipeline and deployment context.
              </p>
            </div>

            <button
              onClick={() => navigate("deployment-intake")}
              className="w-full h-[52px] px-8 rounded-[14px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFFCF7] text-[15px] font-medium transition-all shadow-warm-xs hover:shadow-warm-sm flex items-center justify-center gap-2.5 group-hover:translate-y-[-1px]"
              id="try-deployment-cta"
            >
              <span>Diagnose My Deployment</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </SectionTransition>
    </section>
  );
};

export default IntroSection;
