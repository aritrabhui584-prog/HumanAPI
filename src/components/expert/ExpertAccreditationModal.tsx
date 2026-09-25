import React from "react";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  ArrowRight,
  FileText,
  Brain,
  UserCheck,
  Lock
} from "lucide-react";
import { ExpertStatus } from "../../types";

export const ExpertAccreditationModal: React.FC = () => {
  const {
    isAccreditationModalOpen,
    closeAccreditationModal,
    currentUser,
    navigate,
    showNotification
  } = useApp();

  if (!isAccreditationModalOpen) return null;

  const rawStatus: ExpertStatus = currentUser?.expertStatus || (currentUser?.isExpert ? "APPROVED" : "NOT_EXPERT");

  const getStatusBadge = () => {
    switch (rawStatus) {
      case "APPROVED":
        return { label: "Accredited Expert", color: "bg-[#77816C]/10 text-[#77816C] border-[#77816C]/30", icon: CheckCircle2 };
      case "APPLICATION_STARTED":
        return { label: "Application In Progress", color: "bg-[#C96F42]/10 text-[#C96F42] border-[#C96F42]/30", icon: Clock };
      case "APPLICATION_SUBMITTED":
      case "ASSESSMENT_REQUIRED":
        return { label: "Assessment Required", color: "bg-[#B89152]/10 text-[#B89152] border-[#B89152]/30", icon: Brain };
      case "ASSESSMENT_IN_PROGRESS":
      case "ASSESSMENT_SUBMITTED":
      case "UNDER_REVIEW":
        return { label: "Under Review", color: "bg-[#B89152]/10 text-[#B89152] border-[#B89152]/30", icon: Clock };
      case "SUSPENDED":
      case "BANNED":
        return { label: "Account Restricted", color: "bg-[#B85D3D]/10 text-[#B85D3D] border-[#B85D3D]/30", icon: AlertTriangle };
      case "NOT_EXPERT":
      default:
        return { label: "Not Accredited", color: "bg-[#7B6C60]/10 text-[#7B6C60] border-[#7B6C60]/30", icon: Lock };
    }
  };

  const statusInfo = getStatusBadge();
  const StatusIcon = statusInfo.icon;

  const handleStartOrContinue = () => {
    closeAccreditationModal();
    if (rawStatus === "SUSPENDED" || rawStatus === "BANNED") {
      showNotification("Your expert privileges are restricted. Please contact support@humanapi.io.", "error");
      return;
    }
    navigate("become-expert");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1714]/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeAccreditationModal}
    >
      <div
        className="bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg rounded-[24px] max-w-lg w-full p-6 sm:p-8 relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="expert-accreditation-modal"
      >
        {/* Background Accent Pill */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C96F42]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Close X Button */}
        <button
          onClick={closeAccreditationModal}
          className="absolute top-5 right-5 p-2 rounded-[10px] text-[#7B6C60] hover:text-[#342A24] hover:bg-[#F6F0E7] transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-[14px] bg-[#C96F42]/10 border border-[#C96F42]/20 flex items-center justify-center shrink-0 text-[#C96F42]">
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}>
                <StatusIcon size={12} />
                {statusInfo.label}
              </span>
            </div>
            <h2 className="font-serif font-bold text-xl text-[#342A24]">
              Expert Accreditation Required
            </h2>
            <p className="text-xs text-[#7B6C60] mt-1 leading-relaxed">
              The Expert Workspace is exclusively reserved for verified, accredited practitioners on HumanAPI.
            </p>
          </div>
        </div>

        {/* Accreditation Steps Checklist */}
        <div className="space-y-3 mb-6 bg-[#F6F0E7]/60 p-4 rounded-[16px] border border-[#E8DCCB]/70">
          <p className="text-[11px] font-bold text-[#7B6C60] uppercase tracking-wider mb-2">
            HumanAPI Accreditation Path
          </p>

          {/* Step 1 */}
          <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#E8DCCB]/40">
            <div className="flex items-center gap-2.5 text-[#342A24]">
              <FileText size={15} className="text-[#C96F42]" />
              <span className="font-medium">1. Profile & Professional History</span>
            </div>
            {rawStatus !== "NOT_EXPERT" ? (
              <span className="text-[10px] font-bold text-[#77816C] bg-[#77816C]/10 px-2 py-0.5 rounded-full">Completed</span>
            ) : (
              <span className="text-[10px] font-bold text-[#7B6C60] bg-[#E8DCCB]/50 px-2 py-0.5 rounded-full">Pending</span>
            )}
          </div>

          {/* Step 2 */}
          <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#E8DCCB]/40">
            <div className="flex items-center gap-2.5 text-[#342A24]">
              <Award size={15} className="text-[#B89152]" />
              <span className="font-medium">2. Resume / CV & Work Sample Verification</span>
            </div>
            {["APPLICATION_SUBMITTED", "ASSESSMENT_REQUIRED", "ASSESSMENT_IN_PROGRESS", "ASSESSMENT_SUBMITTED", "UNDER_REVIEW", "APPROVED"].includes(rawStatus) ? (
              <span className="text-[10px] font-bold text-[#77816C] bg-[#77816C]/10 px-2 py-0.5 rounded-full">Completed</span>
            ) : (
              <span className="text-[10px] font-bold text-[#7B6C60] bg-[#E8DCCB]/50 px-2 py-0.5 rounded-full">Pending</span>
            )}
          </div>

          {/* Step 3 */}
          <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#E8DCCB]/40">
            <div className="flex items-center gap-2.5 text-[#342A24]">
              <Brain size={15} className="text-[#C96F42]" />
              <span className="font-medium">3. AI Competency & Consultation Rules Assessment</span>
            </div>
            {["ASSESSMENT_SUBMITTED", "UNDER_REVIEW", "APPROVED"].includes(rawStatus) ? (
              <span className="text-[10px] font-bold text-[#77816C] bg-[#77816C]/10 px-2 py-0.5 rounded-full">Passed</span>
            ) : rawStatus === "ASSESSMENT_IN_PROGRESS" || rawStatus === "ASSESSMENT_REQUIRED" ? (
              <span className="text-[10px] font-bold text-[#B89152] bg-[#B89152]/10 px-2 py-0.5 rounded-full">Action Required</span>
            ) : (
              <span className="text-[10px] font-bold text-[#7B6C60] bg-[#E8DCCB]/50 px-2 py-0.5 rounded-full">Locked</span>
            )}
          </div>

          {/* Step 4 */}
          <div className="flex items-center justify-between text-xs py-1.5">
            <div className="flex items-center gap-2.5 text-[#342A24]">
              <UserCheck size={15} className="text-[#77816C]" />
              <span className="font-medium">4. Board Review & Workspace Unlock</span>
            </div>
            {rawStatus === "APPROVED" ? (
              <span className="text-[10px] font-bold text-[#77816C] bg-[#77816C]/10 px-2 py-0.5 rounded-full">Unlocked</span>
            ) : rawStatus === "UNDER_REVIEW" ? (
              <span className="text-[10px] font-bold text-[#B89152] bg-[#B89152]/10 px-2 py-0.5 rounded-full">In Review</span>
            ) : (
              <span className="text-[10px] font-bold text-[#7B6C60] bg-[#E8DCCB]/50 px-2 py-0.5 rounded-full">Locked</span>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 justify-end">
          <button
            onClick={closeAccreditationModal}
            className="px-4 py-2.5 rounded-[12px] border border-[#E8DCCB] bg-[#FFF9F2] hover:bg-[#F6F0E7] text-xs font-semibold text-[#342A24] transition-colors order-2 sm:order-1"
          >
            Return to Client Workspace
          </button>
          <button
            onClick={handleStartOrContinue}
            className="px-5 py-2.5 rounded-[12px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-semibold shadow-warm-xs hover:shadow-warm-sm transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
            id="accreditation-modal-cta-btn"
          >
            <span>
              {rawStatus === "NOT_EXPERT"
                ? "Become an Expert"
                : rawStatus === "APPLICATION_STARTED"
                ? "Continue Application"
                : rawStatus === "APPLICATION_SUBMITTED" || rawStatus === "ASSESSMENT_REQUIRED"
                ? "Begin AI Assessment"
                : rawStatus === "UNDER_REVIEW"
                ? "View Application Status"
                : "View Status"}
            </span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
