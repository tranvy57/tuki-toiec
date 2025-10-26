"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft, FileText, Clock, CheckCircle2, Play } from "lucide-react";
import { Question } from "../types";
import { formatTime } from "../constants";
import { CountdownTimer } from "@/components/toeic/test/CountDown";
import { AudioPlayer } from "@/components/toeic/test/Audio";

interface TestScreenProps {
  currentQuestion: number;
  totalQuestions: number;
  question: Question;
  questions: Question[]; // All questions for the sidebar
  selectedOption: number | null;
  selectedAnswers: { [key: number]: number }; // Track all answers
  timeElapsed: number;
  timeLimit?: number; // Time limit in seconds for countdown
  onAnswer: (optionIndex: number) => void;
  onAnswerForQuestion: (questionIndex: number, optionIndex: number) => void;
  onQuestionSelect: (questionIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function TestScreen({
  currentQuestion,
  totalQuestions,
  question,
  questions,
  selectedOption,
  selectedAnswers,
  timeElapsed,
  timeLimit = 7200, // Default 2 hours = 7200 seconds
  onAnswer,
  onAnswerForQuestion,
  onQuestionSelect,
  onNext,
  onPrevious,
  onSubmit,
  canGoNext,
  canGoPrevious,
}: TestScreenProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  // Group questions by part for bottom navigation
  const questionsByPart = questions.reduce((acc, q, index) => {
    if (!acc[q.part]) {
      acc[q.part] = [];
    }
    acc[q.part].push({ ...q, originalIndex: index });
    return acc;
  }, {} as Record<number, any>);

  return (
    <motion.div
      key="test"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-h-[calc(100vh-72px)] flex flex-col"
    >
      {/* Test Header with Timer and Submit */}



      {/* Main Content */}
      <div className="flex">
        {/* Left Panel - Instructions/Passage */}

        <div className="w-1/2 h-[620px] bg-white">
          <div className="px-6 py-3">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-lg font-medium">
                Part {question.part} - {question.partName}
              </h2>
            </div>
          </div>

          <div className="h-[calc(100%-8rem)]">
            {question.passage ? (
              /* Passage for Part 7 */
              <div className="rounded-lg p-4 flex flex-col h-full mb-4">
                <div className="flex items-center justify-between ">

                  {question.passageId && (
                    <div className="text-sm text-gray-500 text-end w-full">
                      {(() => {
                        const passageQuestions = questions.filter(q => q.passageId === question.passageId);
                        const currentQuestionInPassage = passageQuestions.findIndex(q => q.id === question.id) + 1;
                        return `Question ${currentQuestionInPassage} of ${passageQuestions.length}`;
                      })()}
                    </div>
                  )}
                </div>

                {/* 👇 chỉ phần này được cuộn */}
                <div className="prose prose-sm max-w-none flex-1 overflow-y-auto border rounded-md p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                    {question.passage}
                  </p>
                </div>
              </div>
            ) : (
              /* Instructions for other parts */
              <div className="rounded-lg p-6 mb-4 ">
                <div className="text-sm text-gray-600 mb-4">
                  Gồm {totalQuestions} câu hỏi (Part {question.part}: {question.partName}).
                </div>
                <div className="text-sm text-gray-700 leading-relaxed mb-4">
                  {question.part === 1 && "Bạn sẽ nhìn vào các bức ảnh và nghe 4 mô tả về bức ảnh đó. Chọn mô tả phù hợp nhất với bức ảnh."}
                  {question.part === 2 && "Bạn sẽ nghe một câu hỏi hoặc phát biểu, sau đó nghe 3 câu trả lời. Chọn câu trả lời phù hợp nhất."}
                  {question.part === 3 && "Bạn sẽ lắng nghe các đoạn hội thoại ngắn giữa hai người. Với mỗi đoạn hội thoại có 3 câu hỏi, mỗi câu hỏi có 4 lựa chọn A, B, C, D."}
                  {question.part === 4 && "Bạn sẽ nghe các bài nói ngắn của một người. Mỗi bài nói có 3 câu hỏi với 4 lựa chọn A, B, C, D."}
                  {question.part === 5 && "Chọn từ hoặc cụm từ phù hợp nhất để hoàn thành câu."}
                  {question.part === 6 && "Chọn từ hoặc cụm từ phù hợp nhất để hoàn thành đoạn văn."}
                  {question.part === 7 && "Đọc đoạn văn và trả lời các câu hỏi."}
                </div>
                <div className="text-red-600 text-sm font-medium">
                  Lưu ý: Chỉ nghe đoạn hội thoại có chắm hiểm âm
                </div>
              </div>
            )}


            {/* Audio Player - Only show for listening parts */}
            {(question.part <= 4) && (
              <div className=" rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-4">
                  <AudioPlayer audioUrl="" />
                </div>
              </div>
            )}

          </div>


          {/* Navigation Buttons */}
          <div className="flex px-4 justify-between">
            <Button
              variant="outline"
              className="flex-1 max-w-[calc(50%-0.75rem)]"
              onClick={onPrevious}
              disabled={!canGoPrevious}
            >
              Câu trước
            </Button>
            <Button
              variant="outline"
              className="flex-1 max-w-[calc(50%-0.75rem)]"
              onClick={onNext}
              disabled={!canGoNext}
            >
              Câu tiếp theo
            </Button>
          </div>
        </div>

        {/* Right Panel - Multiple Questions */}
        <div className="w-1/2 border-l border-gray-200 h-[620px]">
          <div className="bg-primary text-white shadow-lg flex justify-end w-full">
            <div className="max-w-7xl px-6 py-4">
              <div className="flex items-center ">
                <div className="flex items-center space-x-4">
                  {/* Countdown Timer */}
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    <Clock className="w-4 h-4" />
                    <div className="text-white font-mono text-sm font-medium">
                      <CountdownTimer
                        initialSeconds={timeLimit - timeElapsed}
                        onExpire={onSubmit}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    size="sm"
                    onClick={onSubmit}
                    className="bg-white text-teal-600 hover:bg-gray-100 font-medium px-6 py-2 shadow-md transition-colors"
                  >
                    Submit Test
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="px-8 overflow-y-auto h-[calc(620px-70px)]">
            {(() => {
              const currentPart = question.part;
              let questionsToShow = questions.filter(q => q.part === currentPart);

              if (question.passageId) {
                const passageQuestions = questionsToShow.filter(q => q.passageId === question.passageId)
                  .sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));
                const otherQuestions = questionsToShow.filter(q => !q.passageId || q.passageId !== question.passageId);
                questionsToShow = [...passageQuestions, ...otherQuestions];
              }

              return questionsToShow.map((q, qIndex) => {
                const questionIndex = questions.findIndex(qu => qu.id === q.id);
                const isCurrentQuestion = questionIndex === currentQuestion;
                const questionAnswer = selectedAnswers[questionIndex];

                // Check if we need to show passage separator
                const isFirstInPassage = q.passageId && q.questionNumber === 1;
                const prevQuestion = qIndex > 0 ? questionsToShow[qIndex - 1] : null;
                const needsPassageSeparator = q.passageId && (!prevQuestion || prevQuestion.passageId !== q.passageId);

                return (
                  <div key={q.id}>

                    <div className={`${isCurrentQuestion ? 'bg-blue-50/30 -mx-4 px-4 rounded-lg' : ''} py-1`}>
                      {/* Question Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xl font-bold text-gray-900">
                          {questionIndex + 1}
                          <span className="ml-3 font-normal text-base text-gray-900 leading-relaxed">
                            {q.question}
                          </span>
                        </div>

                      </div>

                      {/* Question Content */}
                      <div className="mb-1 ">
                        {q.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className={`
                                flex items-start space-x-3 p-1 rounded cursor-pointer transition-colors
                                ${questionAnswer === optionIndex
                                ? "bg-teal-50 text-teal-800"
                                : "hover:bg-gray-50"
                              }
                              `}
                          >
                            <input
                              type="radio"
                              name={`question-${questionIndex}`}
                              value={optionIndex}
                              checked={questionAnswer === optionIndex}
                              onChange={() => {
                                // Update answer for this specific question immediately
                                onAnswerForQuestion(questionIndex, optionIndex);

                                // If it's not the current question, navigate to it
                                if (questionIndex !== currentQuestion) {
                                  onQuestionSelect(questionIndex);
                                }
                              }}
                              className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500 mt-0.5"
                            />
                            <div className="flex-1 flex items-start">
                              <span className="font-medium text-gray-700 mr-2 min-w-[20px]">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              <span className="text-gray-700 text-sm leading-relaxed">{option}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t p-6">
        <div className="space-y-6">
          {/* Part Circle Navigation */}

          <div className="flex justify-center space-x-8">
            {Object.entries(questionsByPart).map(([partNumber, partQuestions]) => {
              const answeredCount = partQuestions.filter((q: any) =>
                selectedAnswers[q.originalIndex] !== undefined
              ).length;
              const totalCount = partQuestions.length;
              const isCurrentPart = partQuestions.some((q: any) =>
                q.originalIndex === currentQuestion
              );

              return (
                <div key={partNumber} className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Navigate to first question of this part
                      const firstQuestionIndex = partQuestions[0].originalIndex;
                      onQuestionSelect(firstQuestionIndex);
                    }}
                    className={`
                      relative w-16 h-16 rounded-full border-4 flex items-center justify-center mb-2 cursor-pointer transition-all
                      ${isCurrentPart
                        ? "border-teal-400 bg-teal-50 hover:bg-teal-100"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="text-center">
                      <div className={`text-sm font-bold ${isCurrentPart ? "text-teal-600" : "text-gray-600"
                        }`}>
                        Part {partNumber}
                      </div>
                      <div className={`text-xs ${isCurrentPart ? "text-teal-500" : "text-gray-400"
                        }`}>
                        {answeredCount}/{totalCount}
                      </div>
                    </div>
                  </motion.button>
                  <div className={`text-xs ${isCurrentPart ? "text-teal-600 font-medium" : "text-gray-500"
                    }`}>
                    {totalCount} questions
                  </div>
                </div>
              );
            })}
          </div>

          {/* Question Numbers - Current Part Only */}
          <div className="space-y-4">
            {(() => {
              // Get questions from current part only
              const currentPart = question.part;
              const currentPartQuestions = questions.filter(q => q.part === currentPart);

              // Group current part questions by passage or individually
              const individualQuestions: any[] = [];

              currentPartQuestions.forEach((q, index) => {
                const originalIndex = questions.findIndex(qu => qu.id === q.id);
                individualQuestions.push({ ...q, originalIndex });
              });

              return (
                <>
                  <div className="flex flex-wrap justify-center gap-2">
                    {individualQuestions.map((q) => {
                      const isAnswered = selectedAnswers[q.originalIndex] !== undefined;
                      const isCurrent = q.originalIndex === currentQuestion;

                      return (
                        <motion.button
                          key={q.originalIndex}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onQuestionSelect(q.originalIndex)}
                          className={`
                              w-10 h-10 rounded text-sm font-medium transition-all
                              ${isCurrent
                              ? "bg-teal-400 text-white shadow-md border-2 border-teal-500"
                              : isAnswered
                                ? "bg-orange-400 text-white shadow-sm"
                                : "bg-gray-100 text-gray-600 border border-gray-300 hover:border-gray-400"
                            }
                            `}
                        >
                          {q.originalIndex + 1}
                        </motion.button>
                      );
                    })}
                  </div>


                </>
              );
            })()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}