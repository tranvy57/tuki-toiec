"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  Trophy,
  Headphones,
  Play,
} from "lucide-react";
import ClozeListeningQuestion from "./ClozeListeningQuestion";
import { useItems } from "@/api/useItems";

// Demo questions with progressive difficulty

interface ClozeDemoPageProps {
  onBack: () => void;
}

export default function ClozeDemoPage({ onBack }: ClozeDemoPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [scores, setScores] = useState<{ [key: number]: boolean }>({});
  const [showSummary, setShowSummary] = useState(false);
  const { data, isLoading, isError, error } = useItems();

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayCount, setReplayCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const maxReplays = 3;

  console.log(data);

  const currentQuestion = data?.items?.[currentQuestionIndex];
  const progress =
    data && data.items.length > 0
      ? ((currentQuestionIndex + 1) / data.items.length) * 100
      : 0;

  // Reset audio state when question changes
  useEffect(() => {
    setIsPlaying(false);
    setReplayCount(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [currentQuestionIndex]);

  // Audio handlers
  const togglePlay = async () => {
    if (!audioRef.current || !currentQuestion?.promptJsonb?.audioUrl) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        if (replayCount < maxReplays) {
          // Reset audio if it's ended
          if (audioRef.current.ended) {
            audioRef.current.currentTime = 0;
          }

          await audioRef.current.play();
          if (audioRef.current.currentTime === 0) {
            setReplayCount((prev) => prev + 1);
          }
        }
      }
    } catch (error) {
      console.error("Audio play error:", error);
    }
  };
  const handleQuestionComplete = (
    userAnswers: string[],
    isCorrect: boolean
  ) => {
    const newCompleted = new Set(completedQuestions);
    newCompleted.add(currentQuestionIndex);
    setCompletedQuestions(newCompleted);

    setScores((prev) => ({
      ...prev,
      [currentQuestionIndex]: isCorrect,
    }));
  };

  const handleNextQuestion = () => {
    // Reset audio state when changing questions
    setIsPlaying(false);
    setReplayCount(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (currentQuestionIndex < (data?.items?.length ?? 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePreviousQuestion = () => {
    // Reset audio state when changing questions
    setIsPlaying(false);
    setReplayCount(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setCompletedQuestions(new Set());
    setScores({});
    setShowSummary(false);
  };

  const correctAnswers = Object.values(scores).filter(Boolean).length;
  const totalAnswered = Object.keys(scores).length;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-slate-50/50 font-['Inter',system-ui,sans-serif]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Demo
            </Button>
          </div>

          {/* Loading Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-6">
              {/* Animated Loading Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Headphones className="h-10 w-10" />
                </motion.div>
              </motion.div>

              <h1 className="text-3xl font-bold text-slate-900">
                Loading Cloze Questions...
              </h1>

              <p className="text-lg text-slate-600">
                Please wait while we prepare your listening exercises
              </p>

              {/* Loading Progress */}
              <div className="max-w-md mx-auto">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-2 bg-blue-500 rounded-full"
                />
              </div>

              {/* Loading Steps */}
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-2 text-slate-600"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                  <span>Fetching questions...</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-center gap-2 text-slate-600"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                  <span>Preparing audio files...</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-center justify-center gap-2 text-slate-600"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                  <span>Setting up exercises...</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-slate-50/50 font-['Inter',system-ui,sans-serif]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Demo
            </Button>
          </div>

          {/* Error Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-red-100 text-red-600 rounded-full"
              >
                <XCircle className="h-10 w-10" />
              </motion.div>

              <h1 className="text-3xl font-bold text-slate-900">
                Failed to Load Questions
              </h1>

              <p className="text-lg text-slate-600">
                We couldn't load the listening exercises. Please try again.
              </p>

              {/* Error Details */}
              <Card className="max-w-md mx-auto border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <p className="text-red-700 text-sm">
                    {error?.message || "An unexpected error occurred"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="lg"
                className="px-8"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>

              <Button onClick={onBack} size="lg" className="px-8">
                Back to Exercises
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data?.items || data.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-slate-50/50 font-['Inter',system-ui,sans-serif]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Demo
            </Button>
          </div>

          {/* No Data Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full"
              >
                <Headphones className="h-10 w-10" />
              </motion.div>

              <h1 className="text-3xl font-bold text-slate-900">
                No Questions Available
              </h1>

              <p className="text-lg text-slate-600">
                There are no listening exercises available at the moment.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="lg"
                className="px-8"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>

              <Button onClick={onBack} size="lg" className="px-8">
                Back to Exercises
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-slate-50/50 font-['Inter',system-ui,sans-serif]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Demo
            </Button>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full"
              >
                <Trophy className="h-10 w-10" />
              </motion.div>

              <h1 className="text-3xl font-bold text-slate-900">
                Practice Session Complete!
              </h1>

              <p className="text-lg text-slate-600">
                You've completed all the Cloze listening exercises
              </p>
            </div>

            {/* Results */}
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-xl">Your Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Questions Answered:</span>
                  <span className="font-semibold">
                    {totalAnswered}/{data?.items?.length ?? 0}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Correct Answers:</span>
                  <span className="font-semibold text-green-600">
                    {correctAnswers}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Accuracy:</span>
                  <span className="font-semibold text-blue-600">
                    {totalAnswered > 0
                      ? Math.round((correctAnswers / totalAnswered) * 100)
                      : 0}
                    %
                  </span>
                </div>

                <Progress
                  value={
                    totalAnswered > 0
                      ? (correctAnswers / totalAnswered) * 100
                      : 0
                  }
                  className="mt-4"
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleRestart}
                variant="outline"
                size="lg"
                className="px-8"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Practice Again
              </Button>

              <Button onClick={onBack} size="lg" className="px-8">
                Back to Exercises
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Top Navigation */}
        {/* <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Demo
          </Button>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-white/90 backdrop-blur-sm border-slate-200 text-slate-600 font-medium"
            >
              <Headphones className="h-3 w-3 mr-1.5" />
              Cloze Practice
            </Badge>

            <Badge
              variant="outline"
              className="bg-blue-50 border-blue-200 text-blue-700 font-medium"
            >
              Question {currentQuestionIndex + 1} of {data?.items?.length ?? 0}
            </Badge>
          </div>
        </div> */}

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-600">
              Overall Progress
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Practice Card */}
        <div className="flex justify-center">
          <div className="w-full ">
            {currentQuestion ? (
              <Card className="shadow-xl border-0 bg-white rounded-2xl overflow-hidden relative">
                {/* Difficulty Badge - Top Right */}
                {/* <div className="absolute top-6 right-6 z-10">
                  <Badge
                    className={`
                      px-3 py-1.5 text-xs font-semibold rounded-full border-0 shadow-sm
                      ${
                        currentQuestion?.difficulty === "easy"
                          ? "bg-green-100 text-green-700"
                          : currentQuestion?.difficulty === "medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {currentQuestion?.difficulty?.charAt(0).toUpperCase() +
                      currentQuestion?.difficulty?.slice(1) || "Unknown"}
                  </Badge>
                </div> */}

                <CardContent className="p-4">
                  <ClozeListeningQuestion
                    key={`question-${currentQuestionIndex}`} // Force remount on question change
                    text={currentQuestion?.promptJsonb.text || ""}
                    answers={currentQuestion?.solutionJsonb?.answers || []}
                    audioUrl={currentQuestion?.promptJsonb?.audio_url || ""}
                    transcript={currentQuestion?.solutionJsonb?.transcript || ""}
                    onComplete={handleQuestionComplete}
                  />
                </CardContent>
              </Card>
            ) : (
              /* Enhanced Loading Skeleton */
              <Card className="shadow-xl border-0 bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-8 lg:p-12">
                  <div className="animate-pulse space-y-8">
                    {/* Header skeleton */}
                    <div className="text-center space-y-4">
                      <div className="h-8 bg-slate-200 rounded-lg w-3/4 mx-auto" />
                      <div className="h-5 bg-slate-200 rounded-lg w-1/2 mx-auto" />
                    </div>

                    {/* Audio player skeleton */}
                    <div className="bg-slate-100 rounded-xl p-6">
                      <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-slate-200 rounded-full" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <div className="h-4 bg-slate-200 rounded w-12" />
                          <div className="h-4 bg-slate-200 rounded w-20" />
                          <div className="h-4 bg-slate-200 rounded w-12" />
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full w-full" />
                      </div>
                    </div>

                    {/* Question skeleton */}
                    <div className="bg-slate-50 rounded-xl p-8 space-y-4">
                      <div className="h-6 bg-slate-200 rounded w-full" />
                      <div className="h-6 bg-slate-200 rounded w-5/6" />
                      <div className="h-6 bg-slate-200 rounded w-4/6" />
                    </div>

                    {/* Buttons skeleton */}
                    <div className="flex justify-center gap-4">
                      <div className="h-12 bg-slate-200 rounded-xl w-36" />
                      <div className="h-12 bg-slate-200 rounded-xl w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <AnimatePresence>
          {completedQuestions.has(currentQuestionIndex) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center gap-4 mt-8 mb-12"
            >
              {currentQuestionIndex > 0 && (
                <Button
                  onClick={handlePreviousQuestion}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}

              <Button
                onClick={handleNextQuestion}
                size="lg"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {currentQuestionIndex === (data?.items?.length ?? 0) - 1 ? (
                  <>
                    <Trophy className="h-4 w-4 mr-2" />
                    View Results
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Overview */}
        <div className="mt-16">
          <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">
                Question Overview
              </h3>

              <div className="flex justify-center">
                <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                  {data?.items
                    ? data.items.map((_, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentQuestionIndex(index)}
                          className={`
                            w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm
                            transition-all duration-300 shadow-md hover:shadow-lg
                            ${
                              index === currentQuestionIndex
                                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200 ring-4 ring-blue-100"
                                : completedQuestions.has(index)
                                ? scores[index]
                                  ? "bg-gradient-to-br from-green-400 to-green-500 text-white shadow-green-200"
                                  : "bg-gradient-to-br from-red-400 to-red-500 text-white shadow-red-200"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                            }
                          `}
                        >
                          {completedQuestions.has(index) && scores[index] ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : completedQuestions.has(index) &&
                            !scores[index] ? (
                            <XCircle className="h-5 w-5" />
                          ) : (
                            index + 1
                          )}
                        </motion.button>
                      ))
                    : /* Enhanced loading skeleton for question overview */
                      Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="w-12 h-12 rounded-xl bg-slate-200 animate-pulse"
                        />
                      ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-center mt-6 gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-500 to-blue-600" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gradient-to-br from-green-400 to-green-500" />
                  <span>Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gradient-to-br from-red-400 to-red-500" />
                  <span>Incorrect</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-slate-200" />
                  <span>Pending</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
