import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { getUserDisplayName } from "../../lib/userUtils";
import {
  User,
  Mail,
  Bell,
  CreditCard,
  Shield,
  CheckCircle2,
  Lock,
  EyeOff,
  Sliders,
  Clock,
  Key,
  Download,
  Trash2,
  Check
} from "lucide-react";

export const UserSettingsView: React.FC = () => {
  const { currentUser, showNotification } = useApp();

  // 28 — CATEGORY-BASED SETTINGS
  const [activeCategory, setActiveCategory] = useState<
    "account" | "profile" | "preferences" | "notifications" | "security" | "privacy" | "billing" | "sessions"
  >("profile");

  // Profile Form State
  const [name, setName] = useState(getUserDisplayName(currentUser));
  const [email, setEmail] = useState(currentUser?.email || "");
  const [title, setTitle] = useState("Lead Platform Architect");
  const [timezone, setTimezone] = useState("Asia/Kolkata (GMT+5:30)");

  // Notifications State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [calendarSync, setCalendarSync] = useState(true);
  const [sessionRecordings, setSessionRecordings] = useState(true);

  // Security & Password
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const categories = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Mail },
    { id: "preferences", label: "Preferences", icon: Sliders },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "privacy", label: "Privacy", icon: EyeOff },
    { id: "billing", label: "Billing & Invoices", icon: CreditCard },
    { id: "sessions", label: "Sessions & History", icon: Clock },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification("Settings updated successfully.", "success");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#C96F42]">
          Settings & Preferences
        </span>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
          Client Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#7B6C60]">
          Configure your personal profile, notification cadence, payment methods, and privacy controls.
        </p>
      </div>

      {/* 28 — FOCUSED PANEL PER CATEGORY LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Category Navigation Sidebar (Cols 4) */}
        <div className="md:col-span-4 space-y-1">
          <div className="p-2 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-xs space-y-0.5">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#C96F42] text-[#FFF9F2] shadow-warm-xs font-bold"
                      : "text-[#7B6C60] hover:text-[#342A24] hover:bg-[#F6F0E7]"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-[#FFF9F2]" : "text-[#7B6C60]"} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Focused Panel (Cols 8) */}
        <div className="md:col-span-8">
          <div className="p-6 sm:p-7 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-sm">
            {/* CATEGORY 1: PROFILE */}
            {activeCategory === "profile" && (
              <form onSubmit={handleSave} className="space-y-5">
                <div className="border-b border-[#E8DCCB]/80 pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#342A24]">Profile Information</h3>
                  <p className="text-xs text-[#7B6C60]">Your public details visible to specialists during consultation booking.</p>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-16 h-16 rounded-[14px] object-cover border border-[#E8DCCB]"
                  />
                  <div>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-[8px] border border-[#E8DCCB] bg-[#F6F0E7] text-xs font-semibold text-[#342A24] hover:bg-[#E8DCCB]/60 transition-colors"
                    >
                      Change Avatar
                    </button>
                    <p className="text-[11px] text-[#7B6C60] mt-1">PNG, JPG up to 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#342A24] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full p-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#342A24] mb-1">Professional Role</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full p-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-semibold text-[#342A24] mb-1">Preferred Timezone</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    className="w-full p-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs transition-colors"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            )}

            {/* CATEGORY 2: ACCOUNT */}
            {activeCategory === "account" && (
              <div className="space-y-4">
                <div className="border-b border-[#E8DCCB]/80 pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#342A24]">Account Credentials</h3>
                  <p className="text-xs text-[#7B6C60]">Manage primary login email and linked single sign-on providers.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#342A24] mb-1">Primary Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24]"
                    />
                  </div>
                  <div className="p-3 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#342A24]">Account Type</span>
                      <p className="text-[11px] text-[#7B6C60]">Client Verified Account · Member since Oct 2024</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#77816C]/15 text-[#77816C] font-bold text-[10px]">
                      Active
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8DCCB]/80 flex justify-between items-center text-xs">
                  <span className="text-[#B85D3D] font-semibold">Danger Zone</span>
                  <button
                    type="button"
                    onClick={() => showNotification("Deactivation requested. Our support team will confirm via email.", "info")}
                    className="px-3 py-1.5 rounded-[8px] border border-[#B85D3D]/30 text-[#B85D3D] hover:bg-[#B85D3D]/10"
                  >
                    Close Account
                  </button>
                </div>
              </div>
            )}

            {/* CATEGORY 3: PREFERENCES */}
            {activeCategory === "preferences" && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-[#E8DCCB]/80 pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#342A24]">Workspace Preferences</h3>
                  <p className="text-xs text-[#7B6C60]">Customize your consultation room audio defaults and code editor theme.</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] cursor-pointer">
                    <div>
                      <span className="font-bold text-[#342A24] block">Default Microphone on Join</span>
                      <span className="text-[#7B6C60]">Automatically enable mic when connecting to specialist rooms.</span>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#C96F42] w-4 h-4" />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] cursor-pointer">
                    <div>
                      <span className="font-bold text-[#342A24] block">Automatic Note Sync</span>
                      <span className="text-[#7B6C60]">Save consultation scratchpad directly to local project notes.</span>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#C96F42] w-4 h-4" />
                  </label>
                </div>
              </div>
            )}

            {/* CATEGORY 4: NOTIFICATIONS */}
            {activeCategory === "notifications" && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-[#E8DCCB]/80 pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#342A24]">Notification Thresholds</h3>
                  <p className="text-xs text-[#7B6C60]">Choose how you receive sprint reminders and follow-up notes.</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] cursor-pointer">
                    <div>
                      <span className="font-bold text-[#342A24] block">Email Reminders & ICS Invites</span>
                      <span className="text-[#7B6C60]">Receive direct calendar invites 15 minutes before sprint start.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={e => setEmailAlerts(e.target.checked)}
                      className="accent-[#C96F42] w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] cursor-pointer">
                    <div>
                      <span className="font-bold text-[#342A24] block">SMS Urgent Alert</span>
                      <span className="text-[#7B6C60]">Instant SMS ping when expert enters room or shares diagnostic brief.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={e => setSmsAlerts(e.target.checked)}
                      className="accent-[#C96F42] w-4 h-4"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* CATEGORY 5: SECURITY */}
            {activeCategory === "security" && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-[#E8DCCB]/80 pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#342A24]">Security & Encryption</h3>
                  <p className="text-xs text-[#7B6C60]">Manage two-factor authentication and active consultation sessions.</p>
                </div>

                <div className="p-4 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#342A24] block">Two-Factor Authentication (2FA)</span>
                    <span className="text-[#7B6C60]">Hardware security key or authenticator app.</span>
                  </div>
                  <button
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      showNotification(twoFactorEnabled ? "2FA disabled." : "2FA enabled.", "info");
                    }}
                    className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold ${
                      twoFactorEnabled
                        ? "bg-[#77816C]/15 text-[#77816C]"
                        : "bg-[#C96F42] text-white"
                    }`}
                  >
                    {twoFactorEnabled ? "Enabled" : "Enable 2FA"}
                  </button>
                </div>

                <div className="p-4 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#342A24] block">Consultation WebRTC Encryption</span>
                    <span className="text-[#7B6C60]">Enforce DTLS 1.2 and SRTP media integrity.</span>
                  </div>
                  <span className="text-[#77816C] font-bold">Enforced</span>
                </div>
              </div>
            )}

            {/* CATEGORY 6: PRIVACY */}
            {activeCategory === "privacy" && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-[#E8DCCB]/80 pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#342A24]">Privacy & Confidentiality</h3>
                  <p className="text-xs text-[#7B6C60]">Control data retention for shared documents, snippets, and notes.</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] space-y-1">
                    <span className="font-bold text-[#342A24]">Zero-Knowledge Screen Streaming</span>
                    <p className="text-[#7B6C60]">
                      Screen content is transmitted purely peer-to-peer via encrypted WebRTC channels. HumanAPI does not record or store client screen streams.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#342A24]">Export Session Logs</span>
                      <p className="text-[#7B6C60]">Download complete JSON log of all completed consultation sessions.</p>
                    </div>
                    <button
                      onClick={() => showNotification("Consultation history exported to JSON.", "success")}
                      className="px-3 py-1.5 rounded-[8px] border border-[#E8DCCB] bg-[#FFF9F2] text-xs font-semibold"
                    >
                      Export
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 7: BILLING */}
            {activeCategory === "billing" && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-[#E8DCCB]/80 pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#342A24]">Payment Methods & Invoicing</h3>
                  <p className="text-xs text-[#7B6C60]">Secure payment processing via Razorpay & Stripe.</p>
                </div>

                <div className="p-4 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[8px] bg-[#FFF9F2] border border-[#E8DCCB] flex items-center justify-center font-bold text-xs text-[#C96F42]">
                      VISA
                    </div>
                    <div>
                      <span className="font-bold text-[#342A24] block">Visa ending in •••• 4242</span>
                      <span className="text-[#7B6C60]">Expires 08/28 · Primary card</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#77816C]/15 text-[#77816C] font-semibold text-[10px]">
                    Verified
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="font-bold text-[#342A24] block">Recent Invoices</span>
                  <div className="border border-[#E8DCCB] rounded-[10px] overflow-hidden">
                    <div className="p-2.5 bg-[#F6F0E7] flex justify-between border-b border-[#E8DCCB]">
                      <span className="font-mono text-[#342A24]">INV-2025-001</span>
                      <span>₹449 (10m sprint with Arjun Mehta)</span>
                      <span className="text-[#77816C] font-semibold">Paid</span>
                    </div>
                    <div className="p-2.5 bg-[#FFF9F2] flex justify-between">
                      <span className="font-mono text-[#342A24]">INV-2025-002</span>
                      <span>₹699 (15m sprint with Elena Rostova)</span>
                      <span className="text-[#77816C] font-semibold">Paid</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 8: SESSIONS */}
            {activeCategory === "sessions" && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-[#E8DCCB]/80 pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#342A24]">Active Logged-In Sessions</h3>
                  <p className="text-xs text-[#7B6C60]">Devices and browsers currently authenticated to your account.</p>
                </div>

                <div className="space-y-2">
                  <div className="p-3.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#342A24] block">Current Browser (Chrome on macOS)</span>
                      <span className="text-[#7B6C60]">IP 152.58.12.9 · Active right now</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#77816C]/15 text-[#77816C] font-semibold text-[10px]">
                      This Device
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
