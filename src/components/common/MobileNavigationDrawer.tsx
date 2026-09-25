import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HumanAPILogo } from "../brand/HumanAPILogo";
import { useApp } from "../../context/AppContext";
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
  X,
  Briefcase
} from "lucide-react";

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
}

export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeTab = "user-dashboard"
}) => {
  const { navigate, currentUser, currentRole, switchRole, logout, openAuthModal } = useApp();

  // 1. BODY SCROLL LOCK MANAGEMENT
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.overflow = originalOverflow || "";
        document.body.style.touchAction = originalTouchAction || "";
      };
    }
  }, [isOpen]);

  // 2. KEYBOARD ACCESSIBILITY (ESCAPE TO CLOSE)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    badge?: string;
  }

  const authenticatedMenuItems: MenuItem[] = [
    { id: "user-dashboard", label: "Overview", icon: Compass },
    { id: "user-ask", label: "Ask HumanAPI", icon: Sparkles, badge: "AI" },
    { id: "experts", label: "Browse Specialists", icon: Users },
    { id: "user-history", label: "Session History", icon: Calendar },
    { id: "user-payments", label: "Payments & Billing", icon: CreditCard },
    { id: "user-projects", label: "My Projects", icon: FolderOpen },
    { id: "user-integrations", label: "Integrations", icon: Layers },
    { id: "user-settings", label: "Settings", icon: SlidersHorizontal },
  ];

  const publicMenuItems: MenuItem[] = [
    { id: "experts", label: "Find Experts", icon: Users },
    { id: "how-it-works", label: "How It Works", icon: Compass },
    { id: "use-cases", label: "Use Cases", icon: FolderOpen },
    { id: "pricing", label: "Pricing", icon: Layers },
    { id: "about", label: "About", icon: ShieldCheck },
    { id: "faq", label: "FAQ", icon: SlidersHorizontal },
  ];

  const handleNavClick = (viewId: string) => {
    navigate(viewId);
    onClose();
  };

  const isPublicVisitor = !currentUser;

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="mobile-drawer-portal fixed inset-0 z-[1000] font-sans">
          {/* BACKDROP OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-[#342A24]/60 backdrop-blur-xs z-[1000]"
          />

          {/* OPAQUE DRAWER SURFACE */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 bottom-0 left-0 w-[min(88vw,360px)] h-[100dvh] max-h-[100dvh] bg-[#FFF9F2] border-r border-[#E8DCCB] shadow-warm-lg z-[1001] flex flex-col justify-between overflow-hidden select-none box-border"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
          >
            {/* 1. DRAWER HEADER (Fixed top) */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-[#E8DCCB] bg-[#FFF9F2] shrink-0">
              <HumanAPILogo
                variant="navbar"
                alt="HumanAPI Logo"
                onClick={() => {
                  handleNavClick(currentUser ? (currentRole === "expert" ? "expert-dashboard" : "user-dashboard") : "home");
                }}
              />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-10 h-10 min-h-[44px] min-w-[44px] rounded-[10px] hover:bg-[#F6F0E7] text-[#7B6C60] hover:text-[#342A24] flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#C96F42]"
                id="drawer-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* 2. DRAWER SCROLL CONTENT (Scrollable region) */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-4">
              {/* USER PROFILE CARD OR GUEST HEADER */}
              {!isPublicVisitor ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] min-w-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-[10px] object-cover border border-[#E8DCCB] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif font-bold text-xs text-[#342A24] truncate">
                        {currentUser.name}
                      </h3>
                      <p className="text-[10px] text-[#7B6C60] truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  {/* ROLE SWITCHER FOR EXPERTS */}
                  {currentUser.isExpert && (
                    <div className="p-1 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] flex text-xs font-semibold">
                      <button
                        onClick={() => switchRole("user")}
                        className={`flex-1 py-1.5 rounded-[8px] transition-all text-center ${
                          currentRole === "user"
                            ? "bg-[#C96F42] text-[#FFF9F2] shadow-warm-xs"
                            : "text-[#7B6C60] hover:text-[#342A24]"
                        }`}
                      >
                        Client Workspace
                      </button>
                      <button
                        onClick={() => {
                          switchRole("expert");
                          onClose();
                          navigate("expert-dashboard");
                        }}
                        className={`flex-1 py-1.5 rounded-[8px] transition-all text-center ${
                          currentRole === "expert"
                            ? "bg-[#77816C] text-[#FFF9F2] shadow-warm-xs"
                            : "text-[#7B6C60] hover:text-[#342A24]"
                        }`}
                      >
                        Expert Workspace
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] space-y-2 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C96F42]">
                    Welcome to HumanAPI
                  </span>
                  <p className="text-xs text-[#7B6C60]">
                    Direct 5, 10 & 15-minute consultations with verified staff experts.
                  </p>
                </div>
              )}

              {/* PRIMARY NAVIGATION ITEMS */}
              <nav className="space-y-1">
                {(isPublicVisitor ? publicMenuItems : authenticatedMenuItems).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#C96F42] text-[#FFF9F2] shadow-warm-xs"
                          : "text-[#7B6C60] hover:text-[#342A24] hover:bg-[#F6F0E7]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon size={16} className={`shrink-0 ${isActive ? "text-[#FFF9F2]" : "text-[#7B6C60]"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ml-2 ${
                            isActive ? "bg-[#FFF9F2] text-[#C96F42]" : "bg-[#C96F42]/15 text-[#C96F42]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* DIVIDER & BECOME AN EXPERT LINK */}
              <div className="pt-2 border-t border-[#E8DCCB]">
                <button
                  onClick={() => handleNavClick("become-expert")}
                  className="w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-xs font-bold text-[#77816C] hover:bg-[#77816C]/10 transition-colors"
                >
                  <ShieldCheck size={16} className="shrink-0" />
                  <span>Become an Expert</span>
                </button>
              </div>
            </div>

            {/* 3. RESERVED DRAWER FOOTER (Fixed bottom with safe area padding) */}
            <div className="p-4 border-t border-[#E8DCCB] bg-[#FFF9F2] shrink-0 pb-[max(16px,env(safe-area-inset-bottom))]">
              {!isPublicVisitor ? (
                <button
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-[11px] bg-[#B85D3D]/10 hover:bg-[#B85D3D]/20 text-[#B85D3D] text-xs font-bold transition-colors"
                  id="drawer-sign-out-btn"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      openAuthModal("login");
                    }}
                    className="w-full min-h-[44px] py-2.5 rounded-[11px] border border-[#342A24]/20 bg-[#FFF9F2] text-xs font-bold text-[#342A24] text-center"
                    id="drawer-guest-login-btn"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      openAuthModal("signup");
                    }}
                    className="w-full min-h-[44px] py-2.5 rounded-[11px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs text-center"
                    id="drawer-guest-signup-btn"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MobileNavigationDrawer;
