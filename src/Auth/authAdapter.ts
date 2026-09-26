import { RawAuthResponse, NormalizedUser } from "./authTypes";
import { UserRole, ExpertStatus } from "../types";

export function mapUser(raw: any): NormalizedUser {
  if (!raw) {
    return {
      id: "u-guest",
      email: "guest@humanapi.io",
      name: "Guest User",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      role: "user",
      status: "active",
      isExpert: false,
      emailVerified: false,
      createdAt: new Date().toISOString()
    };
  }

  const rawRole = (raw.role || raw.user_role || "user").toLowerCase();
  let role: UserRole = "user";
  if (rawRole === "admin" || rawRole === "owner") {
    role = "admin";
  } else if (rawRole === "expert") {
    role = "expert";
  }

  const rawStatus = (raw.status || "active").toLowerCase();
  let status: "active" | "restricted" | "suspended" | "banned" = "active";
  if (rawStatus === "banned" || rawStatus === "suspended" || rawStatus === "restricted") {
    status = rawStatus;
  }

  const rawExpertStatus = raw.expertStatus || (raw.isExpert ? "APPROVED" : "NOT_EXPERT");

  return {
    id: String(raw.id || raw.user_id || `u_${Date.now()}`),
    email: raw.email || raw.user_email || "user@humanapi.io",
    name: raw.name || `${raw.firstName || raw.first_name || "Member"} ${raw.lastName || raw.last_name || ""}`.trim(),
    firstName: raw.firstName || raw.first_name || (raw.name ? raw.name.split(" ")[0] : "Member"),
    lastName: raw.lastName || raw.last_name || (raw.name ? raw.name.split(" ").slice(1).join(" ") : ""),
    avatar: raw.avatar || raw.avatarUrl || raw.user_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    role,
    status,
    isExpert: Boolean(raw.isExpert) || rawRole === "expert",
    expertStatus: rawExpertStatus as ExpertStatus,
    expertId: raw.expertId || raw.expertProfileId || raw.expert_id,
    expertProfileId: raw.expertProfileId || raw.expertId || raw.expert_profile_id,
    emailVerified: raw.emailVerified !== undefined ? Boolean(raw.emailVerified) : true,
    createdAt: raw.createdAt || new Date().toISOString()
  };
}

export function mapAuthResponse(response: RawAuthResponse): {
  user: NormalizedUser | null;
  token: string | null;
  requiresOtp: boolean;
  message?: string;
} {
  const token = response.accessToken || response.token || null;
  const requiresOtp = response.authStage === "otp_required" || Boolean(response.requiresEmailVerification);

  let user: NormalizedUser | null = null;
  if (response.user) {
    user = mapUser(response.user);
  } else if (response.user_id || response.user_email) {
    user = mapUser(response);
  }

  return {
    user,
    token,
    requiresOtp,
    message: response.message
  };
}
