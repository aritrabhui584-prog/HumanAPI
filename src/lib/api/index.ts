import { Expert, Booking, ExpertMatch } from "../../types";

const API_BASE = "/api";

export async function fetchExperts(page = 1, limit = 50): Promise<{ data: Expert[]; pagination: any }> {
  try {
    const res = await fetch(`${API_BASE}/experts?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch experts");
    return await res.json();
  } catch (err) {
    console.warn("API fetch error, returning fallback", err);
    throw err;
  }
}

export async function fetchExpertById(id: string): Promise<Expert> {
  const res = await fetch(`${API_BASE}/experts/${id}`);
  if (!res.ok) throw new Error("Expert not found");
  return await res.json();
}

export interface CreateDeploymentCasePayload {
  repositoryUrl: string;
  technology: string;
  deploymentPlatform: string;
  ciCdTool: string;
  problemDescription: string;
  requestedHelp?: string[];
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface DeploymentCaseResponse {
  success: boolean;
  caseId: string;
  deploymentCase: {
    id: string;
    title: string;
    description: string;
    repositoryUrl: string;
    technology: string;
    deploymentPlatform: string;
    ciCdTool: string;
    priority: string;
    status: string;
  };
}

export async function createDeploymentCase(payload: CreateDeploymentCasePayload): Promise<DeploymentCaseResponse> {
  const res = await fetch(`${API_BASE}/deployment-cases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || "Failed to create deployment case");
  }
  return await res.json();
}

export interface DiagnosisResponse {
  caseId: string;
  status: "DIAGNOSED";
  problemTypeId: string;
  problemType: string;
  category: string;
  stage: string;
  cause: string;
  diagnosis: string;
  requiredSkills: string[];
  priority: string;
  confidenceWeight: number;
}

export async function diagnoseDeploymentCase(caseId: string): Promise<DiagnosisResponse> {
  const res = await fetch(`${API_BASE}/deployment-cases/${caseId}/diagnose`, {
    method: "POST"
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || "Failed to diagnose deployment case");
  }
  return await res.json();
}

export interface MatchExpertsResponse {
  caseId: string;
  matches: Array<{
    expertId: string;
    name: string;
    avatar: string;
    headline: string;
    rating: number;
    reviewCount: number;
    experienceYears: number;
    pricing10: number;
    score: number;
    matchReasons: string[];
    relevantSkills: string[];
  }>;
}

export async function matchExpertsForCase(caseId: string): Promise<MatchExpertsResponse> {
  const res = await fetch(`${API_BASE}/deployment-cases/${caseId}/match`, {
    method: "POST"
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || "Failed to match experts for case");
  }
  return await res.json();
}

export async function fetchCaseMatches(caseId: string) {
  const res = await fetch(`${API_BASE}/deployment-cases/${caseId}/matches`);
  if (!res.ok) throw new Error("Failed to fetch matches");
  return await res.json();
}

export async function createBookingApi(payload: {
  expertId: string;
  deploymentCaseId?: string;
  sessionDuration: 5 | 10 | 15;
  scheduledAt?: string;
}) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || "Failed to create booking");
  }
  return await res.json();
}

export async function submitFeedbackApi(payload: {
  sessionId: string;
  rating: number;
  problemResolved: boolean;
  comment: string;
}) {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || "Failed to submit feedback");
  }
  return await res.json();
}

export async function fetchNotificationsApi() {
  const res = await fetch(`${API_BASE}/notifications`);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return await res.json();
}

export { loginApi, verifyEmailOTPApi as verifyOtpApi } from "../../Auth/authApi";

