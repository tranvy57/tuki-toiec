import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  WeakVocabulary,
  ReviewMode,
  QuizType,
  ReviewSession as ReviewSessionType,
} from '~/types/vocabulary';
import { ReviewVocabulary } from '~/api/vocabularies/useVocabularyReview';
import { FlashcardSession } from './FlashcardSession';
import { QuizSession } from './QuizSession';
import { colors } from '~/constants/Color';

interface ReviewSessionProps {
  reviewMode: ReviewMode;
  currentWord: ReviewVocabulary;
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
  quizOptions: { key: string; value: string }[];
  selectedOption: string;
  onSelectOption: (option: string) => void;
  quizAnswer: string;
  onAnswerChange: (answer: string) => void;
  quizCompleted: boolean;
  onQuizSubmit: () => void;
  onProceedToNext: () => void;

  // Flashcard word (when in flashcard mode)
  flashcardWord?: WeakVocabulary;
}

export const ReviewSession: React.FC<ReviewSessionProps> = ({
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
  flashcardWord,
}) => {
  const progress =
    reviewSession.total > 0 ? ((currentReviewIndex + 1) / reviewSession.total) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitle}>
            {reviewMode === 'flashcard' ? (
              <>
                <Feather name="book-open" size={20} color={colors.primary} />
                <Text style={styles.headerTitleText}>Ôn tập Flashcard</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="brain" size={20} color={colors.primary} />
                <Text style={styles.headerTitleText}>Quiz từ vựng</Text>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onEndSession}>
            <Feather name="x" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              Tiến độ: {currentReviewIndex + 1}/{reviewSession.total}
            </Text>
            {reviewMode === 'quiz' && (
              <Text style={styles.progressText}>
                Điểm: {reviewSession.correct}/{currentReviewIndex + (quizCompleted ? 1 : 0)}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {reviewMode === 'flashcard' && flashcardWord && (
          <FlashcardSession
            currentWord={flashcardWord}
            showAnswer={showAnswer}
            onShowAnswer={onShowAnswer}
            onNext={onFlashcardNext}
            isLastCard={currentReviewIndex === reviewSession.total - 1}
          />
        )}

        {reviewMode === 'quiz' && showQuiz && currentWord && (
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
});
