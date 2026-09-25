import React from "react";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";

interface AssessmentSubmittedViewProps {
  candidateName: string;
  field: string;
  onReturnToDashboard: () => void;
}

export const AssessmentSubmittedView: React.FC<AssessmentSubmittedViewProps> = ({
  candidateName,
  field,
  onReturnToDashboard
}) => {
  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-full max-w-md space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-[#77816C]/15 border border-[#77816C]/40 text-[#77816C] flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
            Assessment Submitted
          </h2>
          <p className="text-xs sm:text-sm text-[#7B6C60] leading-relaxed">
            Thank you, <strong className="text-[#342A24]">{candidateName}</strong>. Your accreditation assessment for <strong className="text-[#342A24]">{field}</strong> has been received.
          </p>
        </div>

        <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C96F42]">
            <Clock size={15} />
            <span>Accreditation Review In Progress</span>
          </div>
          <p className="text-xs text-[#7B6C60] leading-relaxed">
            Our accreditation system is evaluating your structured answers across domain mastery, practical problem solving, consultation architecture, and client communication.
          </p>
          <p className="text-[11px] text-[#7B6C60] italic pt-1">
            You will receive a notification on your expert dashboard once the evaluation review is complete.
          </p>
        </div>

        <button
          onClick={onReturnToDashboard}
          className="w-full py-3.5 px-5 rounded-[16px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] font-bold text-sm shadow-warm-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Return to Dashboard</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
