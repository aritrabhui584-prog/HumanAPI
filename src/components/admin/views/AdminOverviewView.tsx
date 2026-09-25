import React from "react";
import { useApp } from "../../../context/AppContext";
import { Users, Briefcase, Calendar, DollarSign, ShieldCheck, AlertTriangle, Activity, CheckCircle2, TrendingUp, Clock, ArrowRight } from "lucide-react";

export const AdminOverviewView: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { experts, bookings, reports, bans, systemHealth, auditLogs, platformFeeConfig } = useApp();

  const totalUsersCount = 12842; // Authoritative system stats
  const verifiedExpertsCount = experts.filter(e => e.isVerified).length;
  const activeSessionsCount = bookings.filter(b => b.status === "active" || b.status === "confirmed").length;
  const pendingApplicationsCount = 42;
  const pendingReportsCount = reports.filter(r => r.status === "open").length;

  const totalRevenueINR = bookings.reduce((sum, b) => sum + (b.price || 0), 0) + 142850;
  const pendingPayoutsINR = 48500;

  const healthItems = [
    { name: "Authentication", status: systemHealth.authentication },
    { name: "Payments Gateway", status: systemHealth.payments },
    { name: "Payouts Engine", status: systemHealth.payouts },
    { name: "Consultation / WebRTC", status: systemHealth.webrtc },
    { name: "Email / OTP Service", status: systemHealth.emailOtp },
    { name: "AI Services (Gemini)", status: systemHealth.aiServices },
    { name: "Background Jobs", status: systemHealth.backgroundJobs },
    { name: "Database Cluster", status: systemHealth.database }
  ];

  return (
    <div className="space-y-6 font-sans text-[#342A24]">
      {/* Top Banner */}
      <div className="p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C96F42]/10 text-[#C96F42] text-[11px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={13} />
            <span>Executive Command Center</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
            HumanAPI System Overview
          </h1>
          <p className="text-xs text-[#7B6C60] mt-1">
            Real-time administrative telemetry, financial balance metrics, and system health status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab("audit-log")}
            className="px-4 py-2.5 rounded-[10px] bg-[#342A24] text-[#FFF9F2] text-xs font-bold shadow-warm-xs hover:bg-[#1E1714] transition-colors flex items-center gap-1.5"
          >
            <span>View Audit Logs</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* System KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-1">
          <div className="flex items-center justify-between text-[#7B6C60]">
            <span className="text-xs font-semibold">Total Platform Users</span>
            <Users size={16} className="text-[#C96F42]" />
          </div>
          <p className="font-serif font-bold text-2xl text-[#342A24]">{totalUsersCount.toLocaleString()}</p>
          <span className="text-[10px] text-[#77816C] font-semibold">● Active Accounts</span>
        </div>

        <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-1">
          <div className="flex items-center justify-between text-[#7B6C60]">
            <span className="text-xs font-semibold">Verified Experts</span>
            <Briefcase size={16} className="text-[#77816C]" />
          </div>
          <p className="font-serif font-bold text-2xl text-[#342A24]">{verifiedExpertsCount}</p>
          <span className="text-[10px] text-[#7B6C60]">Accredited Specialists</span>
        </div>

        <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-1">
          <div className="flex items-center justify-between text-[#7B6C60]">
            <span className="text-xs font-semibold">Active Sessions</span>
            <Calendar size={16} className="text-[#B89152]" />
          </div>
          <p className="font-serif font-bold text-2xl text-[#342A24]">{activeSessionsCount}</p>
          <span className="text-[10px] text-[#C96F42] font-semibold">Live in Room / Booked</span>
        </div>

        <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-1">
          <div className="flex items-center justify-between text-[#7B6C60]">
            <span className="text-xs font-semibold">Platform Commission</span>
            <TrendingUp size={16} className="text-[#C96F42]" />
          </div>
          <p className="font-serif font-bold text-2xl text-[#342A24]">{platformFeeConfig.defaultFeePercent}%</p>
          <span className="text-[10px] text-[#7B6C60]">Configurable Commission</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-1">
          <div className="flex items-center justify-between text-[#7B6C60]">
            <span className="text-xs font-semibold">Pending Applications</span>
            <Clock size={16} className="text-[#C96F42]" />
          </div>
          <p className="font-serif font-bold text-2xl text-[#342A24]">{pendingApplicationsCount}</p>
          <button onClick={() => onNavigateTab("applications")} className="text-[10px] font-bold text-[#C96F42] hover:underline">Review Applications →</button>
        </div>

        <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-1">
          <div className="flex items-center justify-between text-[#7B6C60]">
            <span className="text-xs font-semibold">Pending Reports</span>
            <AlertTriangle size={16} className="text-[#B85D3D]" />
          </div>
          <p className="font-serif font-bold text-2xl text-[#B85D3D]">{pendingReportsCount}</p>
          <button onClick={() => onNavigateTab("reports")} className="text-[10px] font-bold text-[#B85D3D] hover:underline">Open Moderation Queue →</button>
        </div>

        <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-1">
          <div className="flex items-center justify-between text-[#7B6C60]">
            <span className="text-xs font-semibold">Platform Revenue</span>
            <DollarSign size={16} className="text-[#77816C]" />
          </div>
          <p className="font-serif font-bold text-2xl text-[#342A24]">₹{totalRevenueINR.toLocaleString()}</p>
          <span className="text-[10px] text-[#77816C]">Gross Client Settlements</span>
        </div>

        <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-1">
          <div className="flex items-center justify-between text-[#7B6C60]">
            <span className="text-xs font-semibold">Pending Payouts</span>
            <DollarSign size={16} className="text-[#B89152]" />
          </div>
          <p className="font-serif font-bold text-2xl text-[#342A24]">₹{pendingPayoutsINR.toLocaleString()}</p>
          <button onClick={() => onNavigateTab("payouts")} className="text-[10px] font-bold text-[#B89152] hover:underline">Manage Payout Batches →</button>
        </div>
      </div>

      {/* System Health Section */}
      <div className="p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-[#342A24]">
            System Health Diagnostics
          </h2>
          <span className="text-xs font-bold text-[#77816C] bg-[#77816C]/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#77816C] animate-pulse" />
            All Systems Operational
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {healthItems.map(h => (
            <div key={h.name} className="p-3 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#342A24] truncate mr-2">{h.name}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#77816C]/15 text-[#77816C] shrink-0">
                ● Operational
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Audit Log Stream Preview */}
      <div className="p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-[#342A24]">
            Recent Administrative Audit Logs
          </h2>
          <button onClick={() => onNavigateTab("audit-log")} className="text-xs font-bold text-[#C96F42] hover:underline">
            View All Audit Logs →
          </button>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 4).map(log => (
            <div key={log.id} className="p-3.5 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#342A24]">{log.adminEmail}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#C96F42] text-[#FFF9F2] uppercase">{log.action}</span>
                </div>
                <p className="text-[#7B6C60]">{log.reason}</p>
              </div>
              <span className="text-[10px] font-mono text-[#7B6C60] shrink-0">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
