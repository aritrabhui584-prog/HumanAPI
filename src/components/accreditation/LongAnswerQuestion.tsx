import React from "react";
import { AccreditationQuestion } from "./AccreditationTypes";

interface LongAnswerQuestionProps {
  question: AccreditationQuestion;
  value: string;
  onChange: (val: string) => void;
}

export const LongAnswerQuestion: React.FC<LongAnswerQuestionProps> = ({
  question,
  value = "",
  onChange
}) => {
  const minCount = question.minCharCount || 50;

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
        <textarea
          rows={6}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Detailed structured response..."
          className="w-full p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] text-sm text-[#342A24] focus:outline-none focus:border-[#C96F42] shadow-warm-xs leading-relaxed resize-y placeholder-[#7B6C60]/50"
        />

        <div className="flex items-center justify-between text-[11px] text-[#7B6C60] px-1">
          <span>
            {value.length >= minCount ? (
              <span className="text-[#77816C] font-semibold">✓ Minimum character threshold met</span>
            ) : (
              <span>Recommended minimum: {minCount} characters</span>
            )}
          </span>
          <span className="font-mono">{value.length} chars</span>
        </div>
      </div>
    </div>
  );
};
