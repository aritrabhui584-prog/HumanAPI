import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Upload, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  Eye, 
  Layers, 
  Type, 
  Palette, 
  Grid, 
  ShieldCheck, 
  Star, 
  Clock, 
  SlidersHorizontal 
} from "lucide-react";
import { HumanAPILoader, HumanAPILoadingButton } from "../loading";
import { Expert } from "../../types";

const DESIGN_TYPES = [
  "Logo",
  "Poster",
  "Social Media",
  "Branding",
  "UI Design",
  "Presentation",
  "Other"
];

const FEEDBACK_OPTIONS = [
  "Design critique",
  "Improvement suggestions",
  "Typography feedback",
  "Color feedback",
  "Layout feedback",
  "Branding feedback"
];

export const DesignIntakeFlow: React.FC = () => {
  const { experts, openBookingModal, navigate } = useApp();

  // Form State
  const [designType, setDesignType] = useState<string>("Poster");
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([
    "Design critique",
    "Visual hierarchy",
    "Layout feedback"
  ]);
  const [file, setFile] = useState<{ name: string; size: string; preview: string } | null>({
    name: "event_poster_v2.png",
    size: "3.4 MB",
    preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
  });
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Analysis & Matching State
  const [step, setStep] = useState<"intake" | "analyzing" | "results">("intake");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toggleFeedback = (option: string) => {
    if (selectedFeedback.includes(option)) {
      setSelectedFeedback(selectedFeedback.filter(item => item !== option));
    } else {
      setSelectedFeedback([...selectedFeedback, option]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const previewUrl = URL.createObjectURL(selected);
      setFile({
        name: selected.name,
        size: `${(selected.size / (1024 * 1024)).toFixed(1)} MB`,
        preview: previewUrl
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      const previewUrl = URL.createObjectURL(selected);
      setFile({
        name: selected.name,
        size: `${(selected.size / (1024 * 1024)).toFixed(1)} MB`,
        preview: previewUrl
      });
    }
  };

  const handleSubmitIntake = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStep("analyzing");

    // Authoritative 1.2s analysis transition
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("results");
    }, 1400);
  };

  // Filter design experts from catalog
  const designExperts = experts.filter(exp => 
    exp.category === "UI/UX Design" || 
    exp.subcategories?.includes("UI/UX Design") || 
    exp.skills.some(s => ["Design Systems", "Figma", "Typography", "Branding", "UI Design", "Visual Design"].includes(s))
  );

  return (
    <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 select-none">
      {/* HEADER BREADCRUMB / CONTEXT */}
      <div className="flex items-center gap-2 mb-6 text-[13px] text-[#7B6C60]">
        <button onClick={() => navigate("home")} className="hover:text-[#C96F42] transition-colors">
          HumanAPI
        </button>
        <span>/</span>
        <span className="text-[#342A24] font-medium">Design Review Intake</span>
      </div>

      {step === "intake" && (
        <div className="bg-[#FFF9F2] border border-[#E8DCCB] rounded-[24px] p-6 sm:p-8 md:p-10 shadow-warm-lg">
          <div className="max-w-[720px] mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C96F42]/10 border border-[#C96F42]/20 text-[#C96F42] text-[12px] font-semibold tracking-[0.02em] mb-3">
              🎨 Problem-First Workflow
            </span>
            <h1 className="text-[28px] sm:text-[36px] font-semibold text-[#342A24] tracking-[-0.03em] leading-[1.15]">
              Tell us about your design
            </h1>
            <p className="mt-2 text-[15px] sm:text-[16px] text-[#7B6C60] leading-relaxed">
              Share your work and tell us what you want to improve. HumanAPI analyzes the visual artifact before matching you with a verified designer.
            </p>
          </div>

          <form onSubmit={handleSubmitIntake} className="space-y-8">
            {/* 1. DESIGN TYPE SELECTOR */}
            <div>
              <label className="block text-[14px] font-semibold text-[#342A24] mb-2.5">
                Design Type
              </label>
              <div className="flex flex-wrap gap-2.5">
                {DESIGN_TYPES.map(type => {
                  const isSelected = designType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDesignType(type)}
                      className={`px-4 py-2.5 rounded-[12px] text-[14px] font-medium transition-all duration-150 border ${
                        isSelected
                          ? "bg-[#C96F42] text-white border-[#C96F42] shadow-warm-xs"
                          : "bg-[#F6F0E7] text-[#342A24] border-[#E8DCCB] hover:border-[#C96F42]/40"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. PROBLEM DESCRIPTION TEXTAREA */}
            <div>
              <label className="block text-[14px] font-semibold text-[#342A24] mb-2">
                What's your problem?
              </label>
              <textarea
                value={problemDescription}
                onChange={e => setProblemDescription(e.target.value)}
                rows={4}
                placeholder="I don't like the visual hierarchy of my poster..."
                className="w-full px-4 py-3.5 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] placeholder-[#A09083] focus:outline-none focus:border-[#C96F42] focus:ring-2 focus:ring-[#C96F42]/20 text-[14px] leading-relaxed transition-all resize-y"
              />
            </div>

            {/* 3. UPLOAD DESIGN ARTIFACT DROPZONE */}
            <div>
              <label className="block text-[14px] font-semibold text-[#342A24] mb-2">
                Upload your design <span className="text-[12px] font-normal text-[#7B6C60]">(PNG, JPG, PDF up to 25MB)</span>
              </label>
              
              {file ? (
                <div className="relative rounded-[16px] border border-[#E8DCCB] bg-[#F6F0E7] p-4 flex flex-col sm:flex-row items-center gap-4">
                  {file.preview.startsWith("http") || file.preview.startsWith("blob") ? (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[12px] overflow-hidden bg-[#E8DCCB] flex-shrink-0 border border-[#D5C6B3]">
                      <img src={file.preview} alt="Design preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-[12px] bg-[#E8DCCB] flex items-center justify-center flex-shrink-0 text-[#7B6C60]">
                      <FileText size={32} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <p className="text-[14px] font-medium text-[#342A24] truncate">{file.name}</p>
                    <p className="text-[12px] text-[#7B6C60] mt-0.5">{file.size} • Ready for visual analysis</p>
                    <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
                      <label className="text-[13px] font-medium text-[#C96F42] hover:underline cursor-pointer">
                        Replace File
                        <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-[13px] font-medium text-[#9E3B2D] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-[16px] p-8 text-center transition-all ${
                    dragActive ? "border-[#C96F42] bg-[#C96F42]/5" : "border-[#E8DCCB] bg-[#F6F0E7] hover:border-[#C96F42]/40"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#FFF9F2] border border-[#E8DCCB] flex items-center justify-center mx-auto mb-3 text-[#C96F42]">
                    <Upload size={22} />
                  </div>
                  <p className="text-[14px] font-semibold text-[#342A24]">
                    Drag and drop your design file here
                  </p>
                  <p className="text-[13px] text-[#7B6C60] mt-1">or browse files from your device</p>
                  <label className="mt-4 inline-flex items-center justify-center h-[38px] px-5 rounded-[10px] bg-[#342A24] hover:bg-[#251E19] text-[#FFFCF7] text-[13px] font-medium cursor-pointer transition-all">
                    Choose File
                    <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            {/* 4. FEEDBACK TYPE MULTI-SELECT */}
            <div>
              <label className="block text-[14px] font-semibold text-[#342A24] mb-2">
                What do you want? <span className="text-[12px] font-normal text-[#7B6C60]">(Select all that apply)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {FEEDBACK_OPTIONS.map(option => {
                  const isChecked = selectedFeedback.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-3.5 rounded-[14px] border cursor-pointer transition-all select-none ${
                        isChecked
                          ? "bg-[#FFF9F2] border-[#C96F42] shadow-warm-xs"
                          : "bg-[#F6F0E7] border-[#E8DCCB] hover:border-[#C96F42]/30"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleFeedback(option)}
                        className="w-4 h-4 rounded text-[#C96F42] focus:ring-[#C96F42] border-[#E8DCCB] accent-[#C96F42]"
                      />
                      <span className="text-[13px] font-medium text-[#342A24]">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-[#E8DCCB] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[13px] text-[#7B6C60] text-center sm:text-left">
                ⚡ Takes ~10 seconds. Generates preliminary visual audit before expert review.
              </p>
              <HumanAPILoadingButton
                type="submit"
                isLoading={isSubmitting}
                className="w-full sm:w-auto h-[48px] px-8 rounded-[12px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFFCF7] text-[15px] font-medium transition-all shadow-warm-sm flex items-center justify-center gap-2"
              >
                <span>Find My Design Expert</span>
                <ArrowRight size={18} />
              </HumanAPILoadingButton>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: ANALYZING LOADING STATE */}
      {step === "analyzing" && (
        <div className="bg-[#FFF9F2] border border-[#E8DCCB] rounded-[24px] p-12 text-center shadow-warm-lg max-w-[640px] mx-auto min-h-[420px] flex flex-col items-center justify-center">
          <HumanAPILoader size="lg" caption="Analyzing your design structure..." />
          <p className="mt-4 text-[14px] text-[#7B6C60] max-w-[380px] mx-auto">
            Evaluating visual hierarchy, typography scale, color contrast, and layout balance for targeted expert matching.
          </p>
        </div>
      )}

      {/* STEP 3: ANALYSIS RESULTS & MATCHED EXPERTS */}
      {step === "results" && (
        <div className="space-y-8">
          {/* VISUAL ANALYSIS SUMMARY CARD */}
          <div className="bg-[#FFF9F2] border border-[#E8DCCB] rounded-[24px] p-6 sm:p-8 shadow-warm-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DCCB]">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C96F42]/10 text-[#C96F42] text-[12px] font-semibold">
                  <Sparkles size={14} /> Design Analysis Complete
                </span>
                <h2 className="text-[24px] font-semibold text-[#342A24] mt-2">
                  Preliminary Design Breakdown
                </h2>
                <p className="text-[14px] text-[#7B6C60] mt-0.5">
                  Artifact: <strong className="text-[#342A24]">{file?.name || "Uploaded Design"}</strong> • Type: {designType}
                </p>
              </div>

              <button
                onClick={() => setStep("intake")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-[#E8DCCB] bg-[#F6F0E7] text-[#342A24] text-[13px] font-medium hover:bg-[#FFF9F2] transition-colors self-start sm:self-auto"
              >
                <RefreshCw size={14} /> Edit Intake
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-[16px] bg-[#F6F0E7] border border-[#E8DCCB]">
                <div className="flex items-center gap-2 text-[#C96F42] text-[13px] font-semibold mb-1.5">
                  <Layers size={16} /> Visual Hierarchy
                </div>
                <p className="text-[13px] text-[#7B6C60] leading-relaxed">
                  Primary headline dominance is clear, but secondary callouts lack focal separation from body text.
                </p>
              </div>

              <div className="p-4 rounded-[16px] bg-[#F6F0E7] border border-[#E8DCCB]">
                <div className="flex items-center gap-2 text-[#C96F42] text-[13px] font-semibold mb-1.5">
                  <Type size={16} /> Typography
                </div>
                <p className="text-[13px] text-[#7B6C60] leading-relaxed">
                  Font scale ratio is well aligned; recommendation for minor tracking adjust on small labels.
                </p>
              </div>

              <div className="p-4 rounded-[16px] bg-[#F6F0E7] border border-[#E8DCCB]">
                <div className="flex items-center gap-2 text-[#C96F42] text-[13px] font-semibold mb-1.5">
                  <Palette size={16} /> Color & Contrast
                </div>
                <p className="text-[13px] text-[#7B6C60] leading-relaxed">
                  WCAG contrast passes AAA; background warm tone creates strong visual harmony.
                </p>
              </div>
            </div>
          </div>

          {/* MATCHED EXPERTS SECTION */}
          <div>
            <div className="mb-6">
              <h2 className="text-[24px] font-semibold text-[#342A24] tracking-[-0.02em]">
                Matched Design Experts
              </h2>
              <p className="text-[14px] text-[#7B6C60] mt-1">
                These verified specialists match the visual critique and layout improvements requested for your {designType}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designExperts.map(expert => (
                <div
                  key={expert.id}
                  className="bg-[#FFF9F2] border border-[#E8DCCB] rounded-[20px] p-6 shadow-warm-sm flex flex-col justify-between hover:shadow-warm-md transition-all duration-200"
                >
                  <div>
                    {/* EXPERT AVATAR & HEADER */}
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        className="w-14 h-14 rounded-full object-cover border border-[#E8DCCB]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-[#342A24] text-[16px] truncate">{expert.name}</h3>
                          {expert.isVerified && (
                            <ShieldCheck size={16} className="text-[#C96F42] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[13px] text-[#7B6C60] truncate">{expert.headline}</p>
                        <div className="flex items-center gap-2 mt-1 text-[12px] text-[#7B6C60]">
                          <span className="flex items-center gap-1 text-[#342A24] font-medium">
                            <Star size={13} className="fill-[#C96F42] text-[#C96F42]" />
                            {expert.rating} ({expert.reviewCount})
                          </span>
                          <span>•</span>
                          <span>{expert.experienceYears} yrs exp</span>
                        </div>
                      </div>
                    </div>

                    {/* MATCH REASON BADGE */}
                    <div className="p-3 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] mb-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C96F42] mb-1">
                        Matched for your design
                      </p>
                      <p className="text-[12px] text-[#342A24]">
                        Specializes in {expert.skills.slice(0, 3).join(", ")} & live layout teardowns.
                      </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="pt-4 border-t border-[#E8DCCB] flex items-center gap-2.5">
                    <button
                      onClick={() => openBookingModal(expert, 10)}
                      className="flex-1 h-[42px] px-4 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFFCF7] text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Clock size={15} />
                      <span>Book 10 min (₹{expert.pricing.duration10})</span>
                    </button>
                    <button
                      onClick={() => navigate("expert-detail", { expertId: expert.id })}
                      className="h-[42px] px-3.5 rounded-[10px] border border-[#E8DCCB] bg-[#F6F0E7] hover:bg-[#FFF9F2] text-[#342A24] text-[13px] font-medium transition-colors"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignIntakeFlow;
