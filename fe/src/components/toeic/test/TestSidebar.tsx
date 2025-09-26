"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/libs";
import { CountdownTimer } from "./CountDown";
import { useCallback } from "react";
import { useRouter } from "next/router";

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
    <div className="w-60 bg-gray-50 border-l flex flex-col overflow-y-hidden">
      <div className="p-6 flex-1">
        <div className="space-y-6">
          {/* Timer */}
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Thời gian còn lại:</div>
            <CountdownTimer initialSeconds={timeRemaining} tickInterval={1000} onExpire={onSubmitTest} />
            <Button
              size="sm"
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-xs px-4"
              onClick={onSubmitTest}
            >
              NỘP BÀI
            </Button>
          </div>
          <hr className="border-gray-200" />

          <div className="p-4 border-t bg-white ">
            <div className="space-y-2 text-xs">
              <div className="text-orange-600">Khôi phục/lưu bài làm ▶</div>
              <div className="text-blue-600 leading-relaxed">
                Chú ý: bạn có thể click vào số thứ tự câu hỏi trong bài để đánh
                dấu review.
              </div>
            </div>
          </div>
          <hr className="border-gray-200" />

          {/* Part Navigation */}
          <div className="space-y-4 overflow-y-hidden">
            {parts.map((part) => (
              <div key={part.number} className="space-y-2">
                <h3 className="font-semibold text-xs text-gray-700 sticky top-0 bg-gray-50 py-1">
                  Part {part.number}
                </h3>
                <div className="grid grid-cols-5 gap-x-1.5 gap-y-1.5">
                  {part.questions.map((questionNum) => (
                    <Button
                      key={questionNum}
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "h-7 w-7 p-0 flex items-center justify-center text-[10px] font-medium transition-all duration-200",
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
