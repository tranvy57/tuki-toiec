import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { WeakVocabulary, ReviewSession, ReviewMode, QuizType } from '~/types/vocabulary';
import {
  useMarkUserVocabulary,
  useUpdateVocabularyProgress,
  ReviewVocabulary,
} from '~/api/vocabularies/useVocabularyReview';

export function useVocabularyReview(
  vocabularies: WeakVocabulary[],
  setVocabularies: React.Dispatch<React.SetStateAction<WeakVocabulary[]>>,
  vocabularyReviews?: { items: ReviewVocabulary[]; totalItems: number }
) {
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
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizOptions, setQuizOptions] = useState<{ key: string; value: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);

  const { mutate: markUserVocab } = useMarkUserVocabulary();
  const { mutate: updateProgress } = useUpdateVocabularyProgress();

  const currentReviewWord = vocabularyReviews?.items?.[currentReviewIndex];

  // Start a quiz for a specific word
  const startQuiz = useCallback((word: ReviewVocabulary) => {
    setCurrentQuizType(word.type);
    setShowQuiz(true);
    setQuizCompleted(false);
    setSelectedOption('');
    setQuizAnswer('');

    if (word.type === 'mcq' && word.content.choices) {
      setQuizOptions(word.content.choices);
    }
  }, []);

  // Start flashcard session
  const startFlashcardSession = useCallback(() => {
    const reviewWords = vocabularies.filter((v) => v.isBookmarked);
    if (reviewWords.length === 0) {
      Alert.alert('Thông báo', 'Không có từ nào được đánh dấu để ôn tập!');
      return;
    }

    setIsReviewMode(true);
    setReviewMode('flashcard');
    setCurrentReviewIndex(0);
    setShowAnswer(false);
    setReviewSession({
      correct: 0,
      total: reviewWords.length,
      sessionActive: true,
    });
  }, [vocabularies]);

  // Start quiz session
  const startQuizSession = useCallback(() => {
    if (!vocabularyReviews || vocabularyReviews.totalItems === 0) {
      Alert.alert('Thông báo', 'Không có từ vựng để ôn tập!');
      return;
    }

    setIsReviewMode(true);
    setReviewMode('quiz');
    setCurrentReviewIndex(0);
    setShowAnswer(false);
    setShowQuiz(false);
    setReviewSession({
      correct: 0,
      total: vocabularyReviews.totalItems,
      sessionActive: true,
    });

    // Start first quiz immediately
    const firstWord = vocabularyReviews.items[0];
    startQuiz(firstWord);
  }, [vocabularyReviews, startQuiz]);

  // End review session
  const endReviewSession = useCallback(() => {
    setIsReviewMode(false);
    setReviewMode(null);
    setShowQuiz(false);
    setReviewSession((prev) => ({ ...prev, sessionActive: false }));

    if (reviewMode === 'quiz') {
      const accuracy =
        reviewSession.total > 0
          ? ((reviewSession.correct / reviewSession.total) * 100).toFixed(1)
          : 0;
      Alert.alert('Hoàn thành Quiz!', `Độ chính xác: ${accuracy}%`);
    } else {
      Alert.alert('Hoàn thành!', 'Bạn đã hoàn thành ôn tập Flashcard!');
    }
  }, [reviewMode, reviewSession]);

  // Handle quiz submit
  const handleQuizSubmit = useCallback(() => {
    if (!currentReviewWord) return;

    let isCorrect = false;

    if (currentQuizType === 'mcq') {
      isCorrect = selectedOption === currentReviewWord.content.correctKey;
    } else if (currentQuizType === 'cloze' || currentQuizType === 'pronunciation') {
      isCorrect =
        quizAnswer.toLowerCase().trim() === currentReviewWord.content.answer?.toLowerCase().trim();
    }

    // Update vocabulary progress
    updateProgress({
      vocabId: currentReviewWord.vocabId,
      isCorrect,
    });

    setQuizCompleted(true);

    // Update score
    if (isCorrect) {
      setReviewSession((prev) => ({ ...prev, correct: prev.correct + 1 }));
    }
  }, [currentReviewWord, currentQuizType, selectedOption, quizAnswer, updateProgress]);

  // Proceed to next word
  const proceedToNextWord = useCallback(() => {
    if (!vocabularyReviews) return;

    if (currentReviewIndex < vocabularyReviews.totalItems - 1) {
      const nextIndex = currentReviewIndex + 1;
      const nextWord = vocabularyReviews.items[nextIndex];

      setCurrentReviewIndex(nextIndex);
      setShowAnswer(false);
      setQuizCompleted(false);
      startQuiz(nextWord);
    } else {
      endReviewSession();
    }
  }, [currentReviewIndex, vocabularyReviews, endReviewSession, startQuiz]);

  // Show answer in flashcard
  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true);
  }, []);

  // Next flashcard
  const handleFlashcardNext = useCallback(() => {
    const reviewWords = vocabularies.filter((v) => v.isBookmarked);
    if (currentReviewIndex < reviewWords.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
      setShowAnswer(false);
    } else {
      endReviewSession();
    }
  }, [currentReviewIndex, vocabularies, endReviewSession]);

  // Toggle mark for review (bookmark)
  const toggleMarkForReview = useCallback(
    (vocabId: string) => {
      const vocab = vocabularies.find((v) => v.id === vocabId);
      if (!vocab) return;

      markUserVocab(
        { id: vocabId, status: !vocab.isBookmarked },
        {
          onSuccess: () => {
            setVocabularies((prev) =>
              prev.map((v) => (v.id === vocabId ? { ...v, isBookmarked: !v.isBookmarked } : v))
            );
          },
        }
      );
    },
    [vocabularies, setVocabularies, markUserVocab]
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
