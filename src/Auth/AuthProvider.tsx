import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, NormalizedUser } from "./authTypes";
import { loginApi, signupApi, verifyEmailOTPApi, resendOTPApi, forgotPasswordApi, logoutApi, getCurrentUserApi } from "./authApi";

interface AuthContextType {
  authState: AuthState;
  currentUser: NormalizedUser | null;
  pendingEmail: string | null;
  token: string | null;
  otpCooldownSeconds: number;
  isInitializing: boolean;

  login: (email: string, password?: string) => Promise<{ success: boolean; requiresOtp: boolean; error?: string }>;
  signup: (data: { email: string; name: string; password: string; intentRole?: "client" | "expert" }) => Promise<{ success: boolean; requiresOtp: boolean; error?: string }>;
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
  resendOtp: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>("INITIALIZING");
  const [currentUser, setCurrentUser] = useState<NormalizedUser | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("humanapi_auth_token");
    }
    return null;
  });
  const [otpCooldownSeconds, setOtpCooldownSeconds] = useState(0);

  // Initialize session on startup
  useEffect(() => {
    async function initSession() {
      const storedEmail = localStorage.getItem("humanapi_auth_email") || "demo.user@humanapi.test";
      const storedToken = localStorage.getItem("humanapi_auth_token");

      if (storedToken || storedEmail) {
        const user = await getCurrentUserApi(storedEmail);
        if (user) {
          setCurrentUser(user);
          setAuthState("AUTHENTICATED");
          setToken(storedToken || `token_${user.id}`);
        } else {
          setAuthState("UNAUTHENTICATED");
        }
      } else {
        setAuthState("UNAUTHENTICATED");
      }
    }
    initSession();
  }, []);

  // OTP Cooldown Timer
  useEffect(() => {
    if (otpCooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setOtpCooldownSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpCooldownSeconds]);

  const login = async (email: string, password?: string) => {
    setPendingEmail(email);
    const result = await loginApi(email, password);

    if (result.success) {
      if (result.requiresOtp) {
        setAuthState("VERIFYING_EMAIL");
        setOtpCooldownSeconds(60);
      } else if (result.token) {
        localStorage.setItem("humanapi_auth_token", result.token);
        localStorage.setItem("humanapi_auth_email", email);
        const user = await getCurrentUserApi(email);
        setCurrentUser(user);
        setAuthState("AUTHENTICATED");
      }
      return { success: true, requiresOtp: result.requiresOtp };
    }

    return { success: false, requiresOtp: false, error: result.error };
  };

  const signup = async (data: { email: string; name: string; password: string; intentRole?: "client" | "expert" }) => {
    setPendingEmail(data.email);
    const result = await signupApi(data);

    if (result.success) {
      setAuthState("VERIFYING_EMAIL");
      setOtpCooldownSeconds(60);
      return { success: true, requiresOtp: true };
    }

    return { success: false, requiresOtp: false, error: result.error };
  };

  const verifyOtp = async (code: string) => {
    const emailToVerify = pendingEmail || localStorage.getItem("humanapi_auth_email") || "demo.user@humanapi.test";
    const result = await verifyEmailOTPApi(emailToVerify, code);

    if (result.success && result.user) {
      setCurrentUser(result.user);
      setAuthState("AUTHENTICATED");
      if (result.token) {
        setToken(result.token);
        localStorage.setItem("humanapi_auth_token", result.token);
      }
      localStorage.setItem("humanapi_auth_email", emailToVerify);
      setPendingEmail(null);
      return { success: true };
    }

    return { success: false, error: result.error || "Verification failed." };
  };

  const resendOtp = async () => {
    const targetEmail = pendingEmail || localStorage.getItem("humanapi_auth_email") || "demo.user@humanapi.test";
    const res = await resendOTPApi(targetEmail);
    if (res.success) {
      setOtpCooldownSeconds(60);
      return true;
    }
    return false;
  };

  const forgotPassword = async (email: string) => {
    return await forgotPasswordApi(email);
  };

  const logout = async () => {
    await logoutApi();
    localStorage.removeItem("humanapi_auth_token");
    localStorage.removeItem("humanapi_auth_email");
    setCurrentUser(null);
    setToken(null);
    setPendingEmail(null);
    setAuthState("UNAUTHENTICATED");
  };

  const refreshCurrentUser = async () => {
    if (currentUser?.email) {
      const user = await getCurrentUserApi(currentUser.email);
      if (user) {
        setCurrentUser(user);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        currentUser,
        pendingEmail,
        token,
        otpCooldownSeconds,
        isInitializing: authState === "INITIALIZING",
        login,
        signup,
        verifyOtp,
        resendOtp,
        forgotPassword,
        logout,
        refreshCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
