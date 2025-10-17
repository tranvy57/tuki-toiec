"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Volume2 } from "lucide-react";
import ListeningExerciseLayout from "./ListeningExerciseLayout";

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MCQQuestion {
  id: string;
  audioUrl: string;
  questionText: string;
  options: MCQOption[];
  explanation?: string;
  transcript?: string;
}

interface MultipleChoiceListeningProps {
  questions: MCQQuestion[];
  currentQuestionIndex: number;
  onAnswer: (questionId: string, selectedOptionId: string) => void;
  onNext: () => void;
  onBack: () => void;
  totalQuestions: number;
  streakCount?: number;
}

export default function MultipleChoiceListening({
  questions,
  currentQuestionIndex,
  onAnswer,
  onNext,
  onBack,
  totalQuestions,
  streakCount = 0,
}: MultipleChoiceListeningProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "correct" | "incorrect";
    message: string;
    explanation?: string;
  } | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return null;

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswered) return;

    const selectedOptionData = currentQuestion.options.find(
      (opt) => opt.id === selectedOption
    );
    const isCorrect = selectedOptionData?.isCorrect || false;

    setIsAnswered(true);
    setShowExplanation(true);

    setFeedback({
      type: isCorrect ? "correct" : "incorrect",
      message: isCorrect ? "Chính xác! 🎉" : "Chưa đúng, hãy thử lại!",
      explanation: currentQuestion.explanation,
    });

    onAnswer(currentQuestion.id, selectedOption);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setFeedback(null);
    onNext();
  };

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <ListeningExerciseLayout
      title="Multiple Choice Listening"
      currentQuestion={currentQuestionIndex + 1}
      totalQuestions={totalQuestions}
      onBack={onBack}
      audioUrl={currentQuestion.audioUrl}
      progress={progress}
      streakCount={streakCount}
      feedback={feedback || undefined}
      actions={{
        primary: isAnswered
          ? {
              label:
                currentQuestionIndex === totalQuestions - 1
                  ? "Hoàn thành"
                  : "Câu tiếp theo",
              onClick: handleNextQuestion,
            }
          : {
              label: "Xác nhận đáp án",
              onClick: handleSubmitAnswer,
              disabled: !selectedOption,
            },
      }}
    >
      <div className="space-y-6">
        {/* Question Text */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            {currentQuestion.questionText}
          </h2>
          <p className="text-slate-600">
            Nghe audio và chọn câu trả lời đúng nhất
          </p>
        </div>

        {/* Answer Options */}
        <RadioGroup
          value={selectedOption || ""}
          onValueChange={handleOptionSelect}
          className="space-y-3"
        >
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === option.id;
            const isCorrect = option.isCorrect;
            const showCorrect = isAnswered && isCorrect;
            const showIncorrect = isAnswered && isSelected && !isCorrect;

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div
                  className={`relative transition-all duration-300 ${
                    isAnswered ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="peer sr-only"
                    disabled={isAnswered}
                  />
                  <Label
                    htmlFor={option.id}
                    className={`
                      flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300
                      ${
                        !isAnswered && isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }
                      ${
                        showCorrect
                          ? "border-green-500 bg-green-50 shadow-lg"
                          : ""
                      }
                      ${
                        showIncorrect
                          ? "border-red-500 bg-red-50 shadow-lg"
                          : ""
                      }
                      ${isAnswered ? "cursor-default" : "cursor-pointer"}
                    `}
                  >
                    {/* Option Letter */}
                    <div
                      className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold
                      ${
                        !isAnswered && isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-slate-100 text-slate-600"
                      }
                      ${showCorrect ? "bg-green-500 text-white" : ""}
                      ${showIncorrect ? "bg-red-500 text-white" : ""}
                    `}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>

                    {/* Option Text */}
                    <span
                      className={`
                      flex-1 text-sm font-medium
                      ${showCorrect ? "text-green-800" : ""}
                      ${showIncorrect ? "text-red-800" : ""}
                      ${!isAnswered ? "text-slate-700" : ""}
                    `}
                    >
                      {option.text}
                    </span>

                    {/* Result Icons */}
                    <AnimatePresence>
                      {showCorrect && (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        >
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </motion.div>
                      )}
                      {showIncorrect && (
                        <motion.div
                          initial={{ scale: 0, rotate: 90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        >
                          <XCircle className="h-5 w-5 text-red-600" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Label>
                </div>
              </motion.div>
            );
          })}
        </RadioGroup>

        {/* Transcript (shown after answering) */}
        <AnimatePresence>
          {isAnswered && currentQuestion.transcript && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-slate-50/50 border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Transcript
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {currentQuestion.transcript}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 pt-4">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < currentQuestionIndex
                  ? "bg-green-500"
                  : i === currentQuestionIndex
                  ? "bg-blue-500 w-6"
                  : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </ListeningExerciseLayout>
  );
}
