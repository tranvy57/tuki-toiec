"use client";

import { cn } from "@/utils/libs";
import { useRef, useCallback, useState } from "react";

// Components
import { PartTabs } from "@/components/toeic/test/PartTabs";
import { QuestionRenderer } from "@/components/toeic/test/QuestionRenderer";
import { TestHeader } from "@/components/toeic/test/TestHeader";
import { TestSidebar } from "@/components/toeic/test/TestSidebar";
import { ConfirmSubmitModal } from "@/components/toeic/test/ModalConfirm";

// Custom hook
import { useTestLogic } from "./handle";
import { AudioPlayer } from "@/components/toeic/test/Audio";

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
    isLoadingTest,
    isReviewMode,

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
    nextPart,
    isLastPart,

    // Constants
    TEST_DURATION,
  } = useTestLogic();

  const showDetails = isReviewMode;

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

  if (isLoadingTest || !fullTest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Starting test...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen p-5 bg-gray-50">
      <TestHeader
        testTitle={fullTest.test.title || "TOEIC Practice Test"}
        highlightContent={highlightContent}
        onHighlightChange={setHighlightContent}
        onExit={handleExit}
      />
      <div className="flex relative">
        {/* Modal */}
        <ConfirmSubmitModal
          open={isReviewMode ? false : open}
          onClose={() => setOpen(false)}
          onConfirm={confirmSubmit}
        />

        {/* Main Content */}
        <div className="flex-1  rounded-xl shadow mb-4 border border-gray-200 mr-6">
          <div className="px-6 py-2 bg-white">
            <div className="flex items-center justify-between">
              {/* Audio controls */}
              <div className="w-full">
                {fullTest?.test.audioUrl && (
                  <AudioPlayer audioUrl={fullTest.test.audioUrl} />
                )}
              </div>
              {/* Always show details in review mode; no toggle button needed */}
            </div>
          </div>
          <PartTabs
            parts={partTabs}
            currentPart={currentPart?.partNumber || 1}
            onPartChange={handlePartChange}
          />

          {/* Questions */}
          <div
            ref={contentRef}
            className={cn(
              "px-6 transition-opacity duration-300 bg-white",
              isTransitioning ? "opacity-50" : "opacity-100"
            )}
          >
            <QuestionRenderer
              questions={currentPartQuestions}
              answers={mappedAnswers}
              onAnswerChange={handleQuestionAnswerChange}
              isTransitioning={isTransitioning}
              mode={isReviewMode ? "review" : fullTest?.mode ?? "test"}
              readOnly={isReviewMode}
              showDetails={showDetails}
              currentQuestion={currentQuestion}
            />

            {!isLastPart && (
              <div className="mt-8 flex justify-end pb-8">
                <button
                  onClick={nextPart}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  Chuyển qua Part kế tiếp
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <TestSidebar
          currentQuestion={currentQuestion}
          answers={mappedAnswers}
          timeRemaining={timeRemaining}
          onQuestionChange={handleQuestionChangeWithScroll}
          onSubmitTest={() => handleSubmit()}
          isReviewMode={isReviewMode}
        />
      </div>
    </div>
  );
}
