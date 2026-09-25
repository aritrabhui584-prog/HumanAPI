import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { RatingStars, VerificationBadge, QualityBadge } from "../common/Badge";
import {
  Clock,
  ShieldCheck,
  Calendar,
  Globe,
  Award,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Briefcase,
  Share2,
  Bookmark,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { useCurrency, AnimatedPrice } from "../../lib/currency";

export const PublicExpertProfile: React.FC = () => {
  const { viewParams, experts, navigate, openBookingModal, savedExpertIds, toggleSaveExpert } = useApp();
  const { formatPrice } = useCurrency();
  const expertId = viewParams?.expertId || "exp-1";
  const expert = experts.find(e => e.id === expertId) || experts[0];

  const [selectedDuration, setSelectedDuration] = useState<5 | 10 | 15>(10);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

  const availableSlots = [
    "Today · 3:30 PM",
    "Today · 5:00 PM",
    "Today · 6:45 PM",
    "Tomorrow · 10:30 AM",
    "Tomorrow · 2:15 PM"
  ];

  const isSaved = savedExpertIds.includes(expert.id);

  const currentPrice =
    selectedDuration === 5
      ? expert.pricing.duration5
      : selectedDuration === 10
      ? expert.pricing.duration10
      : expert.pricing.duration15;

  return (
    <div className="min-h-screen bg-[#F7F1E7] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("experts")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#75675C] hover:text-[#332720]"
          >
            <ChevronLeft size={16} />
            <span>Back to All Specialists</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveExpert(expert.id)}
              className={`p-2 rounded-xl border border-[#DED3C6] text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? "bg-[#C86B3C]/10 border-[#C86B3C] text-[#C86B3C]"
                  : "bg-[#FFF9F0] text-[#75675C] hover:text-[#332720]"
              }`}
            >
              <Bookmark size={15} className={isSaved ? "fill-[#C86B3C]" : ""} />
              <span>{isSaved ? "Saved" : "Save Specialist"}</span>
            </button>
          </div>
        </div>

        {/* Profile Grid: Main Left (8 Cols), Booking Card Right (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Hero Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <img
                  src={expert.avatar}
                  alt={expert.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-[#DED3C6] shadow-warm-md"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#332720]">
                      {expert.name}
                    </h1>
                    <VerificationBadge size="md" />
                    <QualityBadge type="top_rated" />
                  </div>
                  <p className="text-sm font-semibold text-[#C86B3C]">
                    {expert.headline}
                  </p>
                  <p className="text-xs text-[#75675C]">
                    {expert.currentRole} at <strong className="text-[#332720]">{expert.companyOrOrg}</strong> · {expert.experienceYears} Years Experience
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[#75675C] pt-1">
                    <span className="flex items-center gap-1">
                      <Globe size={14} className="text-[#74806B]" />
                      {expert.languages.join(", ")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-[#C86B3C]" />
                      Response: {expert.responseTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reputation & Performance Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6]">
                <div>
                  <div className="text-sm sm:text-base font-serif font-bold text-[#332720]">
                    {expert.rating.toFixed(2)} ★
                  </div>
                  <div className="text-[11px] text-[#75675C]">from {expert.reviewCount} reviews</div>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-serif font-bold text-[#332720]">
                    {expert.completedSessions}
                  </div>
                  <div className="text-[11px] text-[#75675C]">Completed Sessions</div>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-serif font-bold text-[#74806B]">
                    100%
                  </div>
                  <div className="text-[11px] text-[#75675C]">Session Completion</div>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-serif font-bold text-[#C86B3C]">
                    {expert.discoverabilityScore}/100
                  </div>
                  <div className="text-[11px] text-[#75675C]">Reputation Index</div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#332720]">About</h3>
                <p className="text-sm text-[#75675C] leading-relaxed whitespace-pre-line">
                  {expert.bio}
                </p>
              </div>

              {/* What can this expert help with? */}
              <div className="p-5 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-3">
                <h3 className="font-serif font-bold text-base text-[#332720] flex items-center gap-2">
                  <Sparkles size={16} className="text-[#C86B3C]" />
                  What can {expert.name.split(" ")[0]} help you with?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#332720]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-[#718B68] shrink-0 mt-0.5" />
                    <span>Live diagnostic code teardowns & architecture reviews</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-[#718B68] shrink-0 mt-0.5" />
                    <span>Identifying concurrency bottlenecks & race conditions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-[#718B68] shrink-0 mt-0.5" />
                    <span>Staff/Principal level interview preparation & feedback</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-[#718B68] shrink-0 mt-0.5" />
                    <span>Database index sharding & fault-tolerant schema design</span>
                  </div>
                </div>
              </div>

              {/* Skills and Domain Tags */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base text-[#332720]">Core Domain Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {expert.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] text-xs font-semibold text-[#332720]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Project / Proof of Work */}
              {expert.sampleWork && (
                <div className="p-5 rounded-2xl border border-[#DED3C6] bg-[#FFF9F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#74806B]">Verified Work Sample</span>
                    <span className="text-[10px] text-[#75675C] font-mono">AUDITED</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#332720]">
                    {expert.sampleWork.title}
                  </h4>
                  <p className="text-xs text-[#75675C] leading-relaxed">
                    {expert.sampleWork.description}
                  </p>
                </div>
              )}
            </div>

            {/* Client Reviews Section */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#DED3C6] pb-4">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#332720]">
                    Verified Client Reviews
                  </h3>
                  <p className="text-xs text-[#75675C]">
                    Every review is tied to a completed, paid consultation.
                  </p>
                </div>
                <div className="text-right">
                  <RatingStars rating={expert.rating} count={expert.reviewCount} size="lg" />
                </div>
              </div>

              {expert.reviews.length === 0 ? (
                <p className="text-xs text-[#75675C] italic py-4">
                  New specialist accredited. Be the first to book a consultation and leave a review.
                </p>
              ) : (
                <div className="space-y-4">
                  {expert.reviews.map(rev => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-xs text-[#332720]">{rev.userName}</span>
                          <span className="text-[11px] text-[#75675C] ml-2">({rev.duration} min consultation)</span>
                        </div>
                        <span className="text-xs text-[#75675C]">{rev.date}</span>
                      </div>
                      <RatingStars rating={rev.rating} size="sm" showValue={false} />
                      {rev.sessionTopic && (
                        <div className="text-xs font-semibold text-[#C86B3C]">
                          Topic: {rev.sessionTopic}
                        </div>
                      )}
                      <p className="text-xs text-[#75675C] leading-relaxed">
                        "{rev.comment}"
                      </p>
                      {rev.scores && (
                        <div className="flex items-center gap-4 text-[10px] text-[#75675C] pt-1 border-t border-[#DED3C6]/60">
                          <span>Helpfulness: <strong>{rev.scores.helpfulness}/5</strong></span>
                          <span>Communication: <strong>{rev.scores.communication}/5</strong></span>
                          <span>Expertise: <strong>{rev.scores.expertise}/5</strong></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Direct Booking Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="p-6 rounded-3xl bg-[#FFF9F0] border-2 border-[#C86B3C] shadow-warm-md space-y-5">
              <div className="flex items-center justify-between border-b border-[#DED3C6] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C86B3C]">
                  Direct Consultation
                </span>
                <span className="text-xs font-semibold text-[#718B68] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#718B68]" />
                  Instant Booking
                </span>
              </div>

              {/* Duration Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#332720]">
                  1. Select Consultation Sprint:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { dur: 5 as const, price: expert.pricing.duration5 },
                    { dur: 10 as const, price: expert.pricing.duration10 },
                    { dur: 15 as const, price: expert.pricing.duration15 }
                  ].map(item => (
                    <button
                      key={item.dur}
                      onClick={() => setSelectedDuration(item.dur)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        selectedDuration === item.dur
                          ? "bg-[#C86B3C] text-[#FFF9F0] border-[#C86B3C] shadow-warm-sm font-bold"
                          : "bg-[#F7F1E7] border-[#DED3C6] text-[#332720] hover:border-[#C86B3C]"
                      }`}
                    >
                      <div className="text-xs font-bold">{item.dur} mins</div>
                      <div className="text-sm font-extrabold mt-0.5">
                        <AnimatedPrice amountInINR={item.price} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slot picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#332720]">
                  2. Choose Available Slot:
                </label>
                <div className="space-y-1.5">
                  {availableSlots.map((slot, idx) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlotIndex(idx)}
                      className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all ${
                        selectedSlotIndex === idx
                          ? "bg-[#FFF9F0] border-[#C86B3C] text-[#C86B3C] font-bold shadow-warm-sm"
                          : "bg-[#F7F1E7] border-[#DED3C6] text-[#75675C] hover:text-[#332720]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{slot}</span>
                      </div>
                      {selectedSlotIndex === idx && (
                        <CheckCircle2 size={15} className="text-[#C86B3C]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="p-3.5 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#75675C]">
                  <span>{selectedDuration}-min session</span>
                  <span><AnimatedPrice amountInINR={currentPrice} /></span>
                </div>
                <div className="flex items-center justify-between text-[#75675C]">
                  <span>Platform fee (12%)</span>
                  <span>Included</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-[#332720] pt-1.5 border-t border-[#DED3C6]">
                  <span>Total Amount</span>
                  <span className="text-base text-[#C86B3C]">
                    <AnimatedPrice amountInINR={currentPrice} />
                  </span>
                </div>
              </div>

              {/* Book CTA */}
              <button
                onClick={() => openBookingModal(expert, selectedDuration)}
                className="w-full py-3.5 rounded-2xl bg-[#C86B3C] hover:bg-[#B85C3B] text-[#FFF9F0] font-bold text-sm shadow-warm-md flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                id="profile-book-session-btn"
              >
                <span>Book {selectedDuration}-Min Consultation</span>
                <ArrowRight size={16} />
              </button>

              <p className="text-[11px] text-center text-[#75675C]">
                Includes private WebRTC video, screen share, and session chat. Full refund if expert fails to join.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
