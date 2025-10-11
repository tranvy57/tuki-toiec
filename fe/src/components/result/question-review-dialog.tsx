import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Group, SubmitQuestion } from "@/types";
import { cn } from "@/utils";
import { usePracticeTest } from "@/hooks";
import { QuestionRenderer } from "./question-render";

export function QuestionReviewDialog({
  isOpen,
  handleClose,
  selectedQuestion,
}: {
  isOpen: boolean;
  handleClose: (open: boolean) => void;
  selectedQuestion: SubmitQuestion | null;
}) {
  const { findGroupByQuestionId } = usePracticeTest();

  const group = selectedQuestion
    ? findGroupByQuestionId(selectedQuestion.id)
    : undefined;

  return (
    <Dialog open={!!isOpen} onOpenChange={handleClose}>
      <AnimatePresence>
        {isOpen && selectedQuestion && group && (
          <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-0">
            <motion.div
              key={selectedQuestion.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative p-6 rounded-lg",
                "bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70",
                "backdrop-blur-xl border border-white/20 dark:border-white/10",
                "shadow-2xl shadow-black/10"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-lg pointer-events-none" />

              <DialogHeader className="relative z-10 mb-4">
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold shadow-lg">
                    {selectedQuestion.numberLabel}
                  </span>
                  <span>Question {selectedQuestion.numberLabel}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="relative z-10 space-y-4">
                <QuestionRenderer question={selectedQuestion} group={group}  />

                {/* {selectedQuestion.userAnswerId !== undefined && (
                  <div
                    className={cn(
                      "p-4 rounded-lg backdrop-blur-sm border",
                      selectedQuestion.isCorrect
                        ? "bg-green-50/70 dark:bg-green-900/20 border-green-200/50 dark:border-green-700/30"
                        : "bg-red-50/70 dark:bg-red-900/20 border-red-200/50 dark:border-red-700/30"
                    )}
                  >
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Your Answer
                    </h3>
                    <p className="text-base text-gray-900 dark:text-gray-100">
                      {selectedQuestion.answers.find(
                        (a) => a.id === selectedQuestion.userAnswerId
                      )?.content || "No answer selected."}
                    </p>
                  </div>
                )}

                {selectedQuestion.userAnswerId !== undefined && (
                  <div className="p-4 rounded-lg bg-blue-50/70 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/30">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Correct Answer
                    </h3>
                    <p className="text-base text-gray-900 dark:text-gray-100">
                      {selectedQuestion.answers.find((a) => a.isCorrect)
                        ?.content || "No correct answer provided."}
                    </p>
                  </div>
                )} */}

                {/* Explanation */}
                {selectedQuestion.explanation && (
                  <div className="p-4 rounded-lg bg-purple-50/70 dark:bg-purple-900/20 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/30">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Explanation
                    </h3>
                    <p className="text-base text-gray-900 dark:text-gray-100">
                      {selectedQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
