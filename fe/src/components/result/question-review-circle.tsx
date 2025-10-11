"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Circle } from "lucide-react";
import { SubmitQuestion } from "@/types";
import { cn } from "@/utils";
import { usePracticeTest } from "@/hooks";
import { QuestionReviewDialog } from "./question-review-dialog";

interface QuestionReviewCirclesProps {
  questions: SubmitQuestion[];
}

export default function QuestionReviewCircles({
  questions,
}: QuestionReviewCirclesProps) {

  const [selectedQuestion, setSelectedQuestion] =
    useState<SubmitQuestion | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleCircleClick = (question: SubmitQuestion) => {
    setSelectedQuestion(question);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedQuestion(null), 200);
  };

  const getIconAndColor = (isCorrect?: boolean | null) => {
    if (isCorrect === true) {
      return { Icon: CheckCircle2, color: "text-green-500" };
    }
    if (isCorrect === false) {
      return { Icon: XCircle, color: "text-red-500" };
    }
    return { Icon: Circle, color: "text-gray-300" };
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 p-4">
        {questions.map((question) => {
          const { Icon, color } = getIconAndColor(question.isCorrect);
          return (
            <motion.button
              key={question.id}
              onClick={() => handleCircleClick(question)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex items-center justify-center transition-all duration-200",
                "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
              )}
            >
              <Icon className={cn("w-10 h-10", color)} />
              <span className="absolute text-xs font-semibold text-white">
                {question.numberLabel}
              </span>
            </motion.button>
          );
        })}
      </div>

      <QuestionReviewDialog
        isOpen={isOpen}
        handleClose={handleClose}
        selectedQuestion={selectedQuestion}
      />
    </>
  );
}
