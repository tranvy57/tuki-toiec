"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { AnswerResult, GrammarClozeItem } from "@/types/type-exercise";
import { cn } from "@/utils";


interface GrammarClozeProps {
  item: GrammarClozeItem;
  onAnswer: (result: AnswerResult) => void;
}

export function GrammarCloze({ item, onAnswer }: GrammarClozeProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showRule, setShowRule] = useState(false);

  // Keyboard: 1-4 to select, Enter to submit
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (submitted) return;

      if (["Digit1", "Digit2", "Digit3", "Digit4"].includes(e.code)) {
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
  }, [selected, submitted, item]);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const correct = selected === item.correct_index;
    onAnswer({ correct, itemId: item.id, userAnswer: selected });
  };

  // Parse sentence with blank
  const parts = item.sentence_with_blank.split("___");

  return (
    <div className="space-y-6">
      {/* Grammar rule tooltip */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowRule(!showRule)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Info className="w-4 h-4 text-slate-600" />
          <span className="text-sm text-slate-700">Grammar Rule</span>
        </button>
      </div>

      {showRule && (
        <m.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 bg-indigo-50 rounded-xl ring-1 ring-indigo-200"
        >
          <p className="text-sm text-slate-700">{item.rule}</p>
        </m.div>
      )}

      {/* Sentence with blank */}
      <div className="bg-white p-6 rounded-xl ring-1 ring-slate-200">
        <p className="text-lg text-slate-900 leading-relaxed">
          {parts[0]}
          <span className="inline-block w-32 border-b-2 border-indigo-300 mx-2" />
          {parts[1]}
        </p>
      </div>

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

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Submit Answer
        </button>
      )}

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
