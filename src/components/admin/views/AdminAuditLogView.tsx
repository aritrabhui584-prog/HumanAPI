import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { FileText, ShieldCheck, Search, Filter, Lock } from "lucide-react";

export const AdminAuditLogView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 font-sans text-[#342A24]">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#342A24] text-[#FFF9F2] text-[11px] font-mono font-bold tracking-wider mb-2">
          <Lock size={12} />
          <span>IMMUTABLE AUDIT LEDGER</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
          Administrative Security Audit Log
        </h1>
        <p className="text-xs text-[#7B6C60] mt-1">
          Cryptographically recorded administrative operations, ban actions, fee changes, and privilege modifications.
        </p>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by Admin Email, Action, Target ID, or Reason..."
            className="w-full pl-9 pr-4 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#C96F42]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#7B6C60] font-semibold shrink-0">Action Filter:</span>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs font-semibold text-[#342A24] focus:outline-none focus:border-[#C96F42]"
          >
            <option value="all">All Action Types</option>
            <option value="ADMIN_LOGIN">ADMIN_LOGIN</option>
            <option value="USER_BANNED">USER_BANNED</option>
            <option value="USER_UNBANNED">USER_UNBANNED</option>
            <option value="EXPERT_VERIFIED">EXPERT_VERIFIED</option>
            <option value="PLATFORM_FEE_CHANGED">PLATFORM_FEE_CHANGED</option>
            <option value="PAYOUT_RELEASED">PAYOUT_RELEASED</option>
            <option value="REFUND_ISSUED">REFUND_ISSUED</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#342A24]">
            <thead className="bg-[#F6F0E7] border-b border-[#E8DCCB] text-[11px] font-bold text-[#7B6C60] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCCB]/60 font-sans">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#F6F0E7]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#7B6C60]">{log.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#342A24]">{log.adminEmail}</div>
                    <span className="text-[10px] font-bold text-[#C96F42] uppercase">{log.adminRole}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-mono font-bold bg-[#342A24] text-[#FFF9F2]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <span className="text-[#7B6C60] uppercase text-[10px] font-bold mr-1">[{log.targetType}]</span>
                    <strong className="text-[#342A24]">{log.targetId}</strong>
                  </td>
                  <td className="py-3.5 px-4 text-[#7B6C60] max-w-sm truncate">{log.reason || "N/A"}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#7B6C60]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
