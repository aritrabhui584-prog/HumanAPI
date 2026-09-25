import React from "react";
import { useApp } from "../../context/AppContext";
import { ShieldCheck, Sparkles, Target, Zap, Users, Heart, ArrowRight } from "lucide-react";

export const PublicAbout: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-[#F7F1E7] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C86B3C]">
            The HumanAPI Manifesto
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#332720] leading-tight">
            Knowledge Shouldn't Be Trapped Behind 40-Hour Contracts
          </h1>
          <p className="text-lg text-[#75675C] max-w-2xl mx-auto leading-relaxed">
            HumanAPI was born from a simple realization: in the age of generative AI and limitless documentation, the bottleneck is rarely generic information. It is targeted human judgment.
          </p>
        </div>

        {/* Core Philosophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C86B3C]/10 text-[#C86B3C] flex items-center justify-center font-bold">
              <Zap size={20} />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#332720]">The 10-Minute Epiphany</h3>
            <p className="text-sm text-[#75675C] leading-relaxed">
              When a senior engineer looks at your race condition, they don't need 3 days. They need 4 minutes of looking at your state tree. When a design director reviews your onboarding flow, they spot the friction point before you finish describing it.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#74806B]/10 text-[#74806B] flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#332720]">Accreditation Over Clout</h3>
            <p className="text-sm text-[#75675C] leading-relaxed">
              Anyone can write a flattering bio on social media. HumanAPI tests candidates with practical, field-specific AI interviews and portfolio audits. Only candidates with verifiable diagnostic depth offer paid sessions.
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-6 text-[#332720]">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            The Problem with Traditional Freelancing
          </h2>
          <p className="text-sm sm:text-base text-[#75675C] leading-relaxed">
            Freelance marketplaces were designed in the early 2000s around the concept of project outsourcing. You create a job posting, wait days for generic proposals, interview freelancers, draft contracts, set up escrow, and supervise deliverables.
          </p>
          <p className="text-sm sm:text-base text-[#75675C] leading-relaxed">
            For large development contracts, this model works. But modern creators, engineers, and founders don’t always need hands to write code—they need a master mind to validate the architecture, eliminate blindspots, and prevent expensive mistakes.
          </p>
          <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] font-medium text-sm text-[#332720] italic">
            “You don’t always need to hire an expert. Sometimes you just need to ask one.”
          </div>
        </div>

        {/* Quality Signals */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#332720] text-center">
            Our Verification Philosophy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] text-center space-y-2">
              <div className="text-2xl font-bold text-[#C86B3C]">01</div>
              <h4 className="font-serif font-bold text-base text-[#332720]">Credential Audit</h4>
              <p className="text-xs text-[#75675C]">
                Verification of production track record, senior titles, and verified portfolio projects.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] text-center space-y-2">
              <div className="text-2xl font-bold text-[#C86B3C]">02</div>
              <h4 className="font-serif font-bold text-base text-[#332720]">Adaptive AI Interview</h4>
              <p className="text-xs text-[#75675C]">
                Rigorous four-pillar assessment measuring technical depth, problem-solving, consultation structure, and empathy.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] text-center space-y-2">
              <div className="text-2xl font-bold text-[#718B68]">03</div>
              <h4 className="font-serif font-bold text-base text-[#332720]">Reputation Governance</h4>
              <p className="text-xs text-[#75675C]">
                Post-session ratings transparently dictate search rank. Zero fake reviews or paid ranking boosts.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <button
            onClick={() => navigate("experts")}
            className="px-8 py-4 rounded-2xl bg-[#C86B3C] hover:bg-[#B85C3B] text-[#FFF9F0] font-bold text-base shadow-warm-md inline-flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <span>Explore the Experts Network</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
