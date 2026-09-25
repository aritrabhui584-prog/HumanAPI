import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { AlertTriangle, ShieldCheck, CheckCircle2, Search, X } from "lucide-react";

export const AdminReportsView: React.FC = () => {
  const { reports, resolveReport } = useApp();
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !resolutionNote.trim()) return;
    resolveReport(selectedReport.id, resolutionNote);
    setSelectedReport(null);
    setResolutionNote("");
  };

  return (
    <div className="space-y-6 font-sans text-[#342A24]">
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
          Moderation & Dispute Reports Queue
        </h1>
        <p className="text-xs text-[#7B6C60] mt-1">
          Review reported user accounts, consultation disputes, technical failures, and policy violations.
        </p>
      </div>

      <div className="rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#342A24]">
            <thead className="bg-[#F6F0E7] border-b border-[#E8DCCB] text-[11px] font-bold text-[#7B6C60] uppercase">
              <tr>
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Reporter</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCCB]/60">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-[#F6F0E7]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#C96F42]">{r.id}</td>
                  <td className="py-3.5 px-4 capitalize font-semibold">{r.type}</td>
                  <td className="py-3.5 px-4">{r.reporterName} ({r.reporterEmail})</td>
                  <td className="py-3.5 px-4 font-medium max-w-xs truncate">{r.subject}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      r.priority === "critical" || r.priority === "high"
                        ? "bg-[#B85D3D]/15 text-[#B85D3D]"
                        : "bg-[#B89152]/15 text-[#B89152]"
                    }`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#77816C]/15 text-[#77816C] capitalize">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {r.status !== "resolved" ? (
                      <button
                        onClick={() => setSelectedReport(r)}
                        className="px-2.5 py-1 rounded-[8px] bg-[#C96F42] text-[#FFF9F2] text-[11px] font-bold"
                      >
                        Investigate & Resolve
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-[#77816C]">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESOLVE MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342A24]/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#342A24]">Resolve Moderation Report</h3>
              <button onClick={() => setSelectedReport(null)} className="p-1 text-[#7B6C60] hover:text-[#342A24]"><X size={18} /></button>
            </div>

            <form onSubmit={handleResolve} className="space-y-4 text-xs">
              <div className="p-3 rounded-[10px] bg-[#F6F0E7] space-y-1">
                <p className="font-bold text-[#342A24]">{selectedReport.subject}</p>
                <p className="text-[11px] text-[#7B6C60]">{selectedReport.description}</p>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#342A24]">Resolution Outcome / Findings *</label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNote}
                  onChange={e => setResolutionNote(e.target.value)}
                  placeholder="Record moderation investigation conclusions..."
                  className="w-full px-3 py-2 rounded-[8px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setSelectedReport(null)} className="w-1/2 py-2.5 rounded-[10px] border border-[#E8DCCB] text-xs font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 rounded-[10px] bg-[#77816C] text-[#FFF9F2] text-xs font-bold shadow-warm-xs">Mark Resolved</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
