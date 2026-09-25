/**
 * HumanAPI Expert Accreditation Data Contracts & State Machine Types
 */

export type AssessmentState =
  | "idle"
  | "environment_check"
  | "ready"
  | "active"
  | "submitted"
  | "under_review"
  | "terminated"
  | "blocked";

export type QuestionType =
  | "multiple_choice"
  | "multi_select"
  | "short_answer"
  | "long_answer"
  | "scenario"
  | "practical_task"
  | "code";

export type SaveStatus = "unsaved" | "saving" | "saved" | "failed";

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
  explanation?: string;
}

export interface AccreditationQuestion {
  id: string;
  number: number;
  type: QuestionType;
  category: string;
  title: string;
  scenarioContext?: string;
  prompt: string;
  guidance?: string;
  options?: QuestionOption[];
  codeTemplate?: string;
  language?: string;
  practicalTaskInstructions?: string[];
  starterData?: Record<string, any>;
  minCharCount?: number;
  maxCharCount?: number;
}

export interface CandidateAnswer {
  questionId: string;
  value: string | string[]; // Selected option ID(s), written text, or code
  savedAt?: string;
  saveStatus: SaveStatus;
}

export interface AssessmentSession {
  assessmentId: string;
  candidateId: string;
  candidateName: string;
  field: string;
  state: AssessmentState;
  questions: AccreditationQuestion[];
  answers: Record<string, CandidateAnswer>;
  currentQuestionId: string;
  startedAt: string;
  expiresAt: string; // Server-authoritative ISO string
  durationMinutes: number;
  timeRemainingSeconds: number;
  lastSavedAt?: string;
  restrictedUntil?: string; // Server-provided restriction date string if terminated/blocked
  terminationReason?: string;
  isSequentialOnly?: boolean;
}

export interface AssessmentServerMessage {
  type:
    | "ASSESSMENT_STATE_CHANGED"
    | "ANSWER_SAVED"
    | "ANSWER_SAVE_FAILED"
    | "TIME_EXPIRED"
    | "ASSESSMENT_SUBMITTED"
    | "ASSESSMENT_TERMINATED"
    | "ASSESSMENT_BLOCKED";
  session?: Partial<AssessmentSession>;
  questionId?: string;
  restrictedUntil?: string;
  reason?: string;
}

/**
 * Minimal Integration Boundary Contract for Future Backend Integrity Provider
 * (No client detection logic or dummy events)
 */
export interface AssessmentIntegrityProvider {
  initialize(sessionId: string): Promise<void>;
  disconnect(): Promise<void>;
}
