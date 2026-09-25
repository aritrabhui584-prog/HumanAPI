import React from "react";
import { Star, CheckCircle2, Clock, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Expert } from "../../types";

interface StaticHeroFallbackProps {
  onSelectExpert?: (expertId: string) => void;
  onBookExpert?: () => void;
  onTopicClick?: (topic: string) => void;
  onEnable3D?: () => void;
}

export const StaticHeroFallback: React.FC<StaticHeroFallbackProps> = ({
  onSelectExpert,
  onBookExpert,
  onTopicClick,
  onEnable3D,
}) => {
  return (
    <div className="relative w-full min-h-[460px] sm:min-h-[500px] flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-hidden rounded-[20px] bg-gradient-to-b from-[#FFF9F2] via-[#F6F0E7] to-[#FFF9F2]">
      {/* 1. LAYERED STATIC KNOWLEDGE SPHERE VECTOR GRAPHIC */}
      <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center my-2 pointer-events-none">
        {/* Ambient Radial Backlight */}
        <div className="absolute w-64 h-64 rounded-full bg-[#C96F42]/15 blur-2xl animate-pulse" />
        <div className="absolute w-48 h-48 rounded-full bg-[#B89152]/15 blur-xl -top-4 -right-4" />
        <div className="absolute w-44 h-44 rounded-full bg-[#77816C]/15 blur-xl -bottom-4 -left-4" />

        {/* SVG Orbital Meridian Rings & Translucent Core */}
        <svg
          className="w-full h-full drop-shadow-md"
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="sphereCore" cx="42%" cy="38%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#FFF9F2" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#F6F0E7" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#C96F42" stopOpacity="0.3" />
            </radialGradient>
            <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C96F42" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#B89152" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C96F42" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ringGold" x1="0" y1="0" x2="320" y2="320">
              <stop offset="0%" stopColor="#B89152" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFF9F2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#B89152" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="ringSage" x1="320" y1="0" x2="0" y2="320">
              <stop offset="0%" stopColor="#77816C" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#FFF9F2" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#77816C" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Outer Orbit 1: Sage Meridian */}
          <ellipse
            cx="160"
            cy="160"
            rx="140"
            ry="55"
            transform="rotate(-25 160 160)"
            stroke="url(#ringSage)"
            strokeWidth="1.8"
            strokeDasharray="4 3"
          />

          {/* Outer Orbit 2: Gold Meridian */}
          <ellipse
            cx="160"
            cy="160"
            rx="130"
            ry="50"
            transform="rotate(35 160 160)"
            stroke="url(#ringGold)"
            strokeWidth="2"
          />

          {/* Outer Orbit 3: Terracotta Meridian */}
          <ellipse
            cx="160"
            cy="160"
            rx="115"
            ry="40"
            transform="rotate(-60 160 160)"
            stroke="#C96F42"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />

          {/* Translucent Knowledge Sphere Body */}
          <circle
            cx="160"
            cy="160"
            r="82"
            fill="url(#sphereCore)"
            stroke="#E8DCCB"
            strokeWidth="1.5"
          />

          {/* Inner Pulsating Geometric Lattice Core */}
          <circle cx="160" cy="160" r="54" fill="url(#innerGlow)" />
          <polygon
            points="160,115 198,140 198,180 160,205 122,180 122,140"
            stroke="#B89152"
            strokeWidth="1.2"
            fill="none"
            opacity="0.6"
          />
          <polygon
            points="160,126 186,145 186,175 160,194 134,175 134,145"
            stroke="#C96F42"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />

          {/* Orbiting Specialist Touchpoints (Nodes) */}
          <circle cx="270" cy="115" r="5" fill="#C96F42" />
          <circle cx="270" cy="115" r="9" stroke="#C96F42" strokeOpacity="0.4" strokeWidth="1.5" />

          <circle cx="50" cy="140" r="4.5" fill="#77816C" />
          <circle cx="50" cy="140" r="8" stroke="#77816C" strokeOpacity="0.3" strokeWidth="1.5" />

          <circle cx="210" cy="245" r="4" fill="#B89152" />
          <circle cx="105" cy="235" r="4.5" fill="#C96F42" />

          {/* Connection Curves */}
          <path
            d="M 50 140 Q 110 90, 160 115 T 270 115"
            fill="none"
            stroke="#C96F42"
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
        </svg>

        {/* Center Badge Seal */}
        <div className="absolute inset-0 m-auto w-24 h-24 rounded-full flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-mono font-bold tracking-wider text-[#C96F42] uppercase">
            HumanAPI
          </span>
          <span className="text-xs font-serif font-bold text-[#342A24] leading-tight">
            Knowledge Core
          </span>
          <span className="text-[9px] text-[#7B6C60]">Verified 1:1</span>
        </div>
      </div>

      {/* 2. INTERACTIVE EXPERT CARDS (MOBILE OPTIMIZED TOUCH TARGETS) */}
      <div className="w-full max-w-sm space-y-3 z-10 pt-2">
        {/* Card 1: Verified Specialist Profile Card */}
        <div
          onClick={onBookExpert}
          className="bg-[#FFF9F2]/95 backdrop-blur-md border border-[#E8DCCB] hover:border-[#C96F42] rounded-[16px] p-3.5 shadow-warm-sm active:scale-[0.99] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                  alt="Elena Vance"
                  className="w-11 h-11 rounded-[12px] object-cover border border-[#E8DCCB]"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#77816C] border-2 border-[#FFF9F2] flex items-center justify-center">
                  <CheckCircle2 size={10} className="text-[#FFF9F2]" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#342A24]">Arjun Mehta</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#77816C]/10 text-[#77816C] text-[10px] font-semibold">
                    Staff Engineer
                  </span>
                </div>
                <p className="text-xs text-[#7B6C60] truncate max-w-[170px]">
                  Ex-Stripe · Distributed Systems & React
                </p>
              </div>
            </div>

            {/* Quick Price/Book */}
            <div className="text-right shrink-0">
              <div className="font-mono text-xs font-bold text-[#C96F42]">₹349 / 10m</div>
              <div className="flex items-center justify-end gap-1 text-[11px] text-[#342A24] font-semibold">
                <Star size={11} className="fill-[#B89152] text-[#B89152]" />
                4.96
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-[#E8DCCB]/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#77816C] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#77816C] animate-pulse" />
              <span>Available today for 10m consultation</span>
            </div>
            <button className="text-xs font-semibold text-[#C96F42] flex items-center gap-1 hover:underline">
              <span>Book</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Card 2: Interactive Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { name: "React Architecture", color: "#C96F42" },
            { name: "UI/UX Design", color: "#77816C" },
            { name: "Career Strategy", color: "#B89152" },
            { name: "AI Guidance", color: "#342A24" },
          ].map((topic) => (
            <button
              key={topic.name}
              onClick={() => onTopicClick && onTopicClick(topic.name)}
              className="px-3 py-1.5 rounded-full bg-[#FFF9F2] border border-[#E8DCCB] hover:border-[#C96F42] text-xs font-medium text-[#342A24] whitespace-nowrap shadow-warm-xs flex items-center gap-1.5 transition-colors shrink-0 active:scale-95"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: topic.color }} />
              <span>{topic.name}</span>
            </button>
          ))}
        </div>

        {/* Card 3: Mobile Mode Footer with 3D Preview Option */}
        <div className="flex items-center justify-between text-[11px] text-[#7B6C60] pt-1 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-[#77816C]" />
            <span>Mobile performance mode active</span>
          </span>
          {onEnable3D && (
            <button
              onClick={onEnable3D}
              className="text-[#C96F42] font-semibold hover:underline flex items-center gap-1"
            >
              <Zap size={12} />
              <span>Preview 3D Canvas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
