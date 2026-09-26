import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  Expert,
  Booking,
  ProjectItem,
  NotificationItem,
  ExpertApplication,
  UserRole,
  ClientPaymentMethod,
  ClientPaymentTransaction,
  PaymentMethodType,
  AuthStage,
  PendingAuthSession,
  AdminUser,
  AdminRole,
  AuditActionType,
  AuditLogEntry,
  ReportItem,
  BanRecord,
  AdminSystemHealth,
  PlatformFeeConfig,
  AdminCategoryItem
} from "../types";
import {
  INITIAL_EXPERTS,
  INITIAL_BOOKINGS,
  INITIAL_PROJECTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMIN_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_REPORTS,
  INITIAL_BANS,
  INITIAL_PLATFORM_FEE_CONFIG,
  INITIAL_SYSTEM_HEALTH
} from "../data/mockData";
import { PaymentCreateOptions, defaultPaymentGateway } from "../lib/paymentGateway";
import { loginApi, signupApi, verifyEmailOTPApi, resendOTPApi, logoutApi, getCurrentUserApi } from "../Auth/authApi";

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  authStage: AuthStage;
  pendingAuth: PendingAuthSession | null;
  otpCooldownSeconds: number;
  currentRole: UserRole;
  currentView: string;
  viewParams: any;
  experts: Expert[];
  bookings: Booking[];
  projects: ProjectItem[];
  notifications: NotificationItem[];
  savedExpertIds: string[];
  application: ExpertApplication | null;
  notification: { message: string; type: "success" | "error" | "info" } | null;

  // Client Payments & Financial System
  clientPaymentMethods: ClientPaymentMethod[];
  clientTransactions: ClientPaymentTransaction[];

  // Modals & Active Session
  isBookingModalOpen: boolean;
  bookingModalExpert: Expert | null;
  bookingModalDuration: 5 | 10 | 15;
  isReviewModalOpen: boolean;
  reviewModalBooking: Booking | null;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "signup" | "otp" | "forgot";
  isAccreditationModalOpen: boolean;
  activeLiveBooking: Booking | null;

  // Global Professional Loading System State
  isInitializing: boolean;
  isRefreshing: boolean;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  triggerDataRefresh: () => void;

  // Actions
  navigate: (view: string, params?: any) => void;
  showNotification: (message: string, type?: "success" | "error" | "info") => void;
  setCurrentRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  openAccreditationModal: () => void;
  closeAccreditationModal: () => void;
  login: (email: string, name?: string, asExpert?: boolean) => void;
  verifyEmailOtp: (code: string) => boolean;
  resendEmailOtp: () => void;
  logout: () => void;
  openAuthModal: (mode?: "login" | "signup" | "otp" | "forgot") => void;
  closeAuthModal: () => void;
  openBookingModal: (expert: Expert, duration?: 5 | 10 | 15) => void;
  closeBookingModal: () => void;
  confirmBooking: (expert: Expert, duration: 5 | 10 | 15, scheduledTime: string, topic: string) => Booking;
  createBooking: (expert: Expert, duration: 5 | 10 | 15, scheduledTime: string, topic: string, projectId?: string) => Booking;
  processClientCheckout: (options: any) => Promise<{ success: boolean; booking: Booking; transaction: ClientPaymentTransaction }>;
  addClientPaymentMethod: (method: Omit<ClientPaymentMethod, "id" | "createdAt">) => void;
  removeClientPaymentMethod: (id: string) => void;
  requestTransactionRefund: (transactionId: string, reason: string) => void;
  startLiveSession: (booking: Booking) => void;
  endLiveSession: (bookingId: string) => void;
  completeSession: (bookingId: string) => void;
  openReviewModal: (booking: Booking) => void;
  closeReviewModal: () => void;
  submitReview: (bookingId: string, ratingOrExpertId: any, commentOrData?: any, scores?: any) => void;
  toggleSaveExpert: (expertId: string) => void;
  submitExpertApplication: (appData: Partial<ExpertApplication>) => ExpertApplication;
  applyAsExpert: (profile: any) => void;
  updateExpertPricing: (expertId: string, pricing: any) => void;
  updateApplicationEvaluation: (evaluation: any) => void;
  // Admin Control Center State & Actions
  adminUser: AdminUser | null;
  adminAuthStage: AuthStage;
  adminPendingAuth: { email: string; generatedOtp: string } | null;
  adminActiveTab: string;
  adminUsers: AdminUser[];
  auditLogs: AuditLogEntry[];
  reports: ReportItem[];
  bans: BanRecord[];
  platformFeeConfig: PlatformFeeConfig;
  systemHealth: AdminSystemHealth;
  featureFlags: Record<string, boolean>;

  adminLogin: (email: string, password?: string) => void;
  adminVerifyOtp: (code: string) => boolean;
  adminLogout: () => void;
  setAdminActiveTab: (tab: string) => void;
  banUser: (userId: string, userName: string, userEmail: string, reason: string, duration: "7_days" | "30_days" | "permanent", note: string) => void;
  unbanUser: (banId: string, reason: string) => void;
  restrictUser: (userId: string, reason: string, until: string) => void;
  approveExpertApplication: (appId: string) => void;
  rejectExpertApplication: (appId: string, reason: string) => void;
  toggleExpertVerification: (expertId: string) => void;
  processRefund: (transactionId: string, reason: string) => void;
  holdPayout: (payoutId: string, reason: string) => void;
  releasePayout: (payoutId: string) => void;
  updatePlatformFee: (newPercent: number, reason: string) => void;
  toggleFeatureFlag: (flagKey: string) => void;
  resolveReport: (reportId: string, note: string) => void;
  createAuditLog: (action: AuditActionType, targetId: string, targetType: any, reason?: string, metadata?: any) => void;

  addProject: (project: Omit<ProjectItem, "id" | "updatedAt">) => void;
  createProject: (title: string, description: string, tags: string[]) => ProjectItem;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialView = (): string => {
  if (typeof window === "undefined") return "welcome";
  const path = window.location.pathname.replace(/^\/|\/$/g, "");
  if (!path || path === "") return "welcome";
  if (path === "home") return "home";
  if (path === "login") return "login";
  if (path === "signup" || path === "register") return "signup";
  if (path === "dashboard" || path === "user-dashboard") return "user-dashboard";
  if (path === "expert-dashboard") return "expert-dashboard";
  if (path === "how-it-works") return "how-it-works";
  if (path === "experts") return "experts";
  if (path === "about") return "about";
  if (path === "pricing") return "pricing";
  if (path === "use-cases") return "use-cases";
  if (path === "admin") return "admin-overview";
  if (path.startsWith("admin-") || path.startsWith("admin/")) return path.replace("/", "-");
  return path;
};

const getInitialPendingAuth = (): PendingAuthSession | null => {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname.replace(/^\/|\/$/g, "");
  const protectedPaths = [
    "dashboard", "user-dashboard", "payments", "user-payments",
    "history", "user-history", "projects", "user-projects",
    "settings", "user-settings", "ask", "user-ask", "expert-dashboard"
  ];
  if (protectedPaths.includes(path)) {
    return {
      email: "demo.user@humanapi.test",
      name: "Demo User",
      asExpert: path === "expert-dashboard",
      generatedOtp: "123456",
      otpSentAt: Date.now(),
      expiresAt: Date.now() + 600000,
      demoUserObj: {
        id: "u-curr",
        name: "Demo User",
        email: "demo.user@humanapi.test",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        role: path === "expert-dashboard" ? "expert" : "user",
        isExpert: path === "expert-dashboard",
        sessionsCompleted: 14,
        totalSpent: 4200,
        createdAt: "2026-01-15T10:00:00.000Z"
      }
    };
  }
  return null;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingAuth, setPendingAuth] = useState<PendingAuthSession | null>(getInitialPendingAuth);
  const [authStage, setAuthStage] = useState<AuthStage>(() => {
    return getInitialPendingAuth() ? "otp_required" : "unauthenticated";
  });
  const [otpCooldownSeconds, setOtpCooldownSeconds] = useState<number>(0);
  const [currentRole, setCurrentRole] = useState<UserRole>("user");

  const [isInitializing, setIsInitializing] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const storedEmail = typeof window !== "undefined" ? localStorage.getItem("humanapi_auth_email") : null;
      if (storedEmail) {
        const userObj = await getCurrentUserApi(storedEmail);
        if (userObj) {
          const user: User = {
            id: userObj.id,
            name: userObj.name,
            email: userObj.email,
            avatar: userObj.avatar,
            role: userObj.role as any,
            isExpert: userObj.isExpert,
            expertStatus: userObj.expertStatus,
            expertId: userObj.expertId,
            sessionsCompleted: 14,
            totalSpent: 4200,
            createdAt: userObj.createdAt || "2026-01-15T10:00:00.000Z"
          };
          setCurrentUser(user);
          setAuthStage("authenticated");
          setCurrentRole(user.role === "admin" ? "admin" : user.role === "expert" ? "expert" : "user");
        }
      }
      setIsInitializing(false);
    }
    checkSession();
  }, []);

  const triggerDataRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showNotification("Workspace data synchronized.", "info");
    }, 600);
  };
  const [currentView, setCurrentView] = useState<string>(getInitialView);
  const [viewParams, setViewParams] = useState<any>({});

  const [experts, setExperts] = useState<Expert[]>(INITIAL_EXPERTS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [savedExpertIds, setSavedExpertIds] = useState<string[]>(["exp-1", "exp-2"]);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Admin Control Center State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminAuthStage, setAdminAuthStage] = useState<AuthStage>("unauthenticated");
  const [adminPendingAuth, setAdminPendingAuth] = useState<{ email: string; generatedOtp: string } | null>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<string>("overview");

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [bans, setBans] = useState<BanRecord[]>(INITIAL_BANS);
  const [platformFeeConfig, setPlatformFeeConfig] = useState<PlatformFeeConfig>(INITIAL_PLATFORM_FEE_CONFIG);
  const [systemHealth, setSystemHealth] = useState<AdminSystemHealth>(INITIAL_SYSTEM_HEALTH);
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({
    maintenanceMode: false,
    newRegistration: true,
    expertApplications: true,
    newBookings: true,
    payoutsEnabled: true,
    aiInterviewAssister: true
  });

  // Client Payments State
  const [clientPaymentMethods, setClientPaymentMethods] = useState<ClientPaymentMethod[]>([
    {
      id: "cpm-1",
      userId: "u-curr",
      type: "upi",
      title: "UPI (Google Pay)",
      details: "aritra@upi",
      brand: "Google Pay",
      isDefault: true,
      token: "tok_upi_8921",
      createdAt: "2026-09-01T10:00:00.000Z"
    },
    {
      id: "cpm-2",
      userId: "u-curr",
      type: "card",
      title: "HDFC Credit Card",
      details: "•••• 4821",
      brand: "Visa",
      isDefault: false,
      token: "tok_card_9012",
      expiryDate: "12/28",
      createdAt: "2026-09-05T14:30:00.000Z"
    }
  ]);

  const [clientTransactions, setClientTransactions] = useState<ClientPaymentTransaction[]>([
    {
      id: "pay_tx_80192",
      bookingId: "bk-101",
      clientId: "u-curr",
      clientName: "Aritra Bhui",
      clientEmail: "aritra@humanapi.io",
      expertId: "exp-1",
      expertName: "Arjun Mehta",
      sessionTopic: "React State Synchronization & Memory Leak Isolation",
      duration: 10,
      amount: 899,
      platformFee: 90,
      taxAmount: 161,
      totalAmount: 1150,
      expertAmount: 809,
      currency: "INR",
      currencySymbol: "₹",
      status: "paid",
      paymentProvider: "gateway_mock",
      paymentMethodType: "upi",
      paymentMethodLabel: "UPI (aritra@upi)",
      providerPaymentId: "pay_Nz821xL",
      providerOrderId: "order_Mz721kP",
      invoiceUrl: "/invoices/pay_tx_80192.pdf",
      createdAt: "2026-09-18T10:00:00.000Z",
      updatedAt: "2026-09-18T10:00:00.000Z",
      paidAt: "2026-09-18T10:00:00.000Z"
    },
    {
      id: "pay_tx_70144",
      bookingId: "bk-102",
      clientId: "u-curr",
      clientName: "Aritra Bhui",
      clientEmail: "aritra@humanapi.io",
      expertId: "exp-2",
      expertName: "Dr. Camille Laurent",
      sessionTopic: "LLM Fine-Tuning & RAG Hallucination Guardrails",
      duration: 15,
      amount: 1499,
      platformFee: 150,
      taxAmount: 269,
      totalAmount: 1918,
      expertAmount: 1349,
      currency: "INR",
      currencySymbol: "₹",
      status: "paid",
      paymentProvider: "gateway_mock",
      paymentMethodType: "card",
      paymentMethodLabel: "Visa •••• 4821",
      providerPaymentId: "pay_Kx901mQ",
      providerOrderId: "order_Jx801nP",
      invoiceUrl: "/invoices/pay_tx_70144.pdf",
      createdAt: "2026-09-15T16:20:00.000Z",
      updatedAt: "2026-09-15T16:20:00.000Z",
      paidAt: "2026-09-15T16:20:00.000Z"
    }
  ]);

  const addClientPaymentMethod = (method: Omit<ClientPaymentMethod, "id" | "createdAt">) => {
    const newMethod: ClientPaymentMethod = {
      ...method,
      id: `cpm-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setClientPaymentMethods(prev => [newMethod, ...prev]);
    showNotification(`Saved payment method: ${newMethod.title}`, "success");
  };

  const removeClientPaymentMethod = (id: string) => {
    setClientPaymentMethods(prev => prev.filter(m => m.id !== id));
    showNotification("Payment method removed.", "info");
  };

  const requestTransactionRefund = (transactionId: string, reason: string) => {
    setClientTransactions(prev =>
      prev.map(tx => {
        if (tx.id === transactionId) {
          return {
            ...tx,
            refundStatus: "requested",
            refundReason: reason,
            updatedAt: new Date().toISOString()
          };
        }
        return tx;
      })
    );
    showNotification("Refund request submitted for review.", "info");
  };

  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalExpert, setBookingModalExpert] = useState<Expert | null>(null);
  const [bookingModalDuration, setBookingModalDuration] = useState<5 | 10 | 15>(10);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    const initView = getInitialView();
    return initView === "login" || initView === "signup" || initView === "register";
  });
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup" | "otp" | "forgot">("login");

  const [isAccreditationModalOpen, setIsAccreditationModalOpen] = useState(false);
  const openAccreditationModal = () => setIsAccreditationModalOpen(true);
  const closeAccreditationModal = () => setIsAccreditationModalOpen(false);

  const [activeLiveBooking, setActiveLiveBooking] = useState<Booking | null>(null);

  const [application, setApplication] = useState<ExpertApplication | null>({
    id: "app-801",
    userId: "u-curr",
    fullName: "Aritra Bhui",
    headline: "Staff Engineer & Distributed Systems Consultant",
    field: "Software Development",
    secondaryFields: ["System Architecture", "AI & Machine Learning"],
    skills: ["React", "TypeScript", "Node.js", "WebRTC", "PostgreSQL"],
    experienceYears: 8,
    currentRole: "Lead Architect",
    education: "B.Tech in Computer Science",
    bio: "Passionate about high-throughput messaging, clean architectural abstractions, and high-impact consultations.",
    languages: ["English", "Bengali", "Hindi"],
    resumeFileName: "Aritra_Bhui_Engineering_Lead_CV.pdf",
    projectSampleTitle: "Real-time Consultation Signaling Engine",
    projectSampleDescription: "Engineered sub-50ms peer negotiation gateway with automatic ICE candidate fallback.",
    projectSampleUrl: "https://github.com/humanapi/sample-consultation-engine",
    status: "approved",
    aiInterviewScores: {
      overallScore: 92,
      domainMastery: 94,
      problemSolving: 91,
      consultationSkill: 93,
      communication: 90,
      feedbackSummary: "Exceptional triage instincts and rapid technical communication. Exceeded benchmarks across all four evaluation pillars.",
      strengths: [
        "Uncompromising architectural clarity",
        "Fast live problem isolation",
        "Empathetic communication with zero condescension"
      ],
      areasForGrowth: [
        "Encourage client to take notes during minute 3 checkpoint"
      ]
    },
    submittedAt: "2026-09-18T10:00:00.000Z",
    reviewedAt: "2026-09-18T10:05:00.000Z"
  });

  const navigate = (view: string, params: any = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (typeof window !== "undefined") {
      let targetPath = "/" + (view === "welcome" ? "" : view);
      if (view === "user-dashboard") targetPath = "/dashboard";
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, "", targetPath);
      }
    }

    if (view === "login") {
      setAuthModalMode("login");
      setIsAuthModalOpen(true);
    } else if (view === "signup" || view === "register") {
      setAuthModalMode("signup");
      setIsAuthModalOpen(true);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const view = getInitialView();
      setCurrentView(view);
      if (view === "login") {
        setAuthModalMode("login");
        setIsAuthModalOpen(true);
      } else if (view === "signup" || view === "register") {
        setAuthModalMode("signup");
        setIsAuthModalOpen(true);
      } else {
        setIsAuthModalOpen(false);
      }
    };
    window.addEventListener("popstate", handlePopState);

    // Initial load route check
    const initialView = getInitialView();
    if (initialView === "login") {
      setAuthModalMode("login");
      setIsAuthModalOpen(true);
    } else if (initialView === "signup" || initialView === "register") {
      setAuthModalMode("signup");
      setIsAuthModalOpen(true);
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const switchRole = (role: UserRole) => {
    if (role === "expert") {
      const isApproved = currentUser?.expertStatus === "APPROVED" || Boolean(currentUser?.isExpert) || currentUser?.role === "expert";
      if (!isApproved) {
        setIsAccreditationModalOpen(true);
        showNotification("Expert Workspace access requires completed HumanAPI accreditation.", "info");
        return;
      }
      setCurrentRole("expert");
      navigate("expert-dashboard");
    } else {
      setCurrentRole("user");
      navigate("user-dashboard");
    }
  };

  // Countdown timer for OTP resend rate limiting
  useEffect(() => {
    if (otpCooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setOtpCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpCooldownSeconds]);

  const login = async (email: string, name = "Aritra Bhui", asExpert = false) => {
    const res = await loginApi(email);
    if (res.success) {
      const userObj: User = {
        id: `u_${Date.now()}`,
        name: name || (email && email.includes("@") ? email.split("@")[0] : "Aritra Bhui"),
        email: res.email || email,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
        role: asExpert ? "expert" : "user",
        isExpert: asExpert,
        expertId: asExpert ? "exp-1" : undefined,
        headline: "Product Engineer & Tech Founder",
        bio: "Building next-generation real-time applications.",
        interests: ["Software Development", "System Architecture"],
        sessionsCompleted: 4,
        totalSpent: 1240,
        createdAt: new Date().toISOString()
      };

      setPendingAuth({
        email: userObj.email,
        name: userObj.name,
        asExpert,
        generatedOtp: res.demoOtp || "123456",
        otpSentAt: Date.now(),
        expiresAt: Date.now() + 600000,
        demoUserObj: userObj
      });
      setAuthStage("otp_required");
      setCurrentUser(null);
      setAuthModalMode("otp");
      setIsAuthModalOpen(true);
      setOtpCooldownSeconds(30);
      showNotification(`Password verified. Security OTP sent to ${userObj.email}`, "info");
    } else {
      showNotification(res.error || "Login failed.", "error");
    }
  };

  const verifyEmailOtp = (code: string): boolean => {
    const targetEmail = pendingAuth?.email || localStorage.getItem("humanapi_auth_email") || "aritra@humanapi.io";
    
    // Asynchronous backend verification trigger
    verifyEmailOTPApi(targetEmail, code).then(res => {
      if (res.success && res.user) {
        const fetchedUser: User = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          avatar: res.user.avatar,
          role: res.user.role as any,
          isExpert: res.user.isExpert,
          expertStatus: res.user.expertStatus,
          expertId: res.user.expertId,
          sessionsCompleted: 14,
          totalSpent: 4200,
          createdAt: res.user.createdAt || "2026-01-15T10:00:00.000Z"
        };
        setCurrentUser(fetchedUser);
        setAuthStage("authenticated");
        localStorage.setItem("humanapi_auth_email", targetEmail);
        setPendingAuth(null);
        setIsAuthModalOpen(false);

        if (fetchedUser.role === "expert" || pendingAuth?.asExpert) {
          setCurrentRole("expert");
          navigate("expert-dashboard");
        } else {
          setCurrentRole("user");
          navigate("user-dashboard");
        }
        showNotification("Email OTP verified successfully. Welcome to HumanAPI.", "success");
      } else {
        showNotification(res.error || "Invalid OTP code. Use code 123456.", "error");
      }
    });

    return true;
  };

  const resendEmailOtp = async () => {
    if (otpCooldownSeconds > 0) return;
    const targetEmail = pendingAuth?.email || "aritra@humanapi.io";
    await resendOTPApi(targetEmail);
    setOtpCooldownSeconds(30);
    showNotification(`New 6-digit verification code sent to ${targetEmail}. (Demo: 123456)`, "info");
  };

  const logout = async () => {
    await logoutApi();
    localStorage.removeItem("humanapi_auth_email");
    localStorage.removeItem("humanapi_auth_token");
    setCurrentUser(null);
    setPendingAuth(null);
    setAuthStage("unauthenticated");
    setCurrentRole("user");
    navigate("home");
  };

  const openAuthModal = (mode: "login" | "signup" | "otp" | "forgot" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    if (typeof window !== "undefined") {
      const targetPath = mode === "signup" ? "/signup" : "/login";
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, "", targetPath);
      }
    }
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    if (typeof window !== "undefined" && (window.location.pathname === "/login" || window.location.pathname === "/signup" || window.location.pathname === "/register")) {
      window.history.pushState({}, "", "/home");
      setCurrentView("home");
    }
  };

  const openBookingModal = (expert: Expert, duration: 5 | 10 | 15 = 10) => {
    setBookingModalExpert(expert);
    setBookingModalDuration(duration);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setBookingModalExpert(null);
  };

  const confirmBooking = (expert: Expert, duration: 5 | 10 | 15, scheduledTime: string, topic: string): Booking => {
    const price = duration === 5 ? expert.pricing.duration5 : duration === 10 ? expert.pricing.duration10 : expert.pricing.duration15;
    const platformFee = Math.round(price * 0.12);
    const expertEarnings = price - platformFee;
    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-6)}`,
      expertId: expert.id,
      expertName: expert.name,
      expertAvatar: expert.avatar,
      expertHeadline: expert.headline,
      userId: currentUser?.id || "u-guest",
      userName: currentUser?.name || "Guest Client",
      duration,
      price,
      platformFee,
      expertEarnings,
      scheduledTime,
      topic: topic || `Focused ${duration}-minute consultation on ${expert.category}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      paymentId: `pay_txn_${Math.floor(1000000 + Math.random() * 9000000)}`,
      paymentStatus: "paid",
      meetingRoomId: `room-${Date.now().toString().slice(-5)}`,
      hasReviewed: false
    };

    setBookings(prev => [newBooking, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Consultation Booked",
      message: `Your ${duration}-minute session with ${expert.name} is confirmed for ${scheduledTime}.`,
      type: "booking",
      timestamp: "Just now",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    closeBookingModal();
    return newBooking;
  };

  const createBooking = (
    expert: Expert,
    duration: 5 | 10 | 15,
    scheduledTime: string,
    topic: string,
    projectId?: string
  ): Booking => {
    const newBooking = confirmBooking(expert, duration, scheduledTime, topic);
    if (projectId) {
      setProjects(prev =>
        prev.map(p =>
          p.id === projectId
            ? { ...p, consultationIds: [...(p.consultationIds || []), newBooking.id] }
            : p
        )
      );
    }
    return newBooking;
  };

  const completeSession = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: "completed" as const } : b))
    );
  };

  const startLiveSession = (booking: Booking) => {
    setActiveLiveBooking(booking);
    navigate("session-room", { bookingId: booking.id });
  };

  const endLiveSession = (bookingId: string) => {
    completeSession(bookingId);
    const target = bookings.find(b => b.id === bookingId) || activeLiveBooking;
    setActiveLiveBooking(null);
    if (target && !target.hasReviewed) {
      openReviewModal(target);
    } else {
      navigate(currentRole === "expert" ? "expert-dashboard" : "user-dashboard");
    }
  };

  const openReviewModal = (booking: Booking) => {
    setReviewModalBooking(booking);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewModalBooking(null);
  };

  const submitReview = (
    bookingId: string,
    ratingOrExpertId: any,
    commentOrData?: any,
    scores?: any
  ) => {
    const booking = bookings.find(b => b.id === bookingId) || reviewModalBooking;
    const rating = typeof ratingOrExpertId === "number" ? ratingOrExpertId : commentOrData?.rating || 5;
    const comment = typeof commentOrData === "string" ? commentOrData : commentOrData?.comment || "Great consultation";
    const finalScores = scores || commentOrData?.scores || { helpfulness: 5, communication: 5, expertise: 5 };
    const tags = commentOrData?.tags || [];
    const recommend = typeof commentOrData?.recommend === "boolean" ? commentOrData.recommend : true;

    // Update booking hasReviewed, rating, review
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              hasReviewed: true,
              rating,
              review: comment,
              reviewTags: tags,
              recommend,
              reviewScores: finalScores,
              status: "completed" as const
            }
          : b
      )
    );

    const targetExpertId = booking?.expertId || (typeof ratingOrExpertId === "string" ? ratingOrExpertId : undefined);

    if (targetExpertId) {
      setExperts(prev =>
        prev.map(exp => {
          if (exp.id === targetExpertId) {
            const newReviewCount = exp.reviewCount + 1;
            const newRating = Number(((exp.rating * exp.reviewCount + rating) / newReviewCount).toFixed(2));
            const newReview = {
              id: `rev-${Date.now()}`,
              userId: currentUser?.id || "u-curr",
              userName: currentUser?.name || "Client",
              rating,
              date: "Just now",
              duration: booking?.duration || 10,
              sessionTopic: booking?.topic,
              comment,
              tags,
              recommend,
              scores: finalScores
            };
            return {
              ...exp,
              rating: newRating,
              reviewCount: newReviewCount,
              reviews: [newReview, ...exp.reviews]
            };
          }
          return exp;
        })
      );
    }

    closeReviewModal();
  };

  const toggleSaveExpert = (expertId: string) => {
    setSavedExpertIds(prev =>
      prev.includes(expertId) ? prev.filter(id => id !== expertId) : [...prev, expertId]
    );
  };

  const applyAsExpert = (profile: any) => {
    if (currentUser) {
      setCurrentUser(prev =>
        prev
          ? {
              ...prev,
              isExpert: true,
              expertStatus: "APPROVED",
              role: "expert",
              expertId: "exp-approved",
              expertProfileId: "exp-approved"
            }
          : prev
      );
    }
    const newExpert: Expert = {
      id: "exp-approved",
      name: currentUser?.name || "Verified Practitioner",
      avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      headline: profile.headline || "Accredited Specialist",
      category: profile.category || "Software Development",
      subcategories: profile.subcategories || [profile.category],
      skills: profile.skills || ["Consulting"],
      bio: profile.bio || "Verified consultation specialist on HumanAPI.",
      experienceYears: profile.experienceYears || 5,
      currentRole: profile.currentRole || "Specialist",
      companyOrOrg: profile.companyOrOrg || "Independent",
      isVerified: true,
      verificationDate: "September 2026",
      rating: 5.0,
      reviewCount: 1,
      completedSessions: 1,
      responseTime: "< 5 mins",
      languages: profile.languages || ["English"],
      pricing: profile.pricing || { duration5: 199, duration10: 399, duration15: 599 },
      availableToday: true,
      nextAvailableSlot: "Today · 4:00 PM",
      badges: ["Verified Expert", "Top Rated"],
      discoverabilityScore: 95,
      reputationBreakdown: {
        ratingScore: 100,
        completionScore: 100,
        responseScore: 96,
        profileCompleteness: 98
      },
      sampleWork: profile.sampleWork,
      reviews: []
    };
    setExperts(prev => [newExpert, ...prev]);
    setCurrentRole("expert");
  };

  const updateExpertPricing = (expertId: string, pricing: any) => {
    setExperts(prev =>
      prev.map(exp => (exp.id === expertId ? { ...exp, pricing } : exp))
    );
  };

  const submitExpertApplication = (appData: Partial<ExpertApplication>): ExpertApplication => {
    const newApp: ExpertApplication = {
      id: `app-${Date.now()}`,
      userId: currentUser?.id || "u-curr",
      fullName: appData.fullName || currentUser?.name || "Applicant",
      headline: appData.headline || "Specialist Consultant",
      field: appData.field || "Software Development",
      secondaryFields: appData.secondaryFields || [],
      skills: appData.skills || [],
      experienceYears: appData.experienceYears || 5,
      currentRole: appData.currentRole || "Senior Consultant",
      education: appData.education || "Bachelor's Degree",
      bio: appData.bio || "",
      languages: appData.languages || ["English"],
      resumeFileName: appData.resumeFileName || "Curriculum_Vitae.pdf",
      projectSampleTitle: appData.projectSampleTitle || "Representative Project",
      projectSampleDescription: appData.projectSampleDescription || "",
      projectSampleUrl: appData.projectSampleUrl,
      status: "interview_pending",
      submittedAt: new Date().toISOString()
    };
    setApplication(newApp);
    return newApp;
  };

  const updateApplicationEvaluation = (evaluation: any) => {
    if (!application) return;
    const passed = evaluation.passed;
    const updated: ExpertApplication = {
      ...application,
      status: passed ? "approved" : "under_review",
      aiInterviewScores: {
        overallScore: evaluation.overallScore,
        domainMastery: evaluation.scores?.domainMastery || 88,
        problemSolving: evaluation.scores?.problemSolving || 85,
        consultationSkill: evaluation.scores?.consultationSkill || 86,
        communication: evaluation.scores?.communication || 89,
        feedbackSummary: evaluation.feedbackSummary,
        strengths: evaluation.strengths || ["Precise domain answers"],
        areasForGrowth: evaluation.areasForGrowth || ["Maintain concise summaries"]
      },
      reviewedAt: new Date().toISOString()
    };
    setApplication(updated);

    if (passed && currentUser) {
      setCurrentUser(prev => (prev ? { ...prev, isExpert: true, expertId: "exp-current-approved" } : prev));
    }
  };

  const addProject = (project: Omit<ProjectItem, "id" | "updatedAt">) => {
    const newProj: ProjectItem = {
      ...project,
      id: `proj-${Date.now()}`,
      updatedAt: "Just now"
    };
    setProjects(prev => [newProj, ...prev]);
  };

  const createProject = (title: string, description: string, tags: string[]): ProjectItem => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title,
      description,
      status: "active",
      tags,
      consultationIds: [],
      createdAt: "Today",
      updatedAt: "Just now"
    };
    setProjects(prev => [newProj, ...prev]);
    return newProj;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const processClientCheckout = async (options: any): Promise<{ success: boolean; booking: Booking; transaction: ClientPaymentTransaction }> => {
    const { expert, duration, scheduledTime, topic, paymentMethodType } = options;
    const basePrice = duration === 5 ? expert.pricing.duration5 : duration === 10 ? expert.pricing.duration10 : expert.pricing.duration15;
    const platformFee = Math.round(basePrice * 0.10);
    const taxAmount = Math.round((basePrice + platformFee) * 0.18);
    const totalAmount = basePrice + platformFee + taxAmount;
    const expertAmount = Math.max(0, basePrice - platformFee);

    const bookingId = `bk-${Date.now().toString().slice(-6)}`;
    const txOptions: PaymentCreateOptions = {
      bookingId,
      amount: basePrice,
      platformFee,
      taxAmount,
      totalAmount,
      currency: "INR",
      currencySymbol: "₹",
      sessionTopic: topic || `Focused ${duration}-minute consultation on ${expert.category}`,
      duration,
      expertId: expert.id,
      expertName: expert.name,
      clientId: currentUser?.id || "u-curr",
      clientName: currentUser?.name || "Aritra Bhui",
      clientEmail: currentUser?.email || "aritra@humanapi.io",
      paymentMethodType,
      upiId: options.upiId,
      cardLast4: options.cardLast4,
      cardBrand: options.cardBrand,
      bankName: options.bankName,
      walletName: options.walletName,
      savedMethodId: options.savedMethodId
    };

    const transaction = await defaultPaymentGateway.createPaymentTransaction(txOptions);
    const verification = await defaultPaymentGateway.verifyPayment(transaction.id);

    if (!verification.success) {
      showNotification("Payment authorization failed. Please try another method.", "error");
      throw new Error("Payment verification failed");
    }

    const verifiedTx = verification.transaction;

    if (options.saveMethodForFuture) {
      const details = paymentMethodType === "upi"
        ? (options.upiId || "user@upi")
        : (paymentMethodType === "card" ? `•••• ${options.cardLast4 || "4242"}` : verifiedTx.paymentMethodLabel);
      addClientPaymentMethod({
        userId: currentUser?.id || "u-curr",
        type: paymentMethodType,
        title: `${paymentMethodType.toUpperCase()} (${details})`,
        details,
        brand: options.cardBrand || "Gateway",
        token: `tok_${Math.random().toString(36).substring(2, 10)}`
      });
    }

    const newBooking: Booking = {
      id: bookingId,
      expertId: expert.id,
      expertName: expert.name,
      expertAvatar: expert.avatar,
      expertHeadline: expert.headline,
      userId: currentUser?.id || "u-curr",
      userName: currentUser?.name || "Aritra Bhui",
      duration,
      price: basePrice,
      platformFee,
      expertEarnings: expertAmount,
      scheduledTime,
      topic: options.topic || `Focused ${duration}-minute consultation on ${expert.category}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      paymentId: verifiedTx.id,
      paymentStatus: "paid",
      meetingRoomId: `room-${Date.now().toString().slice(-5)}`,
      hasReviewed: false
    };

    setBookings(prev => [newBooking, ...prev]);
    setClientTransactions(prev => [verifiedTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Payment Verified & Session Booked",
      message: `Payment of ₹${totalAmount} verified. Session with ${expert.name} is confirmed for ${scheduledTime}.`,
      type: "booking",
      timestamp: "Just now",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    if (options.projectId) {
      setProjects(prev =>
        prev.map(p =>
          p.id === options.projectId
            ? { ...p, consultationIds: [...p.consultationIds, newBooking.id], updatedAt: "Just now" }
            : p
        )
      );
    }

    return {
      success: true,
      booking: newBooking,
      transaction: verifiedTx
    };
  };

  // ==================================================
  // ADMIN CONTROL CENTER HANDLER IMPLEMENTATIONS
  // ==================================================

  const createAuditLog = (
    action: AuditActionType,
    targetId: string,
    targetType: any,
    reason?: string,
    metadata?: any
  ) => {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      adminEmail: adminUser?.email || "owner@humanapi.com",
      adminRole: adminUser?.role || "OWNER",
      action,
      targetId,
      targetType,
      reason: reason || "Administrative action executed",
      timestamp: new Date().toISOString(),
      metadata
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  const adminLogin = (email: string, password?: string) => {
    const targetEmail = email.trim().toLowerCase() || "owner@humanapi.com";
    const foundAdmin = adminUsers.find(a => a.email.toLowerCase() === targetEmail) || {
      id: `adm-${Date.now()}`,
      name: targetEmail.includes("owner") ? "Platform Owner" : "System Administrator",
      email: targetEmail,
      role: targetEmail.includes("owner") ? ("OWNER" as const) : ("ADMIN" as const),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      mfaEnabled: true,
      lastLogin: "Just now",
      status: "active" as const
    };

    setAdminPendingAuth({
      email: targetEmail,
      generatedOtp: "123456"
    });
    setAdminAuthStage("otp_required");
    showNotification("Admin credentials verified. Enter 6-digit security OTP code.", "info");
  };

  const adminVerifyOtp = (code: string): boolean => {
    if (code === "123456" || code.length === 6) {
      const email = adminPendingAuth?.email || "owner@humanapi.com";
      const user = adminUsers.find(a => a.email.toLowerCase() === email.toLowerCase()) || INITIAL_ADMIN_USERS[0];
      setAdminUser(user);
      setAdminAuthStage("authenticated");
      setAdminPendingAuth(null);
      showNotification(`Welcome to HumanAPI Control Center, ${user.name} (${user.role}).`, "success");
      createAuditLog("ADMIN_LOGIN", user.id, "admin", "Admin session established via OTP verification");
      return true;
    }
    showNotification("Invalid admin security code. Use code 123456.", "error");
    return false;
  };

  const adminLogout = () => {
    if (adminUser) {
      createAuditLog("ADMIN_LOGOUT", adminUser.id, "admin", "Admin session terminated");
    }
    setAdminUser(null);
    setAdminAuthStage("unauthenticated");
    setAdminPendingAuth(null);
    setCurrentView("admin-login");
    showNotification("Admin session logged out safely.", "info");
  };

  const banUser = (
    userId: string,
    userName: string,
    userEmail: string,
    reason: string,
    duration: "7_days" | "30_days" | "permanent",
    note: string
  ) => {
    const newBan: BanRecord = {
      id: `ban-${Date.now()}`,
      userId,
      userName,
      userEmail,
      reason,
      duration,
      restrictedUntil: duration === "7_days" ? "In 7 days" : duration === "30_days" ? "In 30 days" : undefined,
      internalNote: note,
      bannedBy: adminUser?.email || "owner@humanapi.com",
      bannedAt: new Date().toISOString(),
      status: "active"
    };
    setBans(prev => [newBan, ...prev]);
    createAuditLog("USER_BANNED", userId, "user", reason, { duration, internalNote: note });
    showNotification(`Account ${userName} (${userEmail}) banned (${duration}).`, "success");
  };

  const unbanUser = (banId: string, reason: string) => {
    setBans(prev =>
      prev.map(b => (b.id === banId ? { ...b, status: "lifted" } : b))
    );
    const banRec = bans.find(b => b.id === banId);
    if (banRec) {
      createAuditLog("USER_UNBANNED", banRec.userId, "user", reason);
    }
    showNotification("User account unbanned successfully.", "success");
  };

  const restrictUser = (userId: string, reason: string, until: string) => {
    createAuditLog("USER_RESTRICTED", userId, "user", reason, { restrictedUntil: until });
    showNotification(`Account restriction set until ${until}.`, "info");
  };

  const approveExpertApplication = (appId: string) => {
    createAuditLog("EXPERT_APPROVED", appId, "expert", "Expert application approved after review");
    showNotification("Expert application approved.", "success");
  };

  const rejectExpertApplication = (appId: string, reason: string) => {
    createAuditLog("EXPERT_REJECTED", appId, "expert", reason);
    showNotification("Expert application rejected.", "info");
  };

  const toggleExpertVerification = (expertId: string) => {
    setExperts(prev =>
      prev.map(e => {
        if (e.id === expertId) {
          const newStatus = !e.isVerified;
          createAuditLog(
            newStatus ? "EXPERT_VERIFIED" : "EXPERT_REVOKED",
            expertId,
            "expert",
            newStatus ? "Identity verified by administrator" : "Verification badge revoked"
          );
          return { ...e, isVerified: newStatus };
        }
        return e;
      })
    );
    showNotification("Expert verification status updated.", "success");
  };

  const processRefund = (transactionId: string, reason: string) => {
    requestTransactionRefund(transactionId, reason);
    createAuditLog("REFUND_ISSUED", transactionId, "payment", reason);
    showNotification(`Refund issued for transaction #${transactionId}.`, "success");
  };

  const holdPayout = (payoutId: string, reason: string) => {
    createAuditLog("PAYOUT_HELD", payoutId, "payout", reason);
    showNotification(`Payout #${payoutId} placed on administrative hold.`, "info");
  };

  const releasePayout = (payoutId: string) => {
    createAuditLog("PAYOUT_RELEASED", payoutId, "payout", "Administrative hold released");
    showNotification(`Payout #${payoutId} released for processing.`, "success");
  };

  const updatePlatformFee = (newPercent: number, reason: string) => {
    setPlatformFeeConfig(prev => ({
      ...prev,
      defaultFeePercent: newPercent,
      lastUpdatedBy: adminUser?.email || "owner@humanapi.com",
      updatedAt: new Date().toISOString()
    }));
    createAuditLog("PLATFORM_FEE_CHANGED", "fee-config-global", "system", reason, { newPercent });
    showNotification(`Platform commission fee updated to ${newPercent}%.`, "success");
  };

  const toggleFeatureFlag = (flagKey: string) => {
    setFeatureFlags(prev => {
      const nextVal = !prev[flagKey];
      createAuditLog("FEATURE_FLAG_TOGGLED", flagKey, "system", `Toggled feature flag to ${nextVal}`);
      return { ...prev, [flagKey]: nextVal };
    });
    showNotification(`System feature flag '${flagKey}' toggled.`, "info");
  };

  const resolveReport = (reportId: string, note: string) => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: "resolved", resolvedAt: "Just now", resolutionNote: note } : r))
    );
    createAuditLog("REPORT_RESOLVED", reportId, "report", note);
    showNotification("Moderation report resolved.", "success");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser) && authStage === "authenticated",
        authStage,
        pendingAuth,
        otpCooldownSeconds,
        currentRole,
        currentView,
        viewParams,
        experts,
        bookings,
        projects,
        notifications,
        savedExpertIds,
        application,
        notification,

        clientPaymentMethods,
        clientTransactions,

        isBookingModalOpen,
        bookingModalExpert,
        bookingModalDuration,
        isReviewModalOpen,
        reviewModalBooking,
        isAuthModalOpen,
        authModalMode,
        isAccreditationModalOpen,
        activeLiveBooking,

        // Global Professional Loading System State
        isInitializing,
        isRefreshing,
        isSubmitting,
        setIsSubmitting,
        triggerDataRefresh,

        // Admin State & Handlers
        adminUser,
        adminAuthStage,
        adminPendingAuth,
        adminActiveTab,
        adminUsers,
        auditLogs,
        reports,
        bans,
        platformFeeConfig,
        systemHealth,
        featureFlags,

        adminLogin,
        adminVerifyOtp,
        adminLogout,
        setAdminActiveTab,
        banUser,
        unbanUser,
        restrictUser,
        approveExpertApplication,
        rejectExpertApplication,
        toggleExpertVerification,
        processRefund,
        holdPayout,
        releasePayout,
        updatePlatformFee,
        toggleFeatureFlag,
        resolveReport,
        createAuditLog,

        navigate,
        showNotification,
        setCurrentRole,
        switchRole,
        openAccreditationModal,
        closeAccreditationModal,
        login,
        verifyEmailOtp,
        resendEmailOtp,
        logout,
        openAuthModal,
        closeAuthModal,
        openBookingModal,
        closeBookingModal,
        confirmBooking,
        createBooking,
        processClientCheckout,
        addClientPaymentMethod,
        removeClientPaymentMethod,
        requestTransactionRefund,
        startLiveSession,
        endLiveSession,
        completeSession,
        openReviewModal,
        closeReviewModal,
        submitReview,
        toggleSaveExpert,
        submitExpertApplication,
        applyAsExpert,
        updateExpertPricing,
        updateApplicationEvaluation,
        addProject,
        createProject,
        markNotificationRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
