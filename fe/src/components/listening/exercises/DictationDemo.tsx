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
  Volume2,
} from "lucide-react";
import DictationPracticePage from "./DictationPracticePage";

interface DictationItem {
  id: string;
  modality: string;
  title: string;
  difficulty: string;
  bandHint: number;
  promptJsonb: {
    title?: string;
    segments?: Array<{
      end: number;
      text: string;
      start: number;
    }>;
    audio_url?: string;
    source_url?: string;
    instructions?: string;
  };
  solutionJsonb: {
    sentences?: string[];
    correct_answers?: Array<{
      text: string;
      segment_index: number;
    }>;
    full_transcript?: string;
  };
}

interface DictationDemoProps {
  items: DictationItem[];
  onAnswerSubmit: (id: string, answer: any, score: number) => void;
}

export default function DictationDemo({ items, onAnswerSubmit }: DictationDemoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

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
    setUserAnswers({});
  };

  const handleItemSelect = (index: number) => {
    setCurrentIndex(index);
    setShowSummary(false);
  };

  const handleFinishTest = () => {
    const calculateScore = () => {
      let correct = 0;
      items.forEach(question => {
        const userAnswer = userAnswers[question.id];
        const correctText = question.solutionJsonb?.full_transcript || "";

        // Simple comparison - you might want to implement more sophisticated text comparison
        if (userAnswer && correctText &&
          userAnswer.toLowerCase().trim() === correctText.toLowerCase().trim()) {
          correct++;
        }
      });
      return { correct, total: items.length };
    };

    const results = calculateScore();
    // Handle results - for now just log them
    console.log("Test completed:", { ...results, userAnswers });
  };

  const handleAnswerSubmit = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
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

  // Early return if no questions available
  if (!items.length || !currentItem) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No dictation exercises available</p>
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
                  <Button onClick={handleFinishTest} className="px-6 bg-green-600 hover:bg-green-700">
                    <Target className="w-4 h-4 mr-2" />
                    Finish Test
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="px-6">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
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
          onAnswerSubmit={handleAnswerSubmit}
        />

      </div>
    </div>
  );
}
