import React from "react";
import { HumanAPILogo } from "../brand/HumanAPILogo";
import { AssessmentTimer } from "./AssessmentTimer";
import { ChevronRight } from "lucide-react";

interface AccreditationHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  expiresAt: string;
  onTimeExpired?: () => void;
  onLogoClick?: () => void;
  onOpenMobileDrawer?: () => void;
}

export const AccreditationHeader: React.FC<AccreditationHeaderProps> = ({
  currentQuestionIndex,
  totalQuestions,
  expiresAt,
  onTimeExpired,
  onLogoClick,
  onOpenMobileDrawer
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FFF9F2]/95 backdrop-blur-md border-b border-[#E8DCCB] h-[64px] sm:h-[72px] px-4 sm:px-6 lg:px-10 flex items-center justify-between shrink-0 font-sans select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3 min-w-0">
        <HumanAPILogo variant="navbar" onClick={onLogoClick} />
        
        <div className="h-5 w-px bg-[#E8DCCB] hidden sm:block" />

        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#342A24]">
            <span>Expert Accreditation</span>
            <ChevronRight size={12} className="text-[#7B6C60]" />
            <span className="text-[#C96F42]">AI Assessment</span>
          </div>
          <p className="text-[11px] text-[#7B6C60]">Demonstrate your expertise through a structured assessment</p>
        </div>
      </div>

      {/* Center: Step Progress */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6F0E7] border border-[#E8DCCB] text-xs font-medium text-[#342A24]">
        <span className="font-semibold text-[#C96F42]">Step {currentQuestionIndex + 1}</span>
        <span className="text-[#7B6C60]">of {totalQuestions}</span>
      </div>

      {/* Right: Timer & Mobile Menu Trigger */}
      <div className="flex items-center gap-2.5 shrink-0">
        <AssessmentTimer expiresAt={expiresAt} onTimeExpired={onTimeExpired} />

        {onOpenMobileDrawer && (
          <button
            onClick={onOpenMobileDrawer}
            className="md:hidden p-2 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs font-semibold text-[#342A24]"
            aria-label="Toggle assessment progress list"
          >
            <span>Questions</span>
          </button>
        )}
      </div>
    </header>
  );
};
