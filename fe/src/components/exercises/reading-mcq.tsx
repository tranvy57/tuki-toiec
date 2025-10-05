"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { AnswerResult, ReadingMCQItem } from "@/types/type-exercise";
import { cn } from "@/utils";


interface ReadingMCQProps {
  item: ReadingMCQItem;
  onAnswer: (result: AnswerResult) => void;
}

export function ReadingMCQ({ item, onAnswer }: ReadingMCQProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(item.questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  const question = item.questions[currentQuestion];
  const isLastQuestion = currentQuestion === item.questions.length - 1;

  const handleSelect = (optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Submit all answers
      setSubmitted(true);
      const correctCount = answers.filter(
        (ans, idx) => ans === item.questions[idx].correct_index
      ).length;
      onAnswer({
        correct: correctCount === item.questions.length,
        itemId: item.id,
        userAnswer: answers,
      });
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const selectedAnswer = answers[currentQuestion];

  return (
    <div className="space-y-6">
      {/* Passage */}
      <div className="bg-white p-6 rounded-xl ring-1 ring-slate-200 max-h-64 overflow-y-auto">
        <p className="text-slate-900 leading-relaxed whitespace-pre-wrap">
          {item.passage_en}
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>
          Question {currentQuestion + 1} of {item.questions.length}
        </span>
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <m.div
            animate={{ scaleX: (currentQuestion + 1) / item.questions.length }}
            transition={{ duration: 0.2 }}
            style={{ transformOrigin: "left" }}
            className="h-full bg-indigo-600 rounded-full"
          />
        </div>
      </div>

      {/* Question */}
      <div>
        <p className="text-lg font-medium text-slate-900 mb-4">{question.q}</p>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correct_index;
            const showResult = submitted;

            return (
              <m.button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={submitted}
                whileHover={!submitted ? { scale: 1.01 } : {}}
                whileTap={!submitted ? { scale: 0.98 } : {}}
                transition={{ duration: 0.15 }}
                className={cn(
                  "w-full text-left p-4 rounded-xl ring-1 transition-all duration-150 flex items-center gap-3",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  !submitted &&
                    !isSelected &&
                    "bg-white ring-slate-200 hover:ring-indigo-300 hover:bg-indigo-50",
                  !submitted && isSelected && "bg-indigo-50 ring-indigo-300",
                  submitted && isCorrect && "bg-green-50 ring-green-300",
                  submitted &&
                    !isCorrect &&
                    isSelected &&
                    "bg-red-50 ring-red-300",
                  submitted &&
                    !isCorrect &&
                    !isSelected &&
                    "bg-white ring-slate-200 opacity-50"
                )}
                aria-pressed={isSelected}
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showResult && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                {showResult && !isCorrect && isSelected && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </m.button>
            );
          })}
        </div>
      </div>

      {/* Next/Submit button */}
      {!submitted && (
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          {isLastQuestion ? "Submit All Answers" : "Next Question"}
        </button>
      )}

      {/* Explanation (shown after submission) */}
      {submitted && (
        <m.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 bg-slate-50 rounded-xl"
        >
          <p className="font-medium text-slate-900 mb-2">Explanation:</p>
          <p className="text-slate-700">{question.explanation}</p>
          <p className="text-slate-600 text-sm mt-2">
            {question.vi_explanation}
          </p>
        </m.div>
      )}
    </div>
  );
}
