import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { VerificationBadge } from "../common/Badge";
import {
  User,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  Video,
  Bell,
  CreditCard,
  Key,
  Globe,
  LogOut,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Save,
  RefreshCw,
  Sparkles,
  Smartphone,
  Laptop,
  ArrowRight
} from "lucide-react";

interface ExpertSettingsViewProps {
  onNavigateTab: (tab: string) => void;
}

export const ExpertSettingsView: React.FC<ExpertSettingsViewProps> = ({ onNavigateTab }) => {
  const { currentUser, experts, showNotification, logout, navigate } = useApp();

  const myExpert = experts.find(e => e.id === currentUser?.expertProfileId) || experts[0];

  // Active section in settings
  const [activeSection, setActiveSection] = useState<
    "account" | "profile" | "consultations" | "notifications" | "payments" | "security" | "preferences" | "danger"
  >("account");

  // Form states
  const [firstName, setFirstName] = useState(currentUser?.name?.split(" ")[0] || "Aritra");
  const [lastName, setLastName] = useState(currentUser?.name?.split(" ").slice(1).join(" ") || "Bhui");
  const [email] = useState(currentUser?.email || "aritra@humanapi.io");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [headline, setHeadline] = useState(myExpert.headline || "Staff Engineer & Distributed Systems Consultant");
  const [bio, setBio] = useState(myExpert.bio || "Passionate about high-throughput messaging, clean architectural abstractions, and high-impact consultations.");

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification toggles
  const [notifState, setNotifState] = useState({
    emailNotif: true,
    newBooking: true,
    sessionReminder: true,
    clientMessage: true,
    clientCancellation: true,
    newReview: true,
    payoutUpdates: true,
    securityAlerts: true // Locked ON
  });

  // Session preferences
  const [autoAccept, setAutoAccept] = useState(true);
  const [bufferMinutes, setBufferMinutes] = useState(5);
  const [instantBooking, setInstantBooking] = useState(myExpert.availableToday);

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSaveAccountInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      showNotification("Personal information saved successfully.", "success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }, 400);
  };

  const handleSaveProfileInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      showNotification("Expert profile updated.", "success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }, 400);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showNotification("Password must be at least 6 characters long.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification("New passwords do not match.", "error");
      return;
    }

    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showNotification("Password updated. Mandatory OTP policy enforced for next sign-in.", "success");
    }, 600);
  };

  const categories = [
    { id: "account", label: "Personal Information", icon: User, desc: "Name, email & contact details" },
    { id: "profile", label: "Expert Profile", icon: ShieldCheck, desc: "Public headline, bio & credentials" },
    { id: "consultations", label: "Consultation Preferences", icon: Video, desc: "Instant booking & buffers" },
    { id: "notifications", label: "Notification Preferences", icon: Bell, desc: "Email & session reminders" },
    { id: "payments", label: "Payments & Payouts", icon: CreditCard, desc: "Payout methods & tax info" },
    { id: "security", label: "Privacy & Security", icon: Key, desc: "Password, OTP & active sessions" },
    { id: "preferences", label: "Account Preferences", icon: Globe, desc: "Language & theme options" },
    { id: "danger", label: "Danger Zone", icon: Trash2, desc: "Sign out & delete account", isDestructive: true },
  ];

  return (
    <div className="space-y-6 max-w-6xl font-sans">
      {/* PAGE HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#74806B]">
            Expert Workspace
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#332720]">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#75675C]">
            Manage your account, expert profile, availability, security, and platform preferences.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => navigate("expert-detail", { expertId: myExpert.id })}
            className="px-4 py-2 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] hover:bg-[#DED3C6]/50 text-xs font-bold text-[#332720] flex items-center gap-1.5 transition-colors"
          >
            <span>View Public Profile</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* SETTINGS WORKSPACE (DESKTOP TWO-COLUMN / MOBILE RESPONSIVE STACK) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CATEGORY NAVIGATION */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-1">
          {/* Mobile Category Dropdown / Horizontal Switcher */}
          <div className="md:hidden p-1 rounded-2xl bg-[#FFF9F0] border border-[#DED3C6] flex overflow-x-auto scrollbar-none gap-1 mb-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeSection === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveSection(cat.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-2 transition-all ${
                    isActive
                      ? "bg-[#74806B] text-[#FFF9F0] shadow-warm-xs"
                      : "text-[#75675C] hover:text-[#332720]"
                  }`}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Category Navigation List */}
          <div className="hidden md:block p-2 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] space-y-1 shadow-warm-sm">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeSection === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveSection(cat.id as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs text-left transition-all ${
                    isActive
                      ? cat.isDestructive
                        ? "bg-[#B85D3D] text-[#FFF9F0] font-bold shadow-warm-xs"
                        : "bg-[#74806B] text-[#FFF9F0] font-bold shadow-warm-xs"
                      : cat.isDestructive
                      ? "text-[#B85D3D] hover:bg-[#B85D3D]/10"
                      : "text-[#75675C] hover:text-[#332720] hover:bg-[#F7F1E7]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon size={16} className={isActive ? "text-[#FFF9F0]" : cat.isDestructive ? "text-[#B85D3D]" : "text-[#75675C]"} />
                    <div className="min-w-0">
                      <div className="font-bold truncate">{cat.label}</div>
                      <div className={`text-[10px] truncate ${isActive ? "text-[#FFF9F0]/80" : "text-[#75675C]"}`}>
                        {cat.desc}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={14} className={isActive ? "text-[#FFF9F0]" : "text-[#75675C]/50"} />
                </button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT COLUMN: MAIN CONTENT WORKSPACE */}
        <main className="md:col-span-8 lg:col-span-9 space-y-6">
          {/* 1. PERSONAL INFORMATION */}
          {activeSection === "account" && (
            <form onSubmit={handleSaveAccountInfo} className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#DED3C6] pb-4">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#332720]">Personal Information</h2>
                  <p className="text-xs text-[#75675C]">Manage your primary profile identity and contact details.</p>
                </div>
                {saveStatus === "saved" && (
                  <span className="text-xs font-semibold text-[#718B68] flex items-center gap-1 bg-[#718B68]/10 px-3 py-1 rounded-full border border-[#718B68]/20">
                    <CheckCircle2 size={14} /> Saved
                  </span>
                )}
              </div>

              {/* Avatar Preview */}
              <div className="flex items-center gap-4">
                <img
                  src={myExpert.avatar}
                  alt={myExpert.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#DED3C6] shadow-warm-xs"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#332720]">{myExpert.name}</span>
                    <VerificationBadge size="sm" />
                  </div>
                  <p className="text-xs text-[#75675C]">Verified Expert Practitioner</p>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#332720] mb-1.5">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] text-[#332720] focus:outline-none focus:border-[#74806B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#332720] mb-1.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] text-[#332720] focus:outline-none focus:border-[#74806B]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#332720]">Email Address</label>
                    <span className="text-[10px] font-bold text-[#718B68] bg-[#718B68]/10 px-2 py-0.5 rounded-full border border-[#718B68]/20 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Verified
                    </span>
                  </div>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7]/60 border border-[#DED3C6] text-[#75675C] cursor-not-allowed font-mono text-[11px]"
                  />
                  <span className="text-[10px] text-[#75675C] mt-1 block">
                    Email is required for mandatory 2FA security verification.
                  </span>
                </div>
                <div>
                  <label className="block font-bold text-[#332720] mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] text-[#332720] focus:outline-none focus:border-[#74806B]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saveStatus === "saving"}
                  className="px-6 py-2.5 rounded-xl bg-[#74806B] hover:bg-[#5E6956] text-[#FFF9F0] text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-all"
                >
                  {saveStatus === "saving" ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* 2. EXPERT PROFILE SETTINGS */}
          {activeSection === "profile" && (
            <form onSubmit={handleSaveProfileInfo} className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#DED3C6] pb-4">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#332720]">Professional Profile</h2>
                  <p className="text-xs text-[#75675C]">Configure how your expertise and headline appear on HumanAPI.</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("expert-detail", { expertId: myExpert.id })}
                  className="text-xs font-bold text-[#C86B3C] hover:underline flex items-center gap-1"
                >
                  <span>View Public Profile</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#332720] mb-1.5">Professional Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] text-[#332720] focus:outline-none focus:border-[#74806B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#332720] mb-1.5">Biography & Specialty</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] text-[#332720] focus:outline-none focus:border-[#74806B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#332720] mb-1.5">Primary Category</label>
                    <input
                      type="text"
                      disabled
                      value={myExpert.category}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7]/60 border border-[#DED3C6] text-[#75675C] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#332720] mb-1.5">Experience (Years)</label>
                    <input
                      type="text"
                      disabled
                      value={`${myExpert.experienceYears} Years Verified Experience`}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7]/60 border border-[#DED3C6] text-[#75675C] cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Skills tags */}
                <div>
                  <label className="block font-bold text-[#332720] mb-1.5">Verified Skills</label>
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#F7F1E7] border border-[#DED3C6]">
                    {myExpert.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#FFF9F0] border border-[#DED3C6] text-[11px] font-bold text-[#74806B]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saveStatus === "saving"}
                  className="px-6 py-2.5 rounded-xl bg-[#74806B] hover:bg-[#5E6956] text-[#FFF9F0] text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-all"
                >
                  <Save size={14} />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          )}

          {/* 3. CONSULTATION SETTINGS */}
          {activeSection === "consultations" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-6 text-xs">
              <div className="border-b border-[#DED3C6] pb-4">
                <h2 className="font-serif font-bold text-lg text-[#332720]">Consultation Preferences</h2>
                <p className="text-xs text-[#75675C]">Configure instant booking rules, buffer times, and session defaults.</p>
              </div>

              <div className="space-y-4">
                {/* Instant Booking Toggle */}
                <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#332720]">Instant Consultation Availability</span>
                    <p className="text-[11px] text-[#75675C]">Allow clients to book same-day sprint sessions during active windows.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={instantBooking}
                    onChange={e => {
                      setInstantBooking(e.target.checked);
                      showNotification(e.target.checked ? "Instant booking enabled." : "Instant booking paused.", "info");
                    }}
                    className="accent-[#74806B] w-4 h-4 cursor-pointer"
                  />
                </div>

                {/* Buffer time selection */}
                <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] space-y-2">
                  <span className="font-bold text-[#332720]">Inter-Session Buffer Window</span>
                  <p className="text-[11px] text-[#75675C]">Automatic rest window between consecutive 5/10/15m video consultations.</p>
                  <div className="flex gap-2 pt-1">
                    {[0, 5, 10, 15].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setBufferMinutes(mins)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                          bufferMinutes === mins
                            ? "bg-[#74806B] text-[#FFF9F0] shadow-warm-xs"
                            : "bg-[#FFF9F0] text-[#75675C] border border-[#DED3C6]"
                        }`}
                      >
                        {mins === 0 ? "No Buffer" : `${mins} mins`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Link Navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigateTab("calendar")}
                    className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] hover:border-[#74806B] text-left space-y-1 transition-all group"
                  >
                    <div className="flex items-center justify-between font-bold text-[#332720]">
                      <span>Availability Calendar</span>
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-[#75675C]">Set weekly working hours and custom time slots.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateTab("pricing")}
                    className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] hover:border-[#74806B] text-left space-y-1 transition-all group"
                  >
                    <div className="flex items-center justify-between font-bold text-[#332720]">
                      <span>Sprint Rates (5/10/15m)</span>
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-[#75675C]">Adjust pricing for 5, 10, and 15-minute consultation options.</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. NOTIFICATION SETTINGS */}
          {activeSection === "notifications" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-6 text-xs">
              <div className="border-b border-[#DED3C6] pb-4">
                <h2 className="font-serif font-bold text-lg text-[#332720]">Notification Preferences</h2>
                <p className="text-xs text-[#75675C]">Control email, browser, and SMS reminders for active consultations.</p>
              </div>

              <div className="space-y-3">
                {[
                  { key: "emailNotif", label: "Email Notifications", desc: "Receive email updates for platform events." },
                  { key: "newBooking", label: "New Client Booking", desc: "Immediate alert when a client books a consultation sprint." },
                  { key: "sessionReminder", label: "Upcoming Session Reminders", desc: "15-minute and 5-minute pre-session notifications." },
                  { key: "clientMessage", label: "Client Follow-up Messages", desc: "Alerts when clients send follow-up questions." },
                  { key: "clientCancellation", label: "Client Cancellations", desc: "Instant notifications if a client reschedules or cancels." },
                  { key: "newReview", label: "Client Review Published", desc: "Notify when a client leaves a rating and feedback." },
                  { key: "payoutUpdates", label: "Payout Disbursement Updates", desc: "Notifications on earnings transfers and payout statuses." },
                  { key: "securityAlerts", label: "Security & Login Alerts", desc: "Mandatory security notifications.", isLocked: true }
                ].map((item) => (
                  <div key={item.key} className="p-3.5 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] flex items-center justify-between">
                    <div className="space-y-0.5 min-w-0 pr-4">
                      <span className="font-bold text-[#332720]">{item.label}</span>
                      <p className="text-[11px] text-[#75675C]">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      disabled={item.isLocked}
                      checked={(notifState as any)[item.key]}
                      onChange={e => setNotifState({ ...notifState, [item.key]: e.target.checked })}
                      className="accent-[#74806B] w-4 h-4 cursor-pointer shrink-0 disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => showNotification("Notification preferences saved.", "success")}
                  className="px-6 py-2.5 rounded-xl bg-[#74806B] hover:bg-[#5E6956] text-[#FFF9F0] text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-all"
                >
                  <Save size={14} />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. PAYMENTS & PAYOUTS SETTINGS */}
          {activeSection === "payments" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-[#DED3C6] pb-4">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#332720]">Payments & Payouts</h2>
                  <p className="text-xs text-[#75675C]">Manage disbursement methods, direct bank transfers, and tax records.</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab("earnings")}
                  className="px-3.5 py-1.5 rounded-xl bg-[#718B68] text-white font-bold hover:bg-[#5E7356] transition-colors"
                >
                  View Earnings →
                </button>
              </div>

              {/* Balance Card */}
              <div className="p-5 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#75675C]">Available for Payout</span>
                  <div className="font-serif text-2xl font-bold text-[#718B68]">₹16,236</div>
                  <span className="text-[10px] text-[#75675C]">88% Net Expert Rate (12% platform fee deducted)</span>
                </div>
                <button
                  type="button"
                  onClick={() => showNotification("Payout request initiated. Funds will arrive within 1-2 business days.", "success")}
                  className="px-4 py-2 rounded-xl bg-[#718B68] text-white font-bold shadow-warm-xs"
                >
                  Request Payout
                </button>
              </div>

              {/* Supported Payout Methods Entry Point */}
              <div className="space-y-3">
                <span className="font-bold text-[#332720] block">Supported Payout Channels</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                  {["UPI (Google Pay / Paytm)", "Direct Bank Transfer (NEFT)", "PayPal", "PhonePe", "Razorpay Route", "HDFC Direct"].map((m, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] font-bold text-[#74806B] text-[11px]">
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. PRIVACY & SECURITY */}
          {activeSection === "security" && (
            <div className="space-y-6">
              {/* Change Password Form */}
              <form onSubmit={handleUpdatePassword} className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-6 text-xs">
                <div className="border-b border-[#DED3C6] pb-4">
                  <h2 className="font-serif font-bold text-lg text-[#332720]">Password & Authentication</h2>
                  <p className="text-xs text-[#75675C]">Update your password. Password updates mandate 6-digit Email OTP on next sign-in.</p>
                </div>

                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="block font-bold text-[#332720] mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#332720] mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#332720] mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-start">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-6 py-2.5 rounded-xl bg-[#74806B] hover:bg-[#5E6956] text-[#FFF9F0] font-bold shadow-warm-sm flex items-center gap-2 transition-all"
                  >
                    {isChangingPassword ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />}
                    <span>Update Password</span>
                  </button>
                </div>
              </form>

              {/* Active Sessions */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-[#DED3C6] pb-3">
                  <h3 className="font-serif font-bold text-base text-[#332720]">Active Logged-In Sessions</h3>
                  <button
                    type="button"
                    onClick={() => showNotification("Other sessions signed out.", "info")}
                    className="text-[#C86B3C] font-bold hover:underline"
                  >
                    Sign out other sessions
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="p-3.5 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Laptop size={18} className="text-[#74806B]" />
                      <div>
                        <span className="font-bold text-[#332720]">Windows • Chrome (Current Device)</span>
                        <p className="text-[11px] text-[#75675C]">Kolkata, India · Active now</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-[#718B68]/10 text-[#718B68] px-2.5 py-0.5 rounded-full border border-[#718B68]/20">
                      Active Session
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone size={18} className="text-[#75675C]" />
                      <div>
                        <span className="font-bold text-[#332720]">Android • Chrome</span>
                        <p className="text-[11px] text-[#75675C]">Kolkata, India · Active 2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. ACCOUNT PREFERENCES */}
          {activeSection === "preferences" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-6 text-xs">
              <div className="border-b border-[#DED3C6] pb-4">
                <h2 className="font-serif font-bold text-lg text-[#332720]">Account Preferences</h2>
                <p className="text-xs text-[#75675C]">Language and interface visual mode settings.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block font-bold text-[#332720] mb-1.5">Platform Language</label>
                  <select className="w-full p-2.5 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] font-bold text-[#332720]">
                    <option value="en">English (US)</option>
                    <option value="bn">Bengali (বাংলা)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#332720] mb-1.5">Appearance Mode</label>
                  <div className="p-3.5 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#332720]">HumanAPI Editorial Theme</span>
                      <p className="text-[11px] text-[#75675C]">Warm Ivory (#F6F0E7) & Cocoa (#342A24) default theme.</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#74806B] bg-[#74806B]/10 px-2.5 py-0.5 rounded-full border border-[#74806B]/20">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. DANGER ZONE */}
          {activeSection === "danger" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#B85D3D]/30 shadow-warm-sm space-y-6 text-xs">
              <div className="border-b border-[#B85D3D]/20 pb-4">
                <h2 className="font-serif font-bold text-lg text-[#B85D3D]">Danger Zone</h2>
                <p className="text-xs text-[#75675C]">Account termination and session termination options.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#DED3C6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-[#332720]">Sign Out of Workspace</span>
                    <p className="text-[11px] text-[#75675C]">Safely terminate your active expert session on this device.</p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="px-4 py-2 rounded-xl bg-[#F7F1E7] border border-[#DED3C6] hover:bg-[#DED3C6]/50 text-[#332720] font-bold transition-colors self-start sm:self-auto"
                  >
                    Sign Out
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#B85D3D]/5 border border-[#B85D3D]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-[#B85D3D]">Delete Account</span>
                    <p className="text-[11px] text-[#75675C]">Permanently delete your expert profile, consultation records, and data.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#B85D3D] hover:bg-[#A34D2E] text-[#FFF9F0] font-bold transition-colors self-start sm:self-auto shadow-warm-xs"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CONFIRMATION MODAL: DELETE ACCOUNT */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342A24]/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-lg space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#B85D3D]/10 text-[#B85D3D] flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#332720]">
              Delete your HumanAPI account?
            </h3>
            <p className="text-xs text-[#75675C] leading-relaxed">
              This action is permanent and cannot be undone. All active consultations, earnings records, and public profile data will be erased.
            </p>
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#DED3C6] bg-[#F7F1E7] text-xs font-bold text-[#332720]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  logout();
                  showNotification("Account deletion request processed.", "info");
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#B85D3D] text-[#FFF9F0] text-xs font-bold shadow-warm-xs"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
