import React from "react";
import { AccreditationQuestion, QuestionOption } from "./AccreditationTypes";
import { HelpCircle } from "lucide-react";

interface ScenarioQuestionProps {
  question: AccreditationQuestion;
  value: string;
  onChange: (val: string) => void;
}

export const ScenarioQuestion: React.FC<ScenarioQuestionProps> = ({
  question,
  value,
  onChange
}) => {
  return (
    <div className="space-y-5 font-sans">
      {/* Scenario Context Box */}
      {question.scenarioContext && (
        <div className="p-4 sm:p-5 rounded-[18px] bg-[#F6F0E7] border border-[#E8DCCB] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C96F42]">
            <HelpCircle size={15} />
            <span>Consultation Scenario Context</span>
          </div>
          <p className="text-xs sm:text-sm text-[#342A24] leading-relaxed italic font-serif">
            "{question.scenarioContext}"
          </p>
        </div>
      )}

      {/* Prompt */}
      <p className="text-sm sm:text-base font-semibold text-[#342A24] leading-relaxed">
        {question.prompt}
      </p>

      {question.guidance && (
        <p className="text-xs text-[#7B6C60] bg-[#FFF9F2] p-3 rounded-[12px] border border-[#E8DCCB] leading-relaxed">
          💡 <strong className="text-[#342A24]">Evaluation Standard:</strong> {question.guidance}
        </p>
      )}

      {/* Options */}
      <div className="space-y-2.5 pt-2">
        {question.options?.map((opt: QuestionOption) => {
          const isSelected = value === opt.id;
          return (
            <button
              type="button"
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`w-full text-left p-4 rounded-[16px] border transition-all flex items-start gap-3.5 cursor-pointer ${
                isSelected
                  ? "bg-[#FFF9F2] border-[#C96F42] shadow-warm-xs text-[#342A24] font-medium"
                  : "bg-[#F6F0E7]/60 border-[#E8DCCB] text-[#342A24] hover:bg-[#FFF9F2] hover:border-[#C96F42]/40"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected
                    ? "bg-[#C96F42] border-[#C96F42] text-[#FFF9F2]"
                    : "bg-[#FFF9F2] border-[#E8DCCB] text-[#7B6C60]"
                }`}
              >
                {opt.label}
              </span>

              <div className="space-y-1 flex-1">
                <span className="text-xs sm:text-sm leading-relaxed block">{opt.text}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
