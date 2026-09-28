import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { RatingStars, VerificationBadge } from "../common/Badge";
import { getTimeBasedGreeting, getProfileCompletionDetails } from "../../lib/userUtils";
import {
  Sparkles,
  Calendar,
  Clock,
  Video,
  ArrowRight,
  FolderOpen,
  CheckCircle2,
  Users,
  ShieldCheck,
  Search,
  Bookmark,
  FileText,
  ChevronRight,
  AlertCircle,
  UserCheck
} from "lucide-react";

import { ClientOverviewSkeleton, HumanAPIInlineLoader } from "../loading";

export const UserOverview: React.FC = () => {
  const { currentUser, bookings, projects, experts, navigate, openBookingModal, isRefreshing } = useApp();
  const [problemInput, setProblemInput] = useState("");
  const [now, setNow] = useState<Date>(new Date());

  // Periodically update local device time to handle crossing time-period boundaries seamlessly
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  if (isRefreshing) {
    return <ClientOverviewSkeleton />;
  }

  const upcomingBookings = bookings.filter(b => b.status === "confirmed" || b.status === "in_progress");
  const pastBookings = bookings.filter(b => b.status === "completed");
  const recommendedExperts = experts.slice(0, 3);
  const savedExperts = experts.slice(1, 3);

  const profileCompletion = getProfileCompletionDetails(currentUser);

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemInput.trim()) {
      navigate("user-ask");
    } else {
      navigate("user-ask", { initialQuery: problemInput });
    }
  };

  return (
    <div className="space-y-6 max-w-[1240px] mx-auto w-full min-w-0">
      {/* PROFILE COMPLETION BANNER IF INCOMPLETE */}
      {!profileCompletion.isComplete && (
        <div className="p-4 sm:p-5 rounded-[16px] bg-[#FFF9F2] border border-[#C96F42]/40 shadow-warm-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 rounded-[10px] bg-[#C96F42]/10 text-[#C96F42] shrink-0 mt-0.5">
              <AlertCircle size={20} />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-[#342A24]">Profile Completion</span>
                <span className="px-2 py-0.5 rounded-full bg-[#C96F42] text-[#FFF9F2] text-[11px] font-bold">
                  {profileCompletion.percentage}%
                </span>
              </div>
              <p className="text-xs text-[#7B6C60] leading-relaxed">
                Complete your mandatory profile details to enable consultation bookings with specialists.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profileCompletion.missingFields.map(f => (
                  <span key={f.key} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F6F0E7] border border-[#E8DCCB] text-[#B85D3D]">
                    • {f.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("user-settings")}
            className="w-full sm:w-auto px-4 py-2 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shrink-0 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Complete Profile</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* ========================================================
          USER DASHBOARD HEADER & SEARCH FORM
          Responsive composition: buttons stack full-width on mobile
          Input & Match Expert button use non-overlapping flex layout
          ======================================================== */}
      <div className="p-4 sm:p-7 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-sm space-y-4 w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C96F42]">
              Deployment Diagnosis Workspace
            </span>
            <h1 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-[#342A24] mt-0.5 break-words">
              {getTimeBasedGreeting(currentUser, now)} What are you trying to deploy?
            </h1>
            <p className="text-xs sm:text-sm text-[#7B6C60] mt-1 leading-relaxed max-w-[680px]">
              HumanAPI parses your repository and build logs to diagnose software deployment problems before connecting you with a DevOps expert.
            </p>
          </div>
        </div>

        {/* SINGLE ACTIVE DEPLOYMENT DIAGNOSIS LAUNCHER */}
        <div className="pt-2">
          <button
            onClick={() => navigate("deployment-intake")}
            className="w-full p-4 rounded-[14px] bg-[#F6F0E7] hover:bg-[#E8DCCB]/60 border border-[#E8DCCB] hover:border-[#C96F42] text-left transition-all group flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C96F42]">⚙️ Primary Active Focus</span>
              <h3 className="text-[16px] font-semibold text-[#342A24] mt-0.5">⚙️ Diagnose a Deployment Problem</h3>
              <p className="text-[12px] text-[#7B6C60] mt-0.5">Connect GitHub repository, inspect build logs, and match verified DevOps specialists</p>
            </div>
            <ArrowRight size={20} className="text-[#C96F42] group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>

        {/* Responsive problem input form */}
        <form onSubmit={handleAskSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full min-w-0 pt-1">
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
            <input
              type="text"
              value={problemInput}
              onChange={e => setProblemInput(e.target.value)}
              placeholder="Describe your deployment problem (e.g. Jenkins build failure, Docker exit code 137, AWS IAM permission error)..."
              className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs sm:text-sm text-[#342A24] placeholder-[#7B6C60]/60 focus:outline-none focus:border-[#C96F42] focus:bg-[#FFF9F2] transition-colors min-w-0 font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-3 rounded-[12px] bg-[#342A24] hover:bg-[#28201A] text-[#FFF9F2] text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 shadow-warm-xs transition-colors"
          >
            <span>Match DevOps Expert</span>
            <ArrowRight size={14} />
          </button>
        </form>
      </div>

      {/* ========================================================
          12-COLUMN RESPONSIVE DASHBOARD GRID
          Col 8: Dominant primary cards (Upcoming Session, Recommendations, Projects)
          Col 4: Supporting secondary cards (Stats, Recent Activity, Saved Experts)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* LEFT COLUMN (Span 8) */}
        <div className="lg:col-span-8 space-y-6 w-full min-w-0">
          {/* PRIMARY DOMINANT CARD: UPCOMING SESSION */}
          <div className="p-4 sm:p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-sm space-y-4 w-full min-w-0">
            <div className="flex items-center justify-between border-b border-[#E8DCCB]/80 pb-3.5">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#C96F42]" />
                <h2 className="font-serif font-bold text-base sm:text-lg text-[#342A24]">
                  Upcoming Consultation
                </h2>
              </div>
              <span className="text-xs font-medium text-[#7B6C60]">
                {upcomingBookings.length} session scheduled
              </span>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-xs text-[#7B6C60]">You have no consultations queued today.</p>
                <button
                  onClick={() => navigate("experts")}
                  className="text-xs font-bold text-[#C96F42] hover:underline"
                >
                  Schedule a focused sprint with a specialist →
                </button>
              </div>
            ) : (
              upcomingBookings.map(b => (
                <div
                  key={b.id}
                  className="p-4 sm:p-5 rounded-[16px] bg-[#F6F0E7] border border-[#E8DCCB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <img
                      src={b.expertAvatar}
                      alt={b.expertName}
                      className="w-12 h-12 rounded-[12px] object-cover border border-[#E8DCCB] shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                        <h4 className="font-serif font-bold text-base text-[#342A24] break-words">
                          {b.expertName}
                        </h4>
                        <VerificationBadge size="sm" />
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C96F42]/15 text-[#C96F42] shrink-0">
                          {b.duration}m Sprint
                        </span>
                      </div>
                      <p className="text-xs text-[#7B6C60] font-medium leading-relaxed break-words overflow-wrap-anywhere min-w-0">
                        Topic: <span className="text-[#342A24] font-semibold">{b.topic}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#7B6C60] min-w-0">
                        <div className="flex items-center gap-1 shrink-0">
                          <Clock size={12} className="text-[#C96F42]" />
                          <span className="font-mono font-medium">{b.scheduledTime}</span>
                        </div>
                        <span className="hidden sm:inline">·</span>
                        <span className="text-[#77816C] font-semibold flex items-center gap-1 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#77816C] animate-pulse" />
                          Ready to connect
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                      onClick={() => navigate("session-room", { bookingId: b.id })}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs flex items-center justify-center gap-2 transition-all hover-btn-lift"
                    >
                      <Video size={14} />
                      <span>Enter Consultation Room</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RECOMMENDED EXPERTS */}
          <div className="p-4 sm:p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-sm space-y-4 w-full min-w-0">
            <div className="flex items-center justify-between border-b border-[#E8DCCB]/80 pb-3 min-w-0">
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#342A24] truncate">
                  Recommended Specialists
                </h3>
                <p className="text-[11px] text-[#7B6C60] truncate">
                  Vetted practitioners matching your recent project topics
                </p>
              </div>
              <button
                onClick={() => navigate("experts")}
                className="text-xs font-semibold text-[#C96F42] hover:underline shrink-0 ml-2"
              >
                View all ({experts.length}) →
              </button>
            </div>

            <div className="space-y-3 w-full min-w-0">
              {recommendedExperts.map(exp => (
                <div
                  key={exp.id}
                  className="p-4 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] hover:border-[#C96F42]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full min-w-0"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <img
                      src={exp.avatar}
                      alt={exp.name}
                      className="w-11 h-11 rounded-[10px] object-cover border border-[#E8DCCB] shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                        <span className="font-serif font-bold text-sm text-[#342A24] break-words">
                          {exp.name}
                        </span>
                        <VerificationBadge size="sm" />
                        <span className="text-[10px] text-[#7B6C60]">· {exp.companyOrOrg}</span>
                      </div>
                      <p className="text-xs text-[#7B6C60] line-clamp-2 break-words leading-relaxed">{exp.headline}</p>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <RatingStars rating={exp.rating} count={exp.reviewCount} size="sm" />
                        <span className="text-[10px] font-mono text-[#C96F42] font-semibold">
                          ₹{exp.pricing.duration10}/10m
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => openBookingModal(exp, 10)}
                      className="w-full sm:w-auto px-4 py-2 rounded-[8px] bg-[#342A24] hover:bg-[#28201A] text-[#FFF9F2] text-xs font-semibold transition-colors flex items-center justify-center"
                    >
                      Book 10m
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVE PROJECTS */}
          <div className="p-4 sm:p-6 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-sm space-y-4 w-full min-w-0">
            <div className="flex items-center justify-between border-b border-[#E8DCCB]/80 pb-3 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <FolderOpen size={17} className="text-[#77816C] shrink-0" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#342A24] truncate">
                  Active Workspaces & Projects
                </h3>
              </div>
              <button
                onClick={() => navigate("user-projects")}
                className="text-xs font-semibold text-[#C96F42] hover:underline shrink-0 ml-2"
              >
                Manage Projects →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full min-w-0">
              {projects.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => navigate("user-projects")}
                  className="p-4 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] hover:border-[#C96F42]/40 transition-colors cursor-pointer space-y-1.5 min-w-0"
                >
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <span className="font-serif font-bold text-sm text-[#342A24] truncate min-w-0">
                      {proj.title}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#77816C]/15 text-[#77816C] shrink-0">
                      {proj.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7B6C60] line-clamp-2 leading-relaxed break-words">
                    {proj.description}
                  </p>
                  <div className="pt-2 border-t border-[#E8DCCB]/60 flex items-center justify-between text-[10px] text-[#7B6C60] min-w-0">
                    <span>{proj.consultationIds.length} Linked Consultations</span>
                    <span className="text-[#342A24] font-medium truncate">{proj.tags[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Span 4: Supporting Information) */}
        <div className="lg:col-span-4 space-y-6 w-full min-w-0">
          {/* STATS OVERVIEW */}
          <div className="p-5 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-sm space-y-4 w-full min-w-0">
            <h3 className="font-serif font-bold text-base text-[#342A24]">
              Resolution Performance
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] min-w-0">
                <span className="text-[10px] text-[#7B6C60] block truncate">Roadblocks Unblocked</span>
                <div className="font-serif text-2xl font-bold text-[#342A24]">
                  {pastBookings.length + 3}
                </div>
                <span className="text-[9px] font-semibold text-[#77816C] block truncate">100% resolution</span>
              </div>
              <div className="p-3 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] min-w-0">
                <span className="text-[10px] text-[#7B6C60] block truncate">Minutes Consulted</span>
                <div className="font-serif text-2xl font-bold text-[#C96F42]">
                  {(pastBookings.length + 3) * 10}m
                </div>
                <span className="text-[9px] text-[#7B6C60] block truncate">Avg. 10m sprint</span>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY & NOTES */}
          <div className="p-5 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-sm space-y-3 w-full min-w-0">
            <div className="flex items-center justify-between min-w-0">
              <h3 className="font-serif font-bold text-base text-[#342A24] truncate">
                Recent Consultation Notes
              </h3>
              <button
                onClick={() => navigate("user-history")}
                className="text-[11px] font-semibold text-[#C96F42] hover:underline shrink-0 ml-2"
              >
                View History
              </button>
            </div>

            <div className="space-y-2.5 w-full min-w-0">
              <div
                onClick={() => navigate("user-history")}
                className="p-3 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] hover:border-[#C96F42]/40 transition-colors cursor-pointer space-y-1 min-w-0"
              >
                <div className="flex items-center justify-between text-xs min-w-0">
                  <span className="font-bold text-[#342A24] truncate">Dr. Elena Rostova</span>
                  <span className="text-[10px] font-mono text-[#7B6C60] shrink-0 ml-1">2 days ago</span>
                </div>
                <p className="text-[11px] text-[#7B6C60] line-clamp-1 break-words">
                  Topic: Postgres Indexing & Query Plan Tuning
                </p>
                <div className="flex items-center gap-1 text-[10px] text-[#C96F42] font-semibold pt-1">
                  <FileText size={11} className="shrink-0" />
                  <span>3 Action Items Recorded</span>
                </div>
              </div>

              <div
                onClick={() => navigate("user-history")}
                className="p-3 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] hover:border-[#C96F42]/40 transition-colors cursor-pointer space-y-1 min-w-0"
              >
                <div className="flex items-center justify-between text-xs min-w-0">
                  <span className="font-bold text-[#342A24] truncate">Marcus Thorne</span>
                  <span className="text-[10px] font-mono text-[#7B6C60] shrink-0 ml-1">Last week</span>
                </div>
                <p className="text-[11px] text-[#7B6C60] line-clamp-1 break-words">
                  Topic: WebRTC ICE Connectivity Debugging
                </p>
                <div className="flex items-center gap-1 text-[10px] text-[#C96F42] font-semibold pt-1">
                  <FileText size={11} className="shrink-0" />
                  <span>Architecture SVG Shared</span>
                </div>
              </div>
            </div>
          </div>

          {/* SAVED SPECIALISTS */}
          <div className="p-5 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-sm space-y-3 w-full min-w-0">
            <div className="flex items-center justify-between min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <Bookmark size={15} className="text-[#C96F42] shrink-0" />
                <h3 className="font-serif font-bold text-base text-[#342A24] truncate">
                  Saved Specialists
                </h3>
              </div>
            </div>

            <div className="space-y-2 w-full min-w-0">
              {savedExperts.map(exp => (
                <div
                  key={exp.id}
                  className="p-3 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] flex items-center justify-between gap-2 min-w-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <img
                      src={exp.avatar}
                      alt={exp.name}
                      className="w-8 h-8 rounded-[8px] object-cover border border-[#E8DCCB] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-[#342A24] truncate">{exp.name}</div>
                      <div className="text-[10px] text-[#7B6C60] truncate">{exp.companyOrOrg}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => openBookingModal(exp)}
                    className="text-[11px] font-bold text-[#C96F42] hover:underline shrink-0 ml-1"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
