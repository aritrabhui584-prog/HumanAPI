import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertTriangle, KeyRound, CheckCircle2 } from "lucide-react";
import { HumanAPILogo } from "../brand/HumanAPILogo";

export const AdminLogin: React.FC = () => {
  const { adminAuthStage, adminPendingAuth, adminLogin, adminVerifyOtp, showNotification } = useApp();

  const [email, setEmail] = useState("owner@humanapi.com");
  const [password, setPassword] = useState("adminpass123");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification("Please provide admin credentials.", "error");
      return;
    }
    adminLogin(email, password);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) {
      showNotification("Please enter the complete 6-digit security code.", "error");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      adminVerifyOtp(code);
      setIsVerifying(false);
    }, 300);
  };

  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (!clean && val !== "") return;
    const newOtp = [...otpDigits];
    newOtp[index] = clean.slice(-1);
    setOtpDigits(newOtp);

    // Auto focus next input element
    if (clean && index < 5) {
      const nextInput = document.getElementById(`admin-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    if (newOtp.join("").length === 6 && !newOtp.includes("")) {
      adminVerifyOtp(newOtp.join(""));
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F6F0E7] flex flex-col justify-between p-4 sm:p-6 lg:p-10 font-sans text-[#342A24] selection:bg-[#C96F42]/20">
      {/* Top Header Bar */}
      <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
        <HumanAPILogo variant="navbar" alt="HumanAPI Logo" />
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C96F42]/10 border border-[#C96F42]/20 text-[#C96F42] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck size={14} />
          <span>Internal Admin Portal</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto my-8 p-6 sm:p-8 rounded-[24px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-[14px] bg-[#342A24] text-[#FFF9F2] flex items-center justify-center mx-auto shadow-warm-xs">
            <Lock size={22} />
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#342A24]">
            HumanAPI Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#7B6C60] leading-relaxed">
            Authorized company owners and system administrators only.
          </p>
        </div>

        {adminAuthStage === "otp_required" ? (
          /* STAGE 2: 6-DIGIT ADMIN EMAIL OTP */
          <form onSubmit={handleOtpSubmit} className="space-y-5 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] space-y-1 text-xs">
              <div className="flex items-center justify-between text-[#342A24]">
                <span className="font-semibold">Security Challenge</span>
                <span className="text-[11px] text-[#C96F42] font-bold">2-Factor OTP</span>
              </div>
              <p className="text-[11px] text-[#7B6C60]">
                Sent single-use authorization code to <strong className="text-[#342A24]">{adminPendingAuth?.email || email}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#342A24]">
                6-Digit Security Code
              </label>
              <div className="flex items-center justify-between gap-2">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    id={`admin-otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(index, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-mono font-bold rounded-[10px] bg-[#F6F0E7] border border-[#E8DCCB] text-[#342A24] focus:outline-none focus:border-[#C96F42] focus:bg-[#FFF9F2] transition-colors"
                  />
                ))}
              </div>
            </div>

            <div className="p-3 rounded-[10px] bg-[#77816C]/10 border border-[#77816C]/20 flex items-center justify-between text-xs text-[#342A24]">
              <span>Demo Security Code: <strong className="font-mono text-[#77816C] font-bold">123456</strong></span>
              <button
                type="button"
                onClick={() => {
                  setOtpDigits(["1", "2", "3", "4", "5", "6"]);
                  adminVerifyOtp("123456");
                }}
                className="px-2 py-1 rounded-[6px] bg-[#77816C] text-[#FFF9F2] text-[10px] font-bold"
              >
                Auto-fill
              </button>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-[12px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] font-bold text-xs sm:text-sm shadow-warm-xs flex items-center justify-center gap-2 transition-all"
            >
              {isVerifying ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Verify & Access Control Center</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STAGE 1: EMAIL & PASSWORD ENTRY */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#342A24]">
                Administrator Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="owner@humanapi.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-[11px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs sm:text-sm text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#342A24]">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-3 rounded-[11px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs sm:text-sm text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                />
              </div>
            </div>

            {/* Fast Demo Access Switches */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-[#7B6C60] mb-2">Select Admin Role Account:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("owner@humanapi.com");
                    setPassword("ownerpass123");
                  }}
                  className="py-2 px-2.5 rounded-[9px] border border-[#C96F42]/30 bg-[#C96F42]/10 text-xs font-bold text-[#C96F42] hover:bg-[#C96F42]/20 transition-colors text-left truncate"
                >
                  👑 Platform Owner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@humanapi.com");
                    setPassword("adminpass123");
                  }}
                  className="py-2 px-2.5 rounded-[9px] border border-[#E8DCCB] bg-[#F6F0E7] text-xs font-semibold text-[#342A24] hover:border-[#77816C] transition-colors text-left truncate"
                >
                  🛡️ System Admin
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-[12px] bg-[#342A24] hover:bg-[#1E1714] text-[#FFF9F2] font-bold text-xs sm:text-sm shadow-warm-xs flex items-center justify-center gap-2 transition-all"
              id="admin-login-btn"
            >
              <span>Authenticate Administrator</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        <div className="p-3.5 rounded-[12px] bg-[#B85D3D]/10 border border-[#B85D3D]/20 flex items-start gap-2.5 text-[11px] text-[#B85D3D]">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <p className="leading-tight">
            All administrative logins, permission changes, and moderation actions are logged in an immutable audit log.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#7B6C60]">
        <p>© 2026 HumanAPI Inc. Internal Administrative Control Surface.</p>
      </div>
    </div>
  );
};
