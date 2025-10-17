"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  XCircle,
  Volume2,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  FileText,
} from "lucide-react";
import { AudioPlayer } from "@/components/toeic/test/Audio";
// Safe HTML rendering utility
const sanitizeHTML = (html: string) => {
  // Simple HTML sanitization - in production, consider using a proper sanitization library
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
};

interface MCQItemProps {
  item: {
    id: string;
    difficulty?: string;
    bandHint?: number;
    prompt: {
      text: string;
      choices: { content: string; answer_key: string }[];
      audio_url?: string | null;
      explanation?: string;
      transcript?: string;
    };
    solution: { correct_keys: string[] };
  };
  onAnswer?: (answerKey: string, isCorrect: boolean) => void;
  showResult?: boolean;
  disabled?: boolean;
}

interface FeedbackState {
  type: "correct" | "incorrect";
  selectedKey: string;
  correctKeys: string[];
  message: string;
}

export default function MCQItem({
  item,
  onAnswer,
  showResult = false,
  disabled = false,
}: MCQItemProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Audio controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const { prompt, solution } = item;
  const hasAudio = Boolean(prompt.audio_url);
  const hasTranscript = Boolean(prompt.explanation);
  const hasExplanation = Boolean(prompt.explanation);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (isAnswered || disabled) return;

      const choices = prompt.choices;
      const currentIndex = choices.findIndex(
        (choice) => choice.answer_key === selectedOption
      );

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          const nextIndex =
            currentIndex < choices.length - 1 ? currentIndex + 1 : 0;
          setSelectedOption(choices[nextIndex].answer_key);
          break;

        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          const prevIndex =
            currentIndex > 0 ? currentIndex - 1 : choices.length - 1;
          setSelectedOption(choices[prevIndex].answer_key);
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          if (selectedOption && !isAnswered) {
            handleSubmitAnswer();
          }
          break;

        case "1":
        case "2":
        case "3":
        case "4":
          e.preventDefault();
          const keyIndex = parseInt(e.key) - 1;
          if (keyIndex < choices.length) {
            setSelectedOption(choices[keyIndex].answer_key);
          }
          break;
      }
    };

    const element = optionsRef.current;
    if (element) {
      element.addEventListener("keydown", handleKeyDown as any);
      return () => element.removeEventListener("keydown", handleKeyDown as any);
    }
  }, [selectedOption, isAnswered, disabled, prompt.choices]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const replayAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();
  };

  const handleOptionSelect = (answerKey: string) => {
    if (isAnswered || disabled) return;
    setSelectedOption(answerKey);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswered || disabled) return;

    const isCorrect = solution.correct_keys.includes(selectedOption);
    const newFeedback: FeedbackState = {
      type: isCorrect ? "correct" : "incorrect",
      selectedKey: selectedOption,
      correctKeys: solution.correct_keys,
      message: isCorrect
        ? "Chính xác! 🎉"
        : "Chưa đúng. Đáp án đúng được tô sáng bên dưới.",
    };

    setIsAnswered(true);
    setFeedback(newFeedback);
    setShowExplanation(hasExplanation);

    onAnswer?.(selectedOption, isCorrect);
  };

  const resetQuestion = () => {
    setSelectedOption("");
    setIsAnswered(false);
    setFeedback(null);
    setShowTranscript(false);
    setShowExplanation(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getOptionStatus = (answerKey: string) => {
    if (!isAnswered) {
      return selectedOption === answerKey ? "selected" : "default";
    }

    if (solution.correct_keys.includes(answerKey)) {
      return "correct";
    }

    if (
      selectedOption === answerKey &&
      !solution.correct_keys.includes(answerKey)
    ) {
      return "incorrect";
    }

    return "disabled";
  };

  const getOptionStyles = (status: string) => {
    const baseStyles =
      "flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300";

    switch (status) {
      case "selected":
        return `${baseStyles} border-blue-500 bg-blue-50 shadow-md cursor-pointer`;
      case "correct":
        return `${baseStyles} border-green-500 bg-green-50 shadow-lg cursor-default`;
      case "incorrect":
        return `${baseStyles} border-red-500 bg-red-50 shadow-lg cursor-default`;
      case "disabled":
        return `${baseStyles} border-gray-200 bg-gray-50 cursor-default opacity-60`;
      default:
        return `${baseStyles} border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 cursor-pointer`;
    }
  };

  const getBadgeStyles = (status: string) => {
    const baseStyles =
      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold";

    switch (status) {
      case "selected":
        return `${baseStyles} bg-blue-500 text-white`;
      case "correct":
        return `${baseStyles} bg-green-500 text-white`;
      case "incorrect":
        return `${baseStyles} bg-red-500 text-white`;
      case "disabled":
        return `${baseStyles} bg-gray-100 text-gray-400`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-600`;
    }
  };

  const getTextStyles = (status: string) => {
    switch (status) {
      case "correct":
        return "text-green-800 font-medium";
      case "incorrect":
        return "text-red-800 font-medium";
      case "disabled":
        return "text-gray-500";
      default:
        return "text-gray-700";
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 bg-white">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <CardTitle className="text-lg font-semibold text-gray-800 leading-relaxed">
            {prompt.text}
          </CardTitle>

          <div className="flex items-center gap-2 flex-shrink-0">
            {item.difficulty && (
              <Badge
                variant="outline"
                className={`text-xs ${getDifficultyColor(item.difficulty)}`}
              >
                {item.difficulty.toUpperCase()}
              </Badge>
            )}
            {item.bandHint && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
              >
                Band {item.bandHint}
              </Badge>
            )}
          </div>
        </div>

        {/* Audio Controls */}
        {hasAudio && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 w-full border border-blue-100">
            <AudioPlayer audioUrl={prompt.audio_url || ""} />

            <div className="flex items-center justify-between gap-4">
              {duration > 0 && (
                <div className="text-xs text-gray-600 font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              )}
            </div>

            {/* Audio Progress */}
            {duration > 0 && (
              <div className="mt-2 w-full bg-blue-100 rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all duration-100"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Transcript */}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Answer Options */}
        <div
          ref={optionsRef}
          tabIndex={0}
          className="space-y-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-2"
          role="radiogroup"
          aria-label="Answer choices"
        >
          <RadioGroup
            value={selectedOption}
            onValueChange={handleOptionSelect}
            disabled={isAnswered || disabled}
          >
            {prompt.choices.map((choice, index) => {
              const status = getOptionStatus(choice.answer_key);

              return (
                <motion.div
                  key={choice.answer_key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className={getOptionStyles(status)}>
                    <RadioGroupItem
                      value={choice.answer_key}
                      id={choice.answer_key}
                      className="sr-only"
                      disabled={isAnswered || disabled}
                    />

                    <Label
                      htmlFor={choice.answer_key}
                      className="flex items-center space-x-4 w-full cursor-inherit"
                    >
                      {/* Option Letter */}
                      <div className={getBadgeStyles(status)}>
                        {choice.answer_key}
                      </div>

                      {/* Option Content */}
                      <span
                        className={`flex-1 text-sm ${getTextStyles(status)}`}
                      >
                        {choice.content}
                      </span>

                      {/* Result Icons */}
                      <AnimatePresence>
                        {status === "correct" && (
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
                        {status === "incorrect" && (
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
        </div>

        {/* Feedback Message */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`p-4 rounded-lg border ${
                  feedback.type === "correct"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {feedback.type === "correct" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">{feedback.message}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && hasExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Volume2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Explanation
                    </span>
                  </div>
                  <div
                    className="text-sm text-blue-700 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(prompt.explanation || ""),
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-xs text-gray-500">
            Press 1-4 to select, Enter to confirm, arrows to navigate
          </div>

          <div className="flex items-center gap-2">
            {isAnswered && (
              <Button
                onClick={resetQuestion}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Try Again
              </Button>
            )}

            {!isAnswered && (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption || disabled}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="sm"
              >
                Check Answer
              </Button>
            )}
          </div>
        </div>

        {/* Hidden Audio Element */}
        {/* {hasAudio && (
          <AudioPlayer audioUrl={prompt.audio_url || "" } />
        )} */}
      </CardContent>
    </Card>
  );
}
