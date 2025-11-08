"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft, FileText, Clock, CheckCircle2, Play } from "lucide-react";
import { Question, Group } from "../types";
import { formatTime } from "../constants";
import { CountdownTimer } from "@/components/toeic/test/CountDown";
import { AudioPlayer } from "@/components/toeic/test/Audio";
import { useStartTestPractice } from "@/api";
import { useEffect } from "react";
import { usePracticeTest } from "@/hooks";

interface TestScreenProps {
  currentGroupIndex: number;
  totalGroups: number;
  group: Group;
  allGroups: Group[]; // All groups for navigation
  allQuestions: Question[]; // Flattened questions for answer tracking
  selectedAnswers: { [key: number]: number }; // Track all answers by flat question index
  timeLimit?: number; // Time limit in seconds for countdown
  onAnswerForQuestion: (questionIndex: number, optionIndex: number) => void;
  onGroupSelect: (groupIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function TestScreen({
  currentGroupIndex,
  totalGroups,
  group,
  allGroups,
  allQuestions,
  selectedAnswers,
  timeLimit = 7200, // Default 2 hours = 7200 seconds
  onAnswerForQuestion,
  onGroupSelect,
  onNext,
  onPrevious,
  onSubmit,
  canGoNext,
  canGoPrevious,
}: TestScreenProps) {
  const progress = ((currentGroupIndex + 1) / totalGroups) * 100;
  const isLastGroup = currentGroupIndex === totalGroups - 1;


  const { fullTest } = usePracticeTest();
  console.log(fullTest);

  // Get the starting question index for this group in the flat array
  let groupStartIndex = 0;
  for (let i = 0; i < currentGroupIndex; i++) {
    groupStartIndex += allGroups[i].questions.length;
  }

  // Group all questions by part for navigation
  const questionsByPart = allQuestions.reduce((acc, q, index) => {
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
      {/* Main Content */}
      <div className="flex">
        {/* Left Panel - Instructions/Passage */}

        <div className="w-1/2 h-[620px] bg-white">
          <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-teal-50 border-b">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-lg font-semibold text-gray-800">
                Part {group.partNumber} - {group.partName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Group {currentGroupIndex + 1} of {totalGroups} • {group.questions.length} questions
              </p>
            </div>
          </div>

          <div className="h-[calc(100%-8rem)] flex flex-col overflow-hidden">
            {/* Group Info - Fixed height */}


            {/* Content Area - Smart layout based on content type */}
            <div className="flex-1 flex flex-col p-4 overflow-hidden space-y-4">
              {/* Image Display (for Part 1) */}
              {(group.partNumber <= 4) && (
                <div className="flex-shrink-0 w-full max-w-full mx-auto">
                  {group.audioUrl ? (
                    <AudioPlayer audioUrl={group.audioUrl} />
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No audio available for this group
                    </div>
                  )}
                </div>
              )}
              {group.imageUrl && (
                <div className="flex-1 flex items-center justify-center min-h-0">
                  <img
                    src={group.imageUrl}
                    alt="Question image"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg border"
                  />
                </div>
              )}

              {/* Audio Player (for Parts 1-4) - Always show for listening parts */}


              {/* Text content display for reading parts (when no image/audio) */}
              {!group.imageUrl && group.partNumber > 4 && (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Show shared content if available */}
                  {(group.paragraphEn) ? (
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-4 bg-white rounded-lg border shadow-sm">
                        {group.paragraphEn && (
                          <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line mb-4">
                            {group.paragraphEn}
                          </div>
                        )}
                        {/* {group.paragraphVn && (
                          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line bg-blue-50 p-3 rounded border-l-4 border-blue-200">
                            <strong>Vietnamese:</strong><br />
                            {group.paragraphVn}
                          </div>
                        )} */}
                      </div>
                    </div>
                  ) : (
                    /* Default instruction when no specific content */
                    <div className="flex items-center justify-center flex-1">
                      <div className="text-center p-6 bg-gray-50 rounded-lg border">
                        <div className="text-gray-600 text-sm">
                          📝 Hãy đọc và trả lời các câu hỏi bên phải
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Empty state for listening parts without image */}
              {!group.imageUrl && group.partNumber <= 4 && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-6 bg-gray-50 rounded-lg border">
                    <div className="text-gray-600 text-sm">
                      🎧 Nghe audio và trả lời các câu hỏi bên phải
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* Navigation Buttons */}
          <div className="flex px-4 justify-between gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onPrevious}
              disabled={!canGoPrevious}
            >
              ← Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onNext}
              disabled={!canGoNext}
            >
              {isLastGroup ? "Nộp bài" : "Sau →"}
            </Button>
          </div>
        </div>

        {/* Right Panel - Multiple Questions */}
        <div className="w-1/2 border-l border-gray-200 h-[620px]">
          <div className="bg-primary text-white shadow-lg w-full">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-white">
                    <div className="text-sm font-medium">Progress</div>
                    <div className="text-xs opacity-90">{Math.round(progress)}% completed</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Countdown Timer */}
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    <Clock className="w-4 h-4" />
                    <div className="text-white font-mono text-sm font-medium">
                      <CountdownTimer
                        initialSeconds={timeLimit}
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
          <div className="px-4 py-2 overflow-y-auto h-[calc(620px-70px)]">
            {(() => {
              // Show questions from current group only
              const questionsToShow = group.questions;

              return questionsToShow.map((q, qIndex) => {
                // Find the flat question index for this question
                const questionIndex = groupStartIndex + qIndex;
                const questionAnswer = selectedAnswers[questionIndex];

                return (
                  <div key={q.id} className="mb-4">
                    <div className="py-1">
                      {/* Question Header */}
                      <div className="flex items-start mb-2">
                        <div className="text-lg font-bold text-gray-900 flex-1">
                          <span className="text-teal-600">{questionIndex + 1}.</span>
                          <span className="ml-2 font-normal text-sm text-gray-900 leading-relaxed">
                            {q.question}
                          </span>
                        </div>
                      </div>

                      {/* Question Content */}
                      <div className="mb-3">
                        {q.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className={`
                                flex items-start space-x-2 p-2 rounded cursor-pointer transition-colors mb-1
                                ${questionAnswer === optionIndex
                                ? "bg-teal-50 text-teal-800 border border-teal-200"
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
                              }}
                              className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500 mt-0.5 flex-shrink-0"
                            />
                            <div className="flex-1 flex items-start min-w-0">
                              <span className="font-medium text-gray-700 mr-2 flex-shrink-0">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              <span className="text-gray-700 text-sm leading-relaxed break-words">{option}</span>
                            </div>
                          </label>
                        ))}
                      </div>

                      {/* Show explanation if question is answered */}
                      {questionAnswer !== undefined && q.explanation && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="text-xs font-medium text-blue-800 mb-1">💡 Giải thích:</div>
                          <div className="text-xs text-blue-700 leading-relaxed break-words">{q.explanation}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t p-4 bg-white">
        <div className="space-y-4">
          {/* Part Navigation */}
          <div className="flex justify-center space-x-4 overflow-x-auto pb-2">
            {Object.entries(questionsByPart).map(([partNumber, partQuestions]) => {
              const answeredCount = partQuestions.filter((q: any) =>
                selectedAnswers[q.originalIndex] !== undefined
              ).length;
              const totalCount = partQuestions.length;
              const isCurrentPart = parseInt(partNumber) === group.partNumber;

              return (
                <div key={partNumber} className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Navigate to first group of this part
                      const firstQuestionOfPart = partQuestions[0];
                      if (firstQuestionOfPart) {
                        // Find which group contains this question
                        const targetGroupIndex = allGroups.findIndex(g =>
                          g.questions.some(q => q.id === firstQuestionOfPart.id)
                        );
                        if (targetGroupIndex !== -1) {
                          onGroupSelect(targetGroupIndex);
                        }
                      }
                    }}
                    className={`
                      relative w-14 h-14 rounded-full border-3 flex items-center justify-center mb-1 cursor-pointer transition-all flex-shrink-0
                      ${isCurrentPart
                        ? "border-teal-400 bg-teal-50 hover:bg-teal-100"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="text-center">
                      <div className={`text-xs font-bold ${isCurrentPart ? "text-teal-600" : "text-gray-600"}`}>
                        P{partNumber}
                      </div>
                      <div className={`text-xs ${isCurrentPart ? "text-teal-500" : "text-gray-400"}`}>
                        {answeredCount}/{totalCount}
                      </div>
                    </div>
                  </motion.button>
                  <div className={`text-xs ${isCurrentPart ? "text-teal-600 font-medium" : "text-gray-500"} truncate`}>
                    Part {partNumber}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Question Numbers - Current Part Only */}
          <div className="space-y-2">
            <div className="flex flex-wrap justify-center gap-1 max-h-20">
              {(() => {
                // Filter questions from current part only
                const currentPartQuestions = allQuestions.filter(q => q.part === group.partNumber);

                return currentPartQuestions.map((q) => {
                  // Find the original index in allQuestions
                  const questionIndex = allQuestions.findIndex(aq => aq.id === q.id);
                  const isAnswered = selectedAnswers[questionIndex] !== undefined;
                  const isCurrentGroupQuestion = q.groupId === group.id;

                  // Debug log
                  console.log(`Question ${q.id}: questionNumber = ${q.questionNumber}, part = ${q.part}`);

                  return (
                    <motion.button
                      key={q.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        // Find which group contains this question
                        const targetGroupIndex = allGroups.findIndex(g =>
                          g.questions.some(gq => gq.id === q.id)
                        );
                        if (targetGroupIndex !== -1) {
                          onGroupSelect(targetGroupIndex);
                        }
                      }}
                      className={`
                        w-8 h-8 rounded text-xs font-medium transition-all cursor-pointer flex-shrink-0
                        ${isCurrentGroupQuestion
                          ? "bg-teal-400 text-white shadow-md border-2 border-teal-500"
                          : isAnswered
                            ? "bg-orange-400 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 border border-gray-300 hover:border-gray-400"
                        }
                      `}
                    >
                      {q.questionNumber}
                    </motion.button>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}