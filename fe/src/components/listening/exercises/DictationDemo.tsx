"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Target,
  BookOpen,
  Loader2,
  AlertCircle,
  RefreshCw,
  Volume2,
} from "lucide-react";
import DictationPracticePage from "./DictationPracticePage";
import { useItems } from "@/api/useItems";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface DictationDemoProps {
  onBack?: () => void;
}

export default function DictationDemo({ onBack }: DictationDemoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const props = {
    modality: "dictation",
  };

  const { data, isLoading, isError, error, refetch } = useItems(props);

  // Normalize items whether the hook returns an array directly or an object with an `items` array
  const items = Array.isArray(data) ? data : data?.items ?? [];
  const currentItem = items[currentIndex];
  const totalItems = items.length;

  const handleNext = () => {
    setCompletedItems((prev) => new Set(prev).add(currentIndex));

    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setCompletedItems(new Set());
    setShowSummary(false);
  };

  const handleItemSelect = (index: number) => {
    setCurrentIndex(index);
    setShowSummary(false);
  };

  const handleRetry = async () => {
    setRetryCount((prev) => prev + 1);
    toast.info("Retrying to fetch dictation items...");

    try {
      const result = await refetch();
      if (result.data && result.data.items && result.data.items.length > 0) {
        toast.success(
          `Successfully loaded ${result.data.items.length} dictation exercises!`
        );
      } else {
        toast.warning("No dictation exercises found matching the criteria.");
      }
    } catch (err) {
      console.error("Retry failed:", err);
      toast.error("Failed to fetch dictation exercises. Please try again.");
    }
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

  // Loading Component
  if (isLoading) {
    return (
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
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dictation Practice
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Loading dictation exercises...
            </p>
          </motion.div>

          {/* Loading Progress Card */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Preparing dictation exercises...
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

          {/* Dictation Exercise Skeleton */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 space-y-6">
              {/* Header skeleton */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-14 animate-pulse"></div>
                </div>
              </div>

              {/* Audio player skeleton */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Textarea skeleton */}
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Buttons skeleton */}
              <div className="flex gap-3 justify-center">
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-36 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          {/* Features info skeleton */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
            <CardContent className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
  }

  // Error Component
  if (isError) {
    return (
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
                Dictation Practice
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
                    Failed to Load Dictation Exercises
                  </h3>
                  <p className="text-sm text-gray-600">
                    There was an error loading the dictation exercises. Please
                    check your connection and try again.
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
                        <li>No dictation exercises available</li>
                        <li>API configuration issues</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleRetry}
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

                  {onBack && (
                    <Button
                      onClick={onBack}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Menu
                    </Button>
                  )}
                </div>

                {/* Technical Info */}
                <details className="text-left">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                    Technical Details
                  </summary>
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600">
                    <div>Modality: dictation</div>
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
  }

  // Empty State
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
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Dictation Practice
              </h1>
            </div>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl max-w-md mx-auto">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    No Dictation Exercises Available
                  </h3>
                  <p className="text-sm text-gray-600">
                    There are currently no dictation exercises available for
                    practice.
                  </p>
                  <p className="text-xs text-gray-500">
                    The server returned an empty response. This might be due to:
                  </p>
                  <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                    <li>No dictation exercises in the database</li>
                    <li>Server configuration issues</li>
                    <li>Content not yet loaded</li>
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
                        Checking...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </>
                    )}
                  </Button>

                  {onBack && (
                    <Button
                      onClick={onBack}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Menu
                    </Button>
                  )}
                </div>

                <details className="text-left">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                    Request Details
                  </summary>
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600">
                    <div>Modality: dictation</div>
                    <div>Expected: Dictation items</div>
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

  if (showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                  Dictation Demo Complete! 🎉
                </CardTitle>
                <p className="text-gray-600">
                  You've completed all the dictation exercises
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {totalItems}
                    </div>
                    <div className="text-sm text-gray-600">Total Items</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {completedItems.size}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {totalItems
                        ? Math.round((completedItems.size / totalItems) * 100)
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-600">Progress</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">
                    Exercise Summary:
                  </h3>
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleItemSelect(index)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                          Exercise {index + 1}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs border ${getDifficultyColor(
                            item.difficulty
                          )}`}
                        >
                          {item.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Band {item.bandHint}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {completedItems.has(index) && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-50 text-green-700"
                          >
                            ✓ Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-center">
                  <Button onClick={handleReset} className="px-6">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                  {onBack && (
                    <Button onClick={onBack} variant="outline" className="px-6">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Menu
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Progress Header */}

      {/* Main Content */}
      <div>
        <DictationPracticePage
          item={currentItem}
          itemIndex={currentIndex + 1}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          totalItems={totalItems}
          onNext={handleNext}
          onPrevious={currentIndex > 0 ? handlePrevious : undefined}
        />
        
      </div>

      {/* Back Button */}
      {onBack && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-6 left-6 z-50"
        >
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-0 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </motion.div>
      )}
    </div>
  );
}
