import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { RatingStars, VerificationBadge } from "../common/Badge";
import {
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  RotateCcw
} from "lucide-react";
import { AskAnalysisResponse } from "../../types";

export const UserAskView: React.FC = () => {
  const { viewParams, experts, openBookingModal } = useApp();
  const [query, setQuery] = useState(viewParams?.initialQuery || "");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AskAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-run if initial query was provided
  useEffect(() => {
    if (viewParams?.initialQuery) {
      handleAsk(viewParams.initialQuery);
    }
  }, [viewParams?.initialQuery]);

  const handleAsk = async (textToAsk: string) => {
    if (!textToAsk.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch("/api/gemini/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToAsk })
      });

      const data = await res.json();

      if (res.status === 422 || data.isGibberish) {
        setError(data.error || "Unrecognized or gibberish input. Please describe a specific technical, DevOps, architectural, or code issue.");
        setAnalysis(null);
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error?.message || "Failed to analyze question with Gemini API");
      }

      setAnalysis(data);
    } catch (err: any) {
      console.error("Error analyzing query:", err);
      setError("Unable to process query at this time. Please try again or rephrase your question.");
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Our Postgres query latency spikes to 800ms during bulk inserts",
    "How to price an enterprise API that has high GPU compute costs?",
    "Need feedback on our Figma mobile checkout flow before user testing",
    "Staff engineer mock interview on distributed rate limiting"
  ];

  // Matched experts based on domain / skills
  const matchedExperts = analysis
    ? experts.filter(exp => {
        const matchesCategory = exp.category.toLowerCase().includes(analysis.domain.toLowerCase()) ||
          exp.subcategories?.some(sc => sc.toLowerCase().includes(analysis.domain.toLowerCase()));
        const matchesSkills = exp.skills.some(s =>
          analysis.skills.some(askSkill => askSkill.toLowerCase().includes(s.toLowerCase()))
        );
        return matchesCategory || matchesSkills;
      }).slice(0, 3)
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C86B3C]/10 border border-[#C86B3C]/20 text-xs font-bold text-[#C86B3C]">
          <Sparkles size={14} />
          <span>Gemini-Powered Problem Triage</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#332720]">
          Describe What You Need
        </h1>
        <p className="text-sm text-[#75675C]">
          State your challenge in your own words. Our AI triage models identify the required specialty, estimate the ideal sprint duration, and surface top verified practitioners.
        </p>
      </div>

      {/* Triage Input Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-4">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="space-y-3"
        >
          {error && (
            <div className="p-4 rounded-2xl bg-[#B85D3D]/10 border border-[#B85D3D]/30 text-[#B85D3D] text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Unrecognized or Invalid Input</p>
                <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">{error}</p>
              </div>
            </div>
          )}

          <textarea
            rows={3}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. My React state resets when triggering a modal inside a portal, causing race conditions in form validation..."
            className="w-full p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] text-sm text-[#332720] focus:outline-none focus:border-[#C86B3C] leading-relaxed placeholder-[#75675C]/70"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap text-xs text-[#75675C]">
              <span className="font-semibold text-[#332720]">Suggestions:</span>
              {samplePrompts.slice(0, 2).map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(p);
                    handleAsk(p);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-[#F7F1E7] border border-[#DED3C6] hover:border-[#C86B3C] text-[11px] truncate max-w-[200px]"
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C86B3C] hover:bg-[#B85C3B] disabled:opacity-50 text-[#FFF9F0] font-bold text-xs shadow-warm-sm flex items-center justify-center gap-2 transition-all"
              id="ask-triage-submit-btn"
            >
              {loading ? (
                <span>Analyzing Architecture...</span>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Analyze & Match Experts</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Output Results */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* AI Diagnostic Breakdown Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border-2 border-[#C86B3C] shadow-warm-md space-y-5">
            <div className="flex items-center justify-between border-b border-[#DED3C6] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C86B3C]">
                Diagnostic Assessment
              </span>
              <span className="text-xs font-mono font-bold text-[#718B68] bg-[#718B68]/15 px-2.5 py-0.5 rounded-full border border-[#718B68]/30">
                MATCH FOUND
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-1">
                <span className="text-[11px] font-semibold text-[#75675C]">Identified Domain</span>
                <div className="font-serif font-bold text-base text-[#332720]">{analysis.domain}</div>
                <div className="text-xs text-[#C86B3C]">{analysis.subdomain}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-1">
                <span className="text-[11px] font-semibold text-[#75675C]">Recommended Sprint</span>
                <div className="font-serif font-bold text-xl text-[#332720]">
                  {analysis.recommendedDuration} Minutes
                </div>
                <div className="text-[11px] text-[#75675C]">{analysis.durationReasoning}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-1">
                <span className="text-[11px] font-semibold text-[#75675C]">Required Skill Matrix</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {analysis.skills.map(s => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-[#FFF9F0] border border-[#DED3C6] text-[10px] font-medium text-[#332720]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Clarifying Questions if any */}
            {analysis.clarifyingQuestions && analysis.clarifyingQuestions.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#332720]">
                  <HelpCircle size={15} className="text-[#C86B3C]" />
                  <span>Prepare these points for your consultation:</span>
                </div>
                <ul className="space-y-1 text-xs text-[#75675C] list-disc list-inside">
                  {analysis.clarifyingQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recommended Verified Experts */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#332720]">
              Recommended Specialists for this Problem
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(matchedExperts.length > 0 ? matchedExperts : experts.slice(0, 3)).map(expert => (
                <div
                  key={expert.id}
                  className="bg-[#FFF9F0] rounded-3xl border border-[#DED3C6] p-5 shadow-warm-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#DED3C6]"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#332720]">
                          {expert.name}
                        </h4>
                        <VerificationBadge size="sm" />
                        <p className="text-xs text-[#75675C] truncate">{expert.companyOrOrg}</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#75675C] line-clamp-2">
                      {expert.headline}
                    </p>

                    <div className="flex items-center justify-between text-xs py-1 border-y border-[#DED3C6]/60">
                      <RatingStars rating={expert.rating} size="sm" />
                      <span className="text-[11px] text-[#75675C]">{expert.completedSessions} sessions</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[#75675C]">{analysis.recommendedDuration}m Session:</span>
                      <span className="font-bold text-[#C86B3C]">
                        ₹{analysis.recommendedDuration === 5
                          ? expert.pricing.duration5
                          : analysis.recommendedDuration === 10
                          ? expert.pricing.duration10
                          : expert.pricing.duration15}
                      </span>
                    </div>

                    <button
                      onClick={() => openBookingModal(expert, analysis.recommendedDuration as any)}
                      className="w-full py-2.5 rounded-xl bg-[#C86B3C] hover:bg-[#B85C3B] text-xs font-bold text-[#FFF9F0] shadow-warm-sm transition-all"
                    >
                      Book {analysis.recommendedDuration}m Consultation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
