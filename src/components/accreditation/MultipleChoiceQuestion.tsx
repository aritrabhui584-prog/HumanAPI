import React from "react";
import { AccreditationQuestion, QuestionOption } from "./AccreditationTypes";

interface MultipleChoiceQuestionProps {
  question: AccreditationQuestion;
  value: string;
  onChange: (val: string) => void;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  value,
  onChange
}) => {
  return (
    <div className="space-y-4 font-sans">
      <p className="text-sm sm:text-base font-semibold text-[#342A24] leading-relaxed">
        {question.prompt}
      </p>

      {question.guidance && (
        <p className="text-xs text-[#7B6C60] bg-[#F6F0E7] p-3 rounded-[12px] border border-[#E8DCCB] leading-relaxed">
          💡 <strong className="text-[#342A24]">Assessor Guidance:</strong> {question.guidance}
        </p>
      )}

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
                {opt.explanation && (
                  <span className="text-[11px] text-[#7B6C60] block">{opt.explanation}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
