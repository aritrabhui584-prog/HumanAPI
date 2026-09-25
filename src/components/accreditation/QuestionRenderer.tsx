import React from "react";
import { AccreditationQuestion, CandidateAnswer } from "./AccreditationTypes";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { MultiSelectQuestion } from "./MultiSelectQuestion";
import { ShortAnswerQuestion } from "./ShortAnswerQuestion";
import { LongAnswerQuestion } from "./LongAnswerQuestion";
import { ScenarioQuestion } from "./ScenarioQuestion";
import { PracticalTask } from "./PracticalTask";
import { CodeQuestion } from "./CodeQuestion";
import { Check, Loader2, AlertCircle } from "lucide-react";

interface QuestionRendererProps {
  question: AccreditationQuestion;
  answer?: CandidateAnswer;
  onAnswerChange: (value: any) => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  answer,
  onAnswerChange
}) => {
  const saveStatus = answer?.saveStatus || "unsaved";
  const rawValue = answer?.value ?? (question.type === "multi_select" ? [] : "");

  const renderQuestionBody = () => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <MultipleChoiceQuestion
            question={question}
            value={typeof rawValue === "string" ? rawValue : ""}
            onChange={onAnswerChange}
          />
        );
      case "multi_select":
        return (
          <MultiSelectQuestion
            question={question}
            value={Array.isArray(rawValue) ? rawValue : []}
            onChange={onAnswerChange}
          />
        );
      case "short_answer":
        return (
          <ShortAnswerQuestion
            question={question}
            value={typeof rawValue === "string" ? rawValue : ""}
            onChange={onAnswerChange}
          />
        );
      case "long_answer":
        return (
          <LongAnswerQuestion
            question={question}
            value={typeof rawValue === "string" ? rawValue : ""}
            onChange={onAnswerChange}
          />
        );
      case "scenario":
        return (
          <ScenarioQuestion
            question={question}
            value={typeof rawValue === "string" ? rawValue : ""}
            onChange={onAnswerChange}
          />
        );
      case "practical_task":
        return (
          <PracticalTask
            question={question}
            value={typeof rawValue === "string" ? rawValue : ""}
            onChange={onAnswerChange}
          />
        );
      case "code":
        return (
          <CodeQuestion
            question={question}
            value={typeof rawValue === "string" ? rawValue : ""}
            onChange={onAnswerChange}
          />
        );
      default:
        return (
          <LongAnswerQuestion
            question={question}
            value={typeof rawValue === "string" ? rawValue : ""}
            onChange={onAnswerChange}
          />
        );
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Question Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8DCCB]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C96F42]/10 text-[#C96F42] text-[11px] font-bold uppercase tracking-wider">
              {question.category}
            </span>
            <span className="text-xs font-mono text-[#7B6C60]">
              Item {question.number.toString().padStart(2, "0")}
            </span>
          </div>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#342A24]">
            {question.title}
          </h2>
        </div>

        {/* Real-Time Autosave Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#7B6C60] shrink-0 self-start sm:self-auto">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1.5 text-[#C96F42]">
              <Loader2 size={13} className="animate-spin" />
              <span>Saving...</span>
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-[#77816C] font-semibold">
              <Check size={14} strokeWidth={2.5} />
              <span>Saved just now</span>
            </span>
          )}
          {saveStatus === "failed" && (
            <span className="flex items-center gap-1 text-[#B85D3D] font-semibold">
              <AlertCircle size={14} />
              <span>Saving failed</span>
            </span>
          )}
        </div>
      </div>

      {/* Polymorphic Body */}
      {renderQuestionBody()}
    </div>
  );
};
