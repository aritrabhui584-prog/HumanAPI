import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Search, ChevronDown, ChevronUp, HelpCircle, ArrowRight, Sparkles } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  category: "General" | "For Clients" | "For Experts" | "Trust & Safety";
}

export const PublicFaq: React.FC = () => {
  const { navigate } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedIndices, setExpandedIndices] = useState<number[]>([0, 1]);

  const faqs: FAQItem[] = [
    {
      category: "General",
      q: "What is HumanAPI and how does it differ from traditional freelance platforms like Upwork or Fiverr?",
      a: "HumanAPI is not an outsourcing or project contracting platform. You don't post jobs, wait for bids, or hire freelancers for weeks. Instead, you instantly connect with verified human experts for focused, one-to-one video consultations in 5, 10, or 15-minute sprints to diagnose road-blocks, validate architecture, or receive strategic direction."
    },
    {
      category: "General",
      q: "Why are sessions limited to 5, 10, and 15 minutes?",
      a: "Time constraint creates radical clarity. When both parties know they have 10 minutes, there is zero small talk or rambling. The client presents the exact code or decision, and the specialist delivers the diagnosis. Most senior engineers or advisors can spot an architectural defect in under 5 minutes."
    },
    {
      category: "For Clients",
      q: "How does the video room work? Do I need to download any software?",
      a: "No downloads required. The consultation takes place directly inside our browser-based WebRTC video suite. It includes peer video, audio, screen sharing for debugging code or Figma files, side-by-side chat, and a synchronized countdown timer."
    },
    {
      category: "For Clients",
      q: "What happens when the timer reaches 00:00?",
      a: "The session gracefully wraps up. Both client and expert are shown a clean completion screen with prompt options to submit ratings across Helpfulness, Communication, and Expertise. Chat logs remain accessible in your Dashboard history."
    },
    {
      category: "For Clients",
      q: "Can I book multiple consecutive sessions if my issue is complex?",
      a: "Yes! If the expert has consecutive open slots on their calendar, you can book back-to-back consultations or link them under a unified Project in your Client Dashboard."
    },
    {
      category: "For Experts",
      q: "How do I become an approved expert on HumanAPI?",
      a: "Navigate to 'Become an Expert' from your dashboard. You will choose your field, submit your resume/CV, provide a verified work sample (GitHub, design portfolio, or case study), and complete an adaptive field-specific AI interview. Our system grades your technical depth, practical triage ability, and communication before accrediting your account."
    },
    {
      category: "For Experts",
      q: "Who determines my session pricing?",
      a: "You do! Every expert has complete autonomy to set their rates for 5, 10, and 15-minute sessions. You can adjust your pricing at any time from your Expert Workspace."
    },
    {
      category: "For Experts",
      q: "What is the platform commission and payout schedule?",
      a: "Experts receive 88% of all consultation fees (HumanAPI retains a 12% platform fee to maintain WebRTC infrastructure and AI evaluation). Payouts are transferred automatically to your connected bank account on a bi-weekly cycle or instant on-demand withdrawal."
    },
    {
      category: "Trust & Safety",
      q: "What is the cancellation and refund policy?",
      a: "If an expert fails to join a scheduled consultation within 3 minutes of the start time, the client receives an automatic 100% refund. Clients may cancel any consultation with full refund up to 2 hours prior to the scheduled slot."
    },
    {
      category: "Trust & Safety",
      q: "Are video calls and chat logs private and secure?",
      a: "Yes. All WebRTC peer-to-peer streams are encrypted with end-to-end DTLS-SRTP. HumanAPI does not record video streams. Ephemeral session credentials expire immediately when the room concludes."
    }
  ];

  const filteredFaqs = faqs.filter(item => {
    if (activeCategory !== "All" && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleExpand = (idx: number) => {
    setExpandedIndices(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F1E7] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C86B3C]">
            Knowledge Base
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#332720]">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-[#75675C] max-w-xl mx-auto">
            Everything you need to know about our sprint consultations, expert accreditation, and WebRTC privacy.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#75675C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g., refund, video room, pricing)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] text-sm text-[#332720] focus:outline-none focus:border-[#C86B3C] shadow-warm-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {["All", "General", "For Clients", "For Experts", "Trust & Safety"].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-[#C86B3C] text-[#FFF9F0] shadow-warm-sm"
                    : "bg-[#FFF9F0] text-[#75675C] border border-[#DED3C6] hover:text-[#332720]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedIndices.includes(idx);
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] overflow-hidden transition-all shadow-warm-sm"
              >
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif font-bold text-base text-[#332720] hover:text-[#C86B3C] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#C86B3C] font-semibold">[{faq.category}]</span>
                    {faq.q}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-[#C86B3C] shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-[#75675C] shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#75675C] leading-relaxed border-t border-[#DED3C6]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Support CTA */}
        <div className="p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] text-center space-y-3 shadow-warm-sm">
          <h3 className="font-serif font-bold text-xl text-[#332720]">
            Still have an unanswered question?
          </h3>
          <p className="text-xs text-[#75675C] max-w-md mx-auto">
            Our support concierge is available 24/7 to assist with consultations, billing inquiries, or verification questions.
          </p>
          <button
            onClick={() => navigate("contact")}
            className="px-6 py-2.5 rounded-xl bg-[#332720] hover:bg-[#48372E] text-[#FFF9F0] text-xs font-bold transition-colors"
          >
            Contact Support Concierge
          </button>
        </div>
      </div>
    </div>
  );
};
