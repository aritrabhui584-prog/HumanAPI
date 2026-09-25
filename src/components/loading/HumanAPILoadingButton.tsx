import React from "react";
import logoPng from "../../assets/brand/logo/humanapi-logo.png";
import "./loading.css";

export interface HumanAPILoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const HumanAPILoadingButton: React.FC<HumanAPILoadingButtonProps> = ({
  isLoading = false,
  loadingText = "Processing...",
  icon,
  variant = "primary",
  size = "md",
  children,
  disabled,
  className = "",
  onClick,
  ...props
}) => {
  const variantStyles: Record<string, string> = {
    primary: "bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] shadow-warm-xs border border-transparent",
    secondary: "bg-[#F6F0E7] hover:bg-[#E8DCCB] text-[#342A24] border border-[#E8DCCB]",
    outline: "bg-[#FFF9F2] hover:bg-[#F6F0E7] text-[#342A24] border border-[#E8DCCB]",
    danger: "bg-[#B85D3D] hover:bg-[#9B4A2F] text-[#FFF9F2] shadow-warm-xs border border-transparent",
    ghost: "bg-transparent hover:bg-[#F6F0E7] text-[#7B6C60] hover:text-[#342A24] border border-transparent"
  };

  const sizeStyles: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs rounded-[9px]",
    md: "px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-[11px]",
    lg: "px-6 py-3.5 text-sm sm:text-base font-bold rounded-[14px]"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      onClick={handleClick}
      aria-busy={isLoading}
      className={`relative inline-flex items-center justify-center gap-2 font-sans transition-all duration-150 select-none ${
        variantStyles[variant] || variantStyles.primary
      } ${sizeStyles[size] || sizeStyles.md} ${
        isLoading ? "cursor-wait opacity-90" : disabled ? "opacity-50 cursor-not-allowed" : "hover-btn-lift"
      } ${className}`}
    >
      {isLoading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <img
            src={logoPng}
            alt=""
            className="w-4 h-4 object-contain animate-humanapi-logo-pulse shrink-0"
          />
          <span>{loadingText}</span>
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-2">
          {children}
          {icon && <span className="shrink-0">{icon}</span>}
        </span>
      )}
    </button>
  );
};

export default HumanAPILoadingButton;
