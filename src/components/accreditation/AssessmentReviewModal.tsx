import React from "react";
import { X, Send, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AccreditationQuestion, CandidateAnswer } from "./AccreditationTypes";

interface AssessmentReviewModalProps {
  isOpen: boolean;
  questions: AccreditationQuestion[];
  answers: Record<string, CandidateAnswer>;
  onClose: () => void;
  onSubmitFinal: () => void;
}

export const AssessmentReviewModal: React.FC<AssessmentReviewModalProps> = ({
  isOpen,
  questions,
  answers,
  onClose,
  onSubmitFinal
}) => {
  if (!isOpen) return null;

  const isQuestionAnswered = (qId: string) => {
    const ans = answers[qId];
    if (!ans) return false;
    if (Array.isArray(ans.value)) return ans.value.length > 0;
    return Boolean(ans.value && ans.value.trim().length > 0);
  };

  const answeredCount = questions.filter(q => isQuestionAnswered(q.id)).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342A24]/60 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-lg rounded-[24px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg p-6 space-y-6 text-[#342A24] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB]">
          <h2 className="font-serif font-bold text-xl text-[#342A24]">
            Review Before Submission
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7B6C60] hover:text-[#342A24] hover:bg-[#F6F0E7]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] text-center">
            <span className="text-2xl font-serif font-bold text-[#77816C] block">{answeredCount}</span>
            <span className="text-xs text-[#7B6C60]">Questions Answered</span>
          </div>
          <div className="p-3.5 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] text-center">
            <span className={`text-2xl font-serif font-bold block ${unansweredCount > 0 ? "text-[#B85D3D]" : "text-[#77816C]"}`}>
              {unansweredCount}
            </span>
            <span className="text-xs text-[#7B6C60]">Unanswered</span>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="p-3 rounded-[12px] bg-[#B85D3D]/10 border border-[#B85D3D]/30 text-xs text-[#B85D3D] flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>You have {unansweredCount} unanswered question(s). You can still return and complete them before submitting.</span>
          </div>
        )}

        {/* Notice */}
        <p className="text-xs text-[#7B6C60] leading-relaxed">
          Submitting will finalize your assessment responses for accreditation evaluation. Once submitted, answers cannot be edited.
        </p>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-3 rounded-[12px] border border-[#E8DCCB] bg-[#F6F0E7] text-xs font-bold text-[#342A24] hover:bg-[#E8DCCB]/50 transition-colors"
          >
            Return to Questions
          </button>

          <button
            type="button"
            onClick={onSubmitFinal}
            className="py-3 rounded-[12px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send size={14} />
            <span>Submit for Review</span>
          </button>
        </div>
      </div>
    </div>
  );
};
