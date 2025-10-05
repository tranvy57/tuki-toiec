"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { Volume2, CheckCircle2, XCircle } from "lucide-react";
import { AnswerResult, ListeningClozeItem } from "@/types/type-exercise";
import { useTTS } from "@/hooks/use-tts";
import { matchesAnyKeyword } from "@/utils/eval";
import { cn } from "@/utils";

interface ListeningClozeProps {
  item: ListeningClozeItem;
  onAnswer: (result: AnswerResult) => void;
}

export function ListeningCloze({ item, onAnswer }: ListeningClozeProps) {
  const [answers, setAnswers] = useState<string[]>(
    Array(item.blanks.length).fill("")
  );
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const { play } = useTTS();

  // Auto-play on mount
//   useEffect(() => {
//     play(item.audio_tts);
//   }, [item.audio_tts, play]);

  // Keyboard: Space to replay
  // useEffect(() => {
  //   const handleKey = (e: KeyboardEvent) => {
  //     if (e.code === "Space" && e.target === document.body) {
  //       e.preventDefault();
  //       play(item.audio_tts);
  //     }
  //   };
  //   window.addEventListener("keydown", handleKey);
  //   return () => window.removeEventListener("keydown", handleKey);
  // }, [item.audio_tts, play]);

  const handleSubmit = () => {
    setSubmitted(true);
    const checkResults = answers.map((answer, index) =>
      matchesAnyKeyword(answer, item.keywords[index])
    );
    setResults(checkResults);
    const correct = checkResults.every((r) => r);
    onAnswer({ correct, itemId: item.id, userAnswer: answers });
  };

  // Parse text with blanks
  const parts = item.text_with_blanks.split(/___/);
  let blankIndex = 0;

  return (
    <div className="space-y-6">
      {/* Audio player */}
      <div className="flex items-center justify-center">
        <button
          // onClick={() => play(item.audio_tts)}
          className="p-6 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Play audio"
        >
          <Volume2 className="w-8 h-8 text-indigo-600" />
        </button>
      </div>

      {/* Text with blanks */}
      <div className="bg-white p-6 rounded-xl ring-1 ring-slate-200">
        <div className="text-lg leading-relaxed">
          {parts.map((part, index) => {
            const currentBlankIndex = blankIndex;
            const hasBlank = index < parts.length - 1;
            if (hasBlank) blankIndex++;

            return (
              <span key={index}>
                {part}
                {hasBlank && (
                  <span className="inline-flex items-center mx-1">
                    <input
                      type="text"
                      value={answers[currentBlankIndex]}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[currentBlankIndex] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      disabled={submitted}
                      className={cn(
                        "w-32 px-3 py-1 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150",
                        !submitted && "border-slate-300",
                        submitted &&
                          results[currentBlankIndex] &&
                          "border-green-500 bg-green-50",
                        submitted &&
                          !results[currentBlankIndex] &&
                          "border-red-500 bg-red-50"
                      )}
                      placeholder="..."
                    />
                    {submitted && results[currentBlankIndex] && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 ml-1" />
                    )}
                    {submitted && !results[currentBlankIndex] && (
                      <XCircle className="w-4 h-4 text-red-600 ml-1" />
                    )}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={answers.some((a) => !a.trim())}
          className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Check Answers
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
          <p className="font-medium text-slate-900 mb-2">Correct answers:</p>
          <div className="space-y-1">
            {item.blanks.map((blank, index) => (
              <p key={index} className="text-slate-700">
                {index + 1}. {blank}
              </p>
            ))}
          </div>
          <p className="text-slate-600 text-sm mt-3">{item.vi_explanation}</p>
        </m.div>
      )}
    </div>
  );
}
