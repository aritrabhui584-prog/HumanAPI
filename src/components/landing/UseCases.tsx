import React from "react";
import { ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { motion } from "framer-motion";
import { SectionTransition } from "../motion/SectionTransition";
import { Reveal } from "../motion/Reveal";
import { Stagger, StaggerItem } from "../motion/Stagger";
import { EASE } from "../../lib/motion";
import { DEPLOYMENT_PROBLEM_TAXONOMY } from "../../data/deploymentTaxonomy";

export const UseCases: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section id="use-cases" className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24 scroll-mt-[100px] bg-[#FFF9F2] text-[#342A24] select-none">
      <SectionTransition className="max-w-[1240px] mx-auto w-full flex flex-col justify-center h-full">
        {/* Header Reveal */}
        <Reveal amount={0.2} className="max-w-3xl mb-10 sm:mb-12">
          <span className="text-[12px] font-semibold text-[#C96F42] uppercase tracking-[0.14em] block mb-2.5">
            DEPLOYMENT PROBLEM ARCHETYPES
          </span>
          <h2 className="text-[32px] sm:text-[42px] font-semibold text-[#342A24] tracking-[-0.035em] leading-[1.1]">
            When to Use HumanAPI
          </h2>
          <p className="text-[16px] text-[#7B6C60] mt-3 leading-relaxed">
            From repository access and CI/CD failures to Docker, cloud and production issues, HumanAPI helps you understand the deployment problem and connect with the right DevOps expertise.
          </p>
        </Reveal>

        {/* Editorial Staggered Grid */}
        <Stagger staggerDelay={0.06} amount={0.12} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {DEPLOYMENT_PROBLEM_TAXONOMY.map((item) => (
            <StaggerItem key={item.id}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.22, ease: EASE }}
                onClick={() => navigate("deployment-intake")}
                className="p-6 sm:p-7 rounded-[20px] bg-[#F6F0E7]/70 border border-[#342A24]/[0.08] hover:bg-[#F6F0E7] hover:border-[#C96F42]/40 transition-all duration-200 cursor-pointer flex flex-col justify-between group h-full shadow-warm-xs hover:shadow-warm-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="text-[11px] font-bold text-[#C96F42] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C96F42]/10">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-[19px] sm:text-[20px] font-semibold text-[#342A24] tracking-[-0.015em] mb-2.5 group-hover:text-[#C96F42] transition-colors duration-200">
                    {item.title}
                  </h3>

                  <p className="text-[13px] text-[#7B6C60] leading-[1.55] mb-3">
                    {item.roadblock}
                  </p>

                  <div className="p-3 rounded-[12px] bg-[#FFF9F2] border border-[#E8DCCB] text-[12px] text-[#342A24] font-mono italic">
                    {item.example}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#342A24]/[0.06]">
                  <p className="text-[11px] text-[#7B6C60] mb-3">
                    <strong className="text-[#342A24] font-semibold">Specialists:</strong> {item.specialists}
                  </p>
                  <div className="flex items-center justify-between text-[13px] font-medium text-[#C96F42]">
                    <span className="transition-transform duration-200 group-hover:translate-x-[2px]">Find Experts for this Problem</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </SectionTransition>
    </section>
  );
};

export default UseCases;
