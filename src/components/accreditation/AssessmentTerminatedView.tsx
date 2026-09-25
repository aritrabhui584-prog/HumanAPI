import React from "react";
import { AlertCircle, Calendar, ArrowRight } from "lucide-react";

interface AssessmentTerminatedViewProps {
  restrictedUntil?: string;
  onReturnToDashboard: () => void;
}

export const AssessmentTerminatedView: React.FC<AssessmentTerminatedViewProps> = ({
  restrictedUntil = "2026-10-20",
  onReturnToDashboard
}) => {
  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-full max-w-md space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-[#B85D3D]/15 border border-[#B85D3D]/40 text-[#B85D3D] flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
            Assessment Terminated
          </h2>
          <p className="text-xs sm:text-sm text-[#7B6C60] leading-relaxed">
            Your expert accreditation assessment has been terminated because a violation of the assessment rules was confirmed.
          </p>
        </div>

        <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-[#B85D3D]">
            <Calendar size={15} />
            <span>Accreditation Access Restricted</span>
          </div>
          <p className="text-xs text-[#7B6C60] leading-relaxed">
            Access to the expert accreditation assessment is restricted until:
          </p>
          <div className="p-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] font-mono font-bold text-xs text-[#342A24]">
            {restrictedUntil}
          </div>
        </div>

        <button
          onClick={onReturnToDashboard}
          className="w-full py-3.5 px-5 rounded-[16px] bg-[#342A24] hover:bg-[#1E1714] text-[#FFF9F2] font-bold text-sm shadow-warm-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Return to Dashboard</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
