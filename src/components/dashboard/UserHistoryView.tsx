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
  Receipt
} from "lucide-react";

import { SessionHistorySkeleton } from "../loading";

export const UserHistoryView: React.FC = () => {
  const { bookings, experts, navigate, showNotification, openReviewModal, isRefreshing } = useApp();
  const [selectedBookingNotes, setSelectedBookingNotes] = useState<string | null>(null);

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
                      <span className="text-[#77816C] font-semibold">Triage complete · Bug resolved</span>
                    </div>
                    {isCompleted && (
                      <button
                        onClick={() => openReviewModal(b)}
                        className="mt-2 text-left text-[11px] font-bold text-[#C96F42] hover:underline flex items-center gap-1"
                      >
                        <span>Leave Review</span>
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
