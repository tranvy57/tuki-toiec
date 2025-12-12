"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/libs";
import { CountdownTimer } from "./CountDown";

interface Part {
  number: number;
  questions: number[];
}

interface TestSidebarProps {
  currentQuestion: number;
  answers: Record<number, string>;
  timeRemaining: number;
  onQuestionChange: (questionId: number) => void;
  onSubmitTest: () => void;
  isReviewMode?: boolean;
}

const parts: Part[] = [
  { number: 1, questions: Array.from({ length: 6 }, (_, i) => i + 1) },
  { number: 2, questions: Array.from({ length: 25 }, (_, i) => i + 7) },
  { number: 3, questions: Array.from({ length: 39 }, (_, i) => i + 32) },
  { number: 4, questions: Array.from({ length: 30 }, (_, i) => i + 71) },
  { number: 5, questions: Array.from({ length: 30 }, (_, i) => i + 101) },
  { number: 6, questions: Array.from({ length: 16 }, (_, i) => i + 131) },
  { number: 7, questions: Array.from({ length: 54 }, (_, i) => i + 147) },
];

export function TestSidebar({
  currentQuestion,
  answers,
  timeRemaining,
  onQuestionChange,
  onSubmitTest,
  isReviewMode = false,
}: TestSidebarProps) {
  // Format time

  // Check if question is answered
  const isQuestionAnswered = (questionId: number) => {
    return answers[questionId] !== undefined;
  };

  // Get question status color
  const getQuestionStatusColor = (questionId: number) => {
    if (questionId === currentQuestion)
      return "bg-blue-500 text-white shadow-md";
    if (isQuestionAnswered(questionId)) return "bg-green-500 text-white";
    return "bg-gray-200 text-gray-700 hover:bg-gray-300";
  };

  return (
    <div className="sticky -top-[calc(100vh+96px)] w-60 bg-white flex flex-col overflow-y-hidden border rounded-xl shadow-sm h-fit">
      <div className="p-6 flex-1">
        <div className="space-y-6">
          {/* Timer */}
          <div className="text-center sticky top-2 mb-6">
            {isReviewMode ? (
              <div className="text-gray-700 text-sm font-semibold py-2">
                Đang xem lại kết quả
              </div>
            ) : (
              <>
                <div className="text-sm text-gray-600 mb-1">
                  Thời gian còn lại:
                </div>
                <div className="text-2xl font-bold">
                  <CountdownTimer
                    initialSeconds={timeRemaining}
                    tickInterval={1000}
                    onExpire={onSubmitTest}
                  />
                </div>
                <Button
                  size="sm"
                  className="mt-3 bg-primary hover:bg-primary-2 text-xs px-4"
                  onClick={onSubmitTest}
                >
                  NỘP BÀI
                </Button>
              </>
            )}
          </div>
          <hr className="border-gray-200" />

          {/* <hr className="border-gray-200" /> */}

          {/* Part Navigation */}
          <div className="space-y-4 overflow-y-hidden">
            {parts.map((part) => (
              <div key={part.number} className="space-y-2">
                <h3 className="font-semibold text-xs text-gray-700 sticky top-0 py-1">
                  Part {part.number}
                </h3>
                <div className="grid grid-cols-5 gap-x-1.5 gap-y-1.5">
                  {part.questions.map((questionNum) => (
                    <Button
                      key={questionNum}
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "h-7 w-7 p-0 flex items-center justify-center text-[12px] font-medium transition-all duration-200",
                        getQuestionStatusColor(questionNum)
                      )}
                      onClick={() => onQuestionChange(questionNum)}
                    >
                      {questionNum}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Info */}
    </div>
  );
}
