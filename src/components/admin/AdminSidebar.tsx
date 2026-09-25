import React from "react";
import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  SlidersHorizontal,
  Activity,
  FileText,
  Lock,
  Tag,
  Bell,
  Star,
  Layers,
  Award,
  Settings
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const { reports, bans, auditLogs } = useApp();

  const openReportsCount = reports.filter(r => r.status === "open").length;
  const activeBansCount = bans.filter(b => b.status === "active").length;

  const navGroups = [
    {
      title: "OVERVIEW",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "live-activity", label: "Live Activity", icon: Activity }
      ]
    },
    {
      title: "PEOPLE",
      items: [
        { id: "users", label: "Users", icon: Users },
        { id: "experts", label: "Experts", icon: Briefcase },
        { id: "applications", label: "Applications", icon: FileText },
        { id: "banned-accounts", label: "Banned / Restricted", icon: AlertTriangle, badge: activeBansCount ? String(activeBansCount) : undefined }
      ]
    },
    {
      title: "OPERATIONS",
      items: [
        { id: "sessions", label: "Sessions", icon: Calendar },
        { id: "reports", label: "Reports Queue", icon: AlertTriangle, badge: openReportsCount ? String(openReportsCount) : undefined },
        { id: "reviews", label: "Reviews", icon: Star }
      ]
    },
    {
      title: "FINANCE",
      items: [
        { id: "payments", label: "Payments", icon: DollarSign },
        { id: "payouts", label: "Payouts", icon: DollarSign },
        { id: "platform-fees", label: "Platform Fees", icon: SlidersHorizontal }
      ]
    },
    {
      title: "ACCREDITATION",
      items: [
        { id: "accreditation", label: "Expert Accreditation", icon: Award }
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { id: "categories", label: "Categories", icon: Tag },
        { id: "feature-controls", label: "Feature Flags", icon: Layers },
        { id: "system-health", label: "System Health", icon: Activity }
      ]
    },
    {
      title: "SECURITY",
      items: [
        { id: "admin-accounts", label: "Admin Accounts", icon: Lock },
        { id: "audit-log", label: "Audit Log", icon: FileText, badge: String(auditLogs.length) }
      ]
    },
    {
      title: "SETTINGS",
      items: [
        { id: "settings", label: "Platform Settings", icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#FFF9F2] border-r border-[#E8DCCB] h-full flex flex-col justify-between p-4 overflow-y-auto shrink-0 font-sans text-[#342A24]">
      <div className="space-y-6">
        {navGroups.map(group => (
          <div key={group.title} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-[#7B6C60] uppercase tracking-wider">
              {group.title}
            </p>
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#C96F42] text-[#FFF9F2] shadow-warm-xs"
                      : "text-[#342A24] hover:bg-[#F6F0E7]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? "text-[#FFF9F2]" : "text-[#7B6C60]"} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? "bg-[#FFF9F2] text-[#C96F42]"
                          : "bg-[#C96F42]/10 text-[#C96F42]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-[#E8DCCB]/80 text-[11px] text-[#7B6C60] space-y-1">
        <p className="font-semibold text-[#342A24]">HumanAPI Security Policy</p>
        <p className="leading-tight">All admin operations are bound by backend role authorization and logged.</p>
      </div>
    </aside>
  );
};
