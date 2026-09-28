import { UserRole, ExpertStatus } from "../types";

export type AuthState = "INITIALIZING" | "AUTHENTICATED" | "UNAUTHENTICATED" | "VERIFYING_EMAIL" | "EXPIRED";

export interface RawAuthResponse {
  success: boolean;
  authStage?: string;
  accessToken?: string;
  token?: string;
  user_id?: string | number;
  user_email?: string;
  user_role?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    avatarUrl?: string;
    phone?: string;
    dateOfBirth?: string;
    city?: string;
    origin?: string;
    role?: string;
    status?: string;
    isExpert?: boolean;
    expertStatus?: ExpertStatus;
    expertProfileId?: string;
    expertId?: string;
    emailVerified?: boolean;
  };
  requiresEmailVerification?: boolean;
  otpSent?: boolean;
  demoOtp?: string;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface NormalizedUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar: string;
  phone?: string;
  dateOfBirth?: string;
  city?: string;
  origin?: string;
  role: UserRole;
  status: "active" | "restricted" | "suspended" | "banned";
  isExpert: boolean;
  expertStatus?: ExpertStatus;
  expertId?: string;
  expertProfileId?: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthSession {
  user: NormalizedUser | null;
  state: AuthState;
  token: string | null;
  pendingEmail?: string;
}
