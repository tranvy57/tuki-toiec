"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Volume2,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import ListeningExerciseLayout from "./ListeningExerciseLayout";

interface DictationQuestion {
  id: string;
  audioUrl: string;
  correctText: string;
  instructions?: string;
  hint?: string;
  maxReplays?: number;
  allowSlowPlayback?: boolean;
}

interface DictationProps {
  questions: DictationQuestion[];
  currentQuestionIndex: number;
  onAnswer: (questionId: string, userText: string) => void;
  onNext: () => void;
  onBack: () => void;
  totalQuestions: number;
  streakCount?: number;
}

interface WordDiff {
  word: string;
  type: "correct" | "incorrect" | "missing" | "extra";
  correctWord?: string;
}

export default function Dictation({
  questions,
  currentQuestionIndex,
  onAnswer,
  onNext,
  onBack,
  totalQuestions,
  streakCount = 0,
}: DictationProps) {
  const [userText, setUserText] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [wordDiffs, setWordDiffs] = useState<WordDiff[]>([]);
  const [showCorrectText, setShowCorrectText] = useState(false);
  const [replayCount, setReplayCount] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return null;

  const maxReplays = currentQuestion.maxReplays || 3;

  const analyzeText = (userInput: string, correctText: string): WordDiff[] => {
    const userWords = userInput
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const correctWords = correctText.toLowerCase().trim().split(/\s+/);

    const diffs: WordDiff[] = [];
    const maxLength = Math.max(userWords.length, correctWords.length);

    for (let i = 0; i < maxLength; i++) {
      const userWord = userWords[i] || "";
      const correctWord = correctWords[i] || "";

      if (!userWord && correctWord) {
        // Missing word
        diffs.push({
          word: "[missing]",
          type: "missing",
          correctWord: correctWord,
        });
      } else if (userWord && !correctWord) {
        // Extra word
        diffs.push({
          word: userWord,
          type: "extra",
        });
      } else if (userWord === correctWord) {
        // Correct word
        diffs.push({
          word: userWord,
          type: "correct",
        });
      } else {
        // Incorrect word
        diffs.push({
          word: userWord,
          type: "incorrect",
          correctWord: correctWord,
        });
      }
    }

    return diffs;
  };

  const handleCheckAnswer = () => {
    if (isChecked) return;

    const diffs = analyzeText(userText, currentQuestion.correctText);
    setWordDiffs(diffs);
    setIsChecked(true);
    onAnswer(currentQuestion.id, userText);
  };

  const handleClearText = () => {
    if (isChecked) return;
    setUserText("");
  };

  const handleNextQuestion = () => {
    setUserText("");
    setIsChecked(false);
    setWordDiffs([]);
    setShowCorrectText(false);
    setReplayCount(0);
    onNext();
  };

  const calculateAccuracy = (): number => {
    if (wordDiffs.length === 0) return 0;
    const correctWords = wordDiffs.filter(
      (diff) => diff.type === "correct"
    ).length;
    const totalCorrectWords = currentQuestion.correctText.split(/\s+/).length;
    return totalCorrectWords > 0 ? (correctWords / totalCorrectWords) * 100 : 0;
  };

  const accuracy = calculateAccuracy();
  const correctCount = wordDiffs.filter(
    (diff) => diff.type === "correct"
  ).length;
  const totalWords = currentQuestion.correctText.split(/\s+/).length;

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const feedback = isChecked
    ? {
        type:
          accuracy >= 90
            ? ("correct" as const)
            : accuracy >= 60
            ? ("partial" as const)
            : ("incorrect" as const),
        message:
          accuracy >= 90
            ? "Xuất sắc! 🎉"
            : accuracy >= 60
            ? "Khá tốt! 👍"
            : "Hãy nghe lại và thử lại! 💪",
        explanation: `Bạn đã viết đúng ${correctCount}/${totalWords} từ (${Math.round(
          accuracy
        )}%)`,
      }
    : undefined;

  return (
    <ListeningExerciseLayout
      title="Dictation Exercise"
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
              label: "Kiểm tra đáp án",
              onClick: handleCheckAnswer,
              disabled: userText.trim().length === 0,
            },
        secondary: isChecked
          ? {
              label: showCorrectText ? "Ẩn đáp án" : "Xem đáp án",
              onClick: () => setShowCorrectText(!showCorrectText),
              icon: showCorrectText ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              ),
            }
          : {
              label: "Xóa text",
              onClick: handleClearText,
              icon: <RotateCcw className="h-4 w-4 mr-2" />,
            },
      }}
    >
      <div className="space-y-6">
        {/* Instructions */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Chính tả nghe
          </h2>
          <p className="text-slate-600 mb-2">
            {currentQuestion.instructions ||
              "Nghe audio và gõ lại chính xác những gì bạn nghe được"}
          </p>
          <p className="text-sm text-slate-500">
            Bạn có thể phát lại tối đa {maxReplays} lần
          </p>
        </div>

        {/* Text Input Area */}
        <Card className="bg-slate-50/50 border-slate-200">
          <CardContent className="p-6">
            {!isChecked ? (
              <Textarea
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Gõ những gì bạn nghe được..."
                className="w-full min-h-32 text-lg leading-relaxed resize-none border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                disabled={isChecked}
              />
            ) : (
              <div className="space-y-4">
                {/* User Input with Differences */}
                <div className="min-h-32 p-4 border-2 border-slate-200 rounded-lg bg-white">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Văn bản của bạn:
                  </p>
                  <div className="text-lg leading-relaxed flex flex-wrap gap-1">
                    {wordDiffs.map((diff, index) => (
                      <span
                        key={index}
                        className={`px-1 rounded ${
                          diff.type === "correct"
                            ? "bg-green-100 text-green-800"
                            : diff.type === "incorrect"
                            ? "bg-red-100 text-red-800 line-through"
                            : diff.type === "missing"
                            ? "bg-amber-100 text-amber-800 italic"
                            : "bg-orange-100 text-orange-800"
                        }`}
                        title={
                          diff.type === "incorrect"
                            ? `Đúng: ${diff.correctWord}`
                            : diff.type === "missing"
                            ? `Thiếu: ${diff.correctWord}`
                            : diff.type === "extra"
                            ? "Từ thừa"
                            : ""
                        }
                      >
                        {diff.word}
                        {diff.type === "incorrect" && diff.correctWord && (
                          <span className="ml-1 text-green-600 no-underline">
                            → {diff.correctWord}
                          </span>
                        )}
                        {diff.type === "missing" && (
                          <span className="text-amber-600">
                            {diff.correctWord}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-100 rounded"></div>
                    <span className="text-slate-600">Đúng</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-100 rounded"></div>
                    <span className="text-slate-600">Sai</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-amber-100 rounded"></div>
                    <span className="text-slate-600">Thiếu</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-100 rounded"></div>
                    <span className="text-slate-600">Thừa</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hint */}
        {currentQuestion.hint && !isChecked && (
          <Card className="bg-blue-50/50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-blue-800">
                  💡 Gợi ý
                </span>
              </div>
              <p className="text-sm text-blue-700">{currentQuestion.hint}</p>
            </CardContent>
          </Card>
        )}

        {/* Correct Text (shown after checking) */}
        <AnimatePresence>
          {showCorrectText && isChecked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-green-50/50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Đáp án đúng
                    </span>
                  </div>
                  <p className="text-green-700 leading-relaxed">
                    {currentQuestion.correctText}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

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
                Đúng: {correctCount}
              </Badge>
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200"
              >
                Sai: {wordDiffs.filter((d) => d.type === "incorrect").length}
              </Badge>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                Thiếu: {wordDiffs.filter((d) => d.type === "missing").length}
              </Badge>
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-200"
              >
                Thừa: {wordDiffs.filter((d) => d.type === "extra").length}
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
