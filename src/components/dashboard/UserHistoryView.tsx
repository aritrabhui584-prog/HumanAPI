import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { RatingStars, VerificationBadge } from "../common/Badge";
import {
  Calendar,
  Clock,
  Download,
  FileText,
  Star,
  CheckCircle2,
  Video,
  ArrowRight,
  ExternalLink,
  Receipt,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  X,
  UserCheck
} from "lucide-react";

import { SessionHistorySkeleton } from "../loading";

export const UserHistoryView: React.FC = () => {
  const { bookings, experts, navigate, showNotification, openReviewModal, openBookingModal, isRefreshing } = useApp();
  const [selectedBookingNotes, setSelectedBookingNotes] = useState<string | null>(null);

  // Demo Unresolved Session State
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoReport, setDemoReport] = useState<any | null>(null);

  if (isRefreshing) {
    return <SessionHistorySkeleton />;
  }

  const handleDownloadInvoice = (bId: string, amount: number) => {
    const text = `HUMANAPI OFFICIAL CONSULTATION RECEIPT\nReceipt ID: RCP-${bId}\nDate: ${new Date().toLocaleDateString()}\nStatus: PAID\nTotal: ₹${amount}\nPlatform: HumanAPI Inc.`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `humanapi-invoice-${bId}.txt`;
    a.click();
    showNotification("Official receipt downloaded.", "success");
  };

  const runUnresolvedDemoScenario = async () => {
    setIsDemoRunning(true);
    showNotification("Running Gemini LLM Dissatisfaction & Re-matching Engine...", "info");

    try {
      const res = await fetch("/api/gemini/rematch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "sess_demo_unresolved_101",
          previousExpertId: "exp-1",
          comment: "The previous consultant could not isolate the memory leak deadlock in our K8s worker thread within 10 minutes.",
          rating: 2,
          problemResolved: false
        })
      });

      if (!res.ok) {
        throw new Error("Failed to process re-matching");
      }

      const data = await res.json();
      setDemoReport(data.report);
      showNotification("Gemini LLM successfully generated dissatisfaction report and assigned new expert!", "success");
    } catch (err: any) {
      // Fallback demo report
      setDemoReport({
        reportId: `dissat_rpt_${Date.now()}`,
        previousExpertId: "exp-1",
        newExpertId: "exp-2",
        newExpertName: "Dr. Camille Laurent",
        dissatisfactionSummary: "Client experienced session timeout before worker thread deadlock could be isolated in Kubernetes environment.",
        unresolvedTopics: ["K8s Worker Mutex Contention", "Go Routine Leak Analysis"],
        remediationBrief: "Direct live heap profiling and mutex inspection. Skip initial introductory questions and jump directly to thread state logs.",
        suggestedFocusArea: "Thread Synchronization & Mutex Locking"
      });
      showNotification("Generated dissatisfaction & handoff report (fallback).", "info");
    } finally {
      setIsDemoRunning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#C96F42]">
          Consultation Records
        </span>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
          Past Consultations & Invoices
        </h1>
        <p className="text-xs sm:text-sm text-[#7B6C60]">
          Inspect your past diagnostic sprints, specialist notes, review scores, and downloadable receipts.
        </p>
      </div>

      {/* Demo Scenario Banner: Unresolved Consultation Workflow */}
      <div className="p-5 sm:p-6 rounded-[20px] bg-gradient-to-r from-[#FFF9F2] via-[#F6F0E7] to-[#FFF9F2] border border-[#C96F42]/30 shadow-warm-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C96F42]/10 border border-[#C96F42]/20 text-[11px] font-bold text-[#C96F42]">
            <Sparkles size={12} />
            <span>Interactive Demo Workflow</span>
          </div>
          <h3 className="font-serif font-bold text-base text-[#342A24]">
            Test Scenario: Unresolved Bug & Gemini Re-matching
          </h3>
          <p className="text-xs text-[#7B6C60] leading-relaxed max-w-xl">
            Simulate a past consultation where the client's bug was <strong>not resolved</strong>. The Gemini LLM analyzes feedback, generates a Dissatisfaction Report, and assigns a new specialist.
          </p>
        </div>

        <button
          onClick={runUnresolvedDemoScenario}
          disabled={isDemoRunning}
          className="px-4 py-2.5 rounded-[12px] bg-[#C96F42] hover:bg-[#B85D3D] disabled:opacity-50 text-[#FFF9F2] text-xs font-bold shadow-warm-xs transition-all shrink-0 flex items-center gap-2"
          id="demo-unresolved-scenario-btn"
        >
          {isDemoRunning ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              <span>Analyzing Feedback...</span>
            </>
          ) : (
            <>
              <AlertTriangle size={14} />
              <span>Trigger Unresolved Demo</span>
            </>
          )}
        </button>
      </div>

      {/* Demo Report Result Modal */}
      {demoReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1714]/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-[24px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB]">
              <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#342A24]">
                <Sparkles size={20} className="text-[#C96F42]" />
                <span>Gemini Dissatisfaction & Re-match Report</span>
              </div>
              <button
                onClick={() => setDemoReport(null)}
                className="p-1 rounded-full text-[#7B6C60] hover:bg-[#F6F0E7]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#B85D3D]/10 border border-[#B85D3D]/30 space-y-1 text-[#B85D3D]">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  <span>Previous Consultation Status: Unresolved</span>
                </p>
                <p className="text-[11px] opacity-90">{demoReport.dissatisfactionSummary}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F6F0E7] border border-[#E8DCCB] space-y-2">
                <p className="font-bold text-[#342A24]">Newly Assigned Expert</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#77816C]/20 text-[#77816C] font-bold flex items-center justify-center">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-sm text-[#342A24]">{demoReport.newExpertName}</p>
                    <p className="text-[11px] text-[#77816C]">Verified Senior Systems Architect</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-[#342A24]">Generated Handoff Brief for New Expert</p>
                <p className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#E8DCCB] text-[#7B6C60] font-sans leading-relaxed">
                  {demoReport.remediationBrief}
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-[#342A24]">Suggested Immediate Focus Area</p>
                <span className="inline-block px-3 py-1 rounded-lg bg-[#C96F42]/10 text-[#C96F42] font-semibold border border-[#C96F42]/30">
                  🎯 {demoReport.suggestedFocusArea}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8DCCB] flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => setDemoReport(null)}
                className="px-4 py-2.5 rounded-[12px] border border-[#E8DCCB] text-xs font-semibold text-[#7B6C60]"
              >
                Close Report
              </button>
              <button
                onClick={() => {
                  setDemoReport(null);
                  openBookingModal(experts.find(e => e.id === demoReport.newExpertId) || experts[1]);
                }}
                className="px-5 py-2.5 rounded-[12px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs flex items-center justify-center gap-1.5"
              >
                <span>Book Follow-up with {demoReport.newExpertName}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="p-12 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] text-center space-y-3 shadow-warm-xs">
          <Calendar size={28} className="mx-auto text-[#7B6C60]" />
          <h3 className="font-serif font-bold text-lg text-[#342A24]">No consultations booked yet</h3>
          <p className="text-xs text-[#7B6C60]">Find an accredited specialist to unblock your current project in 5, 10, or 15 minutes.</p>
          <button
            onClick={() => navigate("experts")}
            className="px-5 py-2.5 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold transition-colors"
          >
            Browse Specialists
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => {
            const isCompleted = b.status === "completed";
            return (
              <div
                key={b.id}
                className="p-5 sm:p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-4 transition-all hover:border-[#C96F42]/30"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DCCB]/80 pb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={b.expertAvatar}
                      alt={b.expertName}
                      className="w-12 h-12 rounded-[14px] object-cover border border-[#E8DCCB] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-base text-[#342A24]">
                          {b.expertName}
                        </h3>
                        <VerificationBadge size="sm" />
                      </div>
                      <p className="text-xs text-[#7B6C60] mt-0.5">
                        {b.scheduledTime} · {b.duration}-minute sprint (₹{b.price})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        isCompleted
                          ? "bg-[#77816C]/15 text-[#77816C] border border-[#77816C]/30"
                          : "bg-[#C96F42]/15 text-[#C96F42] border border-[#C96F42]/30"
                      }`}
                    >
                      {isCompleted ? "Completed" : "Scheduled"}
                    </span>
                    <button
                      onClick={() => handleDownloadInvoice(b.id, b.price)}
                      className="p-2 rounded-[9px] border border-[#E8DCCB] bg-[#F6F0E7] text-[#7B6C60] hover:text-[#342A24] transition-colors"
                      title="Download Official Receipt"
                    >
                      <Receipt size={16} />
                    </button>
                  </div>
                </div>

                {/* Consultation Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB]/80">
                    <span className="font-bold text-[#342A24] block mb-1">Diagnostic Topic</span>
                    <p className="text-[#7B6C60] line-clamp-2">{b.topic}</p>
                  </div>

                  <div className="p-3 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB]/80">
                    <span className="font-bold text-[#342A24] block mb-1">Sprint Summary</span>
                    <p className="text-[#7B6C60] line-clamp-2">
                      {b.review || "Architect recommended isolated WebRTC loopback test and state tree audit."}
                    </p>
                  </div>

                  <div className="p-3 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB]/80 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-[#342A24] block mb-1">Session Outcome</span>
                      <span className="text-[#77816C] font-semibold">Triage complete</span>
                    </div>
                    {isCompleted && (
                      <button
                        onClick={() => openReviewModal(b)}
                        className="mt-2 text-left text-[11px] font-bold text-[#C96F42] hover:underline flex items-center gap-1"
                      >
                        <span>Leave Review & Outcome</span>
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
