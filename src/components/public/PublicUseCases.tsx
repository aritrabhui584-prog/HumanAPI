import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Github,
  Cpu,
  CheckSquare,
  Terminal,
  GitBranch,
  Cloud,
  Layers,
  Globe,
  RotateCcw,
  ArrowRight
} from "lucide-react";
import { DEPLOYMENT_PROBLEM_TAXONOMY } from "../../data/deploymentTaxonomy";

const ICON_MAP: Record<string, React.FC<{ size?: number }>> = {
  GITHUB: Github,
  BUILD: Cpu,
  TEST: CheckSquare,
  DOCKER: Terminal,
  "JENKINS / CI-CD": GitBranch,
  CLOUD: Cloud,
  KUBERNETES: Layers,
  PRODUCTION: Globe,
  ROLLBACK: RotateCcw
};

export const PublicUseCases: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-[#F7F1E7] py-12 lg:py-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C86B3C]">
            DEPLOYMENT PROBLEM ARCHETYPES
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#332720]">
            When to Use HumanAPI
          </h1>
          <p className="text-base sm:text-lg text-[#75675C] leading-relaxed">
            From repository access and CI/CD failures to Docker, cloud and production issues, HumanAPI helps you understand the deployment problem and connect with the right DevOps expertise.
          </p>
        </div>

        {/* 3-Column Archetype Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEPLOYMENT_PROBLEM_TAXONOMY.map((uc) => {
            const Icon = ICON_MAP[uc.category] || Terminal;
            return (
              <div
                key={uc.id}
                className="p-6 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#C86B3C]/10 text-[#C86B3C] flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#75675C] px-2.5 py-1 rounded-full bg-[#F7F1E7] border border-[#DED3C6]">
                      {uc.category}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-[#332720] group-hover:text-[#C86B3C] transition-colors">
                    {uc.title}
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <strong className="text-[#332720] block mb-1 font-semibold">The Roadblock:</strong>
                      <p className="text-[#75675C] leading-relaxed">{uc.roadblock}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] text-[#332720] italic font-mono text-[11px] leading-relaxed">
                      {uc.example}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-5 border-t border-[#DED3C6]/60">
                  <p className="text-[11px] text-[#75675C] mb-3">
                    <strong className="text-[#74806B] font-semibold">Relevant Specialists:</strong> {uc.specialists}
                  </p>
                  <button
                    onClick={() => navigate("deployment-intake")}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#C86B3C]/30 bg-[#F7F1E7] hover:bg-[#C86B3C] hover:text-[#FFF9F0] text-xs font-bold text-[#C86B3C] transition-all flex items-center justify-center gap-1.5 group-hover:bg-[#C86B3C] group-hover:text-[#FFF9F0]"
                  >
                    <span>Find Experts for this Problem</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PublicUseCases;
