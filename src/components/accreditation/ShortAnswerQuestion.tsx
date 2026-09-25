import React from "react";
import { AccreditationQuestion } from "./AccreditationTypes";

interface ShortAnswerQuestionProps {
  question: AccreditationQuestion;
  value: string;
  onChange: (val: string) => void;
}

export const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
  question,
  value = "",
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

      <div className="space-y-2 pt-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Type your structured response here..."
          className="w-full px-4 py-3 rounded-[14px] bg-[#FFF9F2] border border-[#E8DCCB] text-sm text-[#342A24] focus:outline-none focus:border-[#C96F42] shadow-warm-xs placeholder-[#7B6C60]/50"
        />

        <div className="flex items-center justify-between text-[11px] text-[#7B6C60] px-1">
          <span>Be concise and precise.</span>
          <span>{value.length} characters</span>
        </div>
      </div>
    </div>
  );
};
