import React, { useState, useEffect } from "react";
import { assessmentService } from "./assessmentService";
import { AssessmentSession } from "./AccreditationTypes";
import { AccreditationHeader } from "./AccreditationHeader";
import { ProgressPanel } from "./ProgressPanel";
import { EnvironmentCheckModal } from "./EnvironmentCheckModal";
import { QuestionRenderer } from "./QuestionRenderer";
import { AssessmentReviewModal } from "./AssessmentReviewModal";
import { AssessmentSubmittedView } from "./AssessmentSubmittedView";
import { AssessmentTerminatedView } from "./AssessmentTerminatedView";
import { AssessmentBlockedView } from "./AssessmentBlockedView";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

interface AccreditationShellProps {
  onReturnToDashboard: () => void;
  onSubmittedSuccess?: () => void;
}

export const AccreditationShell: React.FC<AccreditationShellProps> = ({
  onReturnToDashboard,
  onSubmittedSuccess
}) => {
  const [session, setSession] = useState<AssessmentSession>(() => assessmentService.getSession());
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = assessmentService.subscribe(updatedSession => {
      setSession(updatedSession);
    });
    return () => unsubscribe();
  }, []);

  const currentQuestionIndex = session.questions.findIndex(q => q.id === session.currentQuestionId);
  const currentQuestion = session.questions[currentQuestionIndex] || session.questions[0];
  const currentAnswer = session.answers[currentQuestion?.id];

  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === session.questions.length - 1;

  const handleBeginAssessment = () => {
    assessmentService.startAssessment();
  };

  const handleSelectQuestion = (qId: string) => {
    assessmentService.setCurrentQuestion(qId);
  };

  const handleAnswerChange = (value: any) => {
    if (currentQuestion) {
      assessmentService.saveAnswer(currentQuestion.id, value);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevQ = session.questions[currentQuestionIndex - 1];
      assessmentService.setCurrentQuestion(prevQ.id);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      const nextQ = session.questions[currentQuestionIndex + 1];
      assessmentService.setCurrentQuestion(nextQ.id);
    } else {
      setIsReviewModalOpen(true);
    }
  };

  const handleFinalSubmit = async () => {
    setIsReviewModalOpen(false);
    const success = await assessmentService.submitAssessment();
    if (success && onSubmittedSuccess) {
      onSubmittedSuccess();
    }
  };

  // 1. BLOCKED STATE
  if (session.state === "blocked") {
    return (
      <div className="min-h-[100dvh] bg-[#F6F0E7] flex flex-col">
        <AccreditationHeader
          currentQuestionIndex={0}
          totalQuestions={session.questions.length}
          expiresAt={session.expiresAt}
          onLogoClick={onReturnToDashboard}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <AssessmentBlockedView
            restrictedUntil={session.restrictedUntil}
            onReturnToDashboard={onReturnToDashboard}
          />
        </main>
      </div>
    );
  }

  // 2. TERMINATED STATE
  if (session.state === "terminated") {
    return (
      <div className="min-h-[100dvh] bg-[#F6F0E7] flex flex-col">
        <AccreditationHeader
          currentQuestionIndex={0}
          totalQuestions={session.questions.length}
          expiresAt={session.expiresAt}
          onLogoClick={onReturnToDashboard}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <AssessmentTerminatedView
            restrictedUntil={session.restrictedUntil}
            onReturnToDashboard={onReturnToDashboard}
          />
        </main>
      </div>
    );
  }

  // 3. SUBMITTED / UNDER REVIEW STATE
  if (session.state === "submitted" || session.state === "under_review") {
    return (
      <div className="min-h-[100dvh] bg-[#F6F0E7] flex flex-col">
        <AccreditationHeader
          currentQuestionIndex={session.questions.length - 1}
          totalQuestions={session.questions.length}
          expiresAt={session.expiresAt}
          onLogoClick={onReturnToDashboard}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <AssessmentSubmittedView
            candidateName={session.candidateName}
            field={session.field}
            onReturnToDashboard={onReturnToDashboard}
          />
        </main>
      </div>
    );
  }

  // 4. ENVIRONMENT READINESS CHECK MODAL (When state is idle/environment_check)
  const showEnvironmentCheck = session.state === "environment_check" || session.state === "idle" || session.state === "ready";

  return (
    <div className="min-h-[100dvh] h-[100dvh] max-h-[100dvh] flex flex-col bg-[#F6F0E7] text-[#342A24] font-sans overflow-hidden">
      {/* Pre-assessment Readiness Modal */}
      {showEnvironmentCheck && (
        <EnvironmentCheckModal
          candidateName={session.candidateName}
          field={session.field}
          durationMinutes={session.durationMinutes}
          onBeginAssessment={handleBeginAssessment}
        />
      )}

      {/* Main Header */}
      <AccreditationHeader
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={session.questions.length}
        expiresAt={session.expiresAt}
        onTimeExpired={() => assessmentService.handleServerMessage({ type: "TIME_EXPIRED" })}
        onLogoClick={onReturnToDashboard}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Main Assessment Body Shell */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Left Progress Sidebar */}
        <ProgressPanel
          questions={session.questions}
          answers={session.answers}
          currentQuestionId={session.currentQuestionId}
          onSelectQuestion={handleSelectQuestion}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
        />

        {/* Center Workspace */}
        <main className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden bg-[#FFF9F2] p-4 sm:p-8 lg:p-12">
          {/* Scrollable Question Content Container */}
          <div className="flex-1 overflow-y-auto min-h-0 space-y-6 max-w-3xl mx-auto w-full no-scrollbar">
            {currentQuestion && (
              <QuestionRenderer
                question={currentQuestion}
                answer={currentAnswer}
                onAnswerChange={handleAnswerChange}
              />
            )}
          </div>

          {/* Sticky Navigation Controls Footer */}
          <div className="pt-4 border-t border-[#E8DCCB] flex items-center justify-between gap-3 max-w-3xl mx-auto w-full shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirst}
              className="px-4 py-2.5 rounded-[12px] border border-[#E8DCCB] bg-[#F6F0E7] hover:bg-[#E8DCCB]/40 disabled:opacity-40 text-xs font-bold text-[#342A24] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="px-3 py-2.5 rounded-[12px] border border-[#E8DCCB] bg-[#F6F0E7] text-xs font-semibold text-[#7B6C60] hover:text-[#342A24] transition-colors"
              >
                Review Items
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-[12px] bg-[#C96F42] hover:bg-[#B85D3D] text-[#FFF9F2] text-xs font-bold shadow-warm-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                {isLast ? (
                  <>
                    <span>Review & Submit</span>
                    <Send size={15} />
                  </>
                ) : (
                  <>
                    <span>Next Item</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Review Modal */}
      <AssessmentReviewModal
        isOpen={isReviewModalOpen}
        questions={session.questions}
        answers={session.answers}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmitFinal={handleFinalSubmit}
      />
    </div>
  );
};

export default AccreditationShell;
