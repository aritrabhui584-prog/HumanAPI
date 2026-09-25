import React from "react";
import logoPng from "../../assets/brand/logo/humanapi-logo.png";
import "./loading.css";

export type HumanAPILoaderSize = "sm" | "md" | "lg" | "xl";

export interface HumanAPILoaderProps {
  size?: HumanAPILoaderSize;
  showWordmark?: boolean;
  theme?: "light" | "dark";
  className?: string;
  label?: string;
  caption?: string;
}

export const HumanAPILoader: React.FC<HumanAPILoaderProps> = ({
  size = "md",
  showWordmark = false,
  theme = "light",
  className = "",
  label,
  caption
}) => {
  const displayLabel = caption || label || "Loading HumanAPI...";
  const markSizeMap: Record<HumanAPILoaderSize, string> = {
    sm: "w-5 h-5",
    md: "w-8 h-8 sm:w-9 sm:h-9",
    lg: "w-12 h-12 sm:w-14 sm:h-14",
    xl: "w-16 h-16 sm:w-20 sm:h-20"
  };

  const textSizeMap: Record<HumanAPILoaderSize, string> = {
    sm: "text-base",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
    xl: "text-3xl sm:text-4xl"
  };

  const humanColor = theme === "dark" ? "text-[#FFF4E8]" : "text-[#342A24]";
  const apiColor = theme === "dark" ? "text-[#F0A23A]" : "text-[#C96F42]";

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={`inline-flex items-center justify-center gap-2.5 select-none ${className}`}
    >
      <div className={`relative flex items-center justify-center ${markSizeMap[size]}`}>
        <img
          src={logoPng}
          alt="HumanAPI Loading Mark"
          className={`w-full h-full object-contain pointer-events-none animate-humanapi-logo-pulse`}
          loading="eager"
        />
      </div>

      {showWordmark && (
        <span
          className={`font-sans font-semibold tracking-[-0.035em] leading-none ${textSizeMap[size]}`}
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          <span className={humanColor}>Human</span>
          <span className={apiColor}>API</span>
        </span>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default HumanAPILoader;
