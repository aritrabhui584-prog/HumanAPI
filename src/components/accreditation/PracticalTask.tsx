import React from "react";
import { AccreditationQuestion } from "./AccreditationTypes";
import { FileCode, CheckCircle2 } from "lucide-react";

interface PracticalTaskProps {
  question: AccreditationQuestion;
  value: string;
  onChange: (val: string) => void;
}

export const PracticalTask: React.FC<PracticalTaskProps> = ({
  question,
  value = "",
  onChange
}) => {
  const minCount = question.minCharCount || 80;

  return (
    <div className="space-y-5 font-sans">
      {/* Task Instructions Header */}
      <div className="p-4 sm:p-5 rounded-[18px] bg-[#F6F0E7] border border-[#E8DCCB] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C96F42]">
          <FileCode size={16} />
          <span>Practical Consultation Task Instructions</span>
        </div>

        <p className="text-sm font-semibold text-[#342A24] leading-relaxed">
          {question.prompt}
        </p>

        {question.practicalTaskInstructions && question.practicalTaskInstructions.length > 0 && (
          <ul className="space-y-1.5 pt-1 text-xs text-[#342A24]">
            {question.practicalTaskInstructions.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#C96F42] font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {question.guidance && (
        <p className="text-xs text-[#7B6C60] bg-[#FFF9F2] p-3 rounded-[12px] border border-[#E8DCCB] leading-relaxed">
          💡 <strong className="text-[#342A24]">Evaluation Standard:</strong> {question.guidance}
        </p>
      )}

      {/* Editor / Textarea Response */}
      <div className="space-y-2 pt-1">
        <label className="block text-xs font-bold text-[#342A24]">
          Candidate Consultation Architecture Plan:
        </label>
        <textarea
          rows={8}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Structure your 10-minute consultation plan here (e.g., Minute 0-2 Triage, Minute 2-7 Diagnostic Isolation, Minute 7-10 Action Roadmap)..."
          className="w-full p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] text-xs sm:text-sm text-[#342A24] focus:outline-none focus:border-[#C96F42] shadow-warm-xs leading-relaxed resize-y font-mono placeholder-[#7B6C60]/50"
        />

        <div className="flex items-center justify-between text-[11px] text-[#7B6C60] px-1">
          <span>
            {value.length >= minCount ? (
              <span className="text-[#77816C] font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} /> Minimum task length satisfied
              </span>
            ) : (
              <span>Required minimum: {minCount} characters</span>
            )}
          </span>
          <span className="font-mono">{value.length} characters</span>
        </div>
      </div>
    </div>
  );
};
