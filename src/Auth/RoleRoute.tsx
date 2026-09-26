import React from "react";
import { useAuth } from "./AuthProvider";
import { UserRole } from "../types";
import { HumanAPIFullPageLoader } from "../components/loading";

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  onDenied?: () => void;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({
  allowedRoles,
  children,
  onDenied
}) => {
  const { currentUser, authState, isInitializing } = useAuth();

  if (isInitializing) {
    return <HumanAPIFullPageLoader caption="Checking access permissions..." />;
  }

  if (authState !== "AUTHENTICATED" || !currentUser) {
    if (onDenied) onDenied();
    return null;
  }

  const userRole = currentUser.role;
  const isAllowed = allowedRoles.includes(userRole) || (userRole === "admin" && allowedRoles.includes("user"));

  // Enforce expert status verification check
  if (allowedRoles.includes("expert") && userRole === "expert" && !currentUser.isExpert) {
    if (onDenied) onDenied();
    return (
      <div className="p-8 max-w-lg mx-auto text-center bg-[#FFF9F2] border border-[#E8DCCB] rounded-[20px] my-12 shadow-warm-md">
        <h3 className="text-xl font-bold text-[#342A24] mb-2">Expert Accreditation Required</h3>
        <p className="text-sm text-[#7B6C60] mb-4">
          Expert access requires application assessment, review, and accreditation approval.
        </p>
      </div>
    );
  }

  if (!isAllowed) {
    if (onDenied) onDenied();
    return (
      <div className="p-8 max-w-lg mx-auto text-center bg-[#FFF9F2] border border-[#E8DCCB] rounded-[20px] my-12 shadow-warm-md">
        <h3 className="text-xl font-bold text-[#342A24] mb-2">Access Restricted (403 Unauthorized)</h3>
        <p className="text-sm text-[#7B6C60]">
          You do not have administrative or authorization permissions to view this section.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
