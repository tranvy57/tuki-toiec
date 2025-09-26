"use client";

import { cn } from "@/utils/libs";
import { useRef, useCallback } from "react";

// Components
import { PartTabs } from "@/components/toeic/test/PartTabs";
import { QuestionRenderer } from "@/components/toeic/test/QuestionRenderer";
import { TestHeader } from "@/components/toeic/test/TestHeader";
import { TestSidebar } from "@/components/toeic/test/TestSidebar";
import { ConfirmSubmitModal } from "@/components/toeic/test/ModalConfirm";

// Custom hook
import { useTestLogic } from "./handle";

export default function TestStartPage() {
  const {
    // State
    fullTest,
    currentPart,
    currentQuestion,
    timeRemaining,
    highlightContent,
    isTransitioning,
    open,
    startTestMutation,

    // Data
    partTabs,
    mappedAnswers,
    currentPartQuestions,
    testId,

    // Handlers
    handleSubmit,
    confirmSubmit,
    handleQuestionChange,
    handleQuestionAnswerChange,
    handlePartChange,
    handleExit,
    setHighlightContent,
    setOpen,

    // Constants
    TEST_DURATION,
  } = useTestLogic();

  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleQuestionChangeWithScroll = useCallback(
    (questionNumber: number) => {
      handleQuestionChange(questionNumber, scrollToTop);
    },
    [handleQuestionChange, scrollToTop]
  );

  if (startTestMutation.isPending || !fullTest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Starting test...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (startTestMutation.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to start test</p>
          <button
            onClick={() => (window.location.href = `/tests/${testId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex my-5">
      {/* Modal */}
      <ConfirmSubmitModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={confirmSubmit}
      />

      {/* Main Content */}
      <div className="flex-1">
        <TestHeader
          testTitle={fullTest.test.title || "TOEIC Practice Test"}
          highlightContent={highlightContent}
          onHighlightChange={setHighlightContent}
          onExit={handleExit}
        />

        <PartTabs
          parts={partTabs}
          currentPart={currentPart?.partNumber || 1}
          onPartChange={handlePartChange}
        />

        {/* Questions */}
        <div
          ref={contentRef}
          className={cn(
            "px-6 py-6 transition-opacity duration-300",
            isTransitioning ? "opacity-50" : "opacity-100"
          )}
        >
          <QuestionRenderer
            questions={currentPartQuestions}
            answers={mappedAnswers}
            onAnswerChange={handleQuestionAnswerChange}
            isTransitioning={isTransitioning}
          />
        </div>
      </div>

      {/* Sidebar */}
      <TestSidebar
        currentQuestion={currentQuestion}
        answers={mappedAnswers}
        timeRemaining={timeRemaining}
        onQuestionChange={handleQuestionChangeWithScroll}
        onSubmitTest={() => handleSubmit()}
      />
    </div>
  );
}
