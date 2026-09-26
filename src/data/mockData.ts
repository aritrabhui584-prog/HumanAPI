import { 
  Expert, 
  ProjectItem, 
  Booking, 
  NotificationItem, 
  AdminUser, 
  AuditLogEntry, 
  ReportItem, 
  BanRecord, 
  PlatformFeeConfig, 
  AdminSystemHealth 
} from "../types";

export const CATEGORIES = [
  "Deployment Diagnosis",
  "CI/CD & Pipelines",
  "Docker & Containers",
  "AWS & Cloud Infrastructure",
  "Server & Kubernetes SRE"
];

export const INITIAL_EXPERTS: Expert[] = [
  {
    id: "exp-1",
    name: "Arjun Mehta",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    headline: "Principal Cloud Architect & Distributed Systems Engineer",
    category: "Deployment Diagnosis",
    subcategories: ["CI/CD & Pipelines", "Docker & Containers"],
    skills: ["Docker", "AWS", "CI/CD", "Kubernetes", "Jenkins", "GitHub Actions", "Node.js"],
    bio: "Ex-Stripe infrastructure lead. Specializes in diagnosing Jenkins pipeline build failures, Docker multi-stage cache invalidations, and AWS ECS container memory throttling in 10-minute targeted sprints.",
    experienceYears: 11,
    currentRole: "Principal Cloud Architect",
    companyOrOrg: "Independent Consultant (Ex-Stripe)",
    isVerified: true,
    verificationDate: "2024-03-12",
    rating: 4.96,
    reviewCount: 248,
    completedSessions: 312,
    responseTime: "< 5 mins",
    languages: ["English", "Hindi"],
    pricing: {
      duration5: 499,
      duration10: 899,
      duration15: 1299
    },
    availableToday: true,
    nextAvailableSlot: "Today · 3:30 PM",
    badges: ["Verified Expert", "Top Rated", "DevOps Lead"],
    discoverabilityScore: 98,
    reputationBreakdown: {
      ratingScore: 99,
      completionScore: 98,
      responseScore: 97,
      profileCompleteness: 100
    },
    sampleWork: {
      title: "Zero-Downtime Deployment Pipeline for 50M ops/sec",
      description: "Architected a zero-loss automated deployment pipeline reducing p99 release failure rate from 14% to 0.01%."
    },
    reviews: [
      {
        id: "rev-1",
        userId: "u-101",
        userName: "Elena Rostova",
        rating: 5,
        date: "2 days ago",
        duration: 10,
        sessionTopic: "Jenkins Docker Build Failure Debug",
        comment: "Solved a Jenkins container memory deadlock exit code 137 that our team spent 3 days debugging in literally 7 minutes. Arjun gave us the exact Dockerfile layer split.",
        scores: { helpfulness: 5, communication: 5, expertise: 5 }
      }
    ]
  },
  {
    id: "exp-2",
    name: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    headline: "Senior DevOps Engineer & Pipeline Specialist",
    category: "CI/CD & Pipelines",
    subcategories: ["Deployment Diagnosis", "Docker & Containers"],
    skills: ["GitHub Actions", "Jenkins", "Docker", "AWS", "GitLab CI", "Go", "Helm"],
    bio: "Ex-Datadog DevOps lead. Helps engineering teams fix broken CI/CD workflows, optimize Docker layer caching, and automate fail-safe deployments across AWS and Vercel.",
    experienceYears: 9,
    currentRole: "Lead DevOps Specialist",
    companyOrOrg: "InfraLabs (Ex-Datadog)",
    isVerified: true,
    verificationDate: "2024-01-18",
    rating: 4.98,
    reviewCount: 194,
    completedSessions: 220,
    responseTime: "< 10 mins",
    languages: ["English"],
    pricing: {
      duration5: 599,
      duration10: 1099,
      duration15: 1599
    },
    availableToday: true,
    nextAvailableSlot: "Today · 4:15 PM",
    badges: ["Verified Expert", "Top Rated", "CI/CD Specialist"],
    discoverabilityScore: 97,
    reputationBreakdown: {
      ratingScore: 99,
      completionScore: 96,
      responseScore: 95,
      profileCompleteness: 100
    },
    sampleWork: {
      title: "GitHub Actions Parallel Matrix Pipeline",
      description: "Optimized build matrix execution reducing end-to-end deployment time from 42 mins to 4.5 mins."
    },
    reviews: [
      {
        id: "rev-3",
        userId: "u-103",
        userName: "Siddharth Rao",
        rating: 5,
        date: "3 days ago",
        duration: 15,
        sessionTopic: "GitHub Actions Docker Build Fix",
        comment: "Alex immediately pinpointed why our GitHub Actions runner was dropping secrets context. Saved us days of build pipeline retries.",
        scores: { helpfulness: 5, communication: 5, expertise: 5 }
      }
    ]
  },
  {
    id: "exp-3",
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    headline: "Cloud Infrastructure & Security Architect",
    category: "AWS & Cloud Infrastructure",
    subcategories: ["Server & Kubernetes SRE", "Deployment Diagnosis"],
    skills: ["Kubernetes", "AWS", "GCP", "Docker", "Terraform", "GitLab CI", "Python"],
    bio: "12 years leading cloud infrastructure & Kubernetes deployments. Book a 10-minute session for live ECS/EKS deployment debugging, IAM policy audit, and container ingress fixes.",
    experienceYears: 12,
    currentRole: "Principal Cloud Engineer",
    companyOrOrg: "Aegis Cloud Systems",
    isVerified: true,
    verificationDate: "2024-02-04",
    rating: 4.94,
    reviewCount: 167,
    completedSessions: 204,
    responseTime: "< 15 mins",
    languages: ["English", "Hindi"],
    pricing: {
      duration5: 449,
      duration10: 799,
      duration15: 1149
    },
    availableToday: true,
    nextAvailableSlot: "Today · 5:00 PM",
    badges: ["Verified Expert", "Cloud Master"],
    discoverabilityScore: 94,
    reputationBreakdown: {
      ratingScore: 98,
      completionScore: 95,
      responseScore: 91,
      profileCompleteness: 98
    },
    sampleWork: {
      title: "Multi-Region Kubernetes Ingress Automation",
      description: "Automated zero-downtime cluster upgrades across 12 EKS clusters."
    },
    reviews: [
      {
        id: "rev-4",
        userId: "u-104",
        userName: "Aisha Patel",
        rating: 5,
        date: "1 week ago",
        duration: 10,
        sessionTopic: "AWS ECS Task Placement Debug",
        comment: "Priya inspected our Terraform config on screen and fixed our IAM policy binding in 8 minutes. Container deployed immediately.",
        scores: { helpfulness: 5, communication: 5, expertise: 5 }
      }
    ]
  },
  {
    id: "exp-4",
    name: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    headline: "Site Reliability Engineer & Kubernetes Specialist",
    category: "Server & Kubernetes SRE",
    subcategories: ["Deployment Diagnosis", "Docker & Containers"],
    skills: ["Kubernetes", "Docker", "AWS", "Nginx", "Prometheus", "Linux", "Vercel"],
    bio: "SRE Lead for high-concurrency cloud applications. Provides instant diagnosis for Kubernetes pod CrashLoopBackOff errors, ingress TLS terminations, and deployment rollbacks.",
    experienceYears: 14,
    currentRole: "Lead SRE",
    companyOrOrg: "Independent SRE Practice",
    isVerified: true,
    verificationDate: "2023-11-20",
    rating: 4.99,
    reviewCount: 382,
    completedSessions: 460,
    responseTime: "< 5 mins",
    languages: ["English"],
    pricing: {
      duration5: 549,
      duration10: 999,
      duration15: 1399
    },
    availableToday: true,
    nextAvailableSlot: "Today · 6:30 PM",
    badges: ["Verified Expert", "Top Rated", "Rapid Responder"],
    discoverabilityScore: 99,
    reputationBreakdown: {
      ratingScore: 100,
      completionScore: 99,
      responseScore: 98,
      profileCompleteness: 100
    },
    sampleWork: {
      title: "Automated Rollback & Canary Framework",
      description: "Published SRE playbook used by 8,000+ engineers for zero-downtime deployment safety."
    },
    reviews: [
      {
        id: "rev-5",
        userId: "u-105",
        userName: "Kevin Zhang",
        rating: 5,
        date: "Yesterday",
        duration: 15,
        sessionTopic: "Kubernetes Pod CrashLoopBackOff",
        comment: "Marcus probed the exact liveness probe misconfiguration in 5 minutes. Resolved our production cluster deployment failure.",
        scores: { helpfulness: 5, communication: 5, expertise: 5 }
      }
    ]
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "bk-901",
    expertId: "exp-1",
    expertName: "Arjun Mehta",
    expertAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    expertHeadline: "Principal Cloud Architect & Distributed Systems Engineer",
    userId: "u-curr",
    userName: "Demo User",
    duration: 10,
    price: 349,
    platformFee: 42,
    expertEarnings: 307,
    scheduledTime: "Today · 6:00 PM",
    topic: "Jenkins Docker build pipeline exit code 137 failure",
    status: "confirmed",
    createdAt: "2026-09-19T04:15:00.000Z",
    paymentId: "pay_txn_8841029",
    paymentStatus: "paid",
    meetingRoomId: "room-bk-901",
    hasReviewed: false
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    title: "HumanAPI Production Deployment & CI/CD Pipeline",
    description: "Diagnosing Jenkins CI/CD multi-stage build failure and AWS ECS task placement memory reservation margin.",
    goal: "Achieve zero-downtime automated deployment with verified Docker image caching.",
    status: "in_progress",
    consultationIds: ["bk-901"],
    tags: ["Deployment Diagnosis", "CI/CD", "Docker", "AWS"],
    createdAt: "2026-09-15",
    relatedAsks: [
      "Jenkins build log exit code 137 diagnosis",
      "AWS ECS IAM policy task definition binding"
    ],
    expertConsultations: [
      {
        expertId: "exp-1",
        expertName: "Arjun Mehta",
        date: "2026-09-17",
        duration: 10,
        keyTakeaway: "Recommended splitting Dockerfile base layer caching and increasing container memory overhead by 256MB."
      }
    ],
    notes: "Deployment diagnosis complete. Recommended DevOps consultation scheduled.",
    updatedAt: "2 hours ago"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Deployment Session Confirmed",
    message: "Your 10-minute session with Arjun Mehta is confirmed for Today at 6:00 PM.",
    type: "session",
    timestamp: "10 mins ago",
    read: false,
    link: "/sessions/bk-901"
  },
  {
    id: "notif-2",
    title: "Payment Receipt Generated",
    message: "Transaction #pay_txn_8841029 of ₹349 was settled successfully.",
    type: "payment",
    timestamp: "15 mins ago",
    read: false
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-1",
    name: "Platform Owner",
    email: "admin@humanapi.io",
    role: "OWNER",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    mfaEnabled: true,
    lastLogin: "2026-09-20T10:00:00.000Z",
    status: "active"
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log-1",
    adminEmail: "admin@humanapi.io",
    adminRole: "OWNER",
    action: "SYSTEM_SETTING_CHANGED",
    targetId: "sys-1",
    targetType: "system",
    timestamp: "2026-09-20T10:00:00.000Z"
  }
];

export const INITIAL_REPORTS: ReportItem[] = [];
export const INITIAL_BANS: BanRecord[] = [];
export const INITIAL_PLATFORM_FEE_CONFIG: PlatformFeeConfig = {
  defaultFeePercent: 10,
  categoryFees: { "Deployment Diagnosis": 10 },
  promotionalActive: false,
  lastUpdatedBy: "admin@humanapi.io",
  updatedAt: "2026-09-20T10:00:00.000Z"
};
export const INITIAL_SYSTEM_HEALTH: AdminSystemHealth = {
  authentication: "operational",
  payments: "operational",
  payouts: "operational",
  webrtc: "operational",
  emailOtp: "operational",
  aiServices: "operational",
  backgroundJobs: "operational",
  database: "operational"
};
