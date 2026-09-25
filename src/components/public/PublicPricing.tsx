import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, DollarSign, Calculator, Sparkles } from "lucide-react";

export const PublicPricing: React.FC = () => {
  const { navigate } = useApp();

  const [dailySessions, setDailySessions] = useState<number>(4);
  const [avgPrice, setAvgPrice] = useState<number>(350);

  const monthlyGross = dailySessions * avgPrice * 22; // 22 working days
  const platformFee = Math.round(monthlyGross * 0.12);
  const expertTakeHome = monthlyGross - platformFee;

  return (
    <div className="min-h-screen bg-[#F7F1E7] py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C86B3C]">
            Transparent Marketplace Economics
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#332720]">
            Fair, Predictable & Frictionless Pricing
          </h1>
          <p className="text-base sm:text-lg text-[#75675C]">
            No monthly subscriptions. No recruiter placement fees. Pay only for the exact minutes of specialized human wisdom you need.
          </p>
        </div>

        {/* 3 Core Durations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 5 Min Card */}
          <div className="p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-block px-3 py-1 rounded-full bg-[#F7F1E7] border border-[#DED3C6] text-xs font-bold text-[#75675C]">
                Laser Diagnostic
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#332720]">5-Minute Sprint</h3>
              <p className="text-xs text-[#75675C] leading-relaxed">
                Ideal for binary questions, second opinions on architectural choices, or validating a specific command/config.
              </p>
              <div className="py-2">
                <span className="text-xs text-[#75675C]">Typical Rate:</span>
                <div className="font-serif text-3xl font-extrabold text-[#332720] mt-0.5">
                  ₹149 – ₹299
                </div>
              </div>
              <ul className="space-y-2 text-xs text-[#332720]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#718B68]" />
                  <span>Single-question deep dive</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#718B68]" />
                  <span>Instant screen share triage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#718B68]" />
                  <span>Zero subscription obligation</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate("experts")}
              className="w-full py-3 rounded-xl border border-[#DED3C6] bg-[#F7F1E7] hover:bg-[#DED3C6]/40 text-xs font-bold text-[#332720] transition-colors"
            >
              Browse 5-Min Specialists
            </button>
          </div>

          {/* 10 Min Card (Flagship) */}
          <div className="p-8 rounded-3xl bg-[#FFF9F0] border-2 border-[#C86B3C] shadow-warm-md flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#C86B3C] text-[#FFF9F0] text-[11px] font-bold shadow-warm-sm">
              MOST POPULAR SPRINT
            </div>
            <div className="space-y-3">
              <div className="inline-block px-3 py-1 rounded-full bg-[#C86B3C]/10 text-[#C86B3C] text-xs font-bold">
                Root Cause Triage
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#332720]">10-Minute Sprint</h3>
              <p className="text-xs text-[#75675C] leading-relaxed">
                The golden standard for code teardowns, state debugging, Figma component critique, and roadmap tuning.
              </p>
              <div className="py-2">
                <span className="text-xs text-[#75675C]">Typical Rate:</span>
                <div className="font-serif text-3xl font-extrabold text-[#C86B3C] mt-0.5">
                  ₹299 – ₹499
                </div>
              </div>
              <ul className="space-y-2 text-xs text-[#332720]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#718B68]" />
                  <span>Live code or UI inspection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#718B68]" />
                  <span>Identify & rectify root causes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#718B68]" />
                  <span>Chat message logs retained</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate("experts")}
              className="w-full py-3 rounded-xl bg-[#C86B3C] hover:bg-[#B85C3B] text-xs font-bold text-[#FFF9F0] shadow-warm-sm transition-all"
            >
              Browse 10-Min Specialists
            </button>
          </div>

          {/* 15 Min Card */}
          <div className="p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-block px-3 py-1 rounded-full bg-[#74806B]/10 text-[#74806B] text-xs font-bold">
                Strategic & Mock
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#332720]">15-Minute Sprint</h3>
              <p className="text-xs text-[#75675C] leading-relaxed">
                Designed for mock FAANG system design interviews, startup monetization audits, and deep multi-service architecture reviews.
              </p>
              <div className="py-2">
                <span className="text-xs text-[#75675C]">Typical Rate:</span>
                <div className="font-serif text-3xl font-extrabold text-[#332720] mt-0.5">
                  ₹449 – ₹749
                </div>
              </div>
              <ul className="space-y-2 text-xs text-[#332720]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#718B68]" />
                  <span>Deep architectural stress-testing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#718B68]" />
                  <span>Mock interview rubric scoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#718B68]" />
                  <span>Direct post-session rating</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate("experts")}
              className="w-full py-3 rounded-xl border border-[#DED3C6] bg-[#F7F1E7] hover:bg-[#DED3C6]/40 text-xs font-bold text-[#332720] transition-colors"
            >
              Browse 15-Min Specialists
            </button>
          </div>
        </div>

        {/* Platform Fee Breakdown Banner */}
        <div className="p-8 rounded-3xl bg-[#FFF9F0] border border-[#DED3C6] shadow-warm-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#DED3C6] pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#74806B]">Platform Fee Transparency</span>
              <h3 className="font-serif font-bold text-2xl text-[#332720] mt-1">
                Where does your payment go?
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 rounded-xl bg-[#F7F1E7] border border-[#DED3C6]">
                <div className="text-2xl font-serif font-extrabold text-[#718B68]">88%</div>
                <div className="text-[11px] text-[#75675C] font-semibold">Direct Expert Earnings</div>
              </div>
              <div className="text-center px-4 py-2 rounded-xl bg-[#F7F1E7] border border-[#DED3C6]">
                <div className="text-2xl font-serif font-extrabold text-[#C86B3C]">12%</div>
                <div className="text-[11px] text-[#75675C] font-semibold">Platform & WebRTC Ops</div>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#75675C] leading-relaxed">
            The 12% platform fee funds our automated WebRTC video relays, peer signaling gateways, AI interview evaluation infrastructure, and payment settlement guarantees. Experts retain 88% of every single rupee paid.
          </p>
        </div>

        {/* Interactive Expert Earnings Calculator */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#F7F1E7] border border-[#DED3C6] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C86B3C] text-[#FFF9F0] flex items-center justify-center">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-2xl text-[#332720]">
                Expert Earnings Calculator
              </h3>
              <p className="text-xs text-[#75675C]">
                Estimate how much you can earn sharing targeted expertise in spare intervals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
            <div className="space-y-6 bg-[#FFF9F0] p-6 rounded-2xl border border-[#DED3C6]">
              {/* Daily sessions slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#332720]">
                  <span>Consultations per Day:</span>
                  <span className="text-[#C86B3C] font-mono text-sm">{dailySessions} sessions (~{dailySessions * 10} mins)</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={dailySessions}
                  onChange={e => setDailySessions(Number(e.target.value))}
                  className="w-full accent-[#C86B3C]"
                />
              </div>

              {/* Avg Price Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#332720]">
                  <span>Average Rate per Session:</span>
                  <span className="text-[#C86B3C] font-mono text-sm">₹{avgPrice}</span>
                </div>
                <input
                  type="range"
                  min={150}
                  max={800}
                  step={25}
                  value={avgPrice}
                  onChange={e => setAvgPrice(Number(e.target.value))}
                  className="w-full accent-[#C86B3C]"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFF9F0] border-2 border-[#74806B] text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#74806B]">Estimated Monthly Take-Home</span>
              <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#332720]">
                ₹{expertTakeHome.toLocaleString()}
              </div>
              <p className="text-xs text-[#75675C]">
                Net payout based on 22 working days ({dailySessions * 22} total sessions, ~{(dailySessions * 22 * 10 / 60).toFixed(1)} hours/month).
              </p>
              <button
                onClick={() => navigate("become-expert")}
                className="mt-3 px-6 py-2.5 rounded-xl bg-[#74806B] hover:bg-[#5E6956] text-[#FFF9F0] text-xs font-bold shadow-warm-sm transition-all"
              >
                Apply to Become an Expert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
