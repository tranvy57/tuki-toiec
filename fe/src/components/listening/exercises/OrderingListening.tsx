"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, GripVertical, RotateCcw } from "lucide-react";
import ListeningExerciseLayout from "./ListeningExerciseLayout";

interface OrderingSentence {
  id: string;
  text: string;
  correctPosition: number; // 0-based index
}

interface OrderingQuestion {
  id: string;
  audioUrl: string;
  instructions: string;
  sentences: OrderingSentence[];
  explanation?: string;
}

interface OrderingListeningProps {
  questions: OrderingQuestion[];
  currentQuestionIndex: number;
  onAnswer: (questionId: string, orderedSentenceIds: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  totalQuestions: number;
  streakCount?: number;
}

export default function OrderingListening({
  questions,
  currentQuestionIndex,
  onAnswer,
  onNext,
  onBack,
  totalQuestions,
  streakCount = 0,
}: OrderingListeningProps) {
  const [orderedSentences, setOrderedSentences] = useState<OrderingSentence[]>(
    []
  );
  const [isChecked, setIsChecked] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [initialOrder, setInitialOrder] = useState<OrderingSentence[]>([]);

  const currentQuestion = questions[currentQuestionIndex];

  // Initialize shuffled sentences on question change
  useEffect(() => {
    if (currentQuestion) {
      const shuffled = [...currentQuestion.sentences].sort(
        () => Math.random() - 0.5
      );
      setOrderedSentences(shuffled);
      setInitialOrder(shuffled);
      setIsChecked(false);
      setResults({});
    }
  }, [currentQuestion]);

  if (!currentQuestion) return null;

  const handleCheckOrder = () => {
    if (isChecked) return;

    const newResults: Record<string, boolean> = {};
    let correctCount = 0;

    orderedSentences.forEach((sentence, index) => {
      const isCorrect = sentence.correctPosition === index;
      newResults[sentence.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setResults(newResults);
    setIsChecked(true);

    onAnswer(
      currentQuestion.id,
      orderedSentences.map((s) => s.id)
    );
  };

  const handleReset = () => {
    if (isChecked) return;
    setOrderedSentences([...initialOrder]);
  };

  const handleNextQuestion = () => {
    setOrderedSentences([]);
    setIsChecked(false);
    setResults({});
    setInitialOrder([]);
    onNext();
  };

  const correctCount = Object.values(results).filter(Boolean).length;
  const totalSentences = currentQuestion.sentences.length;
  const accuracy =
    totalSentences > 0 ? (correctCount / totalSentences) * 100 : 0;

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const feedback = isChecked
    ? {
        type:
          accuracy >= 80
            ? ("correct" as const)
            : accuracy >= 50
            ? ("partial" as const)
            : ("incorrect" as const),
        message:
          accuracy >= 80
            ? "Hoàn hảo! 🎉"
            : accuracy >= 50
            ? "Khá tốt! 👍"
            : "Hãy nghe lại và thử lại! 💪",
        explanation:
          currentQuestion.explanation ||
          `Bạn đã sắp xếp đúng ${correctCount}/${totalSentences} câu (${Math.round(
            accuracy
          )}%)`,
      }
    : undefined;

  return (
    <ListeningExerciseLayout
      title="Sentence Ordering"
      currentQuestion={currentQuestionIndex + 1}
      totalQuestions={totalQuestions}
      onBack={onBack}
      audioUrl={currentQuestion.audioUrl}
      progress={progress}
      streakCount={streakCount}
      feedback={feedback}
      actions={{
        primary: isChecked
          ? {
              label:
                currentQuestionIndex === totalQuestions - 1
                  ? "Hoàn thành"
                  : "Câu tiếp theo",
              onClick: handleNextQuestion,
            }
          : {
              label: "Kiểm tra thứ tự",
              onClick: handleCheckOrder,
              disabled: orderedSentences.length === 0,
            },
        secondary: isChecked
          ? undefined
          : {
              label: "Đặt lại",
              onClick: handleReset,
              icon: <RotateCcw className="h-4 w-4 mr-2" />,
            },
      }}
    >
      <div className="space-y-6">
        {/* Instructions */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Sắp xếp câu theo thứ tự đúng
          </h2>
          <p className="text-slate-600 mb-4">{currentQuestion.instructions}</p>
          <p className="text-sm text-slate-500">
            Kéo và thả để sắp xếp lại các câu theo thứ tự bạn nghe được
          </p>
        </div>

        {/* Draggable Sentences */}
        <div className="space-y-3">
          {!isChecked ? (
            <Reorder.Group
              axis="y"
              values={orderedSentences}
              onReorder={setOrderedSentences}
              className="space-y-3"
            >
              {orderedSentences.map((sentence, index) => (
                <Reorder.Item
                  key={sentence.id}
                  value={sentence}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <motion.div
                    layout
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group"
                  >
                    <Card className="border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Position Number */}
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                            {index + 1}
                          </div>

                          {/* Sentence Text */}
                          <p className="flex-1 text-slate-700 font-medium">
                            {sentence.text}
                          </p>

                          {/* Drag Handle */}
                          <GripVertical className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            // Show results after checking
            <div className="space-y-3">
              {orderedSentences.map((sentence, index) => {
                const isCorrect = results[sentence.id];
                const shouldBeAt = sentence.correctPosition;

                return (
                  <motion.div
                    key={sentence.id}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`border-2 transition-all duration-300 ${
                        isCorrect
                          ? "border-green-500 bg-green-50 shadow-lg"
                          : "border-red-500 bg-red-50 shadow-lg"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Position Number */}
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                              isCorrect
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {index + 1}
                          </div>

                          {/* Sentence Text */}
                          <p
                            className={`flex-1 font-medium ${
                              isCorrect ? "text-green-800" : "text-red-800"
                            }`}
                          >
                            {sentence.text}
                          </p>

                          {/* Result Icon and Correction */}
                          <div className="flex items-center gap-2">
                            {!isCorrect && (
                              <Badge
                                variant="outline"
                                className="bg-white text-slate-600"
                              >
                                Đúng: {shouldBeAt + 1}
                              </Badge>
                            )}
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Correct Order Preview (after checking) */}
        {isChecked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-slate-50/50 border-slate-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-800 mb-3">
                  Thứ tự đúng:
                </h3>
                <div className="space-y-2">
                  {currentQuestion.sentences
                    .sort((a, b) => a.correctPosition - b.correctPosition)
                    .map((sentence, index) => (
                      <div
                        key={sentence.id}
                        className="flex items-center gap-3"
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-slate-700">{sentence.text}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Summary */}
        {isChecked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center gap-4 text-sm">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Đúng vị trí: {correctCount}
              </Badge>
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200"
              >
                Sai vị trí: {totalSentences - correctCount}
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Độ chính xác: {Math.round(accuracy)}%
              </Badge>
            </div>
          </motion.div>
        )}

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
