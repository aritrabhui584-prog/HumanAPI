import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, Quote } from "lucide-react";
import { EmailOtpVerification } from "../auth/EmailOtpVerification";
import { HumanAPILoadingButton } from "../loading";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, showNotification, navigate } = useApp();

  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "otp">(authModalMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [intentRole, setIntentRole] = useState<"client" | "expert">("client");
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [otpValue, setOtpValue] = useState(["", "", "", ""]);

  // SYNCHRONIZE MODE WITH CONTEXT MODE
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode);
    }
  }, [authModalMode, isAuthModalOpen]);

  // BODY SCROLL LOCK MANAGEMENT
  useEffect(() => {
    if (isAuthModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "";
      };
    }
  }, [isAuthModalOpen]);

  // KEYBOARD ACCESSIBILITY (ESCAPE TO CLOSE)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "aritra@humanapi.io", name || "Aritra Bhui", intentRole === "expert");
    setMode("otp");
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      showNotification("Please accept terms of service to proceed.", "error");
      return;
    }
    login(email || "aritra@humanapi.io", name || "New Member", intentRole === "expert");
    setMode("otp");
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "aritra@humanapi.io", "Member", false);
    setMode("otp");
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#342A24]/60 backdrop-blur-sm animate-in fade-in duration-150 font-sans"
      onClick={closeAuthModal}
      role="dialog"
      aria-modal="true"
    >
      {/* EDITORIAL SPLIT EXPERIENCE: Fits viewport */}
      <div
        className="relative w-[calc(100vw-24px)] max-w-4xl h-[min(92dvh,900px)] max-h-[calc(100dvh-24px)] rounded-[24px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg overflow-hidden flex flex-col md:flex-row text-[#342A24] animate-in zoom-in-95 duration-150 box-border mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 p-2 rounded-[10px] text-[#7B6C60] hover:text-[#342A24] hover:bg-[#F6F0E7] transition-colors"
          id="auth-modal-close-btn"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* LEFT SIDE: EDITORIAL BRANDING & PRACTITIONER QUOTE (Desktop) */}
        <div className="hidden md:flex md:w-5/12 bg-[#F6F0E7] p-8 lg:p-10 flex-col justify-between border-r border-[#E8DCCB] relative overflow-hidden">
          {/* Subtle Ambient Vignette */}
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#C96F42]/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-[#B89152]/10 blur-2xl pointer-events-none" />

          {/* Brand Mark & Mission */}
          <div className="relative z-10 space-y-4">
            <img
              src="/assets/logo.png"
              alt="HumanAPI Logo"
              className="w-10 h-10 object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C96F42]">
                Verified Human Expertise
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#342A24] leading-tight">
                High-leverage micro-consultations for complex systems.
              </h3>
            </div>
            <p className="text-xs text-[#7B6C60] leading-relaxed">
              Skip endless documentation loops and unverified answers. Get directly on a 5, 10, or 15-minute video call with staff engineers and architects.
            </p>
          </div>

          {/* Expert Quote Callout */}
          <div className="relative z-10 p-4 rounded-[16px] bg-[#FFF9F2] border border-[#E8DCCB] space-y-2 shadow-warm-xs">
            <div className="flex items-center gap-1 text-[#C96F42]">
              <Quote size={14} className="fill-[#C96F42]" />
            </div>
            <p className="font-serif italic text-xs text-[#342A24] leading-relaxed">
              "HumanAPI turns days of agonizing over asynchronous state bugs into a 10-minute surgical unlock."
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-[#E8DCCB]/60 text-[10px] text-[#7B6C60]">
              <span className="font-bold text-[#342A24]">Arjun Mehta</span>
              <span>·</span>
              <span>WebRTC & Distributed Systems Specialist</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: CLEAN FORM WORKSPACE (Fits Viewport with internal scroll) */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto space-y-5">
          {/* Modal Header */}
          <div className="space-y-1">
            <h2 className="font-serif font-bold text-2xl text-[#342A24]">
              {mode === "login" && "Welcome back to HumanAPI"}
              {mode === "signup" && "Create your HumanAPI Account"}
              {mode === "forgot" && "Recover your password"}
              {mode === "otp" && "Verify your email"}
            </h2>
            <p className="text-xs text-[#7B6C60]">
              {mode === "login" && "Access your active consultations, workspaces, and specialist notes."}
              {mode === "signup" && "Join the network for direct 5, 10 & 15-minute consultations."}
              {mode === "forgot" && "We'll send you an encrypted recovery token."}
              {mode === "otp" && `Enter the 4-digit code sent to ${email || "your email"}`}
            </p>
          </div>

          {/* Mode Selector Tabs (Login / Signup) */}
          {(mode === "login" || mode === "signup") && (
            <div className="grid grid-cols-2 p-1 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB]">
              <button
                onClick={() => setMode("login")}
                className={`py-2 text-xs font-bold rounded-[9px] transition-all ${
                  mode === "login"
                    ? "bg-[#FFF9F2] text-[#342A24] shadow-warm-xs"
                    : "text-[#7B6C60] hover:text-[#342A24]"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`py-2 text-xs font-bold rounded-[9px] transition-all ${
                  mode === "signup"
                    ? "bg-[#FFF9F2] text-[#342A24] shadow-warm-xs"
                    : "text-[#7B6C60] hover:text-[#342A24]"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* FORM: LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#342A24] mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-3.5 py-3 rounded-[11px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs sm:text-sm text-[#342A24] placeholder-[#7B6C60]/60 focus:outline-none focus:border-[#C96F42]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#342A24]">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[11px] font-semibold text-[#C96F42] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-3 rounded-[11px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs sm:text-sm text-[#342A24] placeholder-[#7B6C60]/60 focus:outline-none focus:border-[#C96F42]"
                  />
                </div>
              </div>

              <HumanAPILoadingButton
                type="submit"
                className="w-full py-3.5"
                id="login-submit-btn"
                icon={<ArrowRight size={14} />}
                loadingText="Verifying Credentials..."
              >
                Sign In to HumanAPI
              </HumanAPILoadingButton>

              {/* Demo Quick Fills */}
              <div className="pt-3 border-t border-[#E8DCCB]/80">
                <p className="text-[11px] text-[#7B6C60] text-center mb-2">Instant Demo Sign-In:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("aritra@developer.io");
                      setPassword("demo123");
                    }}
                    className="py-2 px-2.5 rounded-[9px] border border-[#E8DCCB] bg-[#F6F0E7] text-[11px] font-semibold text-[#342A24] hover:border-[#C96F42] transition-colors"
                  >
                    Client Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("arjun@google.com");
                      setPassword("demo123");
                    }}
                    className="py-2 px-2.5 rounded-[9px] border border-[#E8DCCB] bg-[#F6F0E7] text-[11px] font-semibold text-[#342A24] hover:border-[#77816C] transition-colors"
                  >
                    Expert Demo
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* FORM: SIGNUP */}
          {mode === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#342A24] mb-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-3.5 py-3 rounded-[11px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs sm:text-sm text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#342A24] mb-1">Work Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-3.5 py-3 rounded-[11px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs sm:text-sm text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#342A24] mb-1">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B6C60]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-3.5 py-3 rounded-[11px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs sm:text-sm text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#342A24] mb-1">Primary Intent</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIntentRole("client")}
                    className={`py-2 px-3 rounded-[10px] text-xs font-semibold border transition-all ${
                      intentRole === "client"
                        ? "bg-[#C96F42]/10 border-[#C96F42] text-[#C96F42] font-bold"
                        : "bg-[#F6F0E7] border-[#E8DCCB] text-[#7B6C60]"
                    }`}
                  >
                    I need an expert
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntentRole("expert")}
                    className={`py-2 px-3 rounded-[10px] text-xs font-semibold border transition-all ${
                      intentRole === "expert"
                        ? "bg-[#77816C]/15 border-[#77816C] text-[#77816C] font-bold"
                        : "bg-[#F6F0E7] border-[#E8DCCB] text-[#7B6C60]"
                    }`}
                  >
                    I want to consult
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs text-[#7B6C60]">
                <input
                  type="checkbox"
                  id="terms-check"
                  checked={agreedTerms}
                  onChange={e => setAgreedTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E8DCCB] accent-[#C96F42]"
                />
                <label htmlFor="terms-check" className="cursor-pointer">
                  I agree to HumanAPI's Terms of Service and Privacy Policy
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-[11px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] font-bold text-xs sm:text-sm shadow-warm-xs flex items-center justify-center gap-2 transition-all hover-btn-lift"
              >
                <span>Continue to Verification</span>
                <ArrowRight size={14} />
              </button>
            </form>
          )}

          {/* FORM: OTP VERIFICATION */}
          {mode === "otp" && (
            <EmailOtpVerification inline onCancel={() => setMode("login")} />
          )}

          {/* FORM: FORGOT PASSWORD */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#342A24] mb-1">Registered Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3.5 py-3 rounded-[11px] bg-[#F6F0E7] border border-[#E8DCCB] text-xs sm:text-sm text-[#342A24] focus:outline-none focus:border-[#C96F42]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="flex-1 py-3 rounded-[11px] border border-[#E8DCCB] bg-[#F6F0E7] text-xs font-semibold text-[#342A24]"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-[11px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] font-bold text-xs shadow-warm-xs"
                >
                  Send Token
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
