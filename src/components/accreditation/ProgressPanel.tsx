import React from "react";
import { Check, ShieldCheck, FileText, Briefcase, Award, X } from "lucide-react";
import { AccreditationQuestion, CandidateAnswer } from "./AccreditationTypes";

interface ProgressPanelProps {
  questions: AccreditationQuestion[];
  answers: Record<string, CandidateAnswer>;
  currentQuestionId: string;
  onSelectQuestion: (questionId: string) => void;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const ProgressPanel: React.FC<ProgressPanelProps> = ({
  questions,
  answers,
  currentQuestionId,
  onSelectQuestion,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer
}) => {
  const isQuestionAnswered = (qId: string) => {
    const ans = answers[qId];
    if (!ans) return false;
    if (Array.isArray(ans.value)) return ans.value.length > 0;
    return Boolean(ans.value && ans.value.trim().length > 0);
  };

  const content = (
    <div className="space-y-6 font-sans select-none">
      {/* Overall Accreditation Steps */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#7B6C60]">
          Accreditation Roadmap
        </h3>

        <div className="space-y-1.5 text-xs font-medium">
          <div className="flex items-center gap-2.5 p-2 rounded-[10px] bg-[#FFF9F2] text-[#342A24] border border-[#E8DCCB]">
            <span className="w-5 h-5 rounded-full bg-[#77816C]/20 text-[#77816C] flex items-center justify-center font-bold text-[10px]">
              <Check size={12} strokeWidth={3} />
            </span>
            <span className="truncate">1. Profile Information</span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-[10px] bg-[#FFF9F2] text-[#342A24] border border-[#E8DCCB]">
            <span className="w-5 h-5 rounded-full bg-[#77816C]/20 text-[#77816C] flex items-center justify-center font-bold text-[10px]">
              <Check size={12} strokeWidth={3} />
            </span>
            <span className="truncate">2. Resume / CV Verification</span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-[10px] bg-[#FFF9F2] text-[#342A24] border border-[#E8DCCB]">
            <span className="w-5 h-5 rounded-full bg-[#77816C]/20 text-[#77816C] flex items-center justify-center font-bold text-[10px]">
              <Check size={12} strokeWidth={3} />
            </span>
            <span className="truncate">3. Work Sample Summary</span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-[12px] bg-[#C96F42]/10 border border-[#C96F42]/30 text-[#C96F42] font-semibold">
            <span className="w-5 h-5 rounded-full bg-[#C96F42] text-[#FFF9F2] flex items-center justify-center font-bold text-[10px]">
              4
            </span>
            <span className="truncate">4. AI Assessment</span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-[10px] bg-[#F6F0E7]/60 text-[#7B6C60] border border-transparent">
            <span className="w-5 h-5 rounded-full bg-[#E8DCCB] text-[#7B6C60] flex items-center justify-center font-bold text-[10px]">
              5
            </span>
            <span className="truncate">5. Accreditation Review</span>
          </div>
        </div>
      </div>

      {/* Assessment Question Index */}
      <div className="space-y-2 pt-2 border-t border-[#E8DCCB]">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B6C60]">
            Assessment Items
          </h4>
          <span className="text-[11px] font-semibold text-[#C96F42]">
            {Object.keys(answers).filter(isQuestionAnswered).length} / {questions.length} Completed
          </span>
        </div>

        <div className="space-y-1.5">
          {questions.map((q, idx) => {
            const isCurrent = q.id === currentQuestionId;
            const answered = isQuestionAnswered(q.id);

            return (
              <button
                key={q.id}
                onClick={() => {
                  onSelectQuestion(q.id);
                  if (onCloseMobileDrawer) onCloseMobileDrawer();
                }}
                className={`w-full text-left p-2.5 rounded-[12px] border transition-all flex items-center justify-between gap-2 text-xs ${
                  isCurrent
                    ? "bg-[#FFF9F2] border-[#C96F42] text-[#342A24] font-bold shadow-warm-xs"
                    : answered
                    ? "bg-[#FFF9F2]/70 border-[#E8DCCB] text-[#342A24] hover:bg-[#FFF9F2]"
                    : "bg-[#F6F0E7]/60 border-[#E8DCCB]/60 text-[#7B6C60] hover:bg-[#FFF9F2]/50"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? "bg-[#C96F42] text-[#FFF9F2]"
                        : answered
                        ? "bg-[#77816C] text-[#FFF9F2]"
                        : "bg-[#E8DCCB] text-[#7B6C60]"
                    }`}
                  >
                    {answered ? <Check size={11} strokeWidth={3} /> : idx + 1}
                  </span>
                  <span className="truncate">{q.title}</span>
                </div>

                <span className="text-[10px] uppercase font-mono text-[#7B6C60] shrink-0">
                  {q.type === "multiple_choice"
                    ? "MCQ"
                    : q.type === "scenario"
                    ? "Scenario"
                    : q.type === "code"
                    ? "Code"
                    : q.type === "multi_select"
                    ? "Multi"
                    : "Task"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 lg:w-80 p-5 bg-[#F6F0E7] border-r border-[#E8DCCB] shrink-0 overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#342A24]/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div className="w-4/5 max-w-xs h-full bg-[#F6F0E7] p-5 shadow-warm-lg overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB] mb-4">
                <h3 className="font-serif font-bold text-base text-[#342A24]">Assessment Progress</h3>
                <button
                  onClick={onCloseMobileDrawer}
                  className="p-1 rounded-lg text-[#7B6C60] hover:text-[#342A24]"
                >
                  <X size={20} />
                </button>
              </div>
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
