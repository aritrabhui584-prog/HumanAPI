import { RawAuthResponse } from "./authTypes";
import { mapAuthResponse, mapUser } from "./authAdapter";

const API_BASE = typeof window !== "undefined" ? "/api" : (process.env.VITE_APP_URL || "http://localhost:3000") + "/api";

/**
 * Defensive API Response Parser
 * Prevents "Unexpected end of JSON input" and HTML parsing errors on auth requests
 */
async function parseApiResponse<T = any>(res: Response): Promise<{
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
}> {
  const status = res.status;
  let text = "";
  try {
    text = await res.text();
  } catch (e) {
    text = "";
  }

  if (!text || text.trim().length === 0) {
    return {
      ok: res.ok,
      status,
      data: null,
      error: res.ok ? undefined : "Authentication server returned an empty response."
    };
  }

  try {
    const data = JSON.parse(text);
    if (!res.ok || data.error) {
      const errorMsg = typeof data.error === "object"
        ? data.error.message
        : (data.error || data.message || `Request failed with status ${status}.`);
      return { ok: false, status, data, error: errorMsg };
    }
    return { ok: true, status, data };
  } catch (parseErr) {
    if (text.trim().startsWith("<")) {
      return {
        ok: false,
        status,
        data: null,
        error: status >= 500
          ? "HumanAPI authentication service is temporarily unavailable. Please try again."
          : "Authentication service returned an unexpected server response."
      };
    }
    return {
      ok: false,
      status,
      data: null,
      error: "Authentication service returned an invalid response."
    };
  }
}

export async function loginApi(email: string, password?: string): Promise<{
  success: boolean;
  requiresOtp: boolean;
  email: string;
  demoOtp?: string;
  token?: string;
  message?: string;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const parsed = await parseApiResponse<RawAuthResponse>(res);
    if (!parsed.ok || !parsed.data) {
      return {
        success: false,
        requiresOtp: false,
        email,
        error: parsed.error || "The email or password is incorrect."
      };
    }

    const data = parsed.data;
    const mapped = mapAuthResponse(data);
    return {
      success: true,
      requiresOtp: mapped.requiresOtp,
      email: data.user_email || email,
      demoOtp: data.demoOtp || "123456",
      token: mapped.token || undefined,
      message: data.message
    };
  } catch (err: any) {
    return {
      success: false,
      requiresOtp: false,
      email,
      error: err.message || "Unable to reach HumanAPI. Please check your connection and try again."
    };
  }
}

export async function signupApi(data: {
  email: string;
  name: string;
  password: string;
  intentRole?: "client" | "expert";
}): Promise<{
  success: boolean;
  requiresOtp: boolean;
  email: string;
  demoOtp?: string;
  token?: string;
  message?: string;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const parsed = await parseApiResponse<RawAuthResponse>(res);
    if (!parsed.ok || !parsed.data) {
      return {
        success: false,
        requiresOtp: false,
        email: data.email,
        error: parsed.error || "Failed to create account."
      };
    }

    const body = parsed.data;
    const mapped = mapAuthResponse(body);
    return {
      success: true,
      requiresOtp: mapped.requiresOtp,
      email: data.email,
      demoOtp: body.demoOtp || "123456",
      token: mapped.token || undefined,
      message: body.message
    };
  } catch (err: any) {
    return {
      success: false,
      requiresOtp: false,
      email: data.email,
      error: err.message || "Unable to reach HumanAPI. Please check your connection and try again."
    };
  }
}

export async function verifyEmailOTPApi(email: string, code: string): Promise<{
  success: boolean;
  user: any | null;
  token: string | null;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    });

    const parsed = await parseApiResponse<RawAuthResponse>(res);
    if (!parsed.ok || !parsed.data) {
      return {
        success: false,
        user: null,
        token: null,
        error: parsed.error || "The verification code entered is incorrect."
      };
    }

    const body = parsed.data;
    const mapped = mapAuthResponse(body);
    return {
      success: true,
      user: mapped.user,
      token: mapped.token
    };
  } catch (err: any) {
    return {
      success: false,
      user: null,
      token: null,
      error: err.message || "Failed to verify verification code."
    };
  }
}

export async function resendOTPApi(email: string): Promise<{ success: boolean; demoOtp?: string; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const parsed = await parseApiResponse(res);
    if (!parsed.ok || !parsed.data) {
      return { success: false, demoOtp: "123456", message: parsed.error || "Failed to resend verification code." };
    }

    return {
      success: true,
      demoOtp: parsed.data.demoOtp || "123456",
      message: parsed.data.message || "New 6-digit verification code sent to your email address."
    };
  } catch (err) {
    return { success: false, demoOtp: "123456", message: "Verification code sent." };
  }
}

export async function forgotPasswordApi(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const parsed = await parseApiResponse(res);
    if (!parsed.ok || !parsed.data) {
      return { success: false, message: parsed.error || "Failed to send reset email." };
    }

    return {
      success: true,
      message: parsed.data.message || "Password recovery token sent to your email."
    };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function logoutApi(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: "POST" });
  } catch (e) {
    // Ignore logout network failures
  }
}

export async function getCurrentUserApi(email?: string): Promise<any | null> {
  try {
    const query = email ? `?email=${encodeURIComponent(email)}` : "";
    const res = await fetch(`${API_BASE}/auth/current-user${query}`);
    const parsed = await parseApiResponse(res);
    if (!parsed.ok || !parsed.data) return null;
    return mapUser(parsed.data);
  } catch (err) {
    return null;
  }
}
