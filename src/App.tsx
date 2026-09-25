import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/common/Navbar";
import { AuthModal } from "./components/common/AuthModal";
import { BookingModal } from "./components/common/BookingModal";
import { PostSessionReviewModal } from "./components/common/PostSessionReviewModal";
import { PublicHome } from "./components/public/PublicHome";
import { PublicAbout } from "./components/public/PublicAbout";
import { PublicHowItWorks } from "./components/public/PublicHowItWorks";
import { PublicUseCases } from "./components/public/PublicUseCases";
import { PublicExperts } from "./components/public/PublicExperts";
import { PublicExpertProfile } from "./components/public/PublicExpertProfile";
import { PublicPricing } from "./components/public/PublicPricing";
import { PublicFaq } from "./components/public/PublicFaq";
import { PublicLegalPages } from "./components/public/PublicLegalPages";
import { UserDashboardLayout } from "./components/dashboard/UserDashboardLayout";
import { UserOverview } from "./components/dashboard/UserOverview";
import { UserAskView } from "./components/dashboard/UserAskView";
import { UserHistoryView } from "./components/dashboard/UserHistoryView";
import { UserProjectsView } from "./components/dashboard/UserProjectsView";
import { UserIntegrationsView } from "./components/dashboard/UserIntegrationsView";
import { UserSettingsView } from "./components/dashboard/UserSettingsView";
import { UserPaymentsView } from "./components/dashboard/UserPaymentsView";
import { BecomeAnExpertFlow } from "./components/expert/BecomeAnExpertFlow";
import { ExpertDashboard } from "./components/expert/ExpertDashboard";
import { LiveSessionRoom } from "./components/room/LiveSessionRoom";
import { CurrencyProvider } from "./lib/currency";
import { PageTransition } from "./components/motion/PageTransition";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { PublicLayout } from "./components/layout/PublicLayout";
import { EmailOtpVerification } from "./components/auth/EmailOtpVerification";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminRequireAuth } from "./components/admin/AdminRequireAuth";
import { AdminShell } from "./components/admin/AdminShell";
import { ExpertAccreditationModal } from "./components/expert/ExpertAccreditationModal";
import { HumanAPIFullPageLoader, HumanAPIPageLoader } from "./components/loading";
import { DesignIntakeFlow } from "./components/intake/DesignIntakeFlow";
import { DeploymentIntakeFlow } from "./components/intake/DeploymentIntakeFlow";

/**
 * RequireAuth Guard Component
 * Enforces mandatory Email OTP Verification before granting access to protected workspace routes.
 */
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authStage } = useApp();

  if (authStage !== "authenticated") {
    return (
      <PublicLayout>
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto min-h-[65vh] flex flex-col justify-center">
          <div className="p-6 sm:p-8 rounded-[24px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-lg">
            <EmailOtpVerification inline />
          </div>
        </div>
      </PublicLayout>
    );
  }

  return <>{children}</>;
};

/**
 * RequireExpertAuth Guard Component
 * Enforces mandatory Expert Accreditation before granting access to Expert Workspace.
 */
const RequireExpertAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authStage, currentUser, openAccreditationModal } = useApp();

  if (authStage !== "authenticated") {
    return <RequireAuth>{children}</RequireAuth>;
  }

  const isApproved = currentUser?.expertStatus === "APPROVED" || (currentUser?.isExpert && !currentUser?.expertStatus);
  if (!isApproved) {
    return (
      <RequireAuth>
        <AuthenticatedUserLayout activeTab="user-dashboard">
          <UserOverview />
        </AuthenticatedUserLayout>
      </RequireAuth>
    );
  }

  return <>{children}</>;
};

/**
 * 2. AUTHENTICATED_USER_LAYOUT
 * Workspace for clients: sidebar navigation, active bookings, projects, and user profile menu.
 */
const AuthenticatedUserLayout: React.FC<{ activeTab: string; children: React.ReactNode }> = ({
  activeTab,
  children
}) => {
  return (
    <div className="min-h-[100dvh] md:h-[100dvh] md:max-h-[100dvh] flex flex-col bg-[#F6F0E7] text-[#342A24] md:overflow-hidden">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <UserDashboardLayout activeTab={activeTab}>
        {children}
      </UserDashboardLayout>
    </div>
  );
};

/**
 * 3. EXPERT_LAYOUT
 * Dedicated practitioner workspace for verified specialists.
 */
const ExpertLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-[100dvh] md:h-[100dvh] md:max-h-[100dvh] flex flex-col bg-[#F6F0E7] text-[#342A24] md:overflow-hidden">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="flex-1 min-h-0 flex flex-col md:overflow-hidden">{children}</div>
    </div>
  );
};

const AppRouter: React.FC = () => {
  const { currentView, currentUser, currentRole, notification, isInitializing } = useApp();

  if (isInitializing) {
    return <HumanAPIFullPageLoader caption="Loading HumanAPI..." />;
  }

  const isClientAuth = Boolean(currentUser) && currentRole === "user";

  const renderContent = () => {
    switch (currentView) {
      // --- UNIFIED PUBLIC LANDING EXPERIENCE ---
      case "welcome":
      case "home":
      case "login":
      case "signup":
      case "register":
        return (
          <PublicLayout isHome>
            <PublicHome />
          </PublicLayout>
        );
      case "about":
        return (
          <PublicLayout>
            <PublicAbout />
          </PublicLayout>
        );
      case "how-it-works":
        return (
          <PublicLayout>
            <PublicHowItWorks />
          </PublicLayout>
        );
      case "use-cases":
        return (
          <PublicLayout>
            <PublicUseCases />
          </PublicLayout>
        );
      case "design-intake":
      case "deployment-intake":
        return isClientAuth ? (
          <AuthenticatedUserLayout activeTab="ask">
            <DeploymentIntakeFlow />
          </AuthenticatedUserLayout>
        ) : (
          <PublicLayout>
            <DeploymentIntakeFlow />
          </PublicLayout>
        );
      case "experts":
        return isClientAuth ? (
          <AuthenticatedUserLayout activeTab="experts">
            <PublicExperts />
          </AuthenticatedUserLayout>
        ) : (
          <PublicLayout>
            <PublicExperts />
          </PublicLayout>
        );
      case "expert-detail":
        return isClientAuth ? (
          <AuthenticatedUserLayout activeTab="experts">
            <PublicExpertProfile />
          </AuthenticatedUserLayout>
        ) : (
          <PublicLayout>
            <PublicExpertProfile />
          </PublicLayout>
        );
      case "pricing":
        return (
          <PublicLayout>
            <PublicPricing />
          </PublicLayout>
        );
      case "faq":
        return (
          <PublicLayout>
            <PublicFaq />
          </PublicLayout>
        );
      case "become-expert":
        return isClientAuth ? (
          <AuthenticatedUserLayout activeTab="become-expert">
            <BecomeAnExpertFlow />
          </AuthenticatedUserLayout>
        ) : (
          <PublicLayout>
            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto w-full">
              <BecomeAnExpertFlow />
            </div>
          </PublicLayout>
        );
      case "terms":
      case "privacy":
      case "cancellation":
      case "guidelines":
      case "security":
      case "contact":
      case "help":
        return (
          <PublicLayout>
            <PublicLegalPages type={currentView as any} />
          </PublicLayout>
        );

      // --- AUTHENTICATED_USER_LAYOUT VIEWS ---
      case "dashboard":
      case "user-dashboard":
        return (
          <RequireAuth>
            <AuthenticatedUserLayout activeTab="user-dashboard">
              <UserOverview />
            </AuthenticatedUserLayout>
          </RequireAuth>
        );
      case "ask":
      case "user-ask":
        return (
          <RequireAuth>
            <AuthenticatedUserLayout activeTab="user-ask">
              <UserAskView />
            </AuthenticatedUserLayout>
          </RequireAuth>
        );
      case "history":
      case "user-history":
        return (
          <RequireAuth>
            <AuthenticatedUserLayout activeTab="user-history">
              <UserHistoryView />
            </AuthenticatedUserLayout>
          </RequireAuth>
        );
      case "projects":
      case "user-projects":
        return (
          <RequireAuth>
            <AuthenticatedUserLayout activeTab="user-projects">
              <UserProjectsView />
            </AuthenticatedUserLayout>
          </RequireAuth>
        );
      case "integrations":
      case "user-integrations":
        return (
          <RequireAuth>
            <AuthenticatedUserLayout activeTab="user-integrations">
              <UserIntegrationsView />
            </AuthenticatedUserLayout>
          </RequireAuth>
        );
      case "payments":
      case "user-payments":
        return (
          <RequireAuth>
            <AuthenticatedUserLayout activeTab="user-payments">
              <UserPaymentsView />
            </AuthenticatedUserLayout>
          </RequireAuth>
        );
      case "settings":
      case "user-settings":
        return (
          <RequireAuth>
            <AuthenticatedUserLayout activeTab="user-settings">
              <UserSettingsView />
            </AuthenticatedUserLayout>
          </RequireAuth>
        );

      // --- EXPERT_LAYOUT ---
      case "expert-dashboard":
        return (
          <RequireExpertAuth>
            <ExpertLayout>
              <ExpertDashboard />
            </ExpertLayout>
          </RequireExpertAuth>
        );

      // --- LIVE CONSULTATION ROOM ---
      case "session-room":
        return <LiveSessionRoom />;

      // --- SEPARATE ADMIN CONTROL CENTER ROUTES ---
      case "admin-login":
        return <AdminLogin />;

      case "admin":
      case "admin-overview":
      case "admin-users":
      case "admin-experts":
      case "admin-sessions":
      case "admin-payments":
      case "admin-payouts":
      case "admin-reports":
      case "admin-accreditation":
      case "admin-system":
      case "admin-audit-log":
      case "admin-settings":
      case "admin-accounts":
        return (
          <AdminRequireAuth>
            <AdminShell initialTab={currentView.replace("admin-", "")} />
          </AdminRequireAuth>
        );

      default:
        return (
          <PublicLayout isHome>
            <PublicHome />
          </PublicLayout>
        );
    }
  };

  const isRoomView = currentView === "session-room";

  return (
    <div
      className={`min-h-[100dvh] w-full text-[#342A24] selection:bg-[#C96F42]/20 selection:text-[#342A24] ${
        isRoomView ? "bg-[#1E1714]" : "bg-[#F6F0E7]"
      }`}
    >
      <PageTransition routeKey={currentView}>
        <React.Suspense fallback={<HumanAPIPageLoader />}>
          {renderContent()}
        </React.Suspense>
      </PageTransition>

      {/* Global Modals - Consistently mounted across all views */}
      <AuthModal />
      <BookingModal />
      <PostSessionReviewModal />
      <ExpertAccreditationModal />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-[12px] shadow-warm-lg flex items-center gap-2.5 text-xs font-semibold border ${
              notification.type === "success"
                ? "bg-[#FFF9F2] border-[#77816C] text-[#342A24]"
                : notification.type === "error"
                ? "bg-[#FFF9F2] border-[#B85D3D] text-[#B85D3D]"
                : "bg-[#FFF9F2] border-[#E8DCCB] text-[#342A24]"
            }`}
          >
            {notification.type === "success" && (
              <CheckCircle2 size={16} className="text-[#77816C]" />
            )}
            {notification.type === "error" && (
              <AlertCircle size={16} className="text-[#B85D3D]" />
            )}
            {notification.type === "info" && (
              <Info size={16} className="text-[#C96F42]" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <CurrencyProvider>
        <AppRouter />
      </CurrencyProvider>
    </AppProvider>
  );
}
