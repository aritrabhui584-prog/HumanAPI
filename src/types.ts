export type UserRole = "user" | "expert" | "admin";

export type ExpertStatus =
  | "NOT_EXPERT"
  | "APPLICATION_STARTED"
  | "APPLICATION_SUBMITTED"
  | "ASSESSMENT_REQUIRED"
  | "ASSESSMENT_IN_PROGRESS"
  | "ASSESSMENT_SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "SUSPENDED"
  | "BANNED";

export type AuthStage = "unauthenticated" | "credentials_verified" | "otp_required" | "authenticated";

export interface PendingAuthSession {
  email: string;
  name?: string;
  asExpert?: boolean;
  redirectRoute?: string;
  generatedOtp?: string;
  otpSentAt: number;
  expiresAt: number;
  demoUserObj?: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  isExpert: boolean;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  dob?: string;
  city?: string;
  origin?: string;
  profilePhoto?: string;
  avatarUrl?: string;
  expertStatus?: ExpertStatus;
  expertId?: string;
  expertProfileId?: string;
  headline?: string;
  bio?: string;
  interests?: string[];
  timezone?: string;
  sessionsCompleted?: number;
  totalSpent?: number;
  createdAt: string;
}

export interface SessionPricing {
  duration5: number;   // e.g. ₹199 or $25
  duration10: number;  // e.g. ₹349 or $45
  duration15: number;  // e.g. ₹499 or $65
}

export interface ExpertReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  duration: 5 | 10 | 15;
  sessionTopic?: string;
  tags?: string[];
  recommend?: boolean;
  scores?: {
    helpfulness: number;
    communication: number;
    expertise: number;
  };
}

export interface Expert {
  id: string;
  userId?: string;
  name: string;
  avatar: string;
  headline: string;
  category: string;
  subcategories: string[];
  skills: string[];
  bio: string;
  experienceYears: number;
  currentRole: string;
  companyOrOrg: string;
  isVerified: boolean;
  verificationDate?: string;
  rating: number;
  reviewCount: number;
  completedSessions: number;
  responseTime: string; // e.g. "< 10 mins"
  languages: string[];
  pricing: SessionPricing;
  availableToday: boolean;
  nextAvailableSlot: string;
  badges: string[]; // "Verified Expert", "Top Rated", "Rapid Responder", "Architecture Lead"
  discoverabilityScore: number; // 0-100 calculated from reputation metrics
  reputationBreakdown: {
    ratingScore: number;
    completionScore: number;
    responseScore: number;
    profileCompleteness: number;
  };
  sampleWork?: {
    title: string;
    description: string;
    link?: string;
  };
  reviews: ExpertReview[];
}

export type SessionStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled" | "refunded" | "in_progress";

export type PaymentMethodType = "upi" | "card" | "netbanking" | "wallet" | "paypal";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded"
  | "disputed";

export interface ClientPaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  title: string;
  details: string;
  brand?: string;
  isDefault?: boolean;
  token: string;
  expiryDate?: string;
  createdAt: string;
}

export interface ClientPaymentTransaction {
  id: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  expertId: string;
  expertName: string;
  sessionTopic: string;
  duration: 5 | 10 | 15;
  amount: number;
  platformFee: number;
  taxAmount: number;
  totalAmount: number;
  expertAmount: number;
  currency: string;
  currencySymbol: string;
  status: PaymentStatus;
  paymentProvider: "razorpay" | "stripe" | "paypal" | "gateway_mock";
  paymentMethodType: PaymentMethodType;
  paymentMethodLabel: string;
  providerPaymentId: string;
  providerOrderId: string;
  providerCustomerId?: string;
  refundAmount?: number;
  refundStatus?: "none" | "requested" | "processing" | "refunded" | "rejected";
  refundReason?: string;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export interface Booking {
  id: string;
  expertId: string;
  expertName: string;
  expertAvatar: string;
  expertHeadline: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  duration: 5 | 10 | 15;
  price: number;
  platformFee: number;
  expertEarnings: number;
  scheduledTime: string;
  topic: string;
  status: SessionStatus;
  createdAt: string;
  paymentId: string;
  paymentStatus: "paid" | "refunded" | "pending";
  meetingRoomId: string;
  hasReviewed?: boolean;
  rating?: number;
  review?: string;
  reviewTags?: string[];
  recommend?: boolean;
  reviewScores?: {
    helpfulness: number;
    communication: number;
    expertise: number;
  };
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  senderRole: "user" | "expert";
  text: string;
  timestamp: string;
}

export interface AskAnalysis {
  detectedCategories: string[];
  recommendedSkills: string[];
  recommendedDuration: 5 | 10 | 15;
  consultationGoal: string;
  matchExplanation: string;
}

export interface AskAnalysisResponse {
  domain: string;
  subdomain: string;
  skills: string[];
  recommendedDuration: 5 | 10 | 15;
  durationReasoning: string;
  clarifyingQuestions?: string[];
  problemSummary?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  goal?: string;
  status: "in_progress" | "resolved" | "archived" | "active" | "completed";
  relatedAsks?: string[];
  consultationIds: string[];
  tags: string[];
  createdAt: string;
  expertConsultations?: {
    expertId: string;
    expertName: string;
    date: string;
    duration: number;
    keyTakeaway: string;
  }[];
  notes?: string;
  updatedAt?: string;
}

export type Project = ProjectItem;

export interface InterviewEvaluationResponse {
  approved: boolean;
  score: number;
  feedback: string;
  pillarScores: {
    knowledge: number;
    practicalAbility: number;
    problemSolving: number;
    communication: number;
  };
}

export interface ExpertApplication {
  id: string;
  userId: string;
  fullName: string;
  headline: string;
  field: string;
  secondaryFields: string[];
  skills: string[];
  experienceYears: number;
  currentRole: string;
  education: string;
  bio: string;
  languages: string[];
  resumeFileName: string;
  projectSampleTitle: string;
  projectSampleDescription: string;
  projectSampleUrl?: string;
  status: "draft" | "submitted" | "interview_pending" | "interview_completed" | "under_review" | "approved" | "rejected";
  aiInterviewScores?: {
    overallScore: number;
    domainMastery: number;
    problemSolving: number;
    consultationSkill: number;
    communication: number;
    feedbackSummary: string;
    strengths: string[];
    areasForGrowth: string[];
  };
  submittedAt: string;
  reviewedAt?: string;
}

export interface InterviewQuestion {
  id: string;
  category?: string;
  question: string;
  guidance?: string;
  criterion?: string;
  answer?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "booking" | "session" | "payment" | "review" | "verification" | "system";
  timestamp: string;
  read: boolean;
  link?: string;
}

// ==================================================
// ADMIN CONTROL CENTER MODELS & SECURITY TYPES
// ==================================================

export type AdminRole = "OWNER" | "ADMIN" | "MODERATOR" | "SUPPORT" | "FINANCE";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string;
  mfaEnabled: boolean;
  lastLogin: string;
  status: "active" | "inactive" | "suspended";
}

export type AuditActionType =
  | "ADMIN_LOGIN"
  | "ADMIN_LOGOUT"
  | "USER_VIEWED"
  | "USER_RESTRICTED"
  | "USER_UNRESTRICTED"
  | "USER_BANNED"
  | "USER_UNBANNED"
  | "EXPERT_APPROVED"
  | "EXPERT_REJECTED"
  | "EXPERT_VERIFIED"
  | "EXPERT_REVOKED"
  | "PAYOUT_HELD"
  | "PAYOUT_RELEASED"
  | "PAYOUT_APPROVED"
  | "REFUND_ISSUED"
  | "PLATFORM_FEE_CHANGED"
  | "FEATURE_FLAG_TOGGLED"
  | "ADMIN_CREATED"
  | "ADMIN_ROLE_UPDATED"
  | "SYSTEM_SETTING_CHANGED"
  | "REPORT_RESOLVED"
  | "CATEGORY_MODIFIED";

export interface AuditLogEntry {
  id: string;
  adminEmail: string;
  adminRole: AdminRole;
  action: AuditActionType;
  targetId: string;
  targetType: "user" | "expert" | "session" | "payment" | "payout" | "system" | "admin" | "report";
  reason?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ReportItem {
  id: string;
  type: "user" | "expert" | "session" | "payment" | "abuse" | "fraud" | "technical" | "review_dispute";
  reporterName: string;
  reporterEmail: string;
  targetId: string;
  targetName: string;
  subject: string;
  description: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  priority: "low" | "medium" | "high" | "critical";
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface BanRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  reason: string;
  duration: "7_days" | "30_days" | "permanent";
  restrictedUntil?: string;
  internalNote: string;
  bannedBy: string;
  bannedAt: string;
  status: "active" | "lifted";
}

export type SystemHealthState = "operational" | "degraded" | "unavailable";

export interface AdminSystemHealth {
  authentication: SystemHealthState;
  payments: SystemHealthState;
  payouts: SystemHealthState;
  webrtc: SystemHealthState;
  emailOtp: SystemHealthState;
  aiServices: SystemHealthState;
  backgroundJobs: SystemHealthState;
  database: SystemHealthState;
}

export interface PlatformFeeConfig {
  defaultFeePercent: number; // e.g. 12 (%)
  categoryFees: Record<string, number>;
  promotionalActive: boolean;
  lastUpdatedBy: string;
  updatedAt: string;
}

export interface AdminCategoryItem {
  id: string;
  name: string;
  description: string;
  active: boolean;
  topicCount: number;
  expertCount: number;
  createdAt: string;
}

export interface ExpertMatch {
  expert: Expert;
  matchScore: number;
  matchReason: string;
}


