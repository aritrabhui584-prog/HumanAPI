import React from "react";
import { useApp } from "../../context/AppContext";
import { HumanAPILogo } from "../brand/HumanAPILogo";

/**
 * GlobalFooter
 * 
 * Reusable, canonical public footer component for HumanAPI.
 * Features warm editorial styling, accessible semantic markup,
 * responsive multi-column layout, and exact route navigation.
 */
export const GlobalFooter: React.FC = () => {
  const { currentView, navigate } = useApp();

  const handleLinkClick = (e: React.MouseEvent, view: string, anchorId?: string) => {
    e.preventDefault();
    if ((currentView === "home" || currentView === "welcome") && anchorId) {
      const el = document.getElementById(anchorId);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
        return;
      }
    }
    navigate(view);
  };

  return (
    <footer className="w-full bg-[#F6F0E7] border-t border-[#342A24]/[0.08] text-[#342A24] pt-14 pb-12 select-none flex-shrink-0">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#342A24]/[0.08]">
          {/* LEFT: Brand Logo & Tagline */}
          <div className="max-w-xs space-y-2 min-w-0">
            <HumanAPILogo
              variant="footer"
              alt="HumanAPI Logo"
              onClick={() => {
                if (currentView === "home" || currentView === "welcome") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  navigate("welcome");
                }
              }}
            />
            <p className="text-[13px] text-[#7B6C60] leading-relaxed break-words">
              Human expertise, on demand.
            </p>
          </div>

          {/* RIGHT / NAVIGATION LINKS */}
          <nav aria-label="Footer navigation">
            <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-7 gap-y-3 text-[13.5px] text-[#7B6C60] font-medium min-w-0">
              <a
                href="/experts"
                onClick={(e) => handleLinkClick(e, "experts", "experts")}
                className="hover:text-[#342A24] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C96F42]/30 rounded-sm"
              >
                Find Experts
              </a>
              <a
                href="/how-it-works"
                onClick={(e) => handleLinkClick(e, "how-it-works", "how-it-works")}
                className="hover:text-[#342A24] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C96F42]/30 rounded-sm"
              >
                How It Works
              </a>
              <a
                href="/use-cases"
                onClick={(e) => handleLinkClick(e, "use-cases", "use-cases")}
                className="hover:text-[#342A24] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C96F42]/30 rounded-sm"
              >
                Use Cases
              </a>
              <a
                href="/pricing"
                onClick={(e) => handleLinkClick(e, "pricing", "pricing")}
                className="hover:text-[#342A24] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C96F42]/30 rounded-sm"
              >
                Pricing
              </a>
              <a
                href="/about"
                onClick={(e) => handleLinkClick(e, "about", "about")}
                className="hover:text-[#342A24] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C96F42]/30 rounded-sm"
              >
                About
              </a>
              <a
                href="/become-expert"
                onClick={(e) => handleLinkClick(e, "become-expert", "become-expert")}
                className="hover:text-[#342A24] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C96F42]/30 rounded-sm"
              >
                Become an Expert
              </a>
              <a
                href="/faq"
                onClick={(e) => handleLinkClick(e, "faq", "faq")}
                className="hover:text-[#342A24] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C96F42]/30 rounded-sm"
              >
                FAQ
              </a>
              <a
                href="/terms"
                onClick={(e) => handleLinkClick(e, "terms")}
                className="hover:text-[#342A24] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C96F42]/30 rounded-sm"
              >
                Terms
              </a>
              <a
                href="/privacy"
                onClick={(e) => handleLinkClick(e, "privacy")}
                className="hover:text-[#342A24] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C96F42]/30 rounded-sm"
              >
                Privacy
              </a>
            </div>
          </nav>
        </div>

        {/* BOTTOM ROW */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[12px] text-[#7B6C60] gap-3 min-w-0">
          <p className="break-words">© {new Date().getFullYear()} HumanAPI. All rights reserved.</p>
          <p className="break-words">Verified human practitioners. Encrypted WebRTC sessions.</p>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
