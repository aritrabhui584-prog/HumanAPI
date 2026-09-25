import React from "react";
import { PublicHome } from "../public/PublicHome";

/**
 * WelcomeLanding
 * 
 * Renders the unified, scroll-driven PublicHome landing page.
 * Strictly adheres to the rule of NO timers, NO timeouts, and NO automatic redirects.
 * User controls progression entirely through natural scrolling.
 */
export const WelcomeLanding: React.FC = () => {
  return <PublicHome />;
};

export default WelcomeLanding;
