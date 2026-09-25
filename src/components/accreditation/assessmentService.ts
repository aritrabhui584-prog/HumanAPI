import {
  AssessmentSession,
  AssessmentState,
  AccreditationQuestion,
  CandidateAnswer,
  AssessmentServerMessage,
  AssessmentIntegrityProvider
} from "./AccreditationTypes";

/**
 * Minimal Placeholder Integration Boundary for Future Backend Integrity Provider
 * (No client detection logic or algorithms)
 */
export class NoopIntegrityProvider implements AssessmentIntegrityProvider {
  async initialize(sessionId: string): Promise<void> {}
  async disconnect(): Promise<void> {}
}

/**
 * AssessmentService
 * 
 * Clean frontend service abstraction communicating with the backend assessment engine.
 * Receives server-authoritative session state and handles answer persistence.
 */

type Listener = (session: AssessmentSession) => void;

// Data-driven default assessment question suite
export const DEFAULT_ACCREDITATION_QUESTIONS: AccreditationQuestion[] = [
  {
    id: "q-1",
    number: 1,
    type: "multiple_choice",
    category: "Domain Mastery & Architecture",
    title: "System Bottleneck Isolation",
    prompt: "In a high-concurrency micro-consultation system experiencing intermittent WebRTC signaling latency under peak load, which diagnostic step provides the highest signal-to-noise ratio?",
    guidance: "Evaluate diagnostic efficiency and root cause isolation protocol.",
    options: [
      { id: "a", label: "A", text: "Inspect server-sent event (SSE) queue depth and socket event loop lag metrics before scaling instances." },
      { id: "b", label: "B", text: "Immediately restart all signaling gateway pods to clear memory buffers." },
      { id: "c", label: "C", text: "Increase WebRTC ICE candidate timeout from 500ms to 5,000ms." },
      { id: "d", label: "D", text: "Disable client-side TURN server fallback to reduce network overhead." }
    ]
  },
  {
    id: "q-2",
    number: 2,
    type: "scenario",
    category: "Consultation Architecture",
    title: "Handling Ambiguous Client Requirements",
    scenarioContext: "A client books a 10-minute session with a vague title: 'Database query keeps failing randomly'. During minute 1, they provide conflicting stack descriptions and seem overwhelmed.",
    prompt: "How do you structure the remaining 9 minutes of the consultation to deliver immediate, actionable value before the timer expires?",
    guidance: "Demonstrate live consultation discipline, time triage, and empathetic guidance.",
    options: [
      { id: "opt-1", label: "A", text: "Establish a 2-minute diagnostic isolation checkpoint: request the exact error stack trace, test a single hypothesis, and deliver a clear mitigation roadmap by minute 8." },
      { id: "opt-2", label: "B", text: "Spend 7 minutes explaining general database indexing theory so the client learns fundamental concepts." },
      { id: "opt-3", label: "C", text: "Ask the client to reschedule for a 60-minute call since 10 minutes is insufficient for debugging." },
      { id: "opt-4", label: "D", text: "Take remote control of the client's screen immediately without asking diagnostic questions." }
    ]
  },
  {
    id: "q-3",
    number: 3,
    type: "code",
    category: "Practical Code Diagnostic",
    title: "Race Condition & Resource Leak Mitigation",
    prompt: "Review the Node.js stream handler snippet below. Identify the resource leak in error scenarios and rewrite the function using async disposable/cleanup practices.",
    guidance: "Ensure memory leaks and dangling stream listeners are cleanly addressed.",
    language: "typescript",
    codeTemplate: `import fs from 'fs';
import { pipeline } from 'stream/promises';

// Candidate Task: Fix the unhandled stream leak in error branch
export async function processConsultationLog(filePath: string): Promise<string> {
  const stream = fs.createReadStream(filePath);
  // BAD: Stream is left open if JSON parsing throws
  let content = '';
  for await (const chunk of stream) {
    content += chunk.toString();
  }
  return JSON.parse(content).summary;
}`
  },
  {
    id: "q-4",
    number: 4,
    type: "multi_select",
    category: "Client Empathy & Quality Control",
    title: "Delivering Difficult Technical Feedback",
    prompt: "Select ALL practices that align with HumanAPI's verified expert consultation standards when informing a client their codebase requires structural refactoring:",
    options: [
      { id: "ms-1", label: "A", text: "Provide a clear, non-condescending explanation of why the current design creates risk." },
      { id: "ms-2", label: "B", text: "Outline an incremental, low-risk migration plan rather than a blanket rewrite recommendation." },
      { id: "ms-3", label: "C", text: "Criticize the original developer's skill to demonstrate your superior technical authority." },
      { id: "ms-4", label: "D", text: "Summarize top 3 actionable next steps in the session notes before call conclusion." }
    ]
  },
  {
    id: "q-5",
    number: 5,
    type: "practical_task",
    category: "Live Consultation Case Analysis",
    title: "High-Impact 10-Minute Consultation Architecture Plan",
    prompt: "Synthesize a 10-minute client consultation outline for a high-priority system outage case.",
    guidance: "Break down Minute 0-2 (Triage), Minute 2-7 (Diagnostic Isolation), Minute 7-10 (Action Roadmap & Notes).",
    practicalTaskInstructions: [
      "1. Define how you greet and establish control of the timer in Minute 1.",
      "2. Outline your rapid diagnostic questioning strategy for ambiguous errors.",
      "3. Describe how you summarize tangible deliverables before the consultation ends."
    ],
    minCharCount: 80,
    maxCharCount: 1500
  }
];

class AssessmentService {
  private session: AssessmentSession;
  private listeners: Set<Listener> = new Set();
  private saveTimeoutMap: Map<string, any> = new Map();

  constructor() {
    this.session = this.createDefaultSession();
  }

  private createDefaultSession(): AssessmentSession {
    const questions = DEFAULT_ACCREDITATION_QUESTIONS;
    const initialAnswers: Record<string, CandidateAnswer> = {};

    questions.forEach(q => {
      initialAnswers[q.id] = {
        questionId: q.id,
        value: q.type === "multi_select" ? [] : "",
        saveStatus: "unsaved"
      };
    });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString();

    return {
      assessmentId: `acc-${Date.now()}`,
      candidateId: "u-curr",
      candidateName: "Aritra Bhui",
      field: "Software Development & System Architecture",
      state: "environment_check",
      questions,
      answers: initialAnswers,
      currentQuestionId: questions[0].id,
      startedAt: now.toISOString(),
      expiresAt,
      durationMinutes: 15,
      timeRemainingSeconds: 15 * 60,
      isSequentialOnly: false
    };
  }

  public getSession(): AssessmentSession {
    return { ...this.session };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getSession());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const copy = this.getSession();
    this.listeners.forEach(l => l(copy));
  }

  public startAssessment() {
    if (this.session.state === "environment_check" || this.session.state === "idle" || this.session.state === "ready") {
      this.session.state = "active";
      this.session.startedAt = new Date().toISOString();
      this.notify();
    }
  }

  public setCurrentQuestion(questionId: string) {
    const qExists = this.session.questions.some(q => q.id === questionId);
    if (qExists && this.session.state === "active") {
      this.session.currentQuestionId = questionId;
      this.notify();
    }
  }

  public saveAnswer(questionId: string, value: string | string[]) {
    if (this.session.state !== "active") return;

    // Set saving status
    const currentAns = this.session.answers[questionId] || { questionId, value, saveStatus: "unsaved" };
    this.session.answers[questionId] = {
      ...currentAns,
      value,
      saveStatus: "saving"
    };
    this.notify();

    // Debounce server save simulation
    if (this.saveTimeoutMap.has(questionId)) {
      clearTimeout(this.saveTimeoutMap.get(questionId));
    }

    const timer = setTimeout(() => {
      if (this.session.answers[questionId]) {
        this.session.answers[questionId] = {
          ...this.session.answers[questionId],
          value,
          saveStatus: "saved",
          savedAt: new Date().toISOString()
        };
        this.session.lastSavedAt = new Date().toISOString();
        this.notify();
      }
    }, 400);

    this.saveTimeoutMap.set(questionId, timer);
  }

  public submitAssessment(): Promise<boolean> {
    return new Promise(resolve => {
      if (this.session.state === "active") {
        this.session.state = "under_review";
        this.notify();
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  /**
   * Handle Authoritative Backend Server Messages
   * (e.g. Server WebSocket events for assessment termination, server expiry, or restriction enforcement)
   */
  public handleServerMessage(msg: AssessmentServerMessage) {
    switch (msg.type) {
      case "ASSESSMENT_STATE_CHANGED":
        if (msg.session?.state) {
          this.session.state = msg.session.state;
          this.notify();
        }
        break;

      case "ASSESSMENT_TERMINATED":
        this.session.state = "terminated";
        this.session.restrictedUntil = msg.restrictedUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        this.session.terminationReason = msg.reason || "Assessment policy violation confirmed.";
        this.notify();
        break;

      case "ASSESSMENT_BLOCKED":
        this.session.state = "blocked";
        this.session.restrictedUntil = msg.restrictedUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        this.notify();
        break;

      case "TIME_EXPIRED":
        if (this.session.state === "active") {
          this.session.state = "under_review";
          this.notify();
        }
        break;
    }
  }

  // Developer / Test helper for backend state testing
  public testSimulateBackendTermination() {
    const dateIn30Days = new Date();
    dateIn30Days.setDate(dateIn30Days.getDate() + 30);
    this.handleServerMessage({
      type: "ASSESSMENT_TERMINATED",
      restrictedUntil: dateIn30Days.toISOString().split("T")[0],
      reason: "Confirmed policy violation"
    });
  }

  public testSimulateBackendBlocked() {
    const dateIn30Days = new Date();
    dateIn30Days.setDate(dateIn30Days.getDate() + 30);
    this.handleServerMessage({
      type: "ASSESSMENT_BLOCKED",
      restrictedUntil: dateIn30Days.toISOString().split("T")[0]
    });
  }

  public resetSession() {
    this.session = this.createDefaultSession();
    this.notify();
  }
}

export const assessmentService = new AssessmentService();
