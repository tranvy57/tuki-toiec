import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain, X } from "lucide-react";
import {
  WeakVocabulary,
  ReviewSession as ReviewSessionType,
  ReviewMode,
  QuizType,
} from "@/types/implements/vocabulary";
import FlashcardSession from "./FlashcardSession";
import QuizSession from "./quiz/QuizSession";
import { is } from "zod/v4/locales";

interface ReviewSessionProps {
  reviewMode: ReviewMode;
  currentWord: WeakVocabulary;
  reviewSession: ReviewSessionType;
  currentReviewIndex: number;
  allVocabularies: WeakVocabulary[];

  isLastReviewWord?: boolean;

  onEndSession: () => void;

  // Flashcard props
  showAnswer: boolean;
  onShowAnswer: () => void;
  onFlashcardNext: () => void;

  // Quiz props
  showQuiz: boolean;
  currentQuizType: QuizType;
  quizOptions: { key: string; value: string }[];
  selectedOption: string;
  onSelectOption: (option: string) => void;
  quizAnswer: string;
  onAnswerChange: (answer: string) => void;
  quizCompleted: boolean;
  onQuizSubmit: () => void;
  onProceedToNext: () => void;
}

export default function ReviewSession({
  reviewMode,
  currentWord,
  reviewSession,
  currentReviewIndex,
  allVocabularies,
  isLastReviewWord,
  onEndSession,
  showAnswer,
  onShowAnswer,
  onFlashcardNext,
  showQuiz,
  currentQuizType,
  quizOptions,
  selectedOption,
  onSelectOption,
  quizAnswer,
  onAnswerChange,
  quizCompleted,
  onQuizSubmit,
  onProceedToNext,
}: ReviewSessionProps) {
  return (
    <div className="container mx-auto px-4 py-2">
      {/* Review Header */}
      <div className="mb-4 p-4 rounded-sm space-y-2">
        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {reviewMode === "flashcard" ? (
                <>
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Ôn tập Flashcard
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 text-toeic-primary" />
                  Quiz từ vựng
                </>
              )}
            </div>
            <Button variant="outline" onClick={onEndSession}>
              <X className="h-4 w-4 mr-2" />
              Kết thúc
            </Button>
          </div>
        </div>
        <div>
          <div className="space-y-4">
            <Progress
              value={((currentReviewIndex + 1) / reviewSession.total) * 100}
              className="h-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Tiến độ: {currentReviewIndex + 1}/{reviewSession.total}
              </span>
              {reviewMode === "quiz" && (
                <span>
                  Điểm: {reviewSession.correct}/{quizCompleted}
                  {currentReviewIndex + (showQuiz && quizCompleted ? 1 : 0)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-20">
        <div className=" text-center">
          {reviewMode === "flashcard" && (
            <FlashcardSession
              currentWord={currentWord}
              showAnswer={showAnswer}
              onShowAnswer={onShowAnswer}
              onNext={onFlashcardNext}
              isLastCard={currentReviewIndex === reviewSession.total - 1}
            />
          )}

          {reviewMode === "quiz" && showQuiz && (
            <QuizSession
              currentWord={currentWord}
              currentQuizType={currentQuizType}
              allVocabularies={allVocabularies}
              quizOptions={quizOptions}
              selectedOption={selectedOption}
              onSelectOption={onSelectOption}
              quizAnswer={quizAnswer}
              onAnswerChange={onAnswerChange}
              isCompleted={quizCompleted}
              onSubmit={onQuizSubmit}
              onSkip={onProceedToNext}
              isLastReviewWord={isLastReviewWord}
              onEndSession={onEndSession}
            />
          )}
        </div>
      </div>
    </div>
  );
}
