import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain, X } from "lucide-react";
import { WeakVocabulary, ReviewSession as ReviewSessionType, ReviewMode, QuizType } from "@/types/implements/vocabulary";
import FlashcardSession from "./FlashcardSession";
import QuizSession from "./quiz/QuizSession";

interface ReviewSessionProps {
  reviewMode: ReviewMode;
  currentWord: WeakVocabulary;
  reviewSession: ReviewSessionType;
  currentReviewIndex: number;
  allVocabularies: WeakVocabulary[];
  onEndSession: () => void;
  
  // Flashcard props
  showAnswer: boolean;
  onShowAnswer: () => void;
  onFlashcardNext: () => void;
  
  // Quiz props
  showQuiz: boolean;
  currentQuizType: QuizType;
  quizOptions: string[];
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
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Review Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
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
            </CardTitle>
            <Button variant="outline" onClick={onEndSession}>
              <X className="h-4 w-4 mr-2" />
              Kết thúc
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Tiến độ: {currentReviewIndex + 1}/{reviewSession.total}
              </span>
              {reviewMode === "quiz" && (
                <span>
                  Điểm: {reviewSession.correct}/
                  {currentReviewIndex + (showQuiz && quizCompleted ? 1 : 0)}
                </span>
              )}
            </div>
            <Progress
              value={((currentReviewIndex + 1) / reviewSession.total) * 100}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Review Content */}
      <Card className="mb-6">
        <CardContent className="p-8 text-center">
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
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

