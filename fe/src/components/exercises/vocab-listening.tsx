"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { Volume2, CheckCircle2, XCircle } from "lucide-react";
import { AnswerResult, VocabListeningItem } from "@/types/type-exercise";
import { useTTS } from "@/hooks/use-tts";
import { cn } from "@/utils";


interface VocabListeningMCQProps {
  item: VocabListeningItem;
  onAnswer: (result: AnswerResult) => void;
}

export function VocabListeningMCQ({ item, onAnswer }: VocabListeningMCQProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { play } = useTTS();

  // Auto-play on mount
  useEffect(() => {
    play(item.audio_tts);
  }, [item.audio_tts, play]);

  // Keyboard: 1-4 to select, Enter to submit, Space to replay
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (submitted) return;

      if (e.code === "Space") {
        e.preventDefault();
        play(item.audio_tts);
      } else if (["Digit1", "Digit2", "Digit3", "Digit4"].includes(e.code)) {
        const index = Number.parseInt(e.code.slice(-1)) - 1;
        if (index < item.options.length) {
          setSelected(index);
        }
      } else if (e.code === "Enter" && selected !== null) {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, submitted, item, play]);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const correct = selected === item.correct_index;
    onAnswer({ correct, itemId: item.id, userAnswer: selected });
  };

  return (
    <div className="space-y-6">
      {/* Audio player */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => play(item.audio_tts)}
          className="p-6 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Play audio"
        >
          <Volume2 className="w-8 h-8 text-indigo-600" />
        </button>
      </div>

      <p className="text-lg text-slate-900 text-center">{item.question}</p>

      {/* Options */}
      <div className="space-y-3">
        {item.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = index === item.correct_index;
          const showResult = submitted;

          return (
            <m.button
              key={index}
              onClick={() => !submitted && setSelected(index)}
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
                {index + 1}
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

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Submit Answer
        </button>
      )}

      {/* Explanation */}
      {submitted && (
        <m.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 bg-slate-50 rounded-xl"
        >
          <p className="font-medium text-slate-900 mb-2">Explanation:</p>
          <p className="text-slate-700">{item.explanation}</p>
          <p className="text-slate-600 text-sm mt-2">{item.vi_explanation}</p>
        </m.div>
      )}
    </div>
  );
}
