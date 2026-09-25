import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { HumanAPILogo } from "../brand/HumanAPILogo";
import { Search, ShieldCheck, LogOut, Bell, Activity, Lock, Layers } from "lucide-react";

export const AdminHeader: React.FC<{ onMobileMenuToggle?: () => void }> = ({ onMobileMenuToggle }) => {
  const { adminUser, adminLogout, navigate, auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate("admin-users", { query: searchQuery });
  };

  return (
    <header className="h-[68px] bg-[#FFF9F2] border-b border-[#E8DCCB] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 shadow-warm-xs font-sans text-[#342A24]">
      {/* Brand & Administrative Scope Indicator */}
      <div className="flex items-center gap-4">
        <HumanAPILogo
          variant="navbar"
          alt="HumanAPI Admin"
          onClick={() => navigate("admin-overview")}
        />

        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-[8px] bg-[#342A24] text-[#FFF9F2] text-[11px] font-mono font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#77816C] animate-pulse" />
          <span>ADMIN CONTROL CENTER</span>
        </div>
      </div>

      {/* Global Admin Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <form onSubmit={handleSearchSubmit} className="w-full relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search User ID, Expert, Session #, Payment TXN..."
            className="w-full pl-9 pr-4 py-2 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs text-[#342A24] placeholder-[#7B6C60]/60 focus:outline-none focus:border-[#C96F42]"
          />
        </form>
      </div>

      {/* Right Controls & Admin User Badge */}
      <div className="flex items-center gap-3">
        {/* Environment Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-[#77816C]/10 border border-[#77816C]/20 text-[#77816C] text-[11px] font-bold">
          <Activity size={13} />
          <span>LIVE PROD NODE</span>
        </div>

        {/* Audit Count Indicator */}
        <button
          onClick={() => navigate("admin-audit-log")}
          className="p-2 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] hover:bg-[#FFF9F2] text-[#342A24] relative text-xs font-semibold flex items-center gap-1.5"
          title="Audit Log Stream"
        >
          <Bell size={16} className="text-[#C96F42]" />
          <span className="hidden sm:inline font-mono">{auditLogs.length} Audits</span>
        </button>

        {/* Admin Profile & Logout */}
        {adminUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-[#E8DCCB]">
            <img
              src={adminUser.avatar}
              alt={adminUser.name}
              className="w-8 h-8 rounded-[8px] object-cover border border-[#E8DCCB]"
            />
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-bold text-[#342A24]">{adminUser.name}</p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#C96F42] text-[#FFF9F2] uppercase">
                  {adminUser.role}
                </span>
              </div>
            </div>

            <button
              onClick={adminLogout}
              className="p-2 rounded-[10px] hover:bg-[#B85D3D]/10 text-[#B85D3D] transition-colors font-semibold text-xs flex items-center gap-1 ml-1"
              title="Sign Out of Admin Control Center"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
