"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Volume2,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { AudioPlayer } from "@/components/toeic/test/Audio";

interface DictationItem {
  id: string;
  modality: "dictation";
  difficulty: "easy" | "medium" | "hard";
  bandHint: number;
  prompt: {
    audio_url: string;
  };
  solution: {
    transcript: string;
  };
  rubric: {
    criteria: string[];
  };
}

interface DictationPracticePageProps {
  item: DictationItem;
  itemIndex?: number;
  totalItems?: number;
  currentIndex?: number;
  setCurrentIndex?: (index: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

interface WordComparison {
  word: string;
  isCorrect: boolean;
  userWord?: string;
}

export default function DictationPracticePage({
  item,
  itemIndex = 1,
  totalItems = 25,
  currentIndex = 0,
  setCurrentIndex = () => {},
  onNext,
  onPrevious,
}: DictationPracticePageProps) {
  const [userInput, setUserInput] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [wordComparison, setWordComparison] = useState<WordComparison[]>([]);
  const [score, setScore] = useState<number>(0);

  // Reset state when item changes
  useEffect(() => {
    setUserInput("");
    setShowTranscript(false);
    setIsChecked(false);
    setWordComparison([]);
    setScore(0);
  }, [item.id]);

  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();
  };

  const compareWords = (
    userText: string,
    correctText: string
  ): WordComparison[] => {
    const userWords = normalizeText(userText)
      .split(" ")
      .filter((word) => word.length > 0);
    const correctWords = normalizeText(correctText)
      .split(" ")
      .filter((word) => word.length > 0);

    const comparison: WordComparison[] = [];
    const maxLength = Math.max(userWords.length, correctWords.length);

    for (let i = 0; i < maxLength; i++) {
      const userWord = userWords[i] || "";
      const correctWord = correctWords[i] || "";

      comparison.push({
        word: correctWord || userWord,
        isCorrect: userWord === correctWord && correctWord !== "",
        userWord: userWord !== correctWord ? userWord : undefined,
      });
    }

    return comparison;
  };

  const calculateScore = (comparison: WordComparison[]): number => {
    const correctWords = comparison.filter((item) => item.isCorrect).length;
    const totalWords = comparison.filter((item) => item.word).length;
    return totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
  };

  const getScoreMessage = (
    score: number
  ): { message: string; color: string; icon: React.ReactNode } => {
    if (score >= 90) {
      return {
        message: "Excellent! Outstanding accuracy!",
        color: "text-emerald-600",
        icon: <Award className="w-5 h-5 text-emerald-600" />,
      };
    } else if (score >= 75) {
      return {
        message: "Good job! Well done!",
        color: "text-blue-600",
        icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      };
    } else if (score >= 60) {
      return {
        message: "Not bad, but room for improvement.",
        color: "text-yellow-600",
        icon: <Target className="w-5 h-5 text-yellow-600" />,
      };
    } else {
      return {
        message: "Keep practicing! You'll get better.",
        color: "text-orange-600",
        icon: <BookOpen className="w-5 h-5 text-orange-600" />,
      };
    }
  };

  const handleCheckAnswer = () => {
    if (!userInput.trim()) return;

    const comparison = compareWords(userInput, item.solution.transcript);
    const calculatedScore = calculateScore(comparison);

    setWordComparison(comparison);
    setScore(calculatedScore);
    setIsChecked(true);
  };

  const handleToggleTranscript = () => {
    setShowTranscript(!showTranscript);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const scoreMessage = getScoreMessage(score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                TOEIC Dictation Practice
              </h1>
              <p className="text-gray-600">
                Listen carefully and type what you hear
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              {itemIndex}/{totalItems}
            </Badge>
            <Badge
              variant="outline"
              className={`text-sm border ${getDifficultyColor(
                item.difficulty
              )}`}
            >
              {item.difficulty.charAt(0).toUpperCase() +
                item.difficulty.slice(1)}
            </Badge>
            <Badge
              variant="outline"
              className="text-sm bg-purple-100 text-purple-800 border-purple-200"
            >
              Band {item.bandHint}
            </Badge>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg text-gray-800">
                Listen to the audio and type the exact words you hear
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Audio Player */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4"
              >
                <AudioPlayer audioUrl={item.prompt.audio_url} />
              </motion.div>

              {/* Input Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <label
                  htmlFor="dictation-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your transcription:
                </label>
                <Textarea
                  id="dictation-input"
                  placeholder="Type what you hear..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[120px] text-base resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isChecked}
                />
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3 justify-center"
              >
                <Button
                  onClick={handleCheckAnswer}
                  disabled={!userInput.trim() || isChecked}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check Answer
                </Button>

                <Button
                  onClick={handleToggleTranscript}
                  variant="outline"
                  className="px-6 border-gray-300 hover:bg-gray-50"
                >
                  {showTranscript ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide Transcript
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Show Transcript
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Results Section */}
              <AnimatePresence>
                {isChecked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    {/* Score */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {scoreMessage.icon}
                        <span
                          className={`text-lg font-semibold ${scoreMessage.color}`}
                        >
                          Score: {score}%
                        </span>
                      </div>
                      <p className={`text-sm ${scoreMessage.color}`}>
                        {scoreMessage.message}
                      </p>
                    </div>

                    {/* Word-by-Word Comparison */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Word Comparison:
                      </h3>
                      <div className="flex flex-wrap gap-1 text-sm leading-relaxed">
                        {wordComparison.map((item, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded transition-colors ${
                              item.isCorrect
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                            title={
                              item.userWord
                                ? `Your input: "${item.userWord}"`
                                : undefined
                            }
                          >
                            {item.word || "(missing)"}
                          </span>
                        ))}
                      </div>

                      {/* Rubric Criteria */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">
                          Evaluated on:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.rubric.criteria.map((criterion, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {criterion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Transcript Section */}
              <AnimatePresence>
                {showTranscript && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Correct Transcript
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-blue-900 leading-relaxed">
                          {item.solution.transcript}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  onClick={onPrevious}
                  disabled={currentIndex === 0}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalItems }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        i === currentIndex
                          ? "bg-blue-500 scale-125"
                          : i < currentIndex
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <Button onClick={onNext} className="flex items-center gap-2">
                  {currentIndex === totalItems - 1 ? "Finish" : "Next"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
