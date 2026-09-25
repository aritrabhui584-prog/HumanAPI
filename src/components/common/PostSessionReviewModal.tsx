import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { VerificationBadge } from "./Badge";
import {
  Star,
  X,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Clock,
  MessageSquare,
  HelpCircle,
  Eye,
  ArrowRight
} from "lucide-react";
import { Booking, Expert } from "../../types";

export interface PostSessionReviewModalProps {
  isOpen?: boolean;
  booking?: Booking | null;
  expert?: Expert | null;
  onClose?: () => void;
  onSubmitSuccess?: (reviewData: {
    rating: number;
    comment: string;
    scores: { helpfulness: number; communication: number; expertise: number };
    tags: string[];
    recommend: boolean;
  }) => void;
}

const PRAISE_TAGS = [
  "⚡ Rapid root-cause diagnosis",
  "📐 Crystal-clear architecture advice",
  "🎯 Direct & highly concise",
  "💡 Actionable next steps",
  "🤝 Patient & empathetic communication",
  "⏱️ Respectful of sprint time",
  "🧑‍💻 Production-ready code suggestions",
  "🔍 Deep domain mastery"
];

const RATING_DESCRIPTIONS: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: "Needs Improvement",
    subtitle: "The session did not address the core issue or meet expectations."
  },
  2: {
    title: "Below Expectations",
    subtitle: "Some helpful pointers, but significant gaps in resolution."
  },
  3: {
    title: "Satisfactory",
    subtitle: "Addressed questions adequately with basic recommendations."
  },
  4: {
    title: "Very Good & Helpful",
    subtitle: "Direct, knowledgeable guidance that moved the project forward."
  },
  5: {
    title: "Exceptional Consultation",
    subtitle: "Instant root-cause clarity, deep expertise, and immediate unblocking."
  }
};

export const PostSessionReviewModal: React.FC<PostSessionReviewModalProps> = ({
  isOpen: propIsOpen,
  booking: propBooking,
  expert: propExpert,
  onClose: propOnClose,
  onSubmitSuccess
}) => {
  const {
    isReviewModalOpen,
    reviewModalBooking,
    closeReviewModal,
    submitReview,
    completeSession,
    experts,
    navigate,
    showNotification
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isReviewModalOpen;
  const activeBooking = propBooking || reviewModalBooking;
  const targetExpert =
    propExpert ||
    (activeBooking ? experts.find(e => e.id === activeBooking.expertId) : null) ||
    experts[0];

  // Core Rating State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Optional Qualitative Feedback
  const [comment, setComment] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "⚡ Rapid root-cause diagnosis",
    "💡 Actionable next steps"
  ]);

  // Pillar Rubric (Helpfulness, Communication, Technical Depth)
  const [scoreHelpfulness, setScoreHelpfulness] = useState<number>(5);
  const [scoreCommunication, setScoreCommunication] = useState<number>(5);
  const [scoreExpertise, setScoreExpertise] = useState<number>(5);

  // Recommendation & Visibility Toggles
  const [recommend, setRecommend] = useState<boolean>(true);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Reset states when a new booking opens
  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setHoverRating(null);
      setComment("");
      setSelectedTags(["⚡ Rapid root-cause diagnosis", "💡 Actionable next steps"]);
      setScoreHelpfulness(5);
      setScoreCommunication(5);
      setScoreExpertise(5);
      setRecommend(true);
      setIsPublic(true);
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  }, [isOpen, activeBooking?.id]);

  // BODY SCROLL LOCK MANAGEMENT
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "";
      };
    }
  }, [isOpen]);

  // KEYBOARD ACCESSIBILITY (ESCAPE TO CLOSE)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !activeBooking || !targetExpert) {
    return null;
  }

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      closeReviewModal();
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const effectiveRating = hoverRating !== null ? hoverRating : rating;
  const ratingInfo = RATING_DESCRIPTIONS[effectiveRating] || RATING_DESCRIPTIONS[5];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reviewPayload = {
      rating,
      comment: comment.trim(),
      scores: {
        helpfulness: scoreHelpfulness,
        communication: scoreCommunication,
        expertise: scoreExpertise
      },
      tags: selectedTags,
      recommend,
      isPublic
    };

    setTimeout(() => {
      // Mark session complete and register review in state
      completeSession(activeBooking.id);
      submitReview(activeBooking.id, targetExpert.id, reviewPayload);

      setIsSubmitting(false);
      setIsSubmitted(true);

      showNotification(
        `Thank you! Your review for ${targetExpert.name} has been published.`,
        "success"
      );

      if (onSubmitSuccess) {
        onSubmitSuccess(reviewPayload);
      }

      // Close modal after brief success confirmation
      setTimeout(() => {
        handleClose();
      }, 900);
    }, 450);
  };

  const handleSkip = () => {
    completeSession(activeBooking.id);
    handleClose();
    showNotification("Review skipped. You can always submit feedback later from Consultation History.", "info");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2A1F18]/80 backdrop-blur-sm animate-in fade-in duration-200 font-sans"
      id="post-session-review-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      onClick={handleClose}
    >
      <div
        className="w-[calc(100vw-24px)] max-w-xl h-[min(92dvh,900px)] max-h-[calc(100dvh-24px)] rounded-[24px] sm:rounded-[28px] bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-xl overflow-hidden transition-all relative flex flex-col box-border mx-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Decorative Header Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-[#C86B3C] via-[#C4934B] to-[#718B68]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#DED3C6] flex items-start justify-between gap-4 bg-[#FFFDF9]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#718B68]/15 border border-[#718B68]/30 text-[#718B68] text-[11px] font-bold uppercase tracking-wider">
              <CheckCircle2 size={12} />
              Session Completed
            </div>
            <h2
              id="review-modal-title"
              className="font-serif text-xl sm:text-2xl font-bold text-[#332720]"
            >
              Consultation Feedback
            </h2>
            <p className="text-xs text-[#75675C]">
              Your evaluation upholds accredited verification standards across the HumanAPI network.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#F7F1E7] hover:bg-[#EBE2D5] border border-[#DED3C6] flex items-center justify-center text-[#75675C] hover:text-[#332720] transition-colors shrink-0"
            aria-label="Close review dialog"
            id="close-review-modal-btn"
          >
            <X size={16} />
          </button>
        </div>

        {isSubmitted ? (
          /* Success Screen */
          <div className="p-8 sm:p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#718B68]/15 border border-[#718B68]/30 text-[#718B68] flex items-center justify-center mx-auto animate-in zoom-in duration-300">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#332720]">
              Review Submitted
            </h3>
            <p className="text-xs sm:text-sm text-[#75675C] max-w-md mx-auto">
              Thank you for sharing your experience with <span className="font-semibold text-[#332720]">{targetExpert.name}</span>. Your feedback updates their public discoverability score and aids other engineering leaders.
            </p>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Session Context Summary Card */}
            <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <img
                  src={targetExpert.avatar}
                  alt={targetExpert.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-[#DED3C6] shadow-warm-xs shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-sm text-[#332720]">
                      {targetExpert.name}
                    </span>
                    <VerificationBadge size="sm" />
                  </div>
                  <p className="text-[11px] text-[#75675C] line-clamp-1">
                    {targetExpert.headline}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#C86B3C] font-semibold">
                    <Clock size={12} />
                    <span>{activeBooking.duration}-Minute Sprint</span>
                    <span className="text-[#DED3C6]">·</span>
                    <span className="text-[#332720] font-normal truncate max-w-[180px] sm:max-w-xs">
                      {activeBooking.topic}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1 to 5 Star Rating Section */}
            <div className="space-y-2 text-center py-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#75675C]">
                Overall Consultation Rating
              </label>

              <div
                className="flex items-center justify-center gap-2 py-1"
                role="radiogroup"
                aria-label="Rating from 1 to 5 stars"
              >
                {[1, 2, 3, 4, 5].map(starValue => {
                  const isFilled = starValue <= effectiveRating;
                  return (
                    <button
                      type="button"
                      key={starValue}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1.5 rounded-xl hover:bg-[#F7F1E7] transition-all transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C86B3C]/40"
                      aria-label={`Rate ${starValue} of 5 stars`}
                      aria-checked={rating === starValue}
                      role="radio"
                      id={`star-btn-${starValue}`}
                    >
                      <Star
                        size={32}
                        className={`transition-colors duration-150 ${
                          isFilled
                            ? "fill-[#C86B3C] text-[#C86B3C] drop-shadow-sm"
                            : "text-[#DED3C6] fill-transparent hover:text-[#C86B3C]/50"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Sentiment Descriptor */}
              <div className="min-h-[38px] flex flex-col items-center justify-center transition-all duration-150">
                <span className="font-serif font-bold text-sm sm:text-base text-[#332720]">
                  {ratingInfo.title} ({effectiveRating} / 5)
                </span>
                <span className="text-[11px] text-[#75675C] max-w-sm">
                  {ratingInfo.subtitle}
                </span>
              </div>
            </div>

            {/* Qualitative Feedback Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="review-comment-input"
                  className="text-xs font-bold text-[#332720] flex items-center gap-1.5"
                >
                  <MessageSquare size={13} className="text-[#C86B3C]" />
                  <span>Written Testimonial / Feedback</span>
                  <span className="text-[10px] font-normal text-[#75675C] bg-[#F7F1E7] px-2 py-0.5 rounded-full border border-[#DED3C6]">
                    Optional
                  </span>
                </label>
                <span className="text-[11px] text-[#75675C]">
                  {comment.length} / 500
                </span>
              </div>
              <textarea
                id="review-comment-input"
                rows={3}
                maxLength={500}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={`How did ${targetExpert.name} help resolve your roadblock or unblock your team? Any key recommendations or insights you'd highlight?`}
                className="w-full p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#DED3C6] text-xs text-[#332720] placeholder-[#75675C]/70 focus:outline-none focus:border-[#C86B3C] focus:ring-2 focus:ring-[#C86B3C]/20 transition-all resize-none shadow-warm-xs"
              />
            </div>

            {/* Quick Praise Highlights Tags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#332720] flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#C4934B]" />
                  <span>Key Session Highlights</span>
                  <span className="text-[10px] font-normal text-[#75675C]">
                    (Select any that apply)
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRAISE_TAGS.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left ${
                        isSelected
                          ? "bg-[#C86B3C] text-[#FFF9F0] border border-[#C86B3C] shadow-warm-xs"
                          : "bg-[#F7F1E7] hover:bg-[#EBE2D5] text-[#332720] border border-[#DED3C6]"
                      }`}
                      id={`praise-tag-${tag.replace(/[^a-zA-Z0-9]/g, "").slice(0, 15)}`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Multi-Pillar Dimension Ratings */}
            <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-3">
              <div className="flex items-center justify-between border-b border-[#DED3C6]/60 pb-2">
                <span className="text-xs font-bold text-[#332720]">
                  Performance Rubric
                </span>
                <span className="text-[11px] text-[#75675C]">
                  Granular 1–5 assessment
                </span>
              </div>

              {/* Helpfulness */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-[#332720] font-medium">
                  Helpfulness & Resolution:
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setScoreHelpfulness(val)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                        scoreHelpfulness === val
                          ? "bg-[#C86B3C] text-[#FFF9F0] shadow-warm-xs"
                          : "bg-[#FFF9F0] text-[#75675C] hover:text-[#332720] border border-[#DED3C6]"
                      }`}
                      aria-label={`Rate helpfulness ${val} of 5`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Communication */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-[#332720] font-medium">
                  Communication & Clarity:
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setScoreCommunication(val)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                        scoreCommunication === val
                          ? "bg-[#C86B3C] text-[#FFF9F0] shadow-warm-xs"
                          : "bg-[#FFF9F0] text-[#75675C] hover:text-[#332720] border border-[#DED3C6]"
                      }`}
                      aria-label={`Rate communication ${val} of 5`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Depth */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-[#332720] font-medium">
                  Technical & Domain Depth:
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setScoreExpertise(val)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                        scoreExpertise === val
                          ? "bg-[#C86B3C] text-[#FFF9F0] shadow-warm-xs"
                          : "bg-[#FFF9F0] text-[#75675C] hover:text-[#332720] border border-[#DED3C6]"
                      }`}
                      aria-label={`Rate domain depth ${val} of 5`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation & Visibility Controls */}
            <div className="pt-1 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#332720]">
                  Would you recommend this specialist to colleagues?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRecommend(true)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      recommend
                        ? "bg-[#718B68] text-[#FFF9F0] shadow-warm-xs"
                        : "bg-[#F7F1E7] text-[#75675C] border border-[#DED3C6]"
                    }`}
                  >
                    <ThumbsUp size={12} />
                    <span>Yes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommend(false)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      !recommend
                        ? "bg-[#B85C3B] text-[#FFF9F0] shadow-warm-xs"
                        : "bg-[#F7F1E7] text-[#75675C] border border-[#DED3C6]"
                    }`}
                  >
                    <ThumbsDown size={12} />
                    <span>No</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-[#75675C]">
                <input
                  type="checkbox"
                  id="public-review-checkbox"
                  checked={isPublic}
                  onChange={e => setIsPublic(e.target.checked)}
                  className="rounded text-[#C86B3C] focus:ring-[#C86B3C] border-[#DED3C6] w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="public-review-checkbox"
                  className="cursor-pointer select-none text-[11px]"
                >
                  Feature testimonial publicly on {targetExpert.name}'s verified profile
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#C86B3C] hover:bg-[#B85C3B] text-[#FFF9F0] font-bold text-xs shadow-warm-sm hover:shadow-warm-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                id="submit-review-btn"
              >
                {isSubmitting ? (
                  <span>Publishing Feedback...</span>
                ) : (
                  <>
                    <span>Submit Rating & Review</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="w-full sm:w-auto py-3 px-4 rounded-2xl border border-[#DED3C6] hover:bg-[#F7F1E7] text-xs font-semibold text-[#75675C] hover:text-[#332720] transition-colors"
                id="skip-review-btn"
              >
                Skip for now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
