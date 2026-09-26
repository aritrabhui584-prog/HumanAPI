import React from "react";
import { useAuth } from "./AuthProvider";
import { HumanAPIFullPageLoader } from "../components/loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackView?: string;
  onUnauthorized?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  onUnauthorized
}) => {
  const { authState, isInitializing } = useAuth();

  if (isInitializing) {
    return <HumanAPIFullPageLoader caption="Authenticating session..." />;
  }

  if (authState !== "AUTHENTICATED") {
    if (onUnauthorized) {
      onUnauthorized();
    }
    return null;
  }

  return <>{children}</>;
};
