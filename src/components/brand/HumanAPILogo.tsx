import React, { useState } from "react";
import logoPng from "../../assets/brand/logo/humanapi-logo.png";

export type LogoVariant = "welcome" | "navbar" | "footer" | "compact";
export type LogoTheme = "light" | "dark";

export interface HumanAPILogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

/**
 * HumanAPILogo
 * 
 * Unified HumanAPI Brand Lockup component combining:
 * 1. The compact orange HumanAPI symbol mark (18px–21px, max 22px)
 * 2. Styled Manrope wordmark: "Human" + "API" (18px–21px)
 * 
 * Spacing: Exactly 8px gap using flex layout.
 * Alignment: Perfectly vertically centered, width: fit-content.
 */
export const HumanAPILogo: React.FC<HumanAPILogoProps> = ({
  variant = "navbar",
  theme,
  className = "",
  alt = "HumanAPI Logo",
  onClick
}) => {
  const [hasError, setHasError] = useState(false);

  const effectiveTheme = theme || (variant === "welcome" ? "dark" : "light");

  // Symbol mark sizing per variant (Strictly <= 22px):
  // welcome: Mobile 18px, Tablet 20px, Desktop 21px
  // navbar: Mobile 18px, Desktop 20px
  // footer: Mobile 20px, Desktop 22px
  // compact: Mobile 18px, Tablet 20px, Desktop 22px
  const markSizeMap: Record<LogoVariant, string> = {
    welcome: "w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] md:w-[42px] md:h-[42px]",
    navbar: "w-[26px] h-[26px] sm:w-[29px] sm:h-[29px] md:w-[32px] md:h-[32px]",
    footer: "w-[26px] h-[26px] sm:w-[29px] sm:h-[29px]",
    compact: "w-[24px] h-[24px] sm:w-[26px] sm:h-[26px]"
  };

  const wordmarkTextMap: Record<LogoVariant, string> = {
    welcome: "text-[30px] sm:text-[34px] md:text-[42px]",
    navbar: "text-[24px] sm:text-[27px] md:text-[30px]",
    footer: "text-[24px] sm:text-[27px]",
    compact: ""
  };

  const markSizeClass = markSizeMap[variant] || markSizeMap.navbar;
  const wordmarkTextClass = wordmarkTextMap[variant] || wordmarkTextMap.navbar;

  const humanColor = effectiveTheme === "dark" ? "text-[#FFF4E8]" : "text-[#342A24]";
  const apiColor = effectiveTheme === "dark" ? "text-[#F0A23A]" : "text-[#C96F42]";

  // Only the orange symbol mark image gets a subtle warm drop-shadow glow
  const markGlowStyle = effectiveTheme === "dark"
    ? { filter: "drop-shadow(0 0 6px rgba(240,162,58,0.14))" }
    : undefined;

  return (
    <div
      onClick={onClick}
      className={`humanapi-logo inline-flex items-center justify-center gap-[9px] w-fit h-auto shrink-0 select-none ${
        onClick ? "cursor-pointer transition-all duration-200 hover:opacity-[0.88] hover:scale-[1.015]" : ""
      } ${className}`}
    >
      <img
        src={hasError ? "/assets/logo.png" : logoPng}
        alt={alt}
        onError={() => setHasError(true)}
        style={markGlowStyle}
        className={`humanapi-mark ${markSizeClass} object-contain pointer-events-none shrink-0 -translate-y-[0.5px]`}
        loading="eager"
        decoding="async"
      />
      {variant !== "compact" && (
        <span
          className={`humanapi-wordmark font-sans font-semibold tracking-[-0.035em] leading-none ${wordmarkTextClass}`}
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          <span className={humanColor}>Human</span>
          <span className={apiColor}>API</span>
        </span>
      )}
    </div>
  );
};

export default HumanAPILogo;
