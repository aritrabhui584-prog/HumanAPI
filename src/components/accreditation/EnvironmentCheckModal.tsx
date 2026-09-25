import React, { useState } from "react";
import { ShieldCheck, ArrowRight, CheckSquare, Square, FileText } from "lucide-react";

interface EnvironmentCheckModalProps {
  candidateName: string;
  field: string;
  durationMinutes: number;
  onBeginAssessment: () => void;
}

export const OFFICIAL_ASSESSMENT_RULES = [
  {
    num: 1,
    title: "TIME LIMIT",
    text: "The assessment has a fixed time limit displayed at the top of the assessment. Manage your time accordingly. The assessment timer begins when you select \"Begin Assessment\"."
  },
  {
    num: 2,
    title: "INDIVIDUAL WORK",
    text: "The assessment must be completed entirely by you. All answers, explanations, code, scenarios, and practical submissions must represent your own knowledge, reasoning, and work."
  },
  {
    num: 3,
    title: "NO OUTSIDE ASSISTANCE",
    text: "You must not receive assistance from another person during the assessment, whether in person, by phone, messaging, voice call, screen sharing, remote access, or any other communication method."
  },
  {
    num: 4,
    title: "NO UNAUTHORIZED AI ASSISTANCE",
    text: "Do not use ChatGPT, Gemini, Claude, Copilot, Perplexity, or any other AI assistant, chatbot, automated answer generator, or AI-powered problem-solving tool unless a particular assessment task explicitly states that such assistance is permitted."
  },
  {
    num: 5,
    title: "NO UNAUTHORIZED INTERNET OR SEARCH",
    text: "Do not use search engines, websites, forums, solution repositories, tutorials, documentation, or other external resources unless the specific assessment task explicitly permits them."
  },
  {
    num: 6,
    title: "NO SHARING OF QUESTIONS OR ANSWERS",
    text: "Do not copy, photograph, screenshot, record, reproduce, publish, distribute, or share assessment questions, scenarios, answers, code, or other assessment content with anyone."
  },
  {
    num: 7,
    title: "DO NOT SEEK EXTERNAL ANSWERS",
    text: "Do not use another device, secondary computer, phone, tablet, smart device, or external communication channel to obtain answers or assistance."
  },
  {
    num: 8,
    title: "USE ONLY PERMITTED RESOURCES",
    text: "If a task explicitly allows a resource, use only the resources specified in that task. When no external resources are specified, assume they are not permitted."
  },
  {
    num: 9,
    title: "AUTHENTIC SUBMISSIONS",
    text: "Do not submit copied, purchased, generated, plagiarized, or misrepresented work as your own. Your responses should accurately represent your own professional knowledge and abilities."
  },
  {
    num: 10,
    title: "CODE SUBMISSIONS",
    text: "Code must be your own work unless the assessment explicitly provides code or permits external resources. Do not copy solutions from repositories, websites, forums, AI tools, or another person."
  },
  {
    num: 11,
    title: "STAY WITHIN THE ASSESSMENT",
    text: "Do not intentionally attempt to bypass, manipulate, interfere with, or circumvent assessment controls, timers, navigation, submission systems, or application security."
  },
  {
    num: 12,
    title: "DO NOT TAMPER WITH THE APPLICATION",
    text: "Do not modify the assessment page, manipulate client-side state, alter requests, interfere with APIs, inspect or modify assessment data, or otherwise attempt to gain an unfair advantage."
  },
  {
    num: 13,
    title: "ONE ACTIVE ASSESSMENT SESSION",
    text: "Do not intentionally create or use multiple assessment sessions, accounts, browsers, or devices to circumvent assessment restrictions or assessment rules."
  },
  {
    num: 14,
    title: "KEEP YOUR ACCOUNT SECURE",
    text: "Do not allow another person to access your HumanAPI account or participate in your assessment on your behalf."
  },
  {
    num: 15,
    title: "ASSESSMENT CONTENT IS CONFIDENTIAL",
    text: "Assessment questions, scenarios, evaluation material, and related content are confidential HumanAPI materials and must not be disclosed or redistributed."
  },
  {
    num: 16,
    title: "AUTOSAVE",
    text: "Your answers may be saved automatically while you work. However, you remain responsible for ensuring that your responses have been successfully saved before completing the assessment."
  },
  {
    num: 17,
    title: "TECHNICAL PROBLEMS",
    text: "If you experience a genuine technical problem or connection interruption, use the available recovery/support options. A technical interruption should not automatically be interpreted as a violation of the assessment rules."
  },
  {
    num: 18,
    title: "FOLLOW TASK-SPECIFIC INSTRUCTIONS",
    text: "Some questions may have additional instructions, permitted resources, time limits, or submission requirements. Always follow the instructions shown for the individual task."
  },
  {
    num: 19,
    title: "DO NOT ABANDON AND RESTART TO GAIN AN ADVANTAGE",
    text: "Do not intentionally refresh, restart, reopen, or otherwise manipulate the assessment session to obtain additional time, repeat questions, bypass restrictions, or gain access to previously unavailable content."
  },
  {
    num: 20,
    title: "ASSESSMENT INTEGRITY",
    text: "HumanAPI may use automated and server-side systems to protect the integrity and fairness of the accreditation process."
  },
  {
    num: 21,
    title: "CONFIRMED POLICY VIOLATIONS",
    text: "If HumanAPI confirms a violation of the assessment rules, the assessment may be terminated immediately and access to the expert accreditation process may be temporarily restricted."
  },
  {
    num: 22,
    title: "NO DISCLOSURE OF INTERNAL SECURITY SYSTEMS",
    text: "HumanAPI does not disclose the specific methods, signals, models, thresholds, or internal security mechanisms used to protect assessment integrity."
  },
  {
    num: 23,
    title: "FINAL RESPONSIBILITY",
    text: "By beginning the assessment, you confirm that you have read and understood these rules and agree to follow them throughout the assessment."
  }
];

export const EnvironmentCheckModal: React.FC<EnvironmentCheckModalProps> = ({
  candidateName,
  field,
  durationMinutes,
  onBeginAssessment
}) => {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    if (!hasAgreed) return;
    setIsStarting(true);
    setTimeout(() => {
      setIsStarting(false);
      onBeginAssessment();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#342A24]/65 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-2xl max-h-[92dvh] rounded-[24px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg p-5 sm:p-7 flex flex-col justify-between space-y-4 text-[#342A24] animate-in zoom-in-95 duration-150 overflow-hidden box-border">
        {/* Header */}
        <div className="space-y-1.5 text-center shrink-0">
          <div className="w-11 h-11 rounded-full bg-[#C96F42]/10 border border-[#C96F42]/30 text-[#C96F42] flex items-center justify-center mx-auto">
            <ShieldCheck size={22} />
          </div>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#342A24]">
            HumanAPI Expert Accreditation Rules & Consent
          </h2>
          <p className="text-xs text-[#7B6C60] leading-relaxed max-w-md mx-auto">
            Welcome, <strong className="text-[#342A24]">{candidateName}</strong> ({field}). Please read all rules carefully before beginning.
          </p>
        </div>

        {/* Scrollable Rules Container */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 rounded-[16px] bg-[#F6F0E7] border border-[#E8DCCB] space-y-4 text-xs leading-relaxed no-scrollbar">
          <p className="text-[#7B6C60] font-medium italic border-b border-[#E8DCCB] pb-2">
            Please read all rules carefully before beginning. By starting the assessment, you confirm that you understand and agree to follow them.
          </p>

          <div className="space-y-3.5">
            {OFFICIAL_ASSESSMENT_RULES.map((rule) => (
              <div key={rule.num} className="space-y-0.5">
                <div className="font-bold text-[#342A24] flex items-center gap-1.5">
                  <span className="text-[#C96F42] font-mono font-bold text-[11px]">{rule.num}.</span>
                  <span className="uppercase tracking-wider text-[11px]">{rule.title}</span>
                </div>
                <p className="text-[#7B6C60] pl-4">{rule.text}</p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-[12px] bg-[#FFF9F2] border border-[#E8DCCB] text-[11px] text-[#C96F42] font-semibold">
            IMPORTANT: If you are unsure whether an action or resource is permitted, do not use it unless the assessment instructions explicitly allow it.
          </div>
        </div>

        {/* Candidate Acknowledgement Checkbox */}
        <button
          type="button"
          onClick={() => setHasAgreed(!hasAgreed)}
          className="w-full text-left p-3.5 rounded-[14px] bg-[#FFF9F2] border border-[#E8DCCB] hover:border-[#C96F42]/40 transition-colors flex items-start gap-3 cursor-pointer shrink-0"
        >
          <span className="text-[#C96F42] mt-0.5 shrink-0">
            {hasAgreed ? <CheckSquare size={18} /> : <Square size={18} />}
          </span>
          <span className="text-xs font-semibold text-[#342A24] leading-relaxed">
            By beginning the assessment, I confirm that I have read, understood, and agree to follow the 23 HumanAPI Assessment Rules throughout the evaluation.
          </span>
        </button>

        {/* Action CTA */}
        <button
          type="button"
          onClick={handleStart}
          disabled={!hasAgreed || isStarting}
          className="w-full py-3.5 px-5 rounded-[16px] bg-[#C96F42] hover:bg-[#B85D3D] disabled:opacity-50 text-[#FFF9F2] font-bold text-sm shadow-warm-md flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          {isStarting ? (
            <span>Launching Assessment Workspace...</span>
          ) : (
            <>
              <span>Begin Assessment ({durationMinutes} Minutes)</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
