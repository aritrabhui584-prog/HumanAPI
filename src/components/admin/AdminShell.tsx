import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { AdminOverviewView } from "./views/AdminOverviewView";
import { AdminUsersView } from "./views/AdminUsersView";
import { AdminExpertsView } from "./views/AdminExpertsView";
import { AdminSessionsView } from "./views/AdminSessionsView";
import { AdminFinanceView } from "./views/AdminFinanceView";
import { AdminReportsView } from "./views/AdminReportsView";
import { AdminAuditLogView } from "./views/AdminAuditLogView";
import { AdminAccountsView } from "./views/AdminAccountsView";
import { AdminSystemView } from "./views/AdminSystemView";

import { AdminTableSkeleton } from "../loading";

interface AdminShellProps {
  initialTab?: string;
}

/**
 * AdminShell
 * 
 * Standalone administrative layout shell for HumanAPI company owners/administrators.
 * Completely isolated from Client Workspace and Expert Workspace.
 */
export const AdminShell: React.FC<AdminShellProps> = ({ initialTab = "overview" }) => {
  const { currentView, navigate, isRefreshing } = useApp();
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (currentView.startsWith("admin-")) {
      return currentView.replace("admin-", "");
    }
    return initialTab;
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`admin-${tab}`);
  };

  const renderActiveView = () => {
    if (isRefreshing) {
      return <AdminTableSkeleton rows={8} />;
    }
    switch (activeTab) {
      case "overview":
      case "live-activity":
        return <AdminOverviewView onNavigateTab={handleTabChange} />;
      case "users":
      case "banned-accounts":
        return <AdminUsersView />;
      case "experts":
      case "applications":
        return <AdminExpertsView />;
      case "sessions":
        return <AdminSessionsView />;
      case "payments":
      case "payouts":
      case "platform-fees":
        return <AdminFinanceView initialSubTab={activeTab === "payouts" ? "payouts" : activeTab === "platform-fees" ? "fees" : "payments"} />;
      case "reports":
      case "reviews":
        return <AdminReportsView />;
      case "accreditation":
        return <AdminExpertsView />;
      case "categories":
      case "feature-controls":
      case "system-health":
      case "system":
        return <AdminSystemView />;
      case "audit-log":
        return <AdminAuditLogView />;
      case "admin-accounts":
      case "admins":
      case "settings":
        return <AdminAccountsView />;
      default:
        return <AdminOverviewView onNavigateTab={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F6F0E7] text-[#342A24] selection:bg-[#C96F42]/20 font-sans">
      <AdminHeader />
      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-[1440px]">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
