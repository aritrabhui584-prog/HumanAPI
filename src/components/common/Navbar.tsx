import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { getUserDisplayName, getUserFirstName } from "../../lib/userUtils";
import {
  Menu,
  X,
  Compass,
  Briefcase,
  Calendar,
  LogOut,
  SlidersHorizontal,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { HumanAPILogo } from "../brand/HumanAPILogo";

export const Navbar: React.FC = () => {
  const {
    currentView,
    navigate,
    currentUser,
    currentRole,
    switchRole,
    logout,
    openAuthModal,
    openAccreditationModal
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Subtle sticky-header shadow on scroll & escape key handling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const publicNavLinks = [
    { label: "Find Experts", view: "experts" },
    { label: "How It Works", view: "how-it-works" },
    { label: "Use Cases", view: "use-cases" },
    { label: "Pricing", view: "pricing" },
    { label: "About", view: "about" },
    { label: "FAQ", view: "faq" },
  ];

  const authenticatedClientNavLinks = [
    { label: "Find Experts", view: "experts" },
    { label: "Client Dashboard", view: "user-dashboard" },
    { label: "Ask an Expert", view: "user-ask" },
    { label: "My Sessions", view: "user-history" },
    { label: "Projects", view: "user-projects" },
  ];

  const authenticatedExpertNavLinks = [
    { label: "Expert Overview", view: "expert-dashboard", tab: "overview" },
    { label: "Client Requests", view: "expert-dashboard", tab: "sessions" },
    { label: "Earnings & Payouts", view: "expert-dashboard", tab: "earnings" },
    { label: "Availability", view: "expert-dashboard", tab: "calendar" },
    { label: "Settings", view: "expert-dashboard", tab: "settings" },
  ];

  const isPublicVisitor = !currentUser;

  const navLinksToRender = isPublicVisitor
    ? publicNavLinks
    : currentRole === "expert"
    ? authenticatedExpertNavLinks
    : authenticatedClientNavLinks;

  const handleNav = (view: string, tab?: string) => {
    navigate(view, tab ? { tab } : {});
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-[#FFF9F2]/95 backdrop-blur-md border-b border-[#E8DCCB] shadow-warm-xs"
          : "bg-[#F6F0E7]/90 backdrop-blur-sm border-b border-[#E8DCCB]/60"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 h-[72px] flex items-center justify-between">
        {/* Brand Logo: HumanAPI */}
        <HumanAPILogo
          variant="navbar"
          alt="HumanAPI Logo"
          onClick={() => handleNav(currentUser ? (currentRole === "expert" ? "expert-dashboard" : "user-dashboard") : "home")}
        />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navLinksToRender.map(link => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.label}
                onClick={() => handleNav(link.view, (link as any).tab)}
                className={`px-3 py-2 rounded-lg text-[14px] font-sans font-medium transition-colors ${
                  isActive
                    ? "text-[#C96F42] bg-[#C96F42]/8 font-semibold"
                    : "text-[#7B6C60] hover:text-[#342A24] hover:bg-[#FFF9F2]"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions Bar */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isPublicVisitor ? (
            // UNAUTHENTICATED VISITOR CONTROLS ONLY
            <>
              <button
                onClick={() => handleNav("become-expert")}
                className="px-3.5 py-2 text-[14px] font-sans font-medium text-[#7B6C60] hover:text-[#342A24] transition-colors"
                id="nav-become-expert-btn"
              >
                Become an Expert
              </button>

              <button
                onClick={() => openAuthModal("login")}
                className="px-3.5 py-2 text-[14px] font-sans font-semibold text-[#342A24] hover:text-[#C96F42] transition-colors"
                id="nav-sign-in-btn"
              >
                Sign In
              </button>

              <button
                onClick={() => openAuthModal("signup")}
                className="px-4 py-2 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-[14px] font-sans font-semibold shadow-warm-xs hover:shadow-warm-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5"
                id="nav-get-started-btn"
              >
                <span>Get Started</span>
                <ArrowRight size={14} />
              </button>
            </>
          ) : (
            // AUTHENTICATED USER CONTROLS ONLY
            <div className="flex items-center gap-3">
              {currentUser.expertStatus === "APPROVED" || (currentUser.isExpert && !currentUser.expertStatus) ? (
                <button
                  onClick={() => switchRole(currentRole === "user" ? "expert" : "user")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-[#E8DCCB] bg-[#FFF9F2] text-[#77816C] hover:text-[#342A24] text-xs font-semibold shadow-warm-xs transition-colors"
                  title="Switch between Client and Expert workspaces"
                  id="nav-expert-switch-btn"
                >
                  <Briefcase size={14} />
                  <span>{currentRole === "user" ? "Expert Workspace" : "Client View"}</span>
                </button>
              ) : (
                <button
                  onClick={() => openAccreditationModal()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#77816C]/10 text-[#77816C] hover:bg-[#77816C]/20 text-xs font-semibold transition-colors"
                  id="nav-become-expert-btn"
                >
                  <ShieldCheck size={14} />
                  <span>🔒 Become an Expert</span>
                </button>
              )}

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-[10px] hover:bg-[#FFF9F2] border border-transparent hover:border-[#E8DCCB] transition-all"
                  id="nav-authenticated-user-menu"
                >
                  <img
                    src={currentUser.avatar}
                    alt={getUserDisplayName(currentUser)}
                    className="w-8 h-8 rounded-[8px] object-cover border border-[#E8DCCB]"
                  />
                  <span className="text-xs font-semibold text-[#342A24] max-w-[90px] truncate">
                    {getUserFirstName(currentUser)}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-[14px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#E8DCCB]/60">
                      <p className="text-[11px] text-[#7B6C60]">Signed in as</p>
                      <p className="text-xs font-bold text-[#342A24] truncate">{getUserDisplayName(currentUser)}</p>
                      <p className="text-[10px] text-[#7B6C60] truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNav("user-dashboard")}
                        className="w-full text-left px-4 py-2 text-xs text-[#342A24] hover:bg-[#F6F0E7] flex items-center gap-2.5"
                      >
                        <Compass size={15} className="text-[#C96F42]" />
                        Client Dashboard
                      </button>
                      <button
                        onClick={() => handleNav("user-history")}
                        className="w-full text-left px-4 py-2 text-xs text-[#342A24] hover:bg-[#F6F0E7] flex items-center gap-2.5"
                      >
                        <Calendar size={15} className="text-[#B89152]" />
                        Consultation History
                      </button>
                      <button
                        onClick={() => handleNav("user-projects")}
                        className="w-full text-left px-4 py-2 text-xs text-[#342A24] hover:bg-[#F6F0E7] flex items-center gap-2.5"
                      >
                        <FolderOpen size={15} className="text-[#7B6C60]" />
                        My Projects
                      </button>
                      {currentUser.isExpert && (
                        <button
                          onClick={() => handleNav("expert-dashboard")}
                          className="w-full text-left px-4 py-2 text-xs text-[#342A24] hover:bg-[#F6F0E7] flex items-center gap-2.5"
                        >
                          <Briefcase size={15} className="text-[#77816C]" />
                          Expert Workspace
                        </button>
                      )}
                      <button
                        onClick={() => handleNav("user-settings")}
                        className="w-full text-left px-4 py-2 text-xs text-[#342A24] hover:bg-[#F6F0E7] flex items-center gap-2.5"
                      >
                        <SlidersHorizontal size={15} className="text-[#7B6C60]" />
                        Settings
                      </button>
                    </div>

                    <div className="border-t border-[#E8DCCB]/60 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-[#B85D3D] hover:bg-[#B85D3D]/10 flex items-center gap-2.5 font-semibold"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-[10px] bg-[#FFF9F2] border border-[#E8DCCB] text-[#342A24]"
            aria-label="Toggle navigation menu"
            id="mobile-nav-toggle-btn"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8DCCB] bg-[#FFF9F2] px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinksToRender.map(link => (
              <button
                key={link.label}
                onClick={() => handleNav(link.view)}
                className={`w-full text-left px-3 py-2.5 rounded-[10px] text-sm font-sans font-medium ${
                  currentView === link.view
                    ? "text-[#C96F42] bg-[#C96F42]/10 font-bold"
                    : "text-[#342A24] hover:bg-[#F6F0E7]"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8DCCB] space-y-2">
            {isPublicVisitor ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleNav("become-expert")}
                  className="w-full py-2.5 rounded-[10px] border border-[#E8DCCB] text-xs font-semibold text-[#342A24]"
                >
                  Become an Expert
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAuthModal("login");
                    }}
                    className="w-full py-2.5 rounded-[10px] bg-[#FFF9F2] border border-[#342A24]/20 text-xs font-semibold text-[#342A24]"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAuthModal("signup");
                    }}
                    className="w-full py-2.5 rounded-[10px] bg-[#C96F42] text-[#FFF9F2] text-xs font-semibold shadow-warm-xs"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-[10px] bg-[#F6F0E7]">
                  <img
                    src={currentUser.avatar}
                    alt={getUserDisplayName(currentUser)}
                    className="w-8 h-8 rounded-[8px] object-cover"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#342A24] truncate">{getUserDisplayName(currentUser)}</p>
                    <p className="text-[10px] text-[#7B6C60] truncate">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-center py-2 text-xs text-[#B85D3D] font-semibold"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
