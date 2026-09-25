import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { ShieldCheck, ArrowRight, RefreshCw, AlertCircle, Lock } from "lucide-react";
import { HumanAPILoadingButton } from "../loading";

interface EmailOtpVerificationProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  inline?: boolean;
}

export const EmailOtpVerification: React.FC<EmailOtpVerificationProps> = ({
  onSuccess,
  onCancel,
  inline = false
}) => {
  const {
    pendingAuth,
    verifyEmailOtp,
    resendEmailOtp,
    otpCooldownSeconds,
    closeAuthModal,
    showNotification
  } = useApp();

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const maskedEmail = React.useMemo(() => {
    const targetEmail = pendingAuth?.email || "aritra@humanapi.io";
    const parts = targetEmail.split("@");
    if (parts.length !== 2) return targetEmail;
    const [name, domain] = parts;
    if (name.length <= 2) {
      return `${name.charAt(0)}***@${domain}`;
    }
    return `${name.charAt(0)}***${name.charAt(name.length - 1)}@${domain}`;
  }, [pendingAuth?.email]);

  const handleChange = (index: number, value: string) => {
    setErrorMsg(null);
    // Only accept numeric inputs
    const cleanVal = value.replace(/[^0-9]/g, "");
    if (!cleanVal && value !== "") return;

    const newOtp = [...otpDigits];
    newOtp[index] = cleanVal.slice(-1);
    setOtpDigits(newOtp);

    // Auto-advance to next input
    if (cleanVal && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits completed
    const fullCode = newOtp.join("");
    if (fullCode.length === 6 && !newOtp.includes("")) {
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pastedData) return;

    const digits = pastedData.split("");
    const newOtp = ["", "", "", "", "", ""];
    digits.forEach((d, i) => {
      if (i < 6) newOtp[i] = d;
    });
    setOtpDigits(newOtp);

    const targetFocusIndex = Math.min(digits.length, 5);
    if (inputRefs.current[targetFocusIndex]) {
      inputRefs.current[targetFocusIndex]?.focus();
    }

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = (codeToTest?: string) => {
    const code = codeToTest || otpDigits.join("");
    if (code.length < 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    // Small delay to feel natural
    setTimeout(() => {
      const success = verifyEmailOtp(code);
      setIsVerifying(false);
      if (success) {
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg("Invalid or expired verification code. Use code 123456.");
        setOtpDigits(["", "", "", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    }, 400);
  };

  const handleResend = () => {
    if (otpCooldownSeconds > 0) return;
    resendEmailOtp();
    setOtpDigits(["", "", "", "", "", ""]);
    setErrorMsg(null);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  return (
    <div className={`space-y-6 ${inline ? "p-0" : "w-full max-w-md mx-auto font-sans"}`}>
      {/* Header */}
      <div className="space-y-2 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C96F42]/10 border border-[#C96F42]/20 text-[#C96F42] text-[11px] font-bold uppercase tracking-wider">
          <ShieldCheck size={14} />
          <span>Mandatory Security Verification</span>
        </div>
        <h2 className="font-serif font-bold text-2xl text-[#342A24]">
          Verify your email address
        </h2>
        <p className="text-xs text-[#7B6C60] leading-relaxed">
          We sent a 6-digit single-use security code to{" "}
          <strong className="text-[#342A24] font-semibold">{maskedEmail}</strong>. Enter it below to complete authentication.
        </p>
      </div>

      {/* Demo helper banner */}
      <div className="p-3 rounded-[12px] bg-[#F6F0E7] border border-[#E8DCCB] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#342A24]">
          <Lock size={14} className="text-[#C96F42] shrink-0" />
          <span>Demo Verification Code: <strong className="font-mono text-[#C96F42] font-bold">123456</strong></span>
        </div>
        <button
          type="button"
          onClick={() => {
            const demo = ["1", "2", "3", "4", "5", "6"];
            setOtpDigits(demo);
            handleVerify("123456");
          }}
          className="px-2.5 py-1 rounded-[8px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-[11px] font-bold transition-all"
        >
          Auto-fill
        </button>
      </div>

      {/* 6-Digit Input Row */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-[#342A24] text-center md:text-left">
          6-Digit Security Code
        </label>
        <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              autoComplete="one-time-code"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-[12px] bg-[#F6F0E7] border transition-all outline-none ${
                errorMsg
                  ? "border-[#B85D3D] text-[#B85D3D] bg-[#B85D3D]/5"
                  : digit
                  ? "border-[#C96F42] text-[#342A24] bg-[#FFF9F2] shadow-warm-xs"
                  : "border-[#E8DCCB] text-[#342A24] focus:border-[#C96F42] focus:bg-[#FFF9F2]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3 rounded-[10px] bg-[#B85D3D]/10 border border-[#B85D3D]/30 flex items-center gap-2 text-xs text-[#B85D3D] font-medium animate-in fade-in duration-150">
          <AlertCircle size={15} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <HumanAPILoadingButton
          type="button"
          onClick={() => handleVerify()}
          disabled={isVerifying || otpDigits.join("").length < 6}
          isLoading={isVerifying}
          loadingText="Verifying OTP Code..."
          icon={<ArrowRight size={15} />}
          className="w-full py-3.5"
          id="verify-otp-submit-btn"
        >
          Verify OTP & Complete Sign In
        </HumanAPILoadingButton>

        {/* Resend & Back Row */}
        <div className="flex items-center justify-between text-xs pt-2 text-[#7B6C60]">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="hover:text-[#342A24] underline transition-colors"
            >
              Back to Sign In
            </button>
          ) : (
            <button
              type="button"
              onClick={closeAuthModal}
              className="hover:text-[#342A24] underline transition-colors"
            >
              Cancel
            </button>
          )}

          <div>
            {otpCooldownSeconds > 0 ? (
              <span className="text-[#7B6C60] font-mono text-[11px]">
                Resend in <strong className="text-[#342A24]">{otpCooldownSeconds}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-[#C96F42] font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw size={12} />
                <span>Resend OTP Code</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
