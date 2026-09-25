# HumanAPI Frontend Engineering Roadmap & Feature Lifecycle

## 1. Executive Summary

This document defines the production feature lifecycle and frontend architecture roadmap for HumanAPI. It categorizes current capabilities, immediate next milestones, and future strategic enhancements to guide frontend development without altering live application state.

---

## 2. Feature Lifecycle Matrix

```
┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
│          CURRENT          │           NEXT            │          FUTURE           │
│   (Production Hardened)   │    (Target Q4 2026)       │    (Target H1 2027)       │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│ • 4-Layer Welcome Hero    │ • Instant Expert Filter   │ • AI Consultation Assist  │
│ • Uninhibited 100dvh Shell│ • Session Countdown Audio │ • WebRTC Multi-Peer Mesh  │
│ • INR / USD Multi-Currency│ • Saved Profiles Sync     │ • Custom White-Label Room │
│ • Native Document Scroll  │ • Interactive Calendars   │ • Enterprise SSO & SLA    │
│ • WebRTC Workspace Stage  │ • Automated Escrow Status │ • Offline-First Notes Sync│
└───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

---

## 3. Detail Specifications

### CURRENT (Phase 1 Production Hardened)
- **Cinematic Welcome Hero**: Full-bleed `100dvh` section with 4-layer composition (`RedWallpaper` → `VideoBackground` → `Overlay` → `WelcomeContent`).
- **Scroll Architecture**: Uninhibited native document scrolling across 12 public marketing sections (`#welcome`, `#intro`, `#how-it-works`, `#experts`, `#consultation`, `#use-cases`, `#pricing`, `#about`, `#faq`, `#become-expert`, `#final-cta`, `Footer`).
- **Brand Lockup System**: Unified `HumanAPILogo.tsx` supporting `welcome`, `navbar`, `footer`, and `compact` sizing variants.
- **Consultation Workspace**: Synchronized browser room stage with video placeholder, active sprint countdown timer, and interactive notes/chat panels.
- **Dual Currency Engine**: Seamless INR (`₹`) and USD (`$`) switching with localized formatting.

### NEXT (Immediate Priorities)
- **Advanced Practitioner Search**: Instant client-side fuzzy searching across domain tags, verified credentials, and availability slots.
- **Audio Cue System**: Subtle synthesized audio tones for countdown timer checkpoints (minute 3 alert, 30s remaining).
- **Expanded Calendar Scheduling**: Two-way Google/Outlook calendar synchronization for verified experts.

### FUTURE (Strategic Roadmap)
- **AI Consultation Summarizer**: Automatic real-time speech-to-text transcript generation with auto-bulleted action items.
- **Multi-Peer Consultation Mesh**: Support 3+ participant consultation rooms for multi-stakeholder technical architecture reviews.
- **Enterprise Team Accounts**: Organization-wide seat management, billing aggregation, and dedicated SLA escalation.
