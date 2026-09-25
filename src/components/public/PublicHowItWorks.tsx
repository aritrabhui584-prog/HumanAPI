import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CheckCircle2, ArrowRight, UserCheck, Clock, Video, Star, ShieldCheck, Sparkles, DollarSign } from "lucide-react";

export const PublicHowItWorks: React.FC = () => {
  const { navigate } = useApp();
  const [activeTab, setActiveTab] = useState<"users" | "experts">("users");

  const userSteps = [
    {
      num: "01",
      title: "Tell Us What You Need",
      desc: "Describe your hurdle in plain words or use our Gemini-powered Ask triage engine."
    },
    {
      num: "02",
      title: "Discover Matching Experts",
      desc: "Filter through verified specialists by field, sub-skills, rating, and language."
    },
    {
      num: "03",
      title: "Compare Proven Track Records",
      desc: "Inspect transparent client reviews, actual completed sessions, and response times."
    },
    {
      num: "04",
      title: "Select Your Duration",
      desc: "Choose between focused 5, 10, or 15-minute consultation sprints and pick a time slot."
    },
    {
      num: "05",
      title: "Secure 1-Click Checkout",
      desc: "Transparent pricing with zero hidden subscription fees. Expert receives direct payout."
    },
    {
      num: "06",
      title: "Join the Video Room",
      desc: "Enter our bespoke WebRTC room with screen share, live terminal debugging, and synchronized timer."
    },
    {
      num: "07",
      title: "Collaborate in Real-Time",
      desc: "Chat, share links, review architecture, and get actionable solutions before the timer concludes."
    },
    {
      num: "08",
      title: "Rate the Consultation",
      desc: "Leave detailed scores on helpfulness, communication, and technical depth to fuel platform trust."
    }
  ];

  const expertSteps = [
    {
      num: "01",
      title: "Create an Account",
      desc: "Start with your standard HumanAPI profile. Any member can apply to become an expert."
    },
    {
      num: "02",
      title: "Choose Your Primary Field",
      desc: "Select your core domain (Software, AI/ML, Design, FinTech, Career, etc.) and specific sub-skills."
    },
    {
      num: "03",
      title: "Upload Resume / CV",
      desc: "Submit your professional background, past company affiliations, and years of experience."
    },
    {
      num: "04",
      title: "Submit Work Sample",
      desc: "Provide a GitHub repository, published article, Figma link, or case study demonstrating real-world mastery."
    },
    {
      num: "05",
      title: "Complete Field-Specific AI Interview",
      desc: "Answer dynamic scenario questions evaluating technical depth, time-disciplined triage, and communication."
    },
    {
      num: "06",
      title: "Receive Verified Accreditation",
      desc: "Approved candidates receive the Verified Expert badge and are indexed on the public directory."
    },
    {
      num: "07",
      title: "Configure 5/10/15m Pricing",
      desc: "Decide your rates for 5, 10, and 15-minute sessions. Transparent 88% payout calculation."
    },
    {
      num: "08",
      title: "Set Availability Calendar",
      desc: "Define your working windows, timezones, and minimum buffer between sessions."
    },
    {
      num: "09",
      title: "Accept High-Impact Consultations",
      desc: "Receive client bookings directly into your calendar and join private video consultation rooms."
    },
    {
      num: "10",
      title: "Earn & Grow Reputation",
      desc: "Receive reliable payouts, collect legitimate client reviews, and climb search discoverability."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F1E7] py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C86B3C]">
            Step-by-Step Architecture
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#332720]">
            How HumanAPI Works
          </h1>
          <p className="text-base sm:text-lg text-[#75675C] max-w-2xl mx-auto">
            A frictionless marketplace built for immediate human wisdom, transparent pricing, and zero administrative waste.
          </p>

          {/* Toggle Tab */}
          <div className="inline-flex p-1 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "users"
                  ? "bg-[#C86B3C] text-[#FFF9F0] shadow-warm-sm"
                  : "text-[#75675C] hover:text-[#332720]"
              }`}
            >
              For Clients (8 Steps)
            </button>
            <button
              onClick={() => setActiveTab("experts")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "experts"
                  ? "bg-[#74806B] text-[#FFF9F0] shadow-warm-sm"
                  : "text-[#75675C] hover:text-[#332720]"
              }`}
            >
              For Experts (10 Steps)
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(activeTab === "users" ? userSteps : expertSteps).map((step, idx) => (
            <div
              key={step.num}
              className="p-6 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm flex gap-4 items-start relative group hover:border-[#C86B3C] transition-all"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-lg shrink-0 ${
                  activeTab === "users"
                    ? "bg-[#C86B3C]/10 text-[#C86B3C]"
                    : "bg-[#74806B]/10 text-[#74806B]"
                }`}
              >
                {step.num}
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-serif font-bold text-lg text-[#332720]">
                  {step.title}
                </h3>
                <p className="text-sm text-[#75675C] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] text-center space-y-4">
          <h3 className="font-serif font-bold text-2xl text-[#332720]">
            {activeTab === "users"
              ? "Ready to solve your roadblock in the next 15 minutes?"
              : "Ready to monetize your high-leverage knowledge?"}
          </h3>
          <p className="text-sm text-[#75675C] max-w-xl mx-auto">
            {activeTab === "users"
              ? "Find verified practitioners available right now for direct video consultations."
              : "Complete the AI interview and start accepting paid sessions on your own terms."}
          </p>
          <div className="pt-2">
            {activeTab === "users" ? (
              <button
                onClick={() => navigate("experts")}
                className="px-8 py-3.5 rounded-xl bg-[#C86B3C] hover:bg-[#B85C3B] text-[#FFF9F0] font-bold text-sm shadow-warm-sm inline-flex items-center gap-2"
              >
                <span>Find an Expert</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => navigate("become-expert")}
                className="px-8 py-3.5 rounded-xl bg-[#74806B] hover:bg-[#5E6956] text-[#FFF9F0] font-bold text-sm shadow-warm-sm inline-flex items-center gap-2"
              >
                <span>Start Expert Application</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
