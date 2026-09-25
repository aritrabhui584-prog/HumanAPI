import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { Search, AlertTriangle, ShieldCheck, CheckCircle2, Lock, X, SlidersHorizontal, User, UserX } from "lucide-react";

export const AdminUsersView: React.FC = () => {
  const { banUser, unbanUser, restrictUser, bans, auditLogs } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock platform users roster
  const [userList, setUserList] = useState([
    {
      id: "usr-101",
      name: "Aritra Bhui",
      email: "aritra@developer.io",
      role: "user",
      status: "active",
      sessionsCompleted: 14,
      totalSpent: 4200,
      createdAt: "2026-01-15"
    },
    {
      id: "usr-102",
      name: "Sarah Jenkins",
      email: "sarah@startup.io",
      role: "user",
      status: "active",
      sessionsCompleted: 8,
      totalSpent: 2800,
      createdAt: "2026-02-10"
    },
    {
      id: "usr-103",
      name: "Michael Chen",
      email: "michael@dev.org",
      role: "user",
      status: "restricted",
      sessionsCompleted: 3,
      totalSpent: 899,
      createdAt: "2026-03-01"
    },
    {
      id: "usr-spammer-88",
      name: "Spam Account",
      email: "badactor@example.com",
      role: "user",
      status: "banned",
      sessionsCompleted: 0,
      totalSpent: 0,
      createdAt: "2026-09-20"
    }
  ]);

  // Ban Modal State
  const [selectedUserForBan, setSelectedUserForBan] = useState<any | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState<"7_days" | "30_days" | "permanent">("permanent");
  const [banInternalNote, setBanInternalNote] = useState("");

  // Unban Modal State
  const [selectedBanForUnban, setSelectedBanForUnban] = useState<any | null>(null);
  const [unbanReason, setUnbanReason] = useState("");

  const handleOpenBanModal = (u: any) => {
    setSelectedUserForBan(u);
    setBanReason("");
    setBanDuration("permanent");
    setBanInternalNote("");
  };

  const handleConfirmBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForBan || !banReason.trim()) return;

    banUser(
      selectedUserForBan.id,
      selectedUserForBan.name,
      selectedUserForBan.email,
      banReason,
      banDuration,
      banInternalNote
    );

    setUserList(prev =>
      prev.map(u => (u.id === selectedUserForBan.id ? { ...u, status: "banned" } : u))
    );
    setSelectedUserForBan(null);
  };

  const handleConfirmUnban = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBanForUnban || !unbanReason.trim()) return;

    unbanUser(selectedBanForUnban.id, unbanReason);
    setUserList(prev =>
      prev.map(u => (u.id === selectedBanForUnban.userId ? { ...u, status: "active" } : u))
    );
    setSelectedBanForUnban(null);
  };

  const filteredUsers = userList.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans text-[#342A24]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
            User Account Management
          </h1>
          <p className="text-xs text-[#7B6C60] mt-1">
            Inspect platform client accounts, manage restrictions, enforcement policies, and moderation bans.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by User Name, Email, or User ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#C96F42]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#7B6C60] font-semibold shrink-0">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs font-semibold text-[#342A24] focus:outline-none focus:border-[#C96F42]"
          >
            <option value="all">All Accounts</option>
            <option value="active">Active Only</option>
            <option value="restricted">Restricted Only</option>
            <option value="banned">Banned Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#342A24]">
            <thead className="bg-[#F6F0E7] border-b border-[#E8DCCB] text-[11px] font-bold text-[#7B6C60] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Account ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Sessions</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCCB]/60 font-sans">
              {filteredUsers.map(u => {
                const activeBan = bans.find(b => b.userId === u.id && b.status === "active");
                return (
                  <tr key={u.id} className="hover:bg-[#F6F0E7]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#342A24]">{u.name}</div>
                      <div className="text-[11px] text-[#7B6C60]">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#7B6C60]">{u.id}</td>
                    <td className="py-3.5 px-4">
                      {u.status === "active" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#77816C]/15 text-[#77816C]">
                          Active
                        </span>
                      )}
                      {u.status === "restricted" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B89152]/15 text-[#B89152]">
                          Restricted
                        </span>
                      )}
                      {u.status === "banned" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B85D3D]/15 text-[#B85D3D]">
                          Banned
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold">{u.sessionsCompleted}</td>
                    <td className="py-3.5 px-4 font-semibold">₹{u.totalSpent.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-[#7B6C60]">{u.createdAt}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {u.status === "banned" ? (
                        <button
                          onClick={() => setSelectedBanForUnban(activeBan || { id: "ban-101", userId: u.id, userName: u.name })}
                          className="px-2.5 py-1 rounded-[8px] bg-[#77816C] hover:bg-[#66705B] text-[#FFF9F2] text-[11px] font-bold shadow-warm-xs"
                        >
                          Unban Account
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenBanModal(u)}
                          className="px-2.5 py-1 rounded-[8px] bg-[#B85D3D] hover:bg-[#A34C2D] text-[#FFF9F2] text-[11px] font-bold shadow-warm-xs"
                          id={`ban-btn-${u.id}`}
                        >
                          Ban User
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BAN USER MODAL */}
      {selectedUserForBan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342A24]/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
              <div className="flex items-center gap-2 text-[#B85D3D]">
                <UserX size={20} />
                <h3 className="font-serif font-bold text-lg text-[#342A24]">Ban User Account</h3>
              </div>
              <button onClick={() => setSelectedUserForBan(null)} className="p-1 rounded text-[#7B6C60] hover:text-[#342A24]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmBan} className="space-y-4 text-xs">
              <div className="p-3 rounded-[10px] bg-[#F6F0E7] space-y-1">
                <p className="font-bold text-[#342A24]">{selectedUserForBan.name}</p>
                <p className="text-[11px] text-[#7B6C60]">{selectedUserForBan.email} ({selectedUserForBan.id})</p>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#342A24]">Reason for Ban *</label>
                <input
                  type="text"
                  required
                  value={banReason}
                  onChange={e => setBanReason(e.target.value)}
                  placeholder="e.g. Policy violation / abusive session conduct"
                  className="w-full px-3 py-2 rounded-[8px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#B85D3D]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#342A24]">Ban Duration</label>
                <select
                  value={banDuration}
                  onChange={e => setBanDuration(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-[8px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#B85D3D]"
                >
                  <option value="7_days">7 Days Temporary Suspension</option>
                  <option value="30_days">30 Days Suspension</option>
                  <option value="permanent">Permanent Account Ban</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#342A24]">Internal Administrative Note</label>
                <textarea
                  rows={2}
                  value={banInternalNote}
                  onChange={e => setBanInternalNote(e.target.value)}
                  placeholder="Internal details for compliance & audit records..."
                  className="w-full px-3 py-2 rounded-[8px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#B85D3D]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForBan(null)}
                  className="w-1/2 py-2.5 rounded-[10px] border border-[#E8DCCB] text-xs font-semibold text-[#342A24]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-[10px] bg-[#B85D3D] hover:bg-[#A34C2D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs"
                  id="confirm-ban-btn"
                >
                  Confirm Ban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UNBAN USER MODAL */}
      {selectedBanForUnban && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342A24]/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
              <div className="flex items-center gap-2 text-[#77816C]">
                <ShieldCheck size={20} />
                <h3 className="font-serif font-bold text-lg text-[#342A24]">Unban User Account</h3>
              </div>
              <button onClick={() => setSelectedBanForUnban(null)} className="p-1 rounded text-[#7B6C60] hover:text-[#342A24]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmUnban} className="space-y-4 text-xs">
              <div className="p-3 rounded-[10px] bg-[#F6F0E7] space-y-1">
                <p className="font-bold text-[#342A24]">{selectedBanForUnban.userName || "Target User"}</p>
                <p className="text-[11px] text-[#7B6C60]">Account is currently banned</p>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#342A24]">Unban Justification / Reason *</label>
                <input
                  type="text"
                  required
                  value={unbanReason}
                  onChange={e => setUnbanReason(e.target.value)}
                  placeholder="e.g. Appeal approved after secondary review"
                  className="w-full px-3 py-2 rounded-[8px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] focus:outline-none focus:border-[#77816C]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBanForUnban(null)}
                  className="w-1/2 py-2.5 rounded-[10px] border border-[#E8DCCB] text-xs font-semibold text-[#342A24]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-[10px] bg-[#77816C] hover:bg-[#66705B] text-[#FFF9F2] text-xs font-bold shadow-warm-xs"
                >
                  Confirm Unban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
