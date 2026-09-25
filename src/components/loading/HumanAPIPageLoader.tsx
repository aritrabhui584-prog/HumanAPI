import React from "react";
import { HumanAPILoader } from "./HumanAPILoader";

export interface HumanAPIPageLoaderProps {
  title?: string;
  subtitle?: string;
  minHeight?: string;
}

export const HumanAPIPageLoader: React.FC<HumanAPIPageLoaderProps> = ({
  title = "Loading Page Content",
  subtitle,
  minHeight = "min-h-[50vh]"
}) => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={`w-full ${minHeight} flex flex-col items-center justify-center p-6 text-center text-[#342A24] animate-in fade-in duration-150`}
    >
      <div className="p-8 rounded-[20px] bg-[#FFF9F2]/80 border border-[#E8DCCB] shadow-warm-xs flex flex-col items-center gap-3 max-w-md w-full">
        <HumanAPILoader size="md" showWordmark />
        {title && (
          <p className="text-xs sm:text-sm font-semibold text-[#7B6C60] mt-1">
            {title}
          </p>
        )}
        {subtitle && (
          <p className="text-[11px] text-[#7B6C60]/80">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default HumanAPIPageLoader;
