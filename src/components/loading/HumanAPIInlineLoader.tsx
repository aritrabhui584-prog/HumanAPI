import React from "react";
import logoPng from "../../assets/brand/logo/humanapi-logo.png";
import "./loading.css";

export interface HumanAPIInlineLoaderProps {
  label?: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}

export const HumanAPIInlineLoader: React.FC<HumanAPIInlineLoaderProps> = ({
  label = "Updating...",
  size = "sm",
  className = ""
}) => {
  const sizeMap: Record<"xs" | "sm" | "md", string> = {
    xs: "w-3.5 h-3.5 text-[11px]",
    sm: "w-4 h-4 text-xs",
    md: "w-5 h-5 text-xs sm:text-sm"
  };

  return (
    <span
      role="status"
      aria-busy="true"
      className={`inline-flex items-center gap-2 text-[#7B6C60] font-medium select-none ${className}`}
    >
      <img
        src={logoPng}
        alt=""
        className={`${sizeMap[size].split(" ")[0]} ${sizeMap[size].split(" ")[1]} object-contain animate-humanapi-logo-pulse inline-block`}
      />
      {label && <span className={sizeMap[size].split(" ")[2]}>{label}</span>}
    </span>
  );
};

export default HumanAPIInlineLoader;
