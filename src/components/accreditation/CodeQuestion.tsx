import React from "react";
import { AccreditationQuestion } from "./AccreditationTypes";
import { Code2, CheckCircle2 } from "lucide-react";

interface CodeQuestionProps {
  question: AccreditationQuestion;
  value: string;
  onChange: (val: string) => void;
}

export const CodeQuestion: React.FC<CodeQuestionProps> = ({
  question,
  value = "",
  onChange
}) => {
  // Populate default code template if value is empty
  const currentValue = value !== "" ? value : question.codeTemplate || "";

  const handleChange = (newVal: string) => {
    onChange(newVal);
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C96F42]">
        <Code2 size={16} />
        <span>Technical Code Diagnostic</span>
      </div>

      <p className="text-sm sm:text-base font-semibold text-[#342A24] leading-relaxed">
        {question.prompt}
      </p>

      {question.guidance && (
        <p className="text-xs text-[#7B6C60] bg-[#F6F0E7] p-3 rounded-[12px] border border-[#E8DCCB] leading-relaxed">
          💡 <strong className="text-[#342A24]">Assessor Guidance:</strong> {question.guidance}
        </p>
      )}

      {/* Code Editor Box */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-3 py-1.5 rounded-t-[14px] bg-[#342A24] text-[#FFF9F2] text-xs font-mono">
          <span>{question.language || "TypeScript"} Solution Editor</span>
          <span className="text-[10px] text-[#E8DCCB]/60">Fixed-width Syntax</span>
        </div>

        <textarea
          rows={10}
          value={currentValue}
          onChange={e => handleChange(e.target.value)}
          className="w-full p-4 rounded-b-[14px] bg-[#1E1714] border border-[#342A24] text-xs text-[#FFF9F2] font-mono leading-relaxed resize-y focus:outline-none focus:border-[#C96F42] shadow-warm-md"
          placeholder="// Write your refactored TypeScript solution here..."
        />

        <div className="flex items-center justify-between text-[11px] text-[#7B6C60] px-1">
          <span>Ensure error branches & stream handles are safely closed.</span>
          <span className="font-mono">{currentValue.length} characters</span>
        </div>
      </div>
    </div>
  );
};
