"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { Volume2 } from "lucide-react";
import { useTTS } from "@/hooks/use-tts";
import { AnswerResult, VocabFlashcardItem } from "@/types/type-exercise";
import { cn } from "@/utils";

interface FlashcardProps {
  item: VocabFlashcardItem;
  onAnswer: (result: AnswerResult) => void;
}

export function Flashcard({ item, onAnswer }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const { play } = useTTS();

  // Keyboard: Space to flip
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleKnow = () => {
    onAnswer({ correct: true, itemId: item.id, userAnswer: "know" });
  };

  const handleLearning = () => {
    onAnswer({ correct: false, itemId: item.id, userAnswer: "learning" });
  };

  return (
    <div className="space-y-6">
      {/* 3D flip card */}
      <div className="perspective-1000 h-80">
        <m.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          className="relative w-full h-full cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          {/* Front */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden bg-white rounded-xl ring-1 ring-slate-200 p-8 flex flex-col items-center justify-center",
              flipped && "invisible"
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            <h3 className="text-4xl font-bold text-slate-900 mb-2">
              {item.term}
            </h3>
            <p className="text-slate-500 mb-4">{item.ipa}</p>
            <button
            //   onClick={(e) => {
            //     e.stopPropagation();
            //     play(item.tts_en);
            //   }}
              className="p-3 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Play pronunciation"
            >
              <Volume2 className="w-5 h-5 text-indigo-600" />
            </button>
            <p className="text-sm text-slate-400 mt-6">Press Space to flip</p>
          </div>

          {/* Back */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden bg-indigo-50 rounded-xl ring-1 ring-indigo-200 p-8 flex flex-col justify-center",
              !flipped && "invisible"
            )}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <h4 className="text-2xl font-semibold text-slate-900 mb-4">
              {item.meaning}
            </h4>
            <div className="space-y-2 text-slate-700">
              <p className="font-medium">Example:</p>
              <p className="italic">{item.example_en}</p>
              <p className="text-slate-600">{item.example_vi}</p>
            </div>
          </div>
        </m.div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleLearning}
          className="flex-1 py-3 px-4 bg-slate-200 text-slate-900 rounded-xl font-medium hover:bg-slate-300 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          Still learning
        </button>
        <button
          onClick={handleKnow}
          className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          I know this
        </button>
      </div>
    </div>
  );
}
