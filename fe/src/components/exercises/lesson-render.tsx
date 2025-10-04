"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnswerResult, Lesson, LessonSummary } from "@/types/type-exercise";
import { ListeningCloze } from "./listening-cloze";
import { Flashcard } from "./flash-card";
import { ListeningMCQ } from "./listening-mcq";
import { ReadingMCQ } from "./reading-mcq";
import { GrammarCloze } from "./grammar-cloze";
import { GrammarFormula } from "./grammar-mcq";
import { cn } from "@/utils";
import { VocabListeningMCQ } from "./vocab-listening";

interface LessonRendererProps {
  lesson: Lesson;
  onItemAnswer?: (result: AnswerResult) => void;
  onLessonComplete?: (summary: LessonSummary) => void;
}

export function LessonRenderer({
  lesson,
  onItemAnswer,
  onLessonComplete,
}: LessonRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [completed, setCompleted] = useState(false);

  const totalItems = lesson.items.length;
  const currentItem = lesson.items[currentIndex];

  // Keyboard: Arrow keys for navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex((prev) => prev - 1);
      } else if (e.key === "ArrowRight" && currentIndex < totalItems - 1) {
        e.preventDefault();
        setCurrentIndex((prev) => prev + 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, totalItems]);

  const handleAnswer = (result: AnswerResult) => {
    setResults((prev) => [...prev, result]);
    onItemAnswer?.(result);

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentIndex < totalItems - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Lesson complete
        setCompleted(true);
        const correctCount = [...results, result].filter(
          (r) => r.correct
        ).length;
        onLessonComplete?.({
          correctCount,
          total: totalItems,
          detail: [...results, result],
        });
      }
    }, 1500);
  };

  const renderItem = () => {
    switch (lesson.type) {
      case "vocab_flashcard":
        return <Flashcard item={currentItem as any} onAnswer={handleAnswer} />;
      case "listening_cloze":
        return (
          <ListeningCloze item={currentItem as any} onAnswer={handleAnswer} />
        );
      case "listening_mcq":
        return (
          <ListeningMCQ item={currentItem as any} onAnswer={handleAnswer} />
        );

      case "vocab_listening":
        return (
          <VocabListeningMCQ
            item={currentItem as any}
            onAnswer={handleAnswer}
          />
        );

      case "reading_mcq":
        return <ReadingMCQ item={currentItem as any} onAnswer={handleAnswer} />;
      case "grammar_cloze":
        return (
          <GrammarCloze item={currentItem as any} onAnswer={handleAnswer} />
        );
      case "grammar_formula":
        return (
          <GrammarFormula item={currentItem as any} onAnswer={handleAnswer} />
        );
      default:
        return <div>Unknown lesson type</div>;
    }
  };

  if (completed) {
    const correctCount = results.filter((r) => r.correct).length;
    const percentage = Math.round((correctCount / totalItems) * 100);

    return (
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center min-h-[400px] text-center"
      >
        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
          <span className="text-3xl font-bold text-indigo-600">
            {percentage}%
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Lesson Complete!
        </h2>
        <p className="text-slate-600 mb-6">
          You got {correctCount} out of {totalItems} correct
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setResults([]);
            setCompleted(false);
          }}
          className="py-3 px-6 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Try Again
        </button>
      </m.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {lesson.title}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {currentIndex + 1} of {totalItems} • {lesson.estimated_minutes} min
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <m.div
          animate={{ scaleX: (currentIndex + 1) / totalItems }}
          transition={{ duration: 0.2 }}
          style={{ transformOrigin: "left", willChange: "transform" }}
          className="h-full bg-indigo-600 rounded-full"
        />
      </div>

      {/* Item content with crossfade */}
      <m.div
        key={currentIndex}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{ willChange: "opacity, transform" }}
      >
        {renderItem()}
      </m.div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            currentIndex === 0
              ? "text-slate-400 cursor-not-allowed"
              : "text-slate-700 hover:bg-slate-100"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-sm text-slate-600">
          {currentIndex + 1} / {totalItems}
        </span>

        <button
          onClick={() =>
            setCurrentIndex((prev) => Math.min(totalItems - 1, prev + 1))
          }
          disabled={currentIndex === totalItems - 1}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            currentIndex === totalItems - 1
              ? "text-slate-400 cursor-not-allowed"
              : "text-slate-700 hover:bg-slate-100"
          )}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
