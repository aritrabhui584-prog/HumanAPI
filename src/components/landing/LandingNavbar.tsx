import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HumanAPILogo } from "../brand/HumanAPILogo";

/**
 * LandingNavbar
 * 
 * Floating navigation for the HumanAPI landing page.
 * 
 * Strict specifications:
 * - Does NOT show over the initial full-screen Welcome view.
 * - Initial state (scroll < 40px): opacity: 0, y: -12px, pointerEvents: none.
 * - After user scrolls (30–80px): opacity: 1, y: 0, pointerEvents: auto.
 * - Remains fixed/floating thereafter.
 * - Background: rgba(255, 249, 242, 0.92), backdrop-filter: blur(18px), border-radius: 18px.
 * - Navigation links: HumanAPI, Find Experts, How It Works, Use Cases, Pricing, About, FAQ, Become an Expert, Sign In, Get Started →.
 */
export const LandingNavbar: React.FC = () => {
  const { navigate, openAuthModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      // Reveal navbar smoothly once user begins scrolling (approx 40px)
      setIsVisible(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ["how-it-works", "experts", "consultation", "use-cases", "pricing", "about", "faq", "become-expert"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: "-25% 0px -55% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      if (typeof window !== "undefined" && window.history) {
        window.history.pushState(null, "", `#${id}`);
      }
    }
  };

  const navLinks = [
    { label: "Find Experts", action: () => handleScrollTo("experts"), id: "experts" },
    { label: "How It Works", action: () => handleScrollTo("how-it-works"), id: "how-it-works" },
    { label: "Use Cases", action: () => handleScrollTo("use-cases"), id: "use-cases" },
    { label: "Pricing", action: () => handleScrollTo("pricing"), id: "pricing" },
    { label: "About", action: () => handleScrollTo("about"), id: "about" },
    { label: "FAQ", action: () => handleScrollTo("faq"), id: "faq" }
  ];

  return (
    <>
      <header
        id="landing-floating-navbar"
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] w-[calc(100%-24px)] md:w-[calc(100%-32px)] max-w-[1260px] ${
          isVisible
            ? "opacity-100 translate-y-0 pointer-events-auto top-3 sm:top-4"
            : "opacity-0 -translate-y-3 pointer-events-none top-3 sm:top-4"
        }`}
        style={{
          borderRadius: "18px",
          background: "rgba(255, 249, 242, 0.92)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(52, 42, 36, 0.08)",
          boxShadow: "0 12px 36px rgba(52, 42, 36, 0.08), 0 2px 6px rgba(52, 42, 36, 0.03)"
        }}
      >
        <nav
          aria-label="Main Navigation"
          className="w-full h-[60px] sm:h-[64px] flex items-center justify-between pl-4 pr-2.5 sm:pl-[18px] sm:pr-[10px] py-2"
        >
          {/* LEFT: HumanAPI Logo */}
          <HumanAPILogo
            variant="navbar"
            alt="HumanAPI Home"
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          {/* CENTER: Primary Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="relative px-3 py-1.5 text-[13.5px] font-medium transition-colors duration-200 text-[#7B6C60] hover:text-[#342A24] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C96F42] rounded-md"
                >
                  <span className={isActive ? "text-[#342A24] font-semibold" : ""}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C96F42] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT: Become an Expert, Sign In, Get Started CTA */}
          <div className="hidden sm:flex items-center gap-2 md:gap-3">
            <button
              onClick={() => handleScrollTo("become-expert")}
              className="px-2.5 py-1.5 text-[13px] font-medium text-[#7B6C60] hover:text-[#342A24] transition-colors duration-200 rounded-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C96F42]"
              id="landing-navbar-become-expert"
            >
              Become an Expert
            </button>

            <button
              onClick={() => openAuthModal("login")}
              className="px-2.5 py-1.5 text-[13px] font-medium text-[#342A24] hover:text-[#C96F42] transition-colors duration-200 rounded-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C96F42]"
              id="landing-navbar-sign-in"
            >
              Sign In
            </button>

            <button
              onClick={() => openAuthModal("signup")}
              className="inline-flex items-center gap-1.5 h-[40px] px-3.5 rounded-[12px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFFCF7] text-[13px] font-medium transition-all duration-200 shadow-xs hover:-translate-y-[1px] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C96F42] select-none"
              id="landing-navbar-get-started"
            >
              <span>Get Started</span>
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#342A24] hover:bg-[#F6F0E7] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C96F42]"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[84px] left-3 right-3 z-40 p-5 rounded-[20px] bg-[#FFF9F2] border border-[#342A24]/10 shadow-[0_16px_40px_rgba(52,42,36,0.12)] lg:hidden pointer-events-auto"
          >
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    link.action();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-[15px] font-medium text-[#342A24] hover:bg-[#F6F0E7] transition-colors"
                >
                  {link.label}
                </button>
              ))}

              <div className="h-[1px] bg-[#342A24]/10 my-2" />

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("become-expert");
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-[15px] font-medium text-[#7B6C60] hover:text-[#342A24] hover:bg-[#F6F0E7] transition-colors"
              >
                Become an Expert
              </button>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal("login");
                  }}
                  className="w-full py-2.5 rounded-xl border border-[#342A24]/15 text-[14px] font-medium text-[#342A24] hover:bg-[#F6F0E7] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal("signup");
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFFCF7] text-[14px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNavbar;
