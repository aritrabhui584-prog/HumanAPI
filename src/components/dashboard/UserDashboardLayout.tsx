import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { getUserDisplayName, getUserAvatarUrl } from "../../lib/userUtils";
import { HumanAPILogo } from "../brand/HumanAPILogo";
import { MobileNavigationDrawer } from "../common/MobileNavigationDrawer";
import {
  Compass,
  Sparkles,
  Users,
  Calendar,
  CreditCard,
  FolderOpen,
  SlidersHorizontal,
  ShieldCheck,
  LogOut,
  Layers,
  Lock,
  Menu
} from "lucide-react";

export const UserDashboardLayout: React.FC<{
  activeTab: string;
  children: React.ReactNode;
}> = ({ activeTab, children }) => {
  const { navigate, currentUser, currentRole, switchRole, logout, openAuthModal, openAccreditationModal } = useApp();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const menuItems = [
    { id: "user-dashboard", label: "Overview", icon: Compass },
    { id: "user-ask", label: "Ask HumanAPI", icon: Sparkles, badge: "AI" },
    { id: "experts", label: "Browse Specialists", icon: Users },
    { id: "user-history", label: "Session History", icon: Calendar },
    { id: "user-payments", label: "Payments & Billing", icon: CreditCard },
    { id: "user-projects", label: "My Projects", icon: FolderOpen },
    { id: "user-integrations", label: "Integrations", icon: Layers },
    { id: "user-settings", label: "Settings", icon: SlidersHorizontal },
  ];

  const currentItem = menuItems.find(item => item.id === activeTab) || menuItems[0];
  const ActiveIcon = currentItem.icon;

  // AUTHENTICATION GUARD
  if (!currentUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-md text-center space-y-4">
          <div className="w-12 h-12 rounded-[12px] bg-[#C96F42]/10 text-[#C96F42] flex items-center justify-center mx-auto">
            <Lock size={24} />
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#342A24]">
            Authentication Required
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#7B6C60] leading-relaxed">
            Please sign in to access your client consultation workspace, session history, and active project materials.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => openAuthModal("login")}
              className="px-5 py-2.5 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-semibold shadow-warm-xs transition-colors"
            >
              Sign In to Account
            </button>
            <button
              onClick={() => navigate("home")}
              className="px-4 py-2.5 rounded-[10px] border border-[#E8DCCB] bg-[#F6F0E7] text-xs font-semibold text-[#342A24] transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userDisplayName = getUserDisplayName(currentUser);

  return (
    <div className="client-app-container flex-1 min-h-0 bg-[#F6F0E7] flex flex-col md:flex-row text-[#342A24] md:overflow-hidden relative">
      {/* MOBILE TOP NAVIGATION BAR (Visible strictly on < 768px) */}
      <div className="md:hidden bg-[#FFF9F2] border-b border-[#E8DCCB] px-4 py-2.5 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-2 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] hover:bg-[#C96F42]/10 hover:text-[#C96F42] transition-colors"
            aria-label="Open workspace menu"
            id="mobile-workspace-menu-btn"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <ActiveIcon size={16} className="text-[#C96F42] shrink-0" />
            <span className="font-bold text-xs text-[#342A24] truncate">
              {currentItem.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-[#C96F42] bg-[#C96F42]/10 px-2 py-0.5 rounded-full border border-[#C96F42]/20">
            Client
          </span>
          <img
            src={getUserAvatarUrl(currentUser)}
            alt={userDisplayName}
            className="w-7 h-7 rounded-[8px] object-cover border border-[#E8DCCB]"
          />
        </div>
      </div>

      {/* PORTAL-BASED MOBILE NAVIGATION DRAWER (Renders overlay cleanly to document.body) */}
      <MobileNavigationDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeTab={activeTab}
      />

      {/* DESKTOP & TABLET SIDEBAR (Hidden on mobile < 768px, visible on md+) */}
      <aside className="client-app-sidebar hidden md:flex w-56 sm:w-60 lg:w-64 bg-[#FFF9F2] border-r border-[#E8DCCB] flex-col shrink-0 min-h-0 h-full overflow-y-auto">
        {/* User Card */}
        <div className="p-5 border-b border-[#E8DCCB] shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={getUserAvatarUrl(currentUser)}
              alt={userDisplayName}
              className="w-11 h-11 rounded-[12px] object-cover border border-[#E8DCCB]"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-serif font-bold text-sm text-[#342A24] truncate">
                {userDisplayName}
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C96F42] bg-[#C96F42]/10 px-2 py-0.5 rounded-full border border-[#C96F42]/20">
                Client Workspace
              </span>
            </div>
          </div>

          {/* Quick role toggle */}
          {(currentUser.expertStatus === "APPROVED" || (currentUser.isExpert && !currentUser.expertStatus)) && (
            <div className="p-1 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] flex text-xs font-semibold">
              <button
                onClick={() => switchRole("user")}
                className={`flex-1 py-1 rounded-[8px] transition-all ${
                  currentRole === "user"
                    ? "bg-[#C96F42] text-[#FFF9F2] shadow-warm-xs"
                    : "text-[#7B6C60]"
                }`}
              >
                Client
              </button>
              <button
                onClick={() => switchRole("expert")}
                className="flex-1 py-1 rounded-[8px] text-[#7B6C60] hover:text-[#342A24] transition-all"
              >
                Expert
              </button>
            </div>
          )}
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#C96F42] text-[#FFF9F2] shadow-warm-xs"
                    : "text-[#7B6C60] hover:text-[#342A24] hover:bg-[#F6F0E7]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? "text-[#FFF9F2]" : "text-[#7B6C60]"} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-[#FFF9F2] text-[#C96F42]" : "bg-[#C96F42]/15 text-[#C96F42]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#E8DCCB]/60">
            <button
              onClick={() => openAccreditationModal()}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-xs font-bold text-[#77816C] hover:bg-[#77816C]/10 transition-colors"
              id="sidebar-become-expert-btn"
            >
              <ShieldCheck size={16} />
              <span>{currentUser.expertStatus === "APPROVED" ? "Accreditation Status" : "🔒 Become an Expert"}</span>
            </button>
          </div>
        </nav>

        {/* Bottom sign out */}
        <div className="p-4 border-t border-[#E8DCCB] shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-semibold text-[#B85D3D] hover:bg-[#B85D3D]/10 transition-colors"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="client-app-main flex-1 min-h-0 min-w-0 p-4 sm:p-6 lg:p-8 pb-8 sm:pb-10 overflow-y-auto scroll-region">
        {children}
      </main>
    </div>
  );
};

export default UserDashboardLayout;
