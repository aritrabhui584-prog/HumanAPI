import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { RatingStars, VerificationBadge } from "../common/Badge";
import { ArrowRight, ChevronRight, Clock, Star, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Expert } from "../../types";

export const ExpertDiscoverySection: React.FC = () => {
  const { experts, navigate, openBookingModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Software",
    "Design",
    "Career",
    "Business",
    "Marketing",
    "AI & Data",
    "Engineering",
    "Education"
  ];

  // Map category tag to expert filtering
  const filteredExperts = experts.filter(exp => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Software" && exp.category.includes("Software")) return true;
    if (selectedCategory === "Design" && (exp.category.includes("Design") || exp.subcategories?.includes("UI/UX Design"))) return true;
    if (selectedCategory === "Career" && exp.category.includes("Career")) return true;
    if (selectedCategory === "Business" && (exp.category.includes("Startup") || exp.category.includes("Business") || exp.category.includes("FinTech"))) return true;
    if (selectedCategory === "Marketing" && exp.category.includes("Marketing")) return true;
    if (selectedCategory === "AI & Data" && (exp.category.includes("AI") || exp.category.includes("Data"))) return true;
    if (selectedCategory === "Engineering" && (exp.category.includes("Software") || exp.category.includes("Architecture"))) return true;
    return true;
  });

  const primaryExpert: Expert = filteredExperts[0] || experts[0];
  const secondaryExperts: Expert[] = (filteredExperts.slice(1, 4).length > 0 ? filteredExperts.slice(1, 4) : experts.slice(1, 4));

  return (
    <section className="w-full py-16 sm:py-24 bg-[#EDE3D5]/40 text-[#332A24] border-t border-b border-[#E2D5C3]/80 relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A3E] block mb-2">
              Verified Practitioners
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#332A24] font-normal tracking-tight leading-[1.08]">
              One conversation, <br className="hidden sm:inline" />
              <span className="italic text-[#C96A3E]">weeks of trial-and-error saved.</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#5A4E45] mt-3 leading-relaxed">
              Skip agency retainers and multi-week scheduling delays. Meet with verified senior practitioners available for 5, 10, or 15-minute consultations today.
            </p>
          </div>

          <button
            onClick={() => navigate("experts")}
            className="inline-flex items-center gap-2 self-start lg:self-end px-5 py-2.5 rounded-full bg-[#FFF9F2] border border-[#D8CBBA] hover:border-[#C96A3E] text-xs font-bold text-[#332A24] hover:text-[#C96A3E] shadow-sm transition-all"
            id="browse-all-practitioners-btn"
          >
            <span>Explore All {experts.length} Specialists</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Floating Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none ${
                  isSelected
                    ? "bg-[#332A24] text-[#FFF9F2] shadow-sm"
                    : "bg-[#FFF9F2] text-[#5A4E45] border border-[#E2D5C3] hover:border-[#C96A3E] hover:text-[#332A24]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Asymmetrical Editorial Arrangement: One Primary + Three Secondary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* PRIMARY FEATURED EXPERT CARD (7 Columns) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-[#FFF9F2] rounded-[28px] border border-[#E2D5C3] p-6 sm:p-8 shadow-[0_8px_28px_-6px_rgba(51,42,36,0.07)] flex flex-col justify-between relative group hover:border-[#C96A3E]/70 transition-all"
          >
            <div>
              {/* Card Top Pill: Next Available Slot */}
              <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E2D5C3]/70">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#77806D] animate-pulse" />
                  <span className="font-mono text-xs font-semibold text-[#77806D] uppercase tracking-wider">
                    Available: {primaryExpert.nextAvailableSlot || "Today · 3:30 PM"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C96A3E]/10 text-[#C96A3E] font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles size={11} />
                  <span>Featured Lead</span>
                </div>
              </div>

              {/* Specialist Header: Avatar, Name, Title, Verification */}
              <div className="flex items-start gap-4 sm:gap-5 mb-5">
                <img
                  src={primaryExpert.avatar}
                  alt={primaryExpert.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-[18px] object-cover border border-[#DFCEBA] shrink-0 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif font-bold text-2xl text-[#332A24]">
                      {primaryExpert.name}
                    </h3>
                    <VerificationBadge size="sm" />
                  </div>
                  <p className="font-sans text-xs sm:text-sm font-medium text-[#C96A3E] mt-0.5">
                    {primaryExpert.companyOrOrg}
                  </p>
                  <p className="font-sans text-xs text-[#5A4E45] line-clamp-1 mt-0.5">
                    {primaryExpert.headline}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <RatingStars rating={primaryExpert.rating} count={primaryExpert.reviewCount} size="sm" />
                    <span className="text-[11px] font-mono text-[#77806D]">
                      {primaryExpert.completedSessions} sessions
                    </span>
                  </div>
                </div>
              </div>

              {/* Practitioner Methodology Quote */}
              <div className="p-4 rounded-[18px] bg-[#F4EEE5] border border-[#E2D5C3]/80 my-4 text-xs sm:text-sm text-[#5A4E45] leading-relaxed italic font-serif">
                "{primaryExpert.bio}"
              </div>

              {/* Skills and Domain Tags */}
              <div className="flex flex-wrap gap-1.5 my-4">
                {primaryExpert.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-full bg-[#EDE3D5] text-[11px] font-mono font-medium text-[#332A24] border border-[#DFCEBA]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions: Micro-Sprint Pricing & Booking */}
            <div className="pt-5 mt-4 border-t border-[#E2D5C3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-[#77806D] uppercase">5 min sprint</span>
                  <span className="font-mono text-sm font-bold text-[#332A24]">₹{primaryExpert.pricing.duration5}</span>
                </div>
                <div className="w-px h-6 bg-[#E2D5C3]" />
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-[#C96A3E] uppercase font-bold">10 min (Std)</span>
                  <span className="font-mono text-sm font-bold text-[#C96A3E]">₹{primaryExpert.pricing.duration10}</span>
                </div>
                <div className="w-px h-6 bg-[#E2D5C3]" />
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-[#77806D] uppercase">15 min deep</span>
                  <span className="font-mono text-sm font-bold text-[#332A24]">₹{primaryExpert.pricing.duration15}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigate("expert-detail", { expertId: primaryExpert.id })}
                  className="px-4 py-2.5 rounded-full border border-[#D8CBBA] bg-[#FFF9F2] hover:bg-[#F4EEE5] text-xs font-semibold text-[#332A24] transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={() => openBookingModal(primaryExpert, 10)}
                  className="px-5 py-2.5 rounded-full bg-[#C96A3E] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-semibold shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5"
                >
                  <span>Book 10 Min</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* SECONDARY EXPERT CARDS (5 Columns Stacked) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {secondaryExperts.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="p-5 rounded-[24px] bg-[#FFF9F2] border border-[#E2D5C3] hover:border-[#C96A3E]/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={exp.avatar}
                    alt={exp.name}
                    className="w-13 h-13 rounded-[14px] object-cover border border-[#DFCEBA] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-serif font-bold text-lg text-[#332A24] group-hover:text-[#C96A3E] transition-colors truncate">
                          {exp.name}
                        </h4>
                        <VerificationBadge size="sm" />
                      </div>
                      <span className="font-mono text-xs font-bold text-[#C96A3E]">
                        ₹{exp.pricing.duration10} / 10m
                      </span>
                    </div>

                    <p className="text-xs text-[#77806D] truncate mt-0.5">
                      {exp.headline}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <RatingStars rating={exp.rating} count={exp.reviewCount} size="sm" />
                      <span className="text-[10px] font-mono text-[#5A4E45] flex items-center gap-1">
                        <Clock size={11} className="text-[#77806D]" />
                        {exp.responseTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E2D5C3]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {exp.skills.slice(0, 2).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-[6px] bg-[#F4EEE5] text-[10px] font-mono text-[#5A4E45]">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate("expert-detail", { expertId: exp.id })}
                      className="text-[#5A4E45] hover:text-[#332A24] font-semibold text-[11px]"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => openBookingModal(exp, 10)}
                      className="px-3 py-1 rounded-full bg-[#332A24] hover:bg-[#28201A] text-[#FFF9F2] text-[11px] font-semibold transition-colors"
                    >
                      Book 10m
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
