import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  WeakVocabulary,
  ReviewSession,
  ReviewMode,
  QuizType,
} from "@/types/implements/vocabulary";
import { generateQuizOptions } from "@/utils/vocabularyUtils";

export function useVocabularyReview(
  vocabularies: WeakVocabulary[],
  setVocabularies: React.Dispatch<React.SetStateAction<WeakVocabulary[]>>
) {
  console.log("vocabularies", vocabularies);

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewSession, setReviewSession] = useState<ReviewSession>({
    correct: 0,
    total: 0,
    sessionActive: false,
  });
  const [reviewMode, setReviewMode] = useState<ReviewMode>(null);
  const [currentQuizType, setCurrentQuizType] = useState<QuizType>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [quizCompleted, setQuizCompleted] = useState(false);

  const quizTypes: ("multiple-choice" | "fill-blank" | "audio")[] = [
    "multiple-choice",
    "fill-blank",
    "audio",
  ];

  const reviewWords = vocabularies.filter((v) => v.isMarkedForReview);
  const currentReviewWord = reviewWords[currentReviewIndex];

  const startFlashcardSession = useCallback(() => {
    const reviewWords = vocabularies.filter((v) => v.isMarkedForReview);
    if (reviewWords.length === 0) {
      toast.error("Không có từ nào được đánh dấu để ôn tập!");
      return;
    }

    setIsReviewMode(true);
    setReviewMode("flashcard");
    setCurrentReviewIndex(0);
    setShowAnswer(false);
    setReviewSession({
      correct: 0,
      total: reviewWords.length,
      sessionActive: true,
    });
    toast.success(
      `Bắt đầu ôn tập Flashcard với ${reviewWords.length} từ vựng!`
    );
  }, [vocabularies]);

  const startQuizSession = useCallback(() => {
    const reviewWords = vocabularies.filter((v) => v.isMarkedForReview);
    if (reviewWords.length === 0) {
      toast.error("Không có từ nào được đánh dấu để ôn tập!");
      return;
    }

    setIsReviewMode(true);
    setReviewMode("quiz");
    setCurrentReviewIndex(0);
    setShowAnswer(false);
    setShowQuiz(false);
    setReviewSession({
      correct: 0,
      total: reviewWords.length,
      sessionActive: true,
    });

    // Start first quiz immediately
    const firstWord = reviewWords[0];
    setTimeout(() => startQuiz(firstWord), 500);

    toast.success(`Bắt đầu Quiz với ${reviewWords.length} từ vựng!`);
  }, [vocabularies]);

  const startQuiz = useCallback(
    (word: WeakVocabulary) => {
      const randomType =
        quizTypes[Math.floor(Math.random() * quizTypes.length)];

      setCurrentQuizType(randomType);
      setShowQuiz(true);
      setQuizCompleted(false);
      setSelectedOption("");
      setQuizAnswer("");

      if (randomType === "multiple-choice") {
        const options = generateQuizOptions(word.meaning, vocabularies);
        setQuizOptions(options);
      }
    },
    [vocabularies]
  );

  const endReviewSession = useCallback(() => {
    setIsReviewMode(false);
    setReviewMode(null);
    setShowQuiz(false);
    setReviewSession((prev) => ({ ...prev, sessionActive: false }));

    if (reviewMode === "quiz") {
      const accuracy =
        reviewSession.total > 0
          ? ((reviewSession.correct / reviewSession.total) * 100).toFixed(1)
          : 0;
      toast.success(`Hoàn thành Quiz! Độ chính xác: ${accuracy}%`);
    } else {
      toast.success(`Hoàn thành ôn tập Flashcard!`);
    }
  }, [reviewMode, reviewSession]);

  const handleQuizSubmit = useCallback(() => {
    const currentWord = reviewWords[currentReviewIndex];
    let isQuizCorrect = false;

    if (currentQuizType === "multiple-choice") {
      isQuizCorrect = selectedOption === currentWord.meaning;
    } else if (currentQuizType === "fill-blank") {
      console.log("quizAnswer", quizAnswer);

      isQuizCorrect =
        quizAnswer.toLowerCase().trim() === currentWord.word.toLowerCase();
    } else if (currentQuizType === "audio") {
      isQuizCorrect = selectedOption === currentWord.word;
    }

    setQuizCompleted(true);

    // Update score based on quiz result
    if (isQuizCorrect) {
      setReviewSession((prev) => ({ ...prev, correct: prev.correct + 1 }));
      toast.success("Chính xác! 🎉");
    } else {
      toast.error("Chưa đúng, hãy xem lại! 🤔");
    }

    // Auto advance after 2 seconds
  }, [
    currentReviewIndex,
    currentQuizType,
    selectedOption,
    quizAnswer,
    reviewWords,
  ]);

  const proceedToNextWord = useCallback(() => {
    const reviewWords = vocabularies.filter((v) => v.isMarkedForReview);
    if (currentReviewIndex < reviewWords.length - 1) {
      const randomType =
        quizTypes[Math.floor(Math.random() * quizTypes.length)];
      setCurrentReviewIndex(currentReviewIndex + 1);
      setShowAnswer(false);
      setShowQuiz(true);
      setCurrentQuizType(randomType);

      if (randomType === "multiple-choice") {
        const options = generateQuizOptions(
          reviewWords[currentReviewIndex + 1].meaning,
          vocabularies
        );
        setQuizOptions(options);
      } else if (randomType === "fill-blank") {
        setQuizAnswer("");
      } else if (randomType === "audio") {
        setSelectedOption("");
      }
      setQuizCompleted(false);
    } else {
      endReviewSession();
    }
  }, [currentReviewIndex, vocabularies, endReviewSession]);

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true);
  }, []);

  const handleFlashcardNext = useCallback(() => {
    const reviewWords = vocabularies.filter((v) => v.isMarkedForReview);
    if (currentReviewIndex < reviewWords.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
      setShowAnswer(false);
    } else {
      endReviewSession();
    }
  }, [currentReviewIndex, vocabularies, endReviewSession]);

  const toggleMarkForReview = useCallback(
    (vocabId: string) => {
      setVocabularies((prev) =>
        prev.map((v) =>
          v.id === vocabId
            ? { ...v, isMarkedForReview: !v.isMarkedForReview }
            : v
        )
      );
    },
    [setVocabularies]
  );

  return {
    // State
    currentReviewIndex,
    isReviewMode,
    showAnswer,
    reviewSession,
    reviewMode,
    currentQuizType,
    showQuiz,
    quizAnswer,
    quizOptions,
    selectedOption,
    quizCompleted,
    currentReviewWord,

    // Actions
    startFlashcardSession,
    startQuizSession,
    endReviewSession,
    handleQuizSubmit,
    proceedToNextWord,
    handleShowAnswer,
    handleFlashcardNext,
    toggleMarkForReview,
    setQuizAnswer,
    setSelectedOption,
  };
}
