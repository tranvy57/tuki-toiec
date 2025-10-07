"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Part {
  part: number;
  name: string;
  accuracy: number;
  details: {
    type: string;
    correct: number;
    wrong: number;
    skipped: number;
    questionIds: number[];
  }[];
}

interface AnswerReviewProps {
  parts: Part[];
}

export function AnswerReview({ parts }: AnswerReviewProps) {
  const [expandedParts, setExpandedParts] = useState<number[]>([]);

  const togglePart = (partNumber: number) => {
    setExpandedParts((prev) =>
      prev.includes(partNumber)
        ? prev.filter((p) => p !== partNumber)
        : [...prev, partNumber]
    );
  };

  // Generate mock answers for demonstration
  const generateMockAnswer = (
    questionId: number,
    isCorrect: boolean,
    isSkipped: boolean
  ) => {
    if (isSkipped) return { userAnswer: null, correctAnswer: "B" };
    const options = ["A", "B", "C", "D"];
    const correctAnswer = options[questionId % 4];
    const userAnswer = isCorrect
      ? correctAnswer
      : options[(questionId + 1) % 4];
    return { userAnswer, correctAnswer };
  };

  const getAllQuestions = (part: Part) => {
    const questions: Array<{
      id: number;
      status: "correct" | "wrong" | "skipped";
      userAnswer: string | null;
      correctAnswer: string;
    }> = [];

    part.details.forEach((detail) => {
      let correctCount = 0;
      let wrongCount = 0;
      let skippedCount = 0;

      detail.questionIds.forEach((id) => {
        let status: "correct" | "wrong" | "skipped";
        if (correctCount < detail.correct) {
          status = "correct";
          correctCount++;
        } else if (wrongCount < detail.wrong) {
          status = "wrong";
          wrongCount++;
        } else {
          status = "skipped";
          skippedCount++;
        }

        const { userAnswer, correctAnswer } = generateMockAnswer(
          id,
          status === "correct",
          status === "skipped"
        );

        questions.push({ id, status, userAnswer, correctAnswer });
      });
    });

    return questions;
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border border-primary/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">🧩 Xem lại Đáp án</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Xem Đáp án Chi tiết
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            Làm lại Câu sai
          </Button>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-green-800">
          Bạn có thể tô sáng từ khóa và tạo flashcard từ chế độ xem lại.
        </p>
      </div>

      <div className="space-y-3">
        {parts.map((part) => {
          const isExpanded = expandedParts.includes(part.part);
          const questions = getAllQuestions(part);

          return (
            <div
              key={part.part}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => togglePart(part.part)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">
                    Part {part.part}: {part.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    ({questions.length} câu hỏi)
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-white space-y-2">
                      {questions.map((q) => (
                        <div
                          key={q.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {q.status === "correct" && (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            )}
                            {q.status === "wrong" && (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                            {q.status === "skipped" && (
                              <Circle className="w-5 h-5 text-gray-300" />
                            )}
                            <span className="font-medium text-gray-900">
                              Câu hỏi {q.id}
                            </span>
                            {q.userAnswer ? (
                              <span className="text-sm text-gray-600">
                                Đáp án của bạn:{" "}
                                <span className="font-semibold">
                                  {q.userAnswer}
                                </span>
                                {q.status === "wrong" && (
                                  <span className="ml-2 text-green-600">
                                    (Đúng:{" "}
                                    <span className="font-semibold">
                                      {q.correctAnswer}
                                    </span>
                                    )
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Chưa trả lời
                              </span>
                            )}
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-primary"
                          >
                            Xem Chi tiết
                          </Button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
