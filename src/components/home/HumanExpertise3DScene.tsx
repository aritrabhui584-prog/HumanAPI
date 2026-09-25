import React, { useState, useEffect, useRef } from "react";
import { Star, CheckCircle2, Clock, Sparkles, Zap, ShieldCheck, ArrowRight, Eye } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { KnowledgeSphereScene } from "./KnowledgeSphereScene";
import { StaticHeroFallback } from "./StaticHeroFallback";

export const HumanExpertise3DScene: React.FC = () => {
  const { experts, openBookingModal, navigate } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);

  // Featured expert for the interactive 3D card
  const featuredExpert = experts[0] || {
    id: "exp-1",
    name: "Arjun Mehta",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    headline: "Staff Engineer & Distributed Systems Architect",
    rating: 4.96,
    reviewCount: 248,
    pricing: { duration10: 349 },
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [forceStaticMode, setForceStaticMode] = useState(false);
  const [force3DMode, setForce3DMode] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  // Check device screen width, touch capability, and WebGL support
  useEffect(() => {
    // 1. WebGL Support Test
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
      if (!gl) {
        setHasWebGL(false);
      }
    } catch (e) {
      setHasWebGL(false);
    }

    // 2. Mobile viewport & touch detection (< 768px)
    const checkIsMobile = () => {
      const width = window.innerWidth;
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(width < 768 || (isTouch && width < 1024));
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Subtle Mouse Parallax Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: nx, y: ny });
  };

  const handleMouseLeave = () => {
    // Gracefully ease back to center
    setMousePos({ x: 0, y: 0 });
    setActiveTopic(null);
  };

  // Determine whether to display the static image fallback or the R3F Canvas
  const showStaticFallback = (!hasWebGL || isMobile || forceStaticMode) && !force3DMode;

  // Handlers for interactive cards
  const handleBookFeatured = () => {
    if (featuredExpert) {
      openBookingModal(featuredExpert as any, 10);
    } else {
      navigate("experts");
    }
  };

  const handleTopicSelect = (topic: string) => {
    navigate("experts", { searchQuery: topic });
  };

  if (showStaticFallback) {
    return (
      <div className="relative w-full">
        {/* Toggle bar to optionally preview 3D mode */}
        <div className="flex items-center justify-between px-3 py-1.5 mb-2 rounded-[10px] bg-[#FFF9F2] border border-[#E8DCCB] text-[11px] text-[#7B6C60]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#77816C]" />
            <span>Mobile Fallback (Low-power static rendering)</span>
          </span>
          <button
            onClick={() => {
              setForce3DMode(true);
              setForceStaticMode(false);
            }}
            className="text-[#C96F42] hover:text-[#B85D3D] font-semibold flex items-center gap-1 transition-colors"
          >
            <Zap size={12} />
            <span>Enable 3D Canvas</span>
          </button>
        </div>

        <StaticHeroFallback
          onBookExpert={handleBookFeatured}
          onTopicClick={handleTopicSelect}
          onEnable3D={() => {
            setForce3DMode(true);
            setForceStaticMode(false);
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[480px] sm:h-[520px] lg:h-[560px] flex items-center justify-center select-none overflow-hidden"
    >
      {/* View Mode Switcher pill (Discreet inspection control) */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-2">
        <button
          onClick={() => {
            setForceStaticMode(true);
            setForce3DMode(false);
          }}
          className="px-2.5 py-1 rounded-[8px] bg-[#FFF9F2]/90 hover:bg-[#FFF9F2] backdrop-blur-sm border border-[#E8DCCB] text-[10px] font-sans font-semibold text-[#7B6C60] hover:text-[#342A24] transition-all shadow-warm-xs flex items-center gap-1"
          title="Preview the static image fallback engineered for mobile devices"
        >
          <Eye size={11} className="text-[#C96F42]" />
          <span>Preview Mobile Fallback</span>
        </button>
      </div>

      {/* 1. REACT THREE FIBER CANVAS LAYER */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <KnowledgeSphereScene mousePos={mousePos} activeTopic={activeTopic} />
      </div>

      {/* 2. WARM AMBIENT RADIAL GLOW BACKDROP */}
      <div
        className="absolute w-80 h-80 rounded-full bg-[#C96F42]/10 blur-3xl pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * 28}px, ${mousePos.y * 28}px)`,
          transition: "transform 0.25s ease-out",
        }}
      />
      <div className="absolute w-64 h-64 rounded-full bg-[#B89152]/10 blur-3xl pointer-events-none -bottom-10 -right-10" />
      <div className="absolute w-56 h-56 rounded-full bg-[#77816C]/10 blur-3xl pointer-events-none -top-8 -left-8" />

      {/* 3. INTERACTIVE EXPERT CARDS (ENGINEERED AROUND THE TRANSLUCENT SPHERE) */}
      <div className="relative w-full h-full max-w-[560px] pointer-events-none z-10 p-3 sm:p-4">
        {/* Card 1: Top Right - Verified Specialist Profile Card */}
        <div
          onClick={handleBookFeatured}
          onMouseEnter={() => setActiveTopic("Arjun Mehta")}
          onMouseLeave={() => setActiveTopic(null)}
          className="absolute top-4 sm:top-7 right-1 sm:right-3 bg-[#FFF9F2]/95 backdrop-blur-md border border-[#E8DCCB] hover:border-[#C96F42] rounded-[16px] p-3.5 shadow-warm-md pointer-events-auto transition-all duration-200 hover:scale-[1.03] max-w-[225px] cursor-pointer group"
          style={{
            transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -16}px)`,
          }}
          id="hero-3d-featured-expert-card"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={featuredExpert.avatar}
                alt={featuredExpert.name}
                className="w-11 h-11 rounded-[12px] object-cover border border-[#E8DCCB] group-hover:border-[#C96F42] transition-colors"
              />
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#77816C] border-2 border-[#FFF9F2] flex items-center justify-center"
                title="Verified Human Specialist"
              >
                <CheckCircle2 size={10} className="text-[#FFF9F2]" />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#342A24] truncate">
                  {featuredExpert.name}
                </span>
              </div>
              <p className="text-[11px] text-[#7B6C60] leading-tight truncate">
                Staff Systems Architect
              </p>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-[#E8DCCB]/70 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-[#342A24]">
              <Star size={12} className="fill-[#B89152] text-[#B89152]" />
              {featuredExpert.rating} <span className="text-[#7B6C60] font-normal">({featuredExpert.reviewCount})</span>
            </span>
            <span className="font-mono font-bold text-[#C96F42]">
              10m · ₹{featuredExpert.pricing?.duration10 || 349}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-[#C96F42] group-hover:text-[#B85D3D]">
            <span>Book 10m sprint</span>
            <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Top Left - Expertise Tag: "React Architecture" */}
        <button
          onClick={() => handleTopicSelect("React")}
          onMouseEnter={() => setActiveTopic("React")}
          onMouseLeave={() => setActiveTopic(null)}
          className="absolute top-9 sm:top-12 left-1 sm:left-4 bg-[#FFF9F2]/95 hover:bg-[#FFF9F2] backdrop-blur-md border border-[#E8DCCB] hover:border-[#C96F42] rounded-[11px] px-3.5 py-2 shadow-warm-sm flex items-center gap-2 pointer-events-auto transition-all duration-200 hover:scale-[1.04] cursor-pointer group"
          style={{
            transform: `translate(${mousePos.x * 16}px, ${mousePos.y * 14}px)`,
          }}
          id="hero-3d-chip-react"
        >
          <span className="w-2 h-2 rounded-full bg-[#C96F42] group-hover:scale-125 transition-transform" />
          <span className="text-xs font-semibold text-[#342A24]">React Architecture</span>
        </button>

        {/* Card 3: Mid Left - Availability Live Radar Card */}
        <div
          onClick={() => navigate("experts")}
          onMouseEnter={() => setActiveTopic("Available")}
          onMouseLeave={() => setActiveTopic(null)}
          className="absolute top-[48%] -translate-y-1/2 left-0 sm:left-2 bg-[#FFF9F2]/95 backdrop-blur-md border border-[#77816C]/40 hover:border-[#77816C] rounded-[14px] p-3 shadow-warm-md pointer-events-auto max-w-[195px] transition-all duration-200 hover:scale-[1.03] cursor-pointer"
          style={{
            transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 10}px)`,
          }}
          id="hero-3d-availability-card"
        >
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#77816C]">
            <span className="w-2 h-2 rounded-full bg-[#77816C] animate-pulse" />
            <span>12 Specialists Online</span>
          </div>
          <p className="text-xs font-bold text-[#342A24] mt-1 leading-snug">
            Distributed Systems & AI
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-[#7B6C60]">
            <Clock size={11} className="text-[#C96F42]" />
            <span>Next sprint: Today, in 5m</span>
          </div>
        </div>

        {/* Card 4: Bottom Right - Expertise Tag: "UI/UX Systems" */}
        <button
          onClick={() => handleTopicSelect("UI/UX Design")}
          onMouseEnter={() => setActiveTopic("Design")}
          onMouseLeave={() => setActiveTopic(null)}
          className="absolute bottom-16 sm:bottom-20 right-2 sm:right-6 bg-[#FFF9F2]/95 hover:bg-[#FFF9F2] backdrop-blur-md border border-[#E8DCCB] hover:border-[#77816C] rounded-[11px] px-3.5 py-2 shadow-warm-sm flex items-center gap-2 pointer-events-auto transition-all duration-200 hover:scale-[1.04] cursor-pointer group"
          style={{
            transform: `translate(${mousePos.x * -14}px, ${mousePos.y * -18}px)`,
          }}
          id="hero-3d-chip-uiux"
        >
          <span className="w-2 h-2 rounded-full bg-[#77816C] group-hover:scale-125 transition-transform" />
          <span className="text-xs font-semibold text-[#342A24]">UI/UX Systems</span>
        </button>

        {/* Card 5: Bottom Left - "Career Strategy" Tag */}
        <button
          onClick={() => handleTopicSelect("Career & Interviews")}
          onMouseEnter={() => setActiveTopic("Career")}
          onMouseLeave={() => setActiveTopic(null)}
          className="absolute bottom-6 sm:bottom-8 left-4 sm:left-10 bg-[#FFF9F2]/95 hover:bg-[#FFF9F2] backdrop-blur-md border border-[#E8DCCB] hover:border-[#B89152] rounded-[11px] px-3.5 py-2 shadow-warm-sm flex items-center gap-2 pointer-events-auto transition-all duration-200 hover:scale-[1.04] cursor-pointer group"
          style={{
            transform: `translate(${mousePos.x * 14}px, ${mousePos.y * 16}px)`,
          }}
          id="hero-3d-chip-career"
        >
          <span className="w-2 h-2 rounded-full bg-[#B89152] group-hover:scale-125 transition-transform" />
          <span className="text-xs font-semibold text-[#342A24]">Career Strategy</span>
        </button>

        {/* Card 6: Bottom Right Anchor - Direct 1:1 Consultation Protocol */}
        <div
          className="absolute bottom-1 right-8 sm:right-20 bg-[#342A24] text-[#FFF9F2] rounded-[10px] px-3.5 py-1.5 shadow-warm-md flex items-center gap-2 pointer-events-auto transition-transform duration-200 text-[11px]"
          style={{
            transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -10}px)`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C96F42] animate-ping" />
          <span className="font-mono text-[11px] tracking-wide">Direct 1:1 Consultation</span>
        </div>
      </div>
    </div>
  );
};
