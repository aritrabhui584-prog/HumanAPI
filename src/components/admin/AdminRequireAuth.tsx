import React from "react";
import { useApp } from "../../context/AppContext";
import { AdminLogin } from "./AdminLogin";

interface AdminRequireAuthProps {
  children: React.ReactNode;
  requiredRole?: "OWNER" | "ADMIN" | "MODERATOR" | "FINANCE" | "SUPPORT";
}

/**
 * AdminRequireAuth
 * 
 * Strict route authorization guard enforcing Admin control center authentication.
 * If unauthenticated or OTP required, renders AdminLogin.
 * Never allows normal clients or experts to enter without administrative session.
 */
export const AdminRequireAuth: React.FC<AdminRequireAuthProps> = ({ children, requiredRole }) => {
  const { adminUser, adminAuthStage } = useApp();

  if (adminAuthStage !== "authenticated" || !adminUser) {
    return <AdminLogin />;
  }

  // Optional role restriction check (e.g. OWNER only)
  if (requiredRole && requiredRole === "OWNER" && adminUser.role !== "OWNER") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#F6F0E7]">
        <div className="max-w-md w-full p-8 rounded-[20px] bg-[#FFF9F2] border border-[#E8DCCB] shadow-warm-md text-center space-y-4 font-sans text-[#342A24]">
          <div className="w-12 h-12 rounded-[12px] bg-[#B85D3D]/10 text-[#B85D3D] flex items-center justify-center mx-auto font-bold">
            OWNER ONLY
          </div>
          <h2 className="font-serif font-bold text-2xl">Restricted Action</h2>
          <p className="text-xs text-[#7B6C60] leading-relaxed">
            This module requires company OWNER role privileges. Your current administrative role is <strong>{adminUser.role}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
