import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { RatingStars, VerificationBadge, QualityBadge } from "../common/Badge";
import { HumanAPILogo } from "../brand/HumanAPILogo";
import { motion, AnimatePresence } from "framer-motion";
import { ExpertSettingsView } from "./ExpertSettingsView";
import { ExpertOverviewSkeleton } from "../loading";
import {
  Compass,
  Calendar,
  DollarSign,
  Star,
  Users,
  SlidersHorizontal,
  Clock,
  Video,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Download,
  Plus,
  Menu,
  X,
  AlertTriangle,
  Settings
} from "lucide-react";

export const ExpertDashboard: React.FC = () => {
  const {
    currentUser,
    currentRole,
    switchRole,
    navigate,
    experts,
    bookings,
    updateExpertPricing,
    showNotification,
    openAuthModal,
    isRefreshing
  } = useApp();

  // Guard against unauthenticated access
  if (!currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F6F0E7]">
        <div className="max-w-md w-full p-8 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-md text-center space-y-4">
          <div className="w-12 h-12 rounded-[12px] bg-[#C96F42]/10 text-[#C96F42] flex items-center justify-center mx-auto">
            <ShieldCheck size={24} />
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#342A24]">
            Expert Workspace Access
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#7B6C60] leading-relaxed">
            Please sign in with your verified expert account to access your calendar, consultation queues, and payout balances.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => openAuthModal("login")}
              className="px-5 py-2.5 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-semibold shadow-warm-xs transition-colors"
            >
              Sign In to Expert Account
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

  if (isRefreshing) {
    return (
      <div className="p-6 max-w-[1240px] mx-auto w-full">
        <ExpertOverviewSkeleton />
      </div>
    );
  }

  // Active sub-tab inside expert dashboard
  const [activeTab, setActiveTab] = useState<
    "overview" | "sessions" | "calendar" | "earnings" | "reviews" | "pricing" | "profile" | "settings"
  >("overview");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Active Client Problems state
  const [activeProblems] = useState([
    {
      id: "prob-101",
      clientName: "Aritra Bhui",
      topic: "React state synchronization & WebRTC signaling debugging",
      category: "Frontend Architecture",
      status: "active",
      startedAt: "Today, 2:15 PM"
    },
    {
      id: "prob-102",
      clientName: "Sarah Jenkins",
      topic: "LLM Fine-Tuning & RAG Hallucination Guardrails",
      category: "AI & ML Systems",
      status: "in_progress",
      startedAt: "Yesterday"
    },
    {
      id: "prob-103",
      clientName: "Marcus Vance",
      topic: "PostgreSQL Query Plan Optimization & Index Triage",
      category: "Database Performance",
      status: "active",
      startedAt: "3 days ago"
    },
    {
      id: "prob-104",
      clientName: "David K.",
      topic: "Distributed Event Store Partition Key Resharding",
      category: "System Architecture",
      status: "review_pending",
      startedAt: "4 days ago"
    }
  ]);

  // Urgent Need Attention Action Queue items state
  const [urgentAttentionItems] = useState<{
    id: string;
    title: string;
    description: string;
    actionText: string;
    actionTarget: string;
    targetParams?: any;
    priority: "high" | "medium" | "normal";
  }[]>([
    {
      id: "urg-1",
      title: "Session starts in 15 minutes",
      description: "React state synchronization & WebRTC signaling debugging consultation with Aritra Bhui.",
      actionText: "Enter Room",
      actionTarget: "session-room",
      priority: "high"
    },
    {
      id: "urg-2",
      title: "Client requested follow-up",
      description: "Aritra Bhui replied to your post-consultation architecture notes.",
      actionText: "Review",
      actionTarget: "sessions",
      priority: "medium"
    },
    {
      id: "urg-3",
      title: "Pending review response",
      description: "You have 1 client review awaiting practitioner response.",
      actionText: "Review",
      actionTarget: "reviews",
      priority: "normal"
    }
  ]);

  // Get this expert's data (or demo expert)
  const myExpert = experts.find(e => e.id === currentUser?.expertProfileId) || experts[0];

  // Pricing edit state
  const [price5, setPrice5] = useState(myExpert.pricing.duration5);
  const [price10, setPrice10] = useState(myExpert.pricing.duration10);
  const [price15, setPrice15] = useState(myExpert.pricing.duration15);

  // Calendar toggle
  const [isAvailableToday, setIsAvailableToday] = useState(myExpert.availableToday);
  const [workHoursStart, setWorkHoursStart] = useState("09:00");
  const [workHoursEnd, setWorkHoursEnd] = useState("19:00");

  const myBookings = bookings.filter(b => b.expertId === myExpert.id);
  const upcomingBookings = myBookings.filter(b => b.status === "confirmed" || b.status === "in_progress");
  const completedBookings = myBookings.filter(b => b.status === "completed");

  const totalEarningsGross = completedBookings.reduce((sum, b) => sum + b.price, 0) + 18450;
  const netEarnings = Math.round(totalEarningsGross * 0.88);

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updateExpertPricing(myExpert.id, {
      duration5: price5,
      duration10: price10,
      duration15: price15
    });
    showNotification("Pricing updated! New rates are live on your public profile.", "success");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Compass },
    { id: "sessions", label: "Sessions", icon: Video, count: upcomingBookings.length },
    { id: "calendar", label: "Availability Calendar", icon: Calendar },
    { id: "earnings", label: "Earnings & Payouts", icon: DollarSign },
    { id: "reviews", label: "Client Reviews", icon: Star, count: myExpert.reviewCount },
    { id: "pricing", label: "Sprint Rates (5/10/15m)", icon: SlidersHorizontal },
    { id: "profile", label: "Public Profile", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const currentNavItem = navItems.find(item => item.id === activeTab) || navItems[0];
  const ActiveNavIcon = currentNavItem.icon;

  return (
    <div className="flex-1 min-h-0 bg-[#F6F0E7] flex flex-col md:flex-row text-[#342A24] md:overflow-hidden relative">
      {/* MOBILE TOP NAVIGATION BAR (Visible strictly on < 768px) */}
      <div className="md:hidden bg-[#FFF9F2] border-b border-[#E8DCCB] px-4 py-2.5 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-2 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] hover:bg-[#74806B]/10 hover:text-[#74806B] transition-colors"
            aria-label="Open expert workspace menu"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <ActiveNavIcon size={16} className="text-[#74806B] shrink-0" />
            <span className="font-bold text-xs text-[#342A24] truncate">
              {currentNavItem.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-[#74806B] bg-[#74806B]/10 px-2 py-0.5 rounded-full border border-[#74806B]/20">
            Expert
          </span>
          <img
            src={myExpert.avatar}
            alt={myExpert.name}
            className="w-7 h-7 rounded-[8px] object-cover border border-[#E8DCCB]"
          />
        </div>
      </div>

      {/* MOBILE SLIDE-OVER DRAWER OVERLAY */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-[#342A24]/40 backdrop-blur-xs z-50 md:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#FFF9F2] border-r border-[#E8DCCB] z-50 flex flex-col justify-between p-4 shadow-warm-lg md:hidden"
            >
              <div className="space-y-4">
                {/* Header & Close Button */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB]">
                  <HumanAPILogo variant="navbar" alt="HumanAPI Logo" />
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1.5 rounded-[8px] hover:bg-[#F6F0E7] text-[#7B6C60] hover:text-[#342A24]"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Expert Profile Card */}
                <div className="flex items-center gap-3 p-2.5 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB]">
                  <img
                    src={myExpert.avatar}
                    alt={myExpert.name}
                    className="w-10 h-10 rounded-[10px] object-cover border border-[#E8DCCB]"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif font-bold text-xs text-[#342A24] truncate">
                      {myExpert.name}
                    </h3>
                    <VerificationBadge size="sm" />
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="p-1 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] flex text-xs font-semibold">
                  <button
                    onClick={() => {
                      switchRole("user");
                      setIsMobileDrawerOpen(false);
                      navigate("user-dashboard");
                    }}
                    className="flex-1 py-1 rounded-[8px] text-[#7B6C60] hover:text-[#342A24] transition-all"
                  >
                    Client
                  </button>
                  <button
                    onClick={() => switchRole("expert")}
                    className="flex-1 py-1 rounded-[8px] bg-[#74806B] text-[#FFF9F0] shadow-warm-xs"
                  >
                    Expert
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-1">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-[#74806B] text-[#FFF9F0] shadow-warm-xs font-bold"
                            : "text-[#7B6C60] hover:text-[#342A24] hover:bg-[#F6F0E7]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={16} className={isActive ? "text-[#FFF9F0]" : "text-[#7B6C60]"} />
                          <span>{item.label}</span>
                        </div>
                        {item.count !== undefined && item.count > 0 && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isActive ? "bg-[#FFF9F0] text-[#74806B]" : "bg-[#74806B]/15 text-[#74806B]"
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Instant Booking Toggle inside Drawer */}
              <div className="pt-3 border-t border-[#E8DCCB]">
                <div className="flex items-center justify-between p-2 rounded-[10px] bg-[#F6F0E7]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isAvailableToday ? "bg-[#718B68] animate-pulse" : "bg-[#75675C]"}`} />
                    <span className="text-xs font-bold text-[#342A24]">Instant Booking</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAvailableToday}
                    onChange={e => {
                      setIsAvailableToday(e.target.checked);
                      showNotification(e.target.checked ? "You are now marked Available Today." : "Availability paused.", "info");
                    }}
                    className="accent-[#74806B] w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP & TABLET SIDEBAR (Hidden on mobile < 768px, visible on md+) */}
      <aside className="w-56 sm:w-60 md:w-64 bg-[#FFF9F2] border-r border-[#E8DCCB] hidden md:flex flex-col shrink-0 min-h-0">
        {/* Profile Card */}
        <div className="p-5 border-b border-[#E8DCCB] shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={myExpert.avatar}
              alt={myExpert.name}
              className="w-12 h-12 rounded-2xl object-cover border border-[#DED3C6]"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-serif font-bold text-sm text-[#332720] truncate">
                {myExpert.name}
              </h3>
              <VerificationBadge size="sm" />
            </div>
          </div>

          {/* Quick role toggle to client */}
          <div className="p-1 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] flex text-xs font-semibold">
            <button
              onClick={() => {
                switchRole("user");
                navigate("user-dashboard");
              }}
              className="flex-1 py-1 rounded-lg text-[#75675C] hover:text-[#332720] transition-all"
            >
              Client
            </button>
            <button
              onClick={() => switchRole("expert")}
              className={`flex-1 py-1 rounded-lg transition-all ${
                currentRole === "expert"
                  ? "bg-[#74806B] text-[#FFF9F0] shadow-warm-sm"
                  : "text-[#75675C]"
              }`}
            >
              Expert
            </button>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#74806B] text-[#FFF9F0] shadow-warm-sm font-bold"
                    : "text-[#75675C] hover:text-[#332720] hover:bg-[#F7F1E7]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? "text-[#FFF9F0]" : "text-[#75675C]"} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? "bg-[#FFF9F0] text-[#74806B]" : "bg-[#74806B]/15 text-[#74806B]"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Live Availability Toggle */}
        <div className="p-4 border-t border-[#DED3C6] bg-[#F7F1E7]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isAvailableToday ? "bg-[#718B68] animate-pulse" : "bg-[#75675C]"}`} />
              <span className="text-xs font-bold text-[#332720]">Instant Booking</span>
            </div>
            <input
              type="checkbox"
              checked={isAvailableToday}
              onChange={e => {
                setIsAvailableToday(e.target.checked);
                showNotification(e.target.checked ? "You are now marked Available Today." : "Availability paused.", "info");
              }}
              className="accent-[#74806B] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </aside>

      {/* Expert Content Container */}
      <main className="flex-1 min-h-0 p-4 sm:p-6 lg:p-8 pb-8 sm:pb-10 max-w-7xl overflow-y-auto scroll-region">
        {/* SUB-VIEW 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Header (APPROVED & LOCKED DESIGN) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#74806B]">
                  Specialist Command Center
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#332720]">
                  Welcome, {myExpert.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#75675C]">
                  Your current discoverability rank is <strong className="text-[#332720] font-bold">#{myExpert.discoverabilityScore}</strong> on the platform.
                </p>
              </div>

              <button
                onClick={() => navigate("expert-detail", { expertId: myExpert.id })}
                className="px-5 py-2.5 rounded-xl border border-[#DED3C6] bg-[#F7F1E7] hover:bg-[#DED3C6]/50 text-xs font-bold text-[#332720] transition-colors self-start sm:self-auto"
              >
                View Public Profile →
              </button>
            </div>

            {/* 1. URGENT NEED ATTENTION ACTION QUEUE */}
            {urgentAttentionItems.length > 0 ? (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#DED3C6] pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-[#C86B3C]" />
                    <h3 className="font-serif font-bold text-base text-[#332720]">
                      Needs Attention
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-[#75675C]">
                    {urgentAttentionItems.length} urgent action item{urgentAttentionItems.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {urgentAttentionItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                        item.priority === "high"
                          ? "bg-[#C86B3C]/5 border-[#C86B3C]/30"
                          : item.priority === "medium"
                          ? "bg-[#C4934B]/5 border-[#C4934B]/30"
                          : "bg-[#74806B]/5 border-[#74806B]/30"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              item.priority === "high"
                                ? "bg-[#C86B3C]/15 text-[#C86B3C]"
                                : item.priority === "medium"
                                ? "bg-[#C4934B]/15 text-[#C4934B]"
                                : "bg-[#74806B]/15 text-[#74806B]"
                            }`}
                          >
                            {item.priority} priority
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-xs text-[#332720]">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#75675C] line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (item.actionTarget === "session-room") {
                            navigate("session-room", item.targetParams || { bookingId: upcomingBookings[0]?.id });
                          } else {
                            setActiveTab(item.actionTarget as any);
                          }
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold shadow-warm-xs flex items-center justify-center gap-1.5 transition-all ${
                          item.priority === "high"
                            ? "bg-[#C86B3C] hover:bg-[#B85D3D] text-[#FFF9F0]"
                            : item.priority === "medium"
                            ? "bg-[#C4934B] hover:bg-[#B3833B] text-[#FFF9F0]"
                            : "bg-[#74806B] hover:bg-[#5E6956] text-[#FFF9F0]"
                        }`}
                      >
                        <span>{item.actionText}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] flex items-center justify-between text-xs text-[#75675C]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#718B68]" />
                  <span className="font-semibold text-[#332720]">You're all caught up. No urgent actions required.</span>
                </div>
              </div>
            )}

            {/* 2. PRIMARY KPI METRICS (Total Net Earnings, Completed Consultations, Client Rating, Resolution Rate) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] space-y-1">
                <span className="text-xs text-[#75675C]">Total Net Earnings</span>
                <div className="font-serif text-3xl font-bold text-[#718B68]">
                  ₹{netEarnings.toLocaleString()}
                </div>
                <span className="text-[11px] text-[#75675C]">88% direct payout rate</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] space-y-1">
                <span className="text-xs text-[#75675C]">Completed Consultations</span>
                <div className="font-serif text-3xl font-bold text-[#332720]">
                  {myExpert.completedSessions + completedBookings.length}
                </div>
                <span className="text-[11px] text-[#718B68] font-semibold">100% completion</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] space-y-1">
                <span className="text-xs text-[#75675C]">Client Rating</span>
                <div className="font-serif text-3xl font-bold text-[#C4934B]">
                  {myExpert.rating.toFixed(2)} ★
                </div>
                <span className="text-[11px] text-[#75675C]">from {myExpert.reviewCount} reviews</span>
              </div>
              {/* RESOLUTION RATE KPI */}
              <div className="p-5 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] space-y-1">
                <span className="text-xs text-[#75675C]">Resolution Rate</span>
                <div className="font-serif text-3xl font-bold text-[#74806B]">
                  92.4%
                </div>
                <span className="text-[11px] text-[#718B68] font-semibold flex items-center gap-1">
                  <TrendingUp size={12} /> ↑ 4.2% this month
                </span>
              </div>
            </div>

            {/* 3. WORKLOAD STRIP (Upcoming Consultations, Today's Sessions, Active Problems) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Upcoming Consultations */}
              <div
                onClick={() => setActiveTab("sessions")}
                className="p-5 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] space-y-1 cursor-pointer hover:border-[#C86B3C]/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#75675C]">Upcoming Consultations</span>
                  <ChevronRight size={14} className="text-[#75675C]" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#C86B3C]">
                  {upcomingBookings.length}
                </div>
                <span className="text-[11px] text-[#C86B3C] font-semibold">Sessions in queue</span>
              </div>

              {/* TODAY'S SESSIONS METRIC */}
              <div
                onClick={() => setActiveTab("sessions")}
                className="p-5 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] space-y-2 cursor-pointer hover:border-[#74806B]/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#75675C]">Today's Sessions</span>
                  <ChevronRight size={14} className="text-[#75675C]" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#332720]">
                  3
                </div>
                <div className="flex items-center gap-2 text-[10px] font-semibold text-[#75675C]">
                  <span className="text-[#718B68]">✓ 1 Completed</span>
                  <span>•</span>
                  <span className="text-[#C86B3C]">● 2 Upcoming</span>
                  <span>•</span>
                  <span>○ 0 Cancelled</span>
                </div>
              </div>

              {/* ACTIVE PROBLEMS METRIC */}
              <div
                onClick={() => setActiveTab("sessions")}
                className="p-5 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] space-y-1 cursor-pointer hover:border-[#74806B]/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#75675C]">Active Problems</span>
                  <ChevronRight size={14} className="text-[#75675C]" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#74806B]">
                  {activeProblems.length}
                </div>
                <span className="text-[11px] text-[#75675C]">4 client problems active</span>
              </div>
            </div>

            {/* 4. ACTIVE PROBLEMS DETAIL CARD */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#DED3C6] pb-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#332720]">
                    Active Problems
                  </h3>
                  <p className="text-xs text-[#75675C]">
                    Currently helping clients with {activeProblems.length} active engagements
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("sessions")}
                  className="text-xs font-bold text-[#74806B] hover:underline"
                >
                  View All Sessions →
                </button>
              </div>

              {activeProblems.length === 0 ? (
                <p className="text-xs text-[#75675C] py-4 text-center">
                  No active problems. You currently have no unresolved client engagements.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeProblems.map((prob) => (
                    <div
                      key={prob.id}
                      className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#74806B] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#74806B]/10">
                            {prob.category}
                          </span>
                          <span className="text-[10px] font-semibold text-[#75675C]">
                            {prob.startedAt}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[#332720]">
                          {prob.topic}
                        </h4>
                        <p className="text-xs text-[#75675C]">
                          Client: <strong className="text-[#332720]">{prob.clientName}</strong>
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[#DED3C6]/60 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#718B68] font-semibold flex items-center gap-1">
                          <Clock size={12} /> Active Engagement
                        </span>
                        <button
                          onClick={() => setActiveTab("sessions")}
                          className="text-xs font-bold text-[#C86B3C] hover:underline"
                        >
                          Open Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. NEXT SCHEDULED CONSULTATIONS CARD (APPROVED & UNTOUCHED) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#DED3C6] pb-3">
                <h3 className="font-serif font-bold text-lg text-[#332720]">
                  Next Scheduled Consultations
                </h3>
                <span className="text-xs text-[#75675C]">
                  Join room 1 min prior to start
                </span>
              </div>

              {upcomingBookings.length === 0 ? (
                <p className="text-xs text-[#75675C] py-4 text-center">
                  No upcoming consultations. Make sure your availability hours are set!
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map(b => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-[#332720]">
                            Client: Aritra Bhui
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C86B3C]/15 text-[#C86B3C]">
                            {b.duration} Min Sprint (₹{b.price})
                          </span>
                        </div>
                        <p className="text-xs text-[#75675C]">
                          Topic: <strong className="text-[#332720]">{b.topic}</strong>
                        </p>
                        <span className="text-[11px] text-[#74806B] font-semibold flex items-center gap-1">
                          <Clock size={12} /> {b.scheduledTime}
                        </span>
                      </div>

                      <button
                        onClick={() => navigate("session-room", { bookingId: b.id })}
                        className="px-5 py-2.5 rounded-xl bg-[#74806B] hover:bg-[#5E6956] text-[#FFF9F0] text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-all self-start sm:self-auto"
                      >
                        <Video size={14} />
                        <span>Launch Consultation Suite</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUB-VIEW 2: SESSIONS */}
        {activeTab === "sessions" && (
          <div className="space-y-6">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#332720]">
              All Consultation Sprints
            </h1>
            <div className="space-y-3">
              {myBookings.map(b => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#332720]">{b.scheduledTime} · {b.duration}m</span>
                    <p className="text-xs text-[#75675C]">Topic: {b.topic}</p>
                    <span className="text-[11px] font-mono font-semibold text-[#74806B]">Net Payout: ₹{Math.round(b.price * 0.88)}</span>
                  </div>
                  <button
                    onClick={() => navigate("session-room", { bookingId: b.id })}
                    className="px-4 py-2 rounded-xl bg-[#C86B3C] text-white text-xs font-bold"
                  >
                    Open Room
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-VIEW 3: CALENDAR */}
        {activeTab === "calendar" && (
          <div className="space-y-6 max-w-3xl">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#332720]">
              Availability & Calendar Scheduling
            </h1>
            <div className="p-6 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] space-y-5">
              <div className="flex items-center justify-between border-b border-[#DED3C6] pb-3">
                <span className="font-bold text-sm text-[#332720]">Working Windows</span>
                <span className="text-xs text-[#75675C]">Auto-sync with Google Calendar</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#332720] mb-1">Start Time</label>
                  <input
                    type="time"
                    value={workHoursStart}
                    onChange={e => setWorkHoursStart(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#332720] mb-1">End Time</label>
                  <input
                    type="time"
                    value={workHoursEnd}
                    onChange={e => setWorkHoursEnd(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6]"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="block text-xs font-bold text-[#332720]">Active Days:</span>
                <div className="flex gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                    <button
                      key={day}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        i < 5 ? "bg-[#74806B] text-white" : "bg-[#F7F1E7] text-[#75675C] border border-[#DED3C6]"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => showNotification("Working windows saved.", "success")}
                className="px-6 py-2.5 rounded-xl bg-[#74806B] text-white text-xs font-bold shadow-warm-sm"
              >
                Save Schedule
              </button>
            </div>
          </div>
        )}

        {/* SUB-VIEW 4: EARNINGS */}
        {activeTab === "earnings" && (
          <div className="space-y-6 max-w-4xl">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#332720]">
              Earnings & Payout Disbursements
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6]">
                <span className="text-xs text-[#75675C]">Available for Payout</span>
                <div className="font-serif text-3xl font-bold text-[#718B68] mt-1">
                  ₹{netEarnings.toLocaleString()}
                </div>
                <button
                  onClick={() => showNotification("Payout requested. Funds will transfer in 1-2 business days.", "success")}
                  className="mt-3 w-full py-2 rounded-xl bg-[#718B68] text-white text-xs font-bold"
                >
                  Request Payout
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6]">
                <span className="text-xs text-[#75675C]">Lifetime Platform Fees (12%)</span>
                <div className="font-serif text-3xl font-bold text-[#C86B3C] mt-1">
                  ₹{Math.round(totalEarningsGross * 0.12).toLocaleString()}
                </div>
                <span className="text-[11px] text-[#75675C] block mt-3">Covers WebRTC relays & AI models</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6]">
                <span className="text-xs text-[#75675C]">Connected Account</span>
                <div className="font-mono text-sm font-bold text-[#332720] mt-1">
                  HDFC Bank ··· 8812
                </div>
                <span className="text-[11px] text-[#718B68] font-bold block mt-3">Verified Payout Routing</span>
              </div>
            </div>
          </div>
        )}

        {/* SUB-VIEW 5: REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#332720]">
                Client Reviews & Reputation Rubric
              </h1>
              <RatingStars rating={myExpert.rating} count={myExpert.reviewCount} size="lg" />
            </div>

            <div className="space-y-4">
              {myExpert.reviews.map(r => (
                <div key={r.id} className="p-5 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#332720]">{r.userName} · {r.duration}m sprint</span>
                    <span className="text-xs text-[#75675C]">{r.date}</span>
                  </div>
                  <RatingStars rating={r.rating} size="sm" showValue={false} />
                  <p className="text-xs text-[#75675C] italic leading-relaxed">
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-VIEW 6: PRICING (5/10/15m) */}
        {activeTab === "pricing" && (
          <form onSubmit={handleSavePricing} className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C86B3C]">
                Monetization Control
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#332720]">
                Consultation Sprint Pricing
              </h1>
              <p className="text-xs text-[#75675C]">
                Adjust your fees for 5, 10, and 15-minute consultations. You receive 88% of every session.
              </p>
            </div>

            <div className="space-y-4 bg-[#FFF9F0] p-6 rounded-3xl border border-[#DED3C6]">
              <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[#332720] block">5-Minute Laser Sprint</span>
                  <span className="text-[11px] text-[#75675C]">You take home: ₹{Math.round(price5 * 0.88)}</span>
                </div>
                <div className="flex items-center gap-1 font-serif text-base font-bold">
                  <span>₹</span>
                  <input
                    type="number"
                    value={price5}
                    onChange={e => setPrice5(Number(e.target.value))}
                    className="w-20 p-2 rounded-xl bg-[#FFF9F0] border border-[#DED3C6] text-center"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F1E7] border-2 border-[#C86B3C] flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[#C86B3C] block">10-Minute Root Cause Sprint (Flagship)</span>
                  <span className="text-[11px] text-[#75675C]">You take home: ₹{Math.round(price10 * 0.88)}</span>
                </div>
                <div className="flex items-center gap-1 font-serif text-base font-bold text-[#C86B3C]">
                  <span>₹</span>
                  <input
                    type="number"
                    value={price10}
                    onChange={e => setPrice10(Number(e.target.value))}
                    className="w-20 p-2 rounded-xl bg-[#FFF9F0] border border-[#C86B3C] text-center"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[#332720] block">15-Minute Strategic Sprint</span>
                  <span className="text-[11px] text-[#75675C]">You take home: ₹{Math.round(price15 * 0.88)}</span>
                </div>
                <div className="flex items-center gap-1 font-serif text-base font-bold">
                  <span>₹</span>
                  <input
                    type="number"
                    value={price15}
                    onChange={e => setPrice15(Number(e.target.value))}
                    className="w-20 p-2 rounded-xl bg-[#FFF9F0] border border-[#DED3C6] text-center"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#C86B3C] hover:bg-[#B85C3B] text-white text-xs font-bold shadow-warm-sm transition-all"
              >
                Save New Pricing
              </button>
            </div>
          </form>
        )}

        {/* SUB-VIEW 7: PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-2xl">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#332720]">
              Public Profile Configuration
            </h1>
            <div className="p-6 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#332720] mb-1">Headline</label>
                <input
                  type="text"
                  defaultValue={myExpert.headline}
                  className="w-full p-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#332720] mb-1">Biography</label>
                <textarea
                  rows={4}
                  defaultValue={myExpert.bio}
                  className="w-full p-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6]"
                />
              </div>
              <button
                onClick={() => showNotification("Profile updated.", "success")}
                className="px-6 py-2.5 rounded-xl bg-[#74806B] text-white text-xs font-bold shadow-warm-sm"
              >
                Save Profile
              </button>
            </div>
          </div>
        )}

        {/* SUB-VIEW 8: SETTINGS */}
        {activeTab === "settings" && (
          <ExpertSettingsView onNavigateTab={(tab) => setActiveTab(tab as any)} />
        )}
      </main>
    </div>
  );
};
