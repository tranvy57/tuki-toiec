"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Target,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import MCQItem from "@/components/listening/exercises/MCQItem";
import { useItems } from "@/api/useItems";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function MCQItemDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, { answer: string; correct: boolean }>
  >({});
  const [showStats, setShowStats] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const props = {
    modality: "mcq",
    skill_type: "listening",
    
  };

  const { data, isLoading, isError, error, refetch } = useItems(props);

  // Reset states when data changes
  React.useEffect(() => {
    if (data && data.items && data.items.length > 0) {
      setCurrentIndex(0);
      setShowStats(false);
    }
  }, [data]);

  const currentItem = data?.items?.[currentIndex];
  const totalItems = data?.items?.length ?? 0;

  const handleAnswer = (answerKey: string, isCorrect: boolean) => {
    if (!currentItem) return;

    setAnswers((prev) => ({
      ...prev,
      [currentItem.id]: { answer: answerKey, correct: isCorrect },
    }));
  };

  const handleRetry = async () => {
    setRetryCount((prev) => prev + 1);
    toast.info("Retrying to fetch questions...");

    try {
      const result = await refetch();
      if (result.data && result.data.items && result.data.items.length > 0) {
        toast.success(
          `Successfully loaded ${result.data.items.length} questions!`
        );
      } else {
        toast.warning("No questions found matching the criteria.");
      }
    } catch (err) {
      console.error("Retry failed:", err);
      toast.error("Failed to fetch questions. Please try again.");
    }
  };

  const goToNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowStats(true);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const resetDemo = () => {
    setCurrentIndex(0);
    setAnswers({});
    setShowStats(false);
  };

  const correctAnswers = Object.values(answers).filter((a) => a.correct).length;
  const totalAnswered = Object.keys(answers).length;
  const score =
    totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

  // Loading Component
  const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MCQ Component Demo
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Loading interactive demonstration...
          </p>
        </motion.div>

        {/* Loading Progress Card */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Preparing questions...
              </span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-4 h-4 text-blue-500" />
              </motion.div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* MCQ Skeleton */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>

            {/* Audio controls skeleton */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Question skeleton */}
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>

            {/* Choices skeleton */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer skeleton */}
            <div className="flex justify-between pt-4">
              <div className="h-9 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-9 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        {/* Features info skeleton */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded flex-1 animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Error Component with detailed error handling
  const ErrorScreen = ({ onRetry }: { onRetry: () => void }) => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              MCQ Component Demo
            </h1>
          </div>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl max-w-lg mx-auto">
            <CardContent className="p-8 space-y-6">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              </motion.div>

              <div className="space-y-3 text-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  Failed to Load Questions
                </h3>
                <p className="text-sm text-gray-600">
                  There was an error fetching the MCQ questions. This might be
                  due to network issues or server maintenance.
                </p>
                {retryCount > 0 && (
                  <p className="text-xs text-orange-600">
                    Retry attempt #{retryCount}
                  </p>
                )}
              </div>

              {/* Error Details */}
              <Alert className="text-left border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="space-y-2">
                    <div>
                      <strong>Error:</strong>{" "}
                      {error?.message || "Unknown error occurred"}
                    </div>
                    <div>
                      <strong>Possible causes:</strong>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li>Network connectivity issues</li>
                      <li>Server is temporarily unavailable</li>
                      <li>API endpoint configuration</li>
                      <li>Authentication or permission issues</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={onRetry}
                  className="w-full bg-red-500 hover:bg-red-600"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              {/* Technical Info */}
              <details className="text-left">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                  Technical Details
                </summary>
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600">
                  <div>Modality: {props.modality}</div>
                  <div>Skill Type: {props.skill_type}</div>
                  <div>Retry Count: {retryCount}</div>
                  <div>Timestamp: {new Date().toISOString()}</div>
                </div>
              </details>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  // Handle loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Handle error state
  if (isError) {
    return <ErrorScreen onRetry={handleRetry} />;
  }

  // Handle empty data
  if (!data || !data.items || data.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                MCQ Component Demo
              </h1>
            </div>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl max-w-md mx-auto">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    No Questions Available
                  </h3>
                  <p className="text-sm text-gray-600">
                    There are currently no MCQ questions available for this
                    demo.
                  </p>
                  <p className="text-xs text-gray-500">
                    The server returned an empty response. This might be due to:
                  </p>
                  <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                    <li>No questions matching the specified criteria</li>
                    <li>Database is temporarily empty</li>
                    <li>Configuration issues</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleRetry}
                    className="w-full bg-yellow-500 hover:bg-yellow-600"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking for Questions...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Questions
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reload Page
                  </Button>
                </div>

                <details className="text-left">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                    Request Details
                  </summary>
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600">
                    <div>Modality: {props.modality}</div>
                    <div>Skill Type: {props.skill_type}</div>
                    <div>Expected: MCQ items</div>
                    <div>Received: {data?.items?.length || 0} items</div>
                  </div>
                </details>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                  MCQ Demo Complete! 🎉
                </CardTitle>
                <p className="text-gray-600">Here are your results:</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {totalAnswered}
                    </div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {correctAnswers}
                    </div>
                    <div className="text-sm text-gray-600">Correct</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {score}%
                    </div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {data?.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">
                        Question {index + 1}:{" "}
                        {item.prompt.text.substring(0, 50)}...
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            item.difficulty === "easy"
                              ? "bg-green-50 text-green-700"
                              : item.difficulty === "medium"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {item.difficulty}
                        </Badge>
                        {answers[item.id] ? (
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              answers[item.id].correct
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {answers[item.id].correct ? "✓" : "✗"}{" "}
                            {answers[item.id].answer}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs bg-gray-50 text-gray-500"
                          >
                            Skipped
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={resetDemo} className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MCQ Component Demo
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Interactive demonstration of the new MCQItem component with audio
            playback, keyboard navigation, and comprehensive feedback features.
          </p>
        </motion.div>

        {/* Progress */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentIndex + 1} of {totalItems}
              </span>
              <span className="text-sm text-gray-500">
                {totalAnswered} answered • {correctAnswers} correct
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    totalItems > 0 ? ((currentIndex + 1) / totalItems) * 100 : 0
                  }%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </CardContent>
        </Card>

        {/* MCQ Component */}
        {currentItem && (
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MCQItem item={currentItem as any} onAnswer={handleAnswer} />
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={goToPrevious}
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

          <Button onClick={goToNext} className="flex items-center gap-2">
            {currentIndex === totalItems - 1 ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Features Info */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-800 mb-4">Component Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Audio playback with progress tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Keyboard navigation (arrows, 1-4, Enter)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Visual feedback with animations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Transcript toggle for accessibility</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Safe HTML rendering for explanations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Difficulty and band score indicators</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Responsive design for all devices</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>TypeScript support with full typing</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
