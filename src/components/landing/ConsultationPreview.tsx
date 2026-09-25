import React, { useState } from "react";
import { Mic, Video, Share2, Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionTransition } from "../motion/SectionTransition";
import { Reveal } from "../motion/Reveal";
import { EASE } from "../../lib/motion";

export const ConsultationPreview: React.FC = () => {
  const [activePanel, setActivePanel] = useState<"notes" | "chat">("notes");

  return (
    <section id="consultation" className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24 scroll-mt-[100px] bg-[#F6F0E7] text-[#342A24] select-none">
      <SectionTransition className="max-w-[1200px] mx-auto w-full flex flex-col justify-center h-full">
        {/* Section Header Reveal */}
        <Reveal amount={0.2} className="max-w-2xl mb-8 sm:mb-10 lg:mb-12">
          <span className="text-[12px] font-semibold text-[#C96F42] uppercase tracking-[0.14em] block mb-2.5">
            The Consultation Workspace
          </span>
          <h2 className="text-[32px] sm:text-[42px] font-semibold text-[#342A24] tracking-[-0.035em] leading-[1.1]">
            A room designed to solve the problem, not waste time.
          </h2>
          <p className="text-[16px] text-[#7B6C60] mt-3 leading-relaxed">
            No meeting link hassles or bloated software. Enter a private, synchronized room with low-latency video, shared notes, and an active sprint timer.
          </p>
        </Reveal>

        {/* Gentle Workspace Interface Entrance Reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="w-full rounded-[22px] sm:rounded-[26px] bg-[#FFF9F2] border border-[#342A24]/10 shadow-[0_16px_40px_rgba(52,42,36,0.06)] overflow-hidden"
        >
          {/* Top Bar */}
          <div className="px-5 sm:px-6 py-3.5 border-b border-[#342A24]/[0.08] flex items-center justify-between flex-wrap gap-3 bg-[#FFF9F2]">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="Dr. Elena Rostova"
                className="w-7 h-7 rounded-full object-cover border border-[#342A24]/10"
              />
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-[#342A24]">
                  Dr. Elena Rostova
                </span>
                <span className="text-[#7B6C60] text-[13px] hidden sm:inline">
                  · Distributed Systems Lead
                </span>
              </div>
            </div>

            {/* Countdown Sprint Timer */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6F0E7] border border-[#342A24]/10">
                <Clock size={13} className="text-[#C96F42]" />
                <span className="font-mono font-semibold text-[13.5px] text-[#342A24] tracking-tight">
                  07:42
                </span>
                <span className="text-[11px] text-[#7B6C60] uppercase tracking-wider">left</span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#77816C] bg-[#77816C]/10 px-2.5 py-1 rounded-full font-medium">
                <ShieldCheck size={12} /> Encrypted WebRTC
              </span>
            </div>
          </div>

          {/* Main Workspace Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] lg:min-h-[420px]">
            {/* Left: Video Stage (7 cols) */}
            <div className="lg:col-span-7 bg-[#28201A] p-5 sm:p-6 flex flex-col justify-between relative">
              {/* Top video tag */}
              <div className="flex items-center justify-between text-[11.5px] text-white/70">
                <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs">
                  1080p HD · Low Latency
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Speaker
                </span>
              </div>

              {/* Main Speaker Avatar Frame */}
              <div className="my-auto py-4 sm:py-6 flex flex-col items-center justify-center">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-[20px] overflow-hidden border-2 border-white/20 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80"
                    alt="Elena Rostova video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[11px] text-white font-medium">
                    Elena Rostova
                  </div>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  aria-label="Microphone"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <Mic size={15} />
                </button>
                <button
                  aria-label="Camera"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <Video size={15} />
                </button>
                <button
                  aria-label="Screen Share"
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[12px] font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Share2 size={13} />
                  <span>Share Screen</span>
                </button>
              </div>
            </div>

            {/* Right: Notes & Chat Panel (5 cols) */}
            <div className="lg:col-span-5 bg-[#FFF9F2] p-5 sm:p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#342A24]/[0.08]">
              <div>
                {/* Panel Switcher */}
                <div className="flex items-center gap-2 p-1 bg-[#F6F0E7] rounded-xl border border-[#342A24]/[0.08] mb-5">
                  <button
                    onClick={() => setActivePanel("notes")}
                    className={`flex-1 py-1.5 text-[12.5px] font-medium rounded-lg transition-all duration-150 ${
                      activePanel === "notes"
                        ? "bg-[#FFF9F2] text-[#342A24] shadow-xs"
                        : "text-[#7B6C60] hover:text-[#342A24]"
                    }`}
                  >
                    Diagnosis Notes
                  </button>
                  <button
                    onClick={() => setActivePanel("chat")}
                    className={`flex-1 py-1.5 text-[12.5px] font-medium rounded-lg transition-all duration-150 ${
                      activePanel === "chat"
                        ? "bg-[#FFF9F2] text-[#342A24] shadow-xs"
                        : "text-[#7B6C60] hover:text-[#342A24]"
                    }`}
                  >
                    Live Chat (2)
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activePanel === "notes" ? (
                    <motion.div
                      key="notes"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: EASE }}
                      className="space-y-3.5"
                    >
                      <div className="text-[14px] font-semibold text-[#342A24]">
                        PostgreSQL read-replica lag spike during batch jobs
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F6F0E7] border border-[#342A24]/[0.06]">
                          <CheckCircle2 size={15} className="text-[#77816C] shrink-0 mt-0.5" />
                          <div className="text-[12.5px]">
                            <span className="font-medium text-[#7B6C60] line-through">
                              Check max_standby_streaming_delay
                            </span>
                            <p className="text-[11.5px] text-[#77816C] mt-0.5">
                              Verified: queries canceled due to buffer pin lock.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F6F0E7] border border-[#342A24]/[0.06]">
                          <CheckCircle2 size={15} className="text-[#77816C] shrink-0 mt-0.5" />
                          <div className="text-[12.5px]">
                            <span className="font-medium text-[#7B6C60] line-through">
                              Examine WAL sender throughput
                            </span>
                            <p className="text-[11.5px] text-[#77816C] mt-0.5">
                              Network throughput healthy; worker queue saturated.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#FFF9F2] border border-[#C96F42]/50 shadow-xs">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#C96F42] flex items-center justify-center shrink-0 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C96F42]" />
                          </span>
                          <div className="text-[12.5px]">
                            <span className="font-semibold text-[#342A24]">
                              Configure hot_standby_feedback = on
                            </span>
                            <p className="text-[11.5px] text-[#7B6C60] mt-0.5">
                              Currently evaluating vacuum bloat trade-offs...
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: EASE }}
                      className="space-y-3"
                    >
                      <div className="p-2.5 rounded-lg bg-[#F6F0E7] text-[12.5px]">
                        <span className="font-semibold text-[#342A24] block mb-0.5">Elena</span>
                        <p className="text-[#7B6C60]">
                          "Look at `pg_stat_database_conflicts` for recovery conflict cancel counts."
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#FFF9F2] border border-[#342A24]/10 text-[12.5px]">
                        <span className="font-semibold text-[#C96F42] block mb-0.5">You</span>
                        <p className="text-[#342A24]">
                          "Found 14,000 conflicts in the last 2 hours. That isolates it."
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-4 border-t border-[#342A24]/[0.08] flex items-center justify-between text-[12px] text-[#7B6C60]">
                <span>All notes auto-saved to session summary</span>
                <span className="font-medium text-[#C96F42]">Syncing live</span>
              </div>
            </div>
          </div>
        </motion.div>
      </SectionTransition>
    </section>
  );
};

export default ConsultationPreview;
