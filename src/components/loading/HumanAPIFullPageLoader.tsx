import React from "react";
import { HumanAPILoader } from "./HumanAPILoader";

export interface HumanAPIFullPageLoaderProps {
  caption?: string;
  subcaption?: string;
}

export const HumanAPIFullPageLoader: React.FC<HumanAPIFullPageLoaderProps> = ({
  caption = "Loading HumanAPI...",
  subcaption
}) => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="fixed inset-0 z-[9999] min-h-[100dvh] w-full bg-[#F6F0E7] flex flex-col items-center justify-center p-4 text-[#342A24] selection:bg-[#C96F42]/20 font-sans animate-in fade-in duration-150"
    >
      <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto">
        <HumanAPILoader size="lg" showWordmark />
        
        {caption && (
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-medium text-[#7B6C60] tracking-wide animate-pulse">
              {caption}
            </p>
            {subcaption && (
              <p className="text-[11px] text-[#7B6C60]/70">
                {subcaption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HumanAPIFullPageLoader;
