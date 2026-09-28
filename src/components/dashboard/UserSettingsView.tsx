import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { getUserDisplayName, getUserAvatarUrl, isDefaultAvatar, getProfileCompletionDetails } from "../../lib/userUtils";
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
  Check,
  Upload,
  AlertCircle,
  Phone,
  Calendar as CalendarIcon,
  MapPin,
  Globe
} from "lucide-react";

export const UserSettingsView: React.FC = () => {
  const { currentUser, updateUserProfile, uploadProfilePhoto, removeProfilePhoto, showNotification } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 28 — CATEGORY-BASED SETTINGS
  const [activeCategory, setActiveCategory] = useState<
    "account" | "profile" | "preferences" | "notifications" | "security" | "privacy" | "billing" | "sessions"
  >("profile");

  // Profile Form State
  const [name, setName] = useState(getUserDisplayName(currentUser));
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState(currentUser?.dateOfBirth || currentUser?.dob || "");
  const [city, setCity] = useState(currentUser?.city || "");
  const [origin, setOrigin] = useState(currentUser?.origin || "");
  const [title, setTitle] = useState("Lead Platform Architect");
  const [timezone, setTimezone] = useState("Asia/Kolkata (GMT+5:30)");
  const [isSaving, setIsSaving] = useState(false);

  // Notifications State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Security & Password
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Calculate live completion details
  const draftUser = {
    ...currentUser,
    name,
    email,
    phone,
    dateOfBirth,
    city,
    origin,
    avatar: currentUser?.avatar
  };
  const completion = getProfileCompletionDetails(draftUser);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (JPG, PNG, WebP)
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      showNotification("Invalid file format. Please upload JPG, PNG, or WebP.", "error");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification("File size exceeds 5MB limit.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      await uploadProfilePhoto(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await updateUserProfile({
      name,
      phone,
      dateOfBirth,
      city,
      origin
    });
    setIsSaving(false);
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
                  <p className="text-xs text-[#7B6C60]">Mandatory profile details required prior to booking expert consultations.</p>
                </div>

                {/* PROFILE COMPLETION PROGRESS BAR */}
                <div className="p-4 rounded-[14px] bg-[#F6F0E7] border border-[#E8DCCB] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#342A24]">Profile Completion</span>
                    <span className={completion.isComplete ? "text-[#77816C]" : "text-[#C96F42]"}>
                      {completion.percentage}% {completion.isComplete ? "✓ Complete" : ""}
                    </span>
                  </div>
                  <div className="w-full bg-[#E8DCCB] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${completion.isComplete ? "bg-[#77816C]" : "bg-[#C96F42]"}`}
                      style={{ width: `${completion.percentage}%` }}
                    />
                  </div>
                  {!completion.isComplete && (
                    <p className="text-[11px] text-[#7B6C60]">
                      Missing fields: {completion.missingFields.map(m => m.label).join(", ")}
                    </p>
                  )}
                </div>

                {/* PROFILE PHOTO UPLOAD / REMOVE */}
                <div className="flex items-center gap-4">
                  <img
                    src={getUserAvatarUrl(currentUser)}
                    alt={getUserDisplayName(currentUser)}
                    className="w-16 h-16 rounded-[14px] object-cover border border-[#E8DCCB]"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-[8px] border border-[#E8DCCB] bg-[#F6F0E7] text-xs font-semibold text-[#342A24] hover:bg-[#E8DCCB]/60 transition-colors flex items-center gap-1.5"
                      >
                        <Upload size={14} />
                        <span>Upload Photo</span>
                      </button>
                      {!isDefaultAvatar(currentUser?.avatar) && (
                        <button
                          type="button"
                          onClick={() => removeProfilePhoto()}
                          className="px-3 py-1.5 rounded-[8px] border border-[#B85D3D]/30 text-[#B85D3D] hover:bg-[#B85D3D]/10 text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#7B6C60]">JPG, PNG, or WebP up to 5MB</p>
                  </div>
                </div>

                {/* 7 MANDATORY PROFILE FIELDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#342A24] mb-1">
                      Full Name <span className="text-[#C96F42]">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full p-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#342A24] mb-1">
                      Email Address <span className="text-[#C96F42]">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full p-2.5 rounded-[10px] bg-[#E8DCCB]/40 border border-[#E8DCCB] text-[#7B6C60] cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#342A24] mb-1">
                      Phone Number <span className="text-[#C96F42]">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full p-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#342A24] mb-1">
                      Date of Birth <span className="text-[#C96F42]">*</span>
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={e => setDateOfBirth(e.target.value)}
                      className="w-full p-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#342A24] mb-1">
                      City <span className="text-[#C96F42]">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full p-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#342A24] mb-1">
                      Origin / Home Region <span className="text-[#C96F42]">*</span>
                    </label>
                    <input
                      type="text"
                      value={origin}
                      onChange={e => setOrigin(e.target.value)}
                      placeholder="e.g. Karnataka, India"
                      className="w-full p-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <label className="block font-semibold text-[#342A24] mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full p-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#342A24] mb-1">Preferred Timezone</label>
                    <input
                      type="text"
                      value={timezone}
                      onChange={e => setTimezone(e.target.value)}
                      className="w-full p-2.5 rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-[10px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs transition-colors disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Profile Changes"}
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
                      disabled
                      className="w-full p-2.5 rounded-[10px] bg-[#E8DCCB]/40 border border-[#E8DCCB] text-[#7B6C60] cursor-not-allowed"
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

export default UserSettingsView;
