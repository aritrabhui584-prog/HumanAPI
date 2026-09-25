import React from "react";
import ResponsiveHeroVideo from "./ResponsiveHeroVideo";

interface WelcomeVideoProps {
  className?: string;
  prefersReducedMotion?: boolean;
}

/**
 * WelcomeVideo Component
 * Re-exports ResponsiveHeroVideo for complete backwards compatibility across the landing page.
 */
export const WelcomeVideo: React.FC<WelcomeVideoProps> = (props) => {
  return <ResponsiveHeroVideo {...props} />;
};

export default WelcomeVideo;
