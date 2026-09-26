import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { VerificationBadge, RatingStars } from "../common/Badge";
import { PostSessionReviewModal } from "../common/PostSessionReviewModal";
import { DocumentPreviewDrawer, SharedDocument } from "./DocumentPreviewDrawer";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  FileText,
  User,
  Clock,
  Send,
  Sparkles,
  ShieldCheck,
  Star,
  CheckCircle2,
  Plus,
  AlertTriangle,
  Download,
  Paperclip,
  Share2,
  FolderDown,
  FolderOpen,
  Wifi,
  Copy
} from "lucide-react";
import { Booking } from "../../types";
import { HumanAPIPageLoader, HumanAPIInlineLoader } from "../loading";

export const LiveSessionRoom: React.FC = () => {
  const { viewParams, bookings, experts, completeSession, submitReview, navigate, showNotification } = useApp();
  const bookingId = viewParams?.bookingId || bookings[0]?.id;
  const booking: Booking = bookings.find(b => b.id === bookingId) || bookings[0];
  const expert = experts.find(e => e.id === booking?.expertId) || experts[0];

  // Room Joining & Connection Loading States
  const [isJoiningRoom, setIsJoiningRoom] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<"Connecting..." | "Connected" | "Reconnecting..." | "Connection failed">("Connecting...");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsJoiningRoom(false);
      setConnectionStatus("Connected");
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Consultation Room Media States
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "notes" | "files" | "expert">("chat");
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  // Timer countdown
  const initialSeconds = (booking?.duration || 10) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Chat state
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string; isCode?: boolean }>>([
    {
      sender: expert.name,
      text: `Hello! I'm ready to work through "${booking?.topic || "your consultation"}". Feel free to share your screen or drop logs here in chat.`,
      time: "00:15"
    }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isCodeSnippet, setIsCodeSnippet] = useState(false);

  // Shared Session Documents & File Preview Drawer State
  const [isDocDrawerOpen, setIsDocDrawerOpen] = useState(false);
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([
    {
      id: "doc-arch-1",
      name: "architecture-topology.svg",
      size: "18.4 KB",
      type: "image",
      uploadedBy: "Expert",
      timestamp: "00:02",
      description: "Proposed resilient multi-region signaling topology",
      language: "svg",
      content: `<svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto text-xs">
        <rect width="600" height="320" rx="16" fill="#1E1714"/>
        <text x="30" y="40" fill="#FFF9F2" font-family="sans-serif" font-size="14" font-weight="bold">Resilient Micro-Consultation Architecture</text>
        <text x="30" y="60" fill="#E8DCCB" font-family="sans-serif" font-size="11">Low-latency WebRTC signaling with automated state sync</text>
        <g transform="translate(40, 100)">
          <rect width="130" height="70" rx="12" fill="#28201A" stroke="#E8DCCB" stroke-width="1.5"/>
          <text x="65" y="30" fill="#FFF9F2" text-anchor="middle" font-weight="bold">Web Client</text>
          <text x="65" y="48" fill="#77816C" text-anchor="middle" font-size="10">React 18 + WSS</text>
        </g>
        <path d="M 170 135 L 240 135" stroke="#C96F42" stroke-width="2" stroke-dasharray="4 4"/>
        <g transform="translate(240, 100)">
          <rect width="140" height="70" rx="12" fill="#28201A" stroke="#C96F42" stroke-width="2"/>
          <text x="70" y="30" fill="#FFF9F2" text-anchor="middle" font-weight="bold">Signaling Hub</text>
          <text x="70" y="48" fill="#B89152" text-anchor="middle" font-size="10">Sub-50ms Discovery</text>
        </g>
        <path d="M 380 135 L 450 135" stroke="#C96F42" stroke-width="2"/>
        <g transform="translate(450, 100)">
          <rect width="110" height="70" rx="12" fill="#28201A" stroke="#77816C" stroke-width="1.5"/>
          <text x="55" y="30" fill="#FFF9F2" text-anchor="middle" font-weight="bold">SFU Node</text>
          <text x="55" y="48" fill="#77816C" text-anchor="middle" font-size="10">DTLS / SRTP</text>
        </g>
      </svg>`
    },
    {
      id: "doc-sql-2",
      name: "query-optimization-remediation.sql",
      size: "2.4 KB",
      type: "sql",
      uploadedBy: "Client",
      timestamp: "00:05",
      description: "Proposed indexes and execution plan patch for peer room state",
      language: "sql",
      content: `-- High concurrency indexing optimization for consultation rooms
BEGIN;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_consultation_sessions_lookup
ON consultation_sessions (room_id, status, scheduled_start)
INCLUDE (expert_id, user_id, duration_minutes);
COMMIT;`
    }
  ]);

  // Session Notes
  const [notes, setNotes] = useState<string>(
    `# Consultation Notes with ${expert.name}\nTopic: ${booking?.topic}\n\n- Key diagnostic takeaway:\n- Action items to implement:\n- Follow-up recommendations:\n`
  );

  // End Session / Rating Modal States
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);

  const baseFee = booking?.price || 99;
  const extensionPriceIncrease = baseFee + 50;

  const handleExtensionRequest = () => {
    setIsExtendModalOpen(true);
  };

  const confirmExtension = () => {
    setSecondsRemaining(prev => prev + 300);
    setIsExtendModalOpen(false);
    showNotification(`Session extended by +5 minutes. Price is increased by ₹${extensionPriceIncrease}`, "success");
  };

  // Local media stream reference
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera/mic with graceful fallback
  useEffect(() => {
    let mounted = true;
    async function setupCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (mounted) {
            streamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          }
        }
      } catch (err) {
        console.log("Webcam access restricted in sandboxed environment, falling back gracefully to simulated preview.", err);
      }
    }
    setupCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Fix Video Call Session Bug: Re-bind video element srcObject when video is toggled back on
  useEffect(() => {
    if (isVideoOn && localVideoRef.current && streamRef.current) {
      localVideoRef.current.srcObject = streamRef.current;
    }
  }, [isVideoOn]);

  // Dynamic body background sync while in room
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#1E1714";
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  // Timer Tick
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          setIsRatingModalOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      sender: "You",
      text: inputMsg,
      time: formatTime(initialSeconds - secondsRemaining),
      isCode: isCodeSnippet
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMsg("");
    setIsCodeSnippet(false);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: expert.name,
          text: "I see! Notice the synchronization barrier in that worker thread. If you wrap the state mutation in a callback, the deadlock releases.",
          time: formatTime(initialSeconds - secondsRemaining + 4)
        }
      ]);
    }, 2500);
  };

  const handleUploadDocument = (doc: SharedDocument) => {
    setSharedDocuments(prev => [doc, ...prev]);
    showNotification(`Document "${doc.name}" shared with ${expert.name}`, "success");
    setMessages(prev => [
      ...prev,
      {
        sender: "You",
        text: `📎 Shared document: ${doc.name} (${doc.size})`,
        time: formatTime(initialSeconds - secondsRemaining)
      }
    ]);
  };

  const handleDeleteDocument = (docId: string) => {
    const docToDelete = sharedDocuments.find(d => d.id === docId);
    setSharedDocuments(prev => prev.filter(d => d.id !== docId));
    if (docToDelete) {
      showNotification(`Removed "${docToDelete.name}" from shared materials`, "info");
    }
  };

  const handleShareDocToChat = (text: string) => {
    setMessages(prev => [
      ...prev,
      {
        sender: "You",
        text,
        time: formatTime(initialSeconds - secondsRemaining)
      }
    ]);
    showNotification("Referenced document in session chat", "success");
  };

  const handleEndSession = () => {
    setIsEndModalOpen(false);
    setIsTimerRunning(false);
    setIsRatingModalOpen(true);
  };

  const handleExtension = () => {
    setSecondsRemaining(prev => prev + 300);
    showNotification("Session extended by +5 minutes.", "success");
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(notes);
    showNotification("Consultation notes copied to clipboard", "success");
  };

  const handleDownloadNotes = () => {
    const element = document.createElement("a");
    const file = new Blob([notes], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `humanapi-session-${booking.id}-notes.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification("Consultation notes downloaded.", "success");
  };

  const isUrgent = secondsRemaining <= 60;
  const isWarning = secondsRemaining <= 120 && !isUrgent;

  if (isJoiningRoom) {
    return (
      <div className="w-full h-[100dvh] bg-[#1E1714] flex items-center justify-center">
        <HumanAPIPageLoader
          title="Joining Secure Consultation..."
          subtitle={`Establishing WebRTC peer signaling with ${expert?.name || "Specialist"}`}
        />
      </div>
    );
  }

  return (
    <div className="consultation-room relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#1E1714] text-[#FFF9F2] flex flex-col font-sans select-none">
      {/* ========================================================
          TOP HEADER BAR
          ======================================================== */}
      <header className="h-[56px] sm:h-[68px] px-3 sm:px-6 bg-[#28201A] border-b border-[#E8DCCB]/15 flex items-center justify-between z-20 shrink-0">
        {/* Left Section */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div
            onClick={() => setIsEndModalOpen(true)}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shrink-0"
            title="HumanAPI Consultation Workspace"
          >
            <img
              src="/assets/logo.png"
              alt="HumanAPI Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="h-5 sm:h-6 w-px bg-[#E8DCCB]/20 hidden sm:block shrink-0" />

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-serif font-bold text-xs sm:text-base text-[#FFF9F2] truncate">
                Consultation with {expert.name}
              </span>
              <VerificationBadge size="sm" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#E8DCCB]/80 truncate hidden sm:block">
              {booking?.topic || "Technical Consultation & Architecture Review"}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Timer */}
          <div
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[8px] sm:rounded-[10px] border flex items-center gap-1.5 sm:gap-2 font-timer font-bold text-xs sm:text-sm tracking-tight transition-colors ${
              isUrgent
                ? "bg-[#B85D3D]/30 border-[#B85D3D] text-[#FFF9F2] animate-pulse"
                : isWarning
                ? "bg-[#B89152]/25 border-[#B89152] text-[#FFF9F2]"
                : "bg-[#1E1714] border-[#E8DCCB]/20 text-[#FFF9F2]"
            }`}
          >
            <Clock size={13} className={isUrgent ? "text-[#B85D3D]" : isWarning ? "text-[#B89152]" : "text-[#C96F42]"} />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {/* +5 Mins Extension */}
          <button
            onClick={handleExtensionRequest}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] bg-[#FFF9F2]/10 hover:bg-[#FFF9F2]/20 border border-[#E8DCCB]/20 text-xs font-semibold text-[#FFF9F2] transition-colors"
          >
            <Plus size={13} className="text-[#C96F42]" />
            <span>+5m</span>
          </button>

          {/* Leave Session Button */}
          <button
            onClick={() => setIsEndModalOpen(true)}
            className="px-3 py-1.5 rounded-[8px] sm:rounded-[10px] bg-[#B85D3D] hover:bg-[#A34F32] text-[#FFF9F2] text-xs font-bold shadow-warm-xs transition-colors flex items-center gap-1.5"
          >
            <PhoneOff size={13} />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          MAIN CONSULTATION WORKSPACE CONTAINER
          Desktop: 2-column side-by-side (Video Stage + Workspace Panel)
          Mobile: Stacked column (Top Video Stage + Bottom Collaboration Workspace)
          ======================================================== */}
      <div className="consultation-main flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden relative">
        {/* VIDEO STAGE AREA */}
        <div className="w-full md:flex-1 h-[clamp(210px,36dvh,340px)] md:h-auto min-h-0 flex flex-col p-2 sm:p-4 lg:p-5 overflow-hidden relative bg-[#1E1714] shrink-0 md:shrink">
          <div className="flex-1 min-h-0 w-full rounded-[16px] sm:rounded-[20px] bg-[#28201A] border border-[#E8DCCB]/15 relative overflow-hidden flex items-center justify-center shadow-warm-lg">
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1714]/80 via-transparent to-[#1E1714]/40 pointer-events-none z-10" />

            {/* Warning Banners */}
            {isWarning && (
              <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-[6px] bg-[#B89152]/90 text-[#1E1714] font-bold text-[11px] flex items-center gap-1.5">
                <AlertTriangle size={13} />
                <span>2 minutes remaining</span>
              </div>
            )}
            {isUrgent && (
              <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-[6px] bg-[#B85D3D] text-[#FFF9F2] font-bold text-[11px] flex items-center gap-1.5 animate-pulse">
                <AlertTriangle size={13} />
                <span>Final minute</span>
              </div>
            )}

            {isScreenSharing ? (
              /* Screen Share View */
              <div className="w-full h-full p-3 sm:p-5 flex flex-col bg-[#241B16] z-0 overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DCCB]/15 text-xs text-[#E8DCCB] shrink-0">
                  <span className="flex items-center gap-2 font-mono text-[11px]">
                    <Monitor size={14} className="text-[#C96F42]" />
                    Shared Screen · Code & Architecture
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#C96F42]/20 text-[#C96F42] font-bold text-[9px]">
                    STREAM
                  </span>
                </div>
                <div className="flex-1 min-h-0 mt-2 p-3 rounded-[10px] bg-[#1E1714] font-mono text-[11px] text-[#77816C] overflow-y-auto space-y-1 border border-[#E8DCCB]/10">
                  <div>$ npm run test:concurrency</div>
                  <div className="text-[#B89152]">WARN: worker pool lock contention detected at state_reconciler.ts:148</div>
                  <div className="text-[#FFF9F2] pt-1">
                    {expert.name}: "Notice line 148 — the mutex is missing an unlock() call inside the catch branch."
                  </div>
                </div>
              </div>
            ) : (
              /* Participant Video Stream */
              <div className="w-full h-full relative flex items-center justify-center bg-[#231A15]">
                <img
                  src={expert.avatar}
                  alt={expert.name}
                  className="w-full h-full object-cover object-center max-h-full"
                />
                <div className="absolute inset-0 border-2 border-[#77816C]/40 pointer-events-none rounded-[16px] sm:rounded-[20px]" />

                {/* Expert Badge */}
                <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-[8px] bg-[#28201A]/90 backdrop-blur-md border border-[#E8DCCB]/25 text-[11px] font-semibold flex items-center gap-2">
                  <span className="text-[#FFF9F2] font-medium">{expert.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#77816C]" />
                </div>
              </div>
            )}

            {/* Self Preview */}
            <div className="absolute top-3 right-3 w-28 sm:w-44 md:w-52 aspect-video rounded-[10px] sm:rounded-[14px] bg-[#28201A] border-2 border-[#E8DCCB]/30 overflow-hidden shadow-warm-md z-20">
              {isVideoOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#342A24] text-[10px] text-[#E8DCCB]">
                  <VideoOff size={14} className="text-[#E8DCCB]/60" />
                  <span>Off</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* WORKSPACE SIDE PANEL / MOBILE COLLABORATION AREA */}
        <aside className="w-full md:w-80 lg:w-96 flex-1 min-h-0 bg-[#28201A] border-t md:border-t-0 md:border-l border-[#E8DCCB]/15 flex flex-col shrink md:shrink-0 z-10 overflow-hidden">
          {/* Workspace Tabs Header */}
          <div className="h-[44px] sm:h-[48px] border-b border-[#E8DCCB]/15 grid grid-cols-4 p-1 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab("chat")}
              className={`rounded-[6px] sm:rounded-[8px] transition-all flex items-center justify-center gap-1 ${
                activeTab === "chat"
                  ? "bg-[#FFF9F2]/15 text-[#FFF9F2] font-bold"
                  : "text-[#E8DCCB]/70 hover:text-[#FFF9F2]"
              }`}
            >
              <span>Chat</span>
              {messages.length > 0 && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#C96F42] text-white font-bold">
                  {messages.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("notes")}
              className={`rounded-[6px] sm:rounded-[8px] transition-all flex items-center justify-center gap-1 ${
                activeTab === "notes"
                  ? "bg-[#FFF9F2]/15 text-[#FFF9F2] font-bold"
                  : "text-[#E8DCCB]/70 hover:text-[#FFF9F2]"
              }`}
            >
              <span>Notes</span>
            </button>

            <button
              onClick={() => setActiveTab("files")}
              className={`rounded-[6px] sm:rounded-[8px] transition-all flex items-center justify-center gap-1 ${
                activeTab === "files"
                  ? "bg-[#FFF9F2]/15 text-[#FFF9F2] font-bold"
                  : "text-[#E8DCCB]/70 hover:text-[#FFF9F2]"
              }`}
            >
              <span>Files</span>
              {sharedDocuments.length > 0 && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#77816C] text-white font-bold">
                  {sharedDocuments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("expert")}
              className={`rounded-[6px] sm:rounded-[8px] transition-all flex items-center justify-center gap-1 ${
                activeTab === "expert"
                  ? "bg-[#FFF9F2]/15 text-[#FFF9F2] font-bold"
                  : "text-[#E8DCCB]/70 hover:text-[#FFF9F2]"
              }`}
            >
              <span>Expert</span>
            </button>
          </div>

          {/* TAB 1: CHAT */}
          {activeTab === "chat" && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto space-y-2.5 no-scrollbar">
                {messages.map((m, i) => {
                  const isMe = m.sender === "You";
                  return (
                    <div
                      key={i}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 text-[9px] text-[#E8DCCB]/70 mb-0.5">
                        <span className="font-semibold text-[#FFF9F2]">{m.sender}</span>
                        <span>·</span>
                        <span className="font-mono">{m.time}</span>
                      </div>
                      <div
                        className={`p-2.5 rounded-[12px] text-xs max-w-[88%] leading-relaxed ${
                          isMe
                            ? "bg-[#C96F42] text-[#FFF9F2] rounded-tr-none"
                            : "bg-[#342A24] text-[#FFF9F2] rounded-tl-none border border-[#E8DCCB]/15"
                        } ${m.isCode ? "font-mono bg-[#1E1714] text-[#77816C] border border-[#77816C]/40" : ""}`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-2.5 border-t border-[#E8DCCB]/15 space-y-1.5 shrink-0 bg-[#241B16]">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsCodeSnippet(!isCodeSnippet)}
                      className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-colors ${
                        isCodeSnippet ? "bg-[#77816C] text-[#FFF9F2]" : "bg-[#342A24] text-[#E8DCCB]"
                      }`}
                    >
                      {"</> Code"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDocDrawerOpen(true)}
                      className="px-2 py-0.5 rounded text-[9px] font-semibold bg-[#342A24] text-[#E8DCCB] flex items-center gap-1 transition-colors"
                    >
                      <Paperclip size={10} className="text-[#C96F42]" />
                      <span>Doc</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={e => setInputMsg(e.target.value)}
                    placeholder={isCodeSnippet ? "Paste snippet..." : "Type message..."}
                    className="flex-1 px-3 py-2 rounded-[8px] bg-[#1E1714] border border-[#E8DCCB]/20 text-xs text-[#FFF9F2] placeholder-[#E8DCCB]/40 focus:outline-none focus:border-[#C96F42]"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-[8px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] transition-colors shrink-0"
                    title="Send message"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: NOTES */}
          {activeTab === "notes" && (
            <div className="flex-1 min-h-0 flex flex-col p-3 sm:p-4 space-y-2.5 overflow-hidden">
              <div className="flex items-center justify-between text-[11px] shrink-0">
                <span className="text-[#E8DCCB]/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#77816C]" />
                  <span>Auto-saved</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyNotes}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#E8DCCB] hover:text-[#FFF9F2]"
                  >
                    <Copy size={11} />
                    <span>Copy</span>
                  </button>
                  <span className="text-[#E8DCCB]/40">·</span>
                  <button
                    onClick={handleDownloadNotes}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#C96F42] hover:underline"
                  >
                    <Download size={11} />
                    <span>TXT</span>
                  </button>
                </div>
              </div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="flex-1 min-h-0 w-full p-3 rounded-[10px] bg-[#1E1714] border border-[#E8DCCB]/15 font-mono text-xs text-[#FFF9F2] leading-relaxed resize-none focus:outline-none focus:border-[#C96F42]"
                placeholder="Record takeaways..."
              />
            </div>
          )}

          {/* TAB 3: FILES */}
          {activeTab === "files" && (
            <div className="flex-1 min-h-0 flex flex-col p-3 sm:p-4 space-y-2.5 overflow-y-auto">
              <div className="flex items-center justify-between shrink-0">
                <span className="text-xs font-semibold text-[#FFF9F2]">
                  Shared Materials ({sharedDocuments.length})
                </span>
                <button
                  onClick={() => setIsDocDrawerOpen(true)}
                  className="text-xs font-semibold text-[#C96F42] flex items-center gap-1"
                >
                  <Plus size={12} />
                  <span>Upload</span>
                </button>
              </div>

              <div className="space-y-2">
                {sharedDocuments.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setIsDocDrawerOpen(true)}
                    className="p-2.5 rounded-[10px] bg-[#1E1714] hover:bg-[#342A24] border border-[#E8DCCB]/15 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FFF9F2] truncate group-hover:text-[#C96F42]">
                        {doc.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#E8DCCB]/60">
                        {doc.size}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#E8DCCB]/70 mt-0.5 line-clamp-1">
                      {doc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERT INFO */}
          {activeTab === "expert" && (
            <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={expert.avatar}
                  alt={expert.name}
                  className="w-10 h-10 rounded-[10px] object-cover border border-[#E8DCCB]/30"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-[#FFF9F2] truncate">{expert.name}</h4>
                    <VerificationBadge size="sm" />
                  </div>
                  <p className="text-[#E8DCCB]/80 text-[10px]">{expert.companyOrOrg}</p>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-[#E8DCCB]/70">Specialty</span>
                <p className="text-[#FFF9F2] leading-snug text-[11px]">{expert.headline}</p>
              </div>

              <div className="p-2.5 rounded-[8px] bg-[#1E1714] border border-[#E8DCCB]/15 space-y-1">
                <span className="text-[9px] uppercase font-bold text-[#C96F42]">Session Details</span>
                <div className="text-[10px] text-[#E8DCCB] flex justify-between">
                  <span>Room ID:</span>
                  <span className="font-mono text-[#FFF9F2]">{booking?.id}</span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ========================================================
          BOTTOM MEDIA CONTROLS BAR (With env safe-area support)
          ======================================================== */}
      <footer className="h-[56px] sm:h-[68px] px-3 sm:px-8 bg-[#28201A] border-t border-[#E8DCCB]/15 flex items-center justify-between shrink-0 z-20 pb-[max(10px,env(safe-area-inset-bottom,10px))]">
        {/* Left: Security */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-[#E8DCCB]/80">
          <ShieldCheck size={14} className="text-[#77816C]" />
          <span>DTLS Encrypted</span>
        </div>

        {/* Center: Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 mx-auto lg:mx-0">
          {/* Microphone */}
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-2.5 sm:p-3 rounded-[10px] sm:rounded-[12px] border transition-all ${
              isMicOn
                ? "bg-[#1E1714] border-[#E8DCCB]/25 text-[#FFF9F2] hover:bg-[#342A24]"
                : "bg-[#B85D3D] border-[#B85D3D] text-[#FFF9F2]"
            }`}
            title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
          </button>

          {/* Camera */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-2.5 sm:p-3 rounded-[10px] sm:rounded-[12px] border transition-all ${
              isVideoOn
                ? "bg-[#1E1714] border-[#E8DCCB]/25 text-[#FFF9F2] hover:bg-[#342A24]"
                : "bg-[#B85D3D] border-[#B85D3D] text-[#FFF9F2]"
            }`}
            title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
          >
            {isVideoOn ? <VideoIcon size={16} /> : <VideoOff size={16} />}
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-2.5 sm:p-3 rounded-[10px] sm:rounded-[12px] border transition-all ${
              isScreenSharing
                ? "bg-[#C96F42] border-[#C96F42] text-[#FFF9F2]"
                : "bg-[#1E1714] border-[#E8DCCB]/25 text-[#FFF9F2] hover:bg-[#342A24]"
            }`}
            title="Toggle Screen Share"
          >
            <Monitor size={16} />
          </button>

          {/* Document Drawer Quick Trigger */}
          <button
            onClick={() => setIsDocDrawerOpen(prev => !prev)}
            className={`px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-[10px] sm:rounded-[12px] border transition-all flex items-center gap-1 ${
              isDocDrawerOpen
                ? "bg-[#C96F42] border-[#C96F42] text-[#FFF9F2]"
                : "bg-[#1E1714] border-[#E8DCCB]/25 text-[#FFF9F2] hover:bg-[#342A24]"
            }`}
            title="Share Documents"
          >
            <FolderDown size={16} className={isDocDrawerOpen ? "text-white" : "text-[#C96F42]"} />
            <span className="text-xs font-semibold hidden sm:inline">Docs</span>
            {sharedDocuments.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#C96F42] text-[9px] font-bold text-white">
                {sharedDocuments.length}
              </span>
            )}
          </button>

          {/* Toggle Side Panel */}
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className={`p-2.5 sm:p-3 rounded-[10px] sm:rounded-[12px] border transition-all ${
              isSidePanelOpen
                ? "bg-[#FFF9F2]/20 border-[#E8DCCB]/40 text-[#FFF9F2]"
                : "bg-[#1E1714] border-[#E8DCCB]/25 text-[#FFF9F2] hover:bg-[#342A24]"
            }`}
            title="Toggle Workspace Panel"
          >
            <MessageSquare size={16} />
          </button>
        </div>

        {/* Right: End Session Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEndModalOpen(true)}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-[8px] sm:rounded-[10px] bg-[#B85D3D] hover:bg-[#A34F32] text-[#FFF9F2] text-xs font-bold shadow-warm-xs transition-colors flex items-center gap-1.5"
          >
            <PhoneOff size={14} />
            <span className="hidden sm:inline">End Session</span>
          </button>
        </div>
      </footer>

      {/* Confirmation to End Session Early */}
      {isEndModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1714]/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[20px] bg-[#FFF9F2] text-[#342A24] p-6 space-y-4 text-center border border-[#E8DCCB] shadow-warm-lg animate-in zoom-in-95">
            <h3 className="font-serif font-bold text-xl text-[#342A24]">Conclude this consultation?</h3>
            <p className="text-xs text-[#7B6C60] leading-relaxed">
              You have <strong className="text-[#C96F42] font-mono">{formatTime(secondsRemaining)}</strong> remaining. Ending early will finalize the consultation room and open your specialist review.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => setIsEndModalOpen(false)}
                className="py-2.5 rounded-[10px] border border-[#E8DCCB] bg-[#F6F0E7] text-xs font-bold text-[#342A24] hover:bg-[#E8DCCB]/50 transition-colors"
              >
                Return to Call
              </button>
              <button
                onClick={handleEndSession}
                className="py-2.5 rounded-[10px] bg-[#B85D3D] hover:bg-[#A34F32] text-[#FFF9F2] text-xs font-bold shadow-warm-xs transition-colors"
              >
                End & Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timer Extension Fee Popup Modal */}
      {isExtendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1714]/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-[24px] bg-[#FFF9F2] text-[#342A24] p-6 space-y-4 text-center border border-[#E8DCCB] shadow-warm-lg animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-[14px] bg-[#C96F42]/10 text-[#C96F42] flex items-center justify-center mx-auto">
              <Clock size={24} />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#342A24]">Extend Consultation Time?</h3>
            <p className="text-xs text-[#7B6C60] leading-relaxed">
              Extending your consultation session by <strong className="text-[#342A24]">+5 minutes</strong> will update your session balance.
            </p>
            <div className="p-3.5 rounded-2xl bg-[#F6F0E7] border border-[#E8DCCB] text-center space-y-0.5">
              <p className="text-[11px] font-semibold text-[#7B6C60]">Additional Fee Notice</p>
              <p className="text-sm font-bold text-[#C96F42]">
                Price is increased by ₹{extensionPriceIncrease}
              </p>
              <p className="text-[10px] text-[#7B6C60]">({baseFee} base fee + ₹50 extension surcharge)</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => setIsExtendModalOpen(false)}
                className="py-2.5 rounded-[12px] border border-[#E8DCCB] bg-[#FFF9F2] text-xs font-bold text-[#342A24] hover:bg-[#F6F0E7]"
              >
                Cancel
              </button>
              <button
                onClick={confirmExtension}
                className="py-2.5 rounded-[12px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs"
              >
                Confirm +5m
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Session Rating and Review Component */}
      <PostSessionReviewModal
        isOpen={isRatingModalOpen}
        booking={booking}
        expert={expert}
        onClose={() => {
          setIsRatingModalOpen(false);
          navigate("user-dashboard");
        }}
        onSubmitSuccess={() => {
          setIsRatingModalOpen(false);
          navigate("user-dashboard");
        }}
      />

      {/* Shared Document & File Preview Drawer */}
      <DocumentPreviewDrawer
        isOpen={isDocDrawerOpen}
        onClose={() => setIsDocDrawerOpen(false)}
        documents={sharedDocuments}
        onUploadDocument={handleUploadDocument}
        onDeleteDocument={handleDeleteDocument}
        onShareToChat={handleShareDocToChat}
        expertName={expert.name}
      />
    </div>
  );
};
