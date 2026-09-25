import React, { useEffect } from "react";
import { LandingNavbar } from "../landing/LandingNavbar";
import { WelcomeSection } from "../landing/WelcomeSection";
import { IntroSection } from "../landing/IntroSection";
import { TrustStrip } from "../landing/TrustStrip";
import { HowItWorks } from "../landing/HowItWorks";
import { ExpertDiscovery } from "../landing/ExpertDiscovery";
import { ConsultationPreview } from "../landing/ConsultationPreview";
import { UseCases } from "../landing/UseCases";
import { PricingSection } from "../landing/PricingSection";
import { AboutSection } from "../landing/AboutSection";
import { FAQSection } from "../landing/FAQSection";
import { BecomeExpert } from "../landing/BecomeExpert";
import { FinalCTA } from "../landing/FinalCTA";

/**
 * PublicHome
 * 
 * Continuous, scroll-driven Public Landing Page Experience for HumanAPI.
 */
export const PublicHome: React.FC = () => {
  // Support URL hash auto-scroll on initial load (e.g. /#pricing, /#faq, /#experts)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      const timer = setTimeout(() => {
        const element = document.getElementById(hashId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="relative w-full max-w-none m-0 p-0 bg-[#F6F0E7] text-[#342A24] selection:bg-[#C96F42]/20 selection:text-[#342A24] flex flex-col">
      {/* Floating Landing Navbar (Appears on scroll, stays stable over landing sections) */}
      <LandingNavbar />

      {/* 01: Welcome Section */}
      <WelcomeSection />

      {/* 02: Main HumanAPI Introduction */}
      <IntroSection />

      {/* Product Truths Strip */}
      <TrustStrip />

      {/* 03: How It Works */}
      <HowItWorks />

      {/* 04: Find Experts */}
      <ExpertDiscovery />

      {/* 05: Consultation Experience Workspace Preview */}
      <ConsultationPreview />

      {/* 06: Use Cases */}
      <UseCases />

      {/* 07: Pricing */}
      <PricingSection />

      {/* 08: About */}
      <AboutSection />

      {/* 09: FAQ */}
      <FAQSection />

      {/* 10: Become an Expert */}
      <BecomeExpert />

      {/* 11: Final CTA */}
      <FinalCTA />
    </div>
  );
};

export default PublicHome;
