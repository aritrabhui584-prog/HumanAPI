import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  ArrowRight,
  Send,
  Award,
  ChevronLeft,
  DollarSign,
  Briefcase,
  Layers,
  Code,
  Check
} from "lucide-react";
import { CATEGORIES } from "../../data/mockData";
import { InterviewQuestion, InterviewEvaluationResponse } from "../../types";
import { AccreditationShell } from "../accreditation/AccreditationShell";

export const BecomeAnExpertFlow: React.FC = () => {
  const { applyAsExpert, currentUser, navigate, showNotification } = useApp();

  // 26 — 7-STEP BECOME AN EXPERT FLOW
  // Step 1: Choose expertise
  // Step 2: Professional information
  // Step 3: Resume upload
  // Step 4: Project/work sample
  // Step 5: AI interview
  // Step 6: Verification status
  // Step 7: Approved
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  // Step 1: Choose expertise
  const [category, setCategory] = useState("Software Development");
  const [skills, setSkills] = useState("React, TypeScript, WebRTC, Concurrency, PostgreSQL");

  // Step 2: Professional information
  const [headline, setHeadline] = useState("Staff Frontend Engineer & Distributed UI Architect");
  const [experienceYears, setExperienceYears] = useState(8);
  const [company, setCompany] = useState("Independent Consultant (ex-Stripe)");
  const [bio, setBio] = useState(
    "8+ years architecting high-throughput frontend applications, WebRTC peer topologies, and low-latency client state synchronization."
  );

  // Step 3: Resume upload
  const [resumeFileName, setResumeFileName] = useState("arjun_mehta_principal_cv_2025.pdf");
  const [resumeSummary, setResumeSummary] = useState(
    "Former Senior Frontend Engineer at Stripe. Specialized in React concurrency, WebRTC streaming topologies, and sub-100ms UI latency."
  );

  // Step 4: Project/work sample
  const [sampleProjectTitle, setSampleProjectTitle] = useState("Resilient WebRTC Audio Mesh Network");
  const [sampleProjectUrl, setSampleProjectUrl] = useState("https://github.com/developer/webrtc-audio-mesh");
  const [sampleProjectDesc, setSampleProjectDesc] = useState(
    "A peer-to-peer distributed WebRTC signaling hub with adaptive jitter buffer management and automatic failover."
  );

  // Step 5: AI interview
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([
    {
      id: "q1",
      question: "A client books a 10-minute sprint with a critical WebRTC ICE renegotiation deadlock in production. How do you structure the first 90 seconds to isolate whether the failure is signaling or NAT traversal?",
      criterion: "Rapid diagnostic triage and structured micro-consultation cadence"
    },
    {
      id: "q2",
      question: "Describe an architectural trade-off from your work sample where delivery velocity was balanced against strict memory safety.",
      criterion: "Technical depth and trade-off calibration"
    },
    {
      id: "q3",
      question: "How do you explain a complex synchronization race condition to a non-technical founder during a 5-minute emergency consultation?",
      criterion: "Clarity, empathy, and high-leverage communication"
    }
  ]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({
    q1: "I ask the client to replicate the peer handshake log in the shared editor, inspect ICE candidate pairs for timeout flags, and verify STUN/TURN reachability in under 90 seconds.",
    q2: "We used optimistic memory buffering for peer frames with an automated fallback to SFU routing when packet loss exceeded 3%, preventing buffer bloat.",
    q3: "I use an optical analogy of two cashiers writing to the same ledger simultaneously without locking the page, then provide the exact 2-line mutex fix."
  });
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Step 6 & 7: Evaluation & Approved
  const [evaluation, setEvaluation] = useState<InterviewEvaluationResponse | null>({
    approved: true,
    score: 94,
    feedback: "Exceptional mastery of distributed systems, disciplined consultation cadence, and clear empathy.",
    pillarScores: {
      knowledge: 96,
      practicalAbility: 92,
      problemSolving: 94,
      communication: 95
    }
  });

  // Step 7: Pricing Configuration
  const [price5, setPrice5] = useState(249);
  const [price10, setPrice10] = useState(449);
  const [price15, setPrice15] = useState(699);

  const stepsList = [
    { num: 1, label: "Expertise" },
    { num: 2, label: "Profile" },
    { num: 3, label: "Resume" },
    { num: 4, label: "Work Sample" },
    { num: 5, label: "AI Interview" },
    { num: 6, label: "Verification" },
    { num: 7, label: "Approved" }
  ];

  const handleCompleteVerification = () => {
    applyAsExpert({
      headline,
      bio,
      category,
      subcategories: [category],
      skills: skills.split(",").map(s => s.trim()),
      experienceYears,
      currentRole: headline.split("&")[0]?.trim() || "Principal Specialist",
      companyOrOrg: company,
      languages: ["English"],
      pricing: {
        duration5: price5,
        duration10: price10,
        duration15: price15
      },
      sampleWork: {
        title: sampleProjectTitle,
        description: sampleProjectDesc,
        link: sampleProjectUrl
      }
    });
    showNotification("Accreditation confirmed! Welcome to HumanAPI.", "success");
    navigate("expert-dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#77816C]/15 border border-[#77816C]/30 text-xs font-semibold text-[#77816C]">
          <ShieldCheck size={14} />
          <span>Practitioner Accreditation Gateway</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#342A24]">
          Become a Verified Expert on HumanAPI
        </h1>
        <p className="text-xs sm:text-sm text-[#7B6C60] max-w-2xl">
          HumanAPI admits staff-level engineers, architects, and senior specialists. Complete our 7-step verification to provide high-leverage 5, 10, and 15-minute consultations.
        </p>
      </div>

      {/* 7-STEP PROGRESS INDICATOR */}
      <div className="p-3 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[580px] gap-2">
          {stepsList.map(s => {
            const isCurrent = step === s.num;
            const isCompleted = step > s.num;
            return (
              <div
                key={s.num}
                onClick={() => isCompleted && setStep(s.num as any)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all ${
                  isCompleted ? "cursor-pointer hover:bg-[#F6F0E7]" : ""
                } ${
                  isCurrent
                    ? "bg-[#C96F42] text-[#FFF9F2] shadow-warm-xs"
                    : isCompleted
                    ? "text-[#77816C]"
                    : "text-[#7B6C60]/60"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? "bg-[#FFF9F2] text-[#C96F42]"
                      : isCompleted
                      ? "bg-[#77816C] text-[#FFF9F2]"
                      : "bg-[#E8DCCB] text-[#7B6C60]"
                  }`}
                >
                  {isCompleted ? <Check size={10} /> : s.num}
                </span>
                <span className="truncate">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP CONTAINER (Fits viewport with internal scroll) */}
      <div className="p-6 sm:p-8 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-sm">
        {/* STEP 1: CHOOSE EXPERTISE */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#342A24]">Step 1: Choose Your Primary Field & Skills</h2>
              <p className="text-xs text-[#7B6C60]">Select the primary technical or domain area where you have deep, verifiable practitioner experience.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {CATEGORIES.filter(c => c !== "All Fields").map(catName => (
                <div
                  key={catName}
                  onClick={() => setCategory(catName)}
                  className={`p-3.5 rounded-[14px] border cursor-pointer transition-all ${
                    category === catName
                      ? "bg-[#C96F42]/10 border-[#C96F42] shadow-warm-xs"
                      : "bg-[#F6F0E7] border-[#E8DCCB] hover:border-[#C96F42]/40"
                  }`}
                >
                  <div className="font-serif font-bold text-sm text-[#342A24]">{catName}</div>
                  <p className="text-[11px] text-[#7B6C60] line-clamp-1 mt-0.5">Accredited specialist track for {catName}</p>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#342A24] mb-1">
                Specific Competencies & Technologies (comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="e.g. React, WebSockets, Distributed Locks, PostgreSQL, Kubernetes"
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs sm:text-sm text-[#342A24] focus:outline-none focus:border-[#C96F42]"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Continue to Professional Info</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROFESSIONAL INFORMATION */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#342A24]">Step 2: Professional Information</h2>
              <p className="text-xs text-[#7B6C60]">Tell clients about your background, current affiliation, and track record.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#342A24] mb-1">Public Headline</label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#C96F42]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#342A24] mb-1">Years of Practical Experience</label>
                <input
                  type="number"
                  min={3}
                  value={experienceYears}
                  onChange={e => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#342A24] mb-1">Current Company or Independent Practice</label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#342A24] mb-1">Practitioner Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#C96F42]"
              />
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-[10px] border border-[#E8DCCB] bg-[#F6F0E7] text-xs font-semibold text-[#342A24]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Continue to Resume Upload</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RESUME UPLOAD */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#342A24]">Step 3: Resume & Credential Verification</h2>
              <p className="text-xs text-[#7B6C60]">Provide your current CV or structured resume summary for our accreditation review.</p>
            </div>

            <div className="p-6 rounded-[16px] border-2 border-dashed border-[#E8DCCB] bg-[#F6F0E7] text-center space-y-2">
              <Upload size={24} className="mx-auto text-[#C96F42]" />
              <div className="font-bold text-xs text-[#342A24]">{resumeFileName}</div>
              <p className="text-[11px] text-[#7B6C60]">PDF, DOCX up to 10MB. Verified via automated cryptographic hash.</p>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-[8px] bg-[#FFF9F2] border border-[#E8DCCB] text-xs font-semibold text-[#342A24] shadow-warm-xs hover:border-[#C96F42]"
              >
                Select Different File
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#342A24] mb-1">Career Highlights Summary</label>
              <textarea
                rows={3}
                value={resumeSummary}
                onChange={e => setResumeSummary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#C96F42]"
              />
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-[10px] border border-[#E8DCCB] bg-[#F6F0E7] text-xs font-semibold text-[#342A24]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-5 py-2.5 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Continue to Work Sample</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PROJECT/WORK SAMPLE */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#342A24]">Step 4: Verifiable Work Sample</h2>
              <p className="text-xs text-[#7B6C60]">Submit a representative open-source repo, architecture RFC, paper, or published project.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#342A24] mb-1">Project Title</label>
              <input
                type="text"
                value={sampleProjectTitle}
                onChange={e => setSampleProjectTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#C96F42]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#342A24] mb-1">Public Verification URL (GitHub, GitLab, RFC, Paper)</label>
              <input
                type="url"
                value={sampleProjectUrl}
                onChange={e => setSampleProjectUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#C96F42]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#342A24] mb-1">Technical Architecture & Trade-Offs</label>
              <textarea
                rows={3}
                value={sampleProjectDesc}
                onChange={e => setSampleProjectDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#C96F42]"
              />
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-[10px] border border-[#E8DCCB] bg-[#F6F0E7] text-xs font-semibold text-[#342A24]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="px-5 py-2.5 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Proceed to AI Assessment</span>
                <Sparkles size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: AI ACCREDITATION WORKSPACE */}
        {step === 5 && (
          <AccreditationShell
            onReturnToDashboard={() => setStep(4)}
            onSubmittedSuccess={() => setStep(6)}
          />
        )}

        {/* STEP 6: VERIFICATION STATUS */}
        {step === 6 && (
          <div className="space-y-5 text-center sm:text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#77816C]/20 text-[#77816C] text-xs font-bold mb-2">
                <CheckCircle2 size={15} />
                <span>Verification Score: {evaluation?.score || 94}/100</span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#342A24]">Step 6: Accreditation Results</h2>
              <p className="text-xs text-[#7B6C60] max-w-xl">
                Your credentials, work sample, and scenario responses have passed our rubric.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] text-center">
                <span className="text-[10px] text-[#7B6C60] uppercase font-bold">Knowledge</span>
                <div className="font-serif text-2xl font-bold text-[#342A24]">96%</div>
              </div>
              <div className="p-3.5 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] text-center">
                <span className="text-[10px] text-[#7B6C60] uppercase font-bold">Diagnostics</span>
                <div className="font-serif text-2xl font-bold text-[#C96F42]">92%</div>
              </div>
              <div className="p-3.5 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] text-center">
                <span className="text-[10px] text-[#7B6C60] uppercase font-bold">Pacing</span>
                <div className="font-serif text-2xl font-bold text-[#77816C]">94%</div>
              </div>
              <div className="p-3.5 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] text-center">
                <span className="text-[10px] text-[#7B6C60] uppercase font-bold">Clarity</span>
                <div className="font-serif text-2xl font-bold text-[#B89152]">95%</div>
              </div>
            </div>

            <div className="p-4 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] space-y-1">
              <span className="font-bold text-[#77816C]">Evaluator Commentary:</span>
              <p className="text-[#7B6C60] leading-relaxed">
                "{evaluation?.feedback || "Candidate exhibited excellent diagnostic discipline and empathetic communication."}"
              </p>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setStep(7)}
                className="px-6 py-2.5 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Proceed to Approved Rate Setup</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: APPROVED & RATE SETUP */}
        {step === 7 && (
          <div className="space-y-5">
            <div className="text-center sm:text-left">
              <div className="w-12 h-12 rounded-[14px] bg-[#77816C] text-[#FFF9F2] flex items-center justify-center mb-2 shadow-warm-xs">
                <Award size={24} />
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#342A24]">Step 7: Approved Specialist & Sprint Rates</h2>
              <p className="text-xs text-[#7B6C60]">
                Configure your sprint consultation pricing. Standard HumanAPI rates are structured around 5, 10, and 15-minute bursts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] space-y-2">
                <span className="text-xs font-bold text-[#342A24]">5-Minute Sprint</span>
                <div className="flex items-center gap-1 font-mono text-xl font-bold text-[#C96F42]">
                  <span>₹</span>
                  <input
                    type="number"
                    value={price5}
                    onChange={e => setPrice5(Number(e.target.value))}
                    className="w-20 px-2 py-1 bg-[#FFF9F2] border border-[#E8DCCB] rounded-[6px] text-sm"
                  />
                </div>
                <p className="text-[10px] text-[#7B6C60]">Ideal for quick sanity checks & syntax unblocks.</p>
              </div>

              <div className="p-4 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] space-y-2">
                <span className="text-xs font-bold text-[#342A24]">10-Minute Sprint</span>
                <div className="flex items-center gap-1 font-mono text-xl font-bold text-[#C96F42]">
                  <span>₹</span>
                  <input
                    type="number"
                    value={price10}
                    onChange={e => setPrice10(Number(e.target.value))}
                    className="w-20 px-2 py-1 bg-[#FFF9F2] border border-[#E8DCCB] rounded-[6px] text-sm"
                  />
                </div>
                <p className="text-[10px] text-[#7B6C60]">Most popular. Architecture review & diagnostic triage.</p>
              </div>

              <div className="p-4 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] space-y-2">
                <span className="text-xs font-bold text-[#342A24]">15-Minute Sprint</span>
                <div className="flex items-center gap-1 font-mono text-xl font-bold text-[#C96F42]">
                  <span>₹</span>
                  <input
                    type="number"
                    value={price15}
                    onChange={e => setPrice15(Number(e.target.value))}
                    className="w-20 px-2 py-1 bg-[#FFF9F2] border border-[#E8DCCB] rounded-[6px] text-sm"
                  />
                </div>
                <p className="text-[10px] text-[#7B6C60]">Deep code tracing & complex distributed debugging.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCompleteVerification}
                className="w-full py-3.5 rounded-[12px] bg-[#77816C] hover:bg-[#68725E] text-[#FFF9F2] font-bold text-xs sm:text-sm shadow-warm-xs flex items-center justify-center gap-2 transition-all hover-btn-lift"
              >
                <CheckCircle2 size={16} />
                <span>Launch Verified Expert Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
