import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  VocabularyDetail,
  StatsOverview,
  ReviewSession,
  VocabularyCard,
} from '~/components/vocabulary';
import { WeakVocabulary } from '~/types/vocabulary';
import { colors } from '~/constants/Color';
import { StatusBar } from 'expo-status-bar';
import {
  useGetUserVocabularies,
  useGetReviewVocabularies,
} from '~/api/vocabularies/useVocabularyReview';
import { useVocabularyReview } from '~/hooks/useVocabularyReview';

export default function VocabularyScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [vocabularies, setVocabularies] = useState<WeakVocabulary[]>([]);
  const [selectedVocabulary, setSelectedVocabulary] = useState<WeakVocabulary | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Fetch data
  const { data: userVocabData } = useGetUserVocabularies();
  const { data: reviewData } = useGetReviewVocabularies();

  useEffect(() => {
    if (userVocabData) {
      // Transform UserVocabulary[] to WeakVocabulary[]
      const transformedData = userVocabData.map((item) => ({
        id: item.vocabulary.id,
        word: item.vocabulary.word,
        meaning: item.vocabulary.meaning,
        pronunciation: item.vocabulary.pronunciation,
        partOfSpeech: item.vocabulary.partOfSpeech,
        exampleEn: item.vocabulary.exampleEn,
        exampleVn: item.vocabulary.exampleVn,
        audioUrl: item.vocabulary.audioUrl,
        wrongCount: item.wrongCount,
        correctCount: item.correctCount,
        weaknessLevel: item.weaknessLevel || 'none',
        strength: item.strength,
        timesReviewed: item.timesReviewed,
        lastReviewedAt: item.lastReviewedAt ? new Date(item.lastReviewedAt) : undefined,
        nextReviewAt: item.nextReviewAt ? new Date(item.nextReviewAt) : null,
        isBookmarked: item.isBookmarked,
        status: item.status,
      }));
      setVocabularies(transformedData);
    }
  }, [userVocabData]);

  // Vocabulary review hook
  const {
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
  } = useVocabularyReview(vocabularies, setVocabularies, reviewData);

  const handleVocabularyPress = (vocabulary: WeakVocabulary) => {
    setSelectedVocabulary(vocabulary);
    setIsDetailModalVisible(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalVisible(false);
    setSelectedVocabulary(null);
  };

  // Filter vocabularies
  const filteredVocabularies = vocabularies.filter((vocab) => {
    const matchesSearch =
      vocab.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vocab.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterLevel === 'all' || vocab.weaknessLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const markedForReview = vocabularies.filter((v) => v.isBookmarked).length;

  // If in review mode, show review session
  if (isReviewMode && reviewMode) {
    const reviewWords = vocabularies.filter((v) => v.isBookmarked);
    const flashcardWord = reviewMode === 'flashcard' ? reviewWords[currentReviewIndex] : undefined;

    // For flashcard mode, ensure we have a word
    if (reviewMode === 'flashcard' && !flashcardWord) {
      endReviewSession();
      return null;
    }

    // For quiz mode, ensure we have a current review word
    if (reviewMode === 'quiz' && !currentReviewWord) {
      endReviewSession();
      return null;
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <ReviewSession
          reviewMode={reviewMode}
          currentWord={currentReviewWord || ({} as any)}
          reviewSession={reviewSession}
          currentReviewIndex={currentReviewIndex}
          allVocabularies={vocabularies}
          onEndSession={endReviewSession}
          showAnswer={showAnswer}
          onShowAnswer={handleShowAnswer}
          onFlashcardNext={handleFlashcardNext}
          showQuiz={showQuiz}
          currentQuizType={currentQuizType}
          quizOptions={quizOptions}
          selectedOption={selectedOption}
          onSelectOption={setSelectedOption}
          quizAnswer={quizAnswer}
          onAnswerChange={setQuizAnswer}
          quizCompleted={quizCompleted}
          onQuizSubmit={handleQuizSubmit}
          onProceedToNext={proceedToNextWord}
          flashcardWord={flashcardWord}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vocabulary</Text>
        <Text style={styles.headerSubtitle}>Learn and practice new words</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <StatsOverview vocabularies={vocabularies} />

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.flashcardButton,
              markedForReview === 0 && styles.actionButtonDisabled,
            ]}
            onPress={startFlashcardSession}
            disabled={markedForReview === 0}>
            <Feather name="book-open" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Flashcard ({markedForReview} từ)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.quizButton]}
            onPress={startQuizSession}>
            <Feather name="zap" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Ôn tập</Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchFilter}>
          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={16}
              color={colors.mutedForeground}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm từ vựng..."
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, filterLevel === 'all' && styles.filterButtonActive]}
              onPress={() => setFilterLevel('all')}>
              <Text
                style={[
                  styles.filterButtonText,
                  filterLevel === 'all' && styles.filterButtonTextActive,
                ]}>
                Tất cả
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterLevel === 'critical' && styles.filterButtonActive]}
              onPress={() => setFilterLevel('critical')}>
              <Text
                style={[
                  styles.filterButtonText,
                  filterLevel === 'critical' && styles.filterButtonTextActive,
                ]}>
                Rất yếu
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterLevel === 'moderate' && styles.filterButtonActive]}
              onPress={() => setFilterLevel('moderate')}>
              <Text
                style={[
                  styles.filterButtonText,
                  filterLevel === 'moderate' && styles.filterButtonTextActive,
                ]}>
                Trung bình
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterLevel === 'mild' && styles.filterButtonActive]}
              onPress={() => setFilterLevel('mild')}>
              <Text
                style={[
                  styles.filterButtonText,
                  filterLevel === 'mild' && styles.filterButtonTextActive,
                ]}>
                Hơi yếu
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Vocabulary List */}
        {filteredVocabularies.length > 0 ? (
          filteredVocabularies.map((vocab) => (
            <VocabularyCard
              key={vocab.id}
              vocabulary={vocab}
              onToggleMarkForReview={toggleMarkForReview}
              onPress={handleVocabularyPress}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather name="book-open" size={48} color={colors.mutedForeground} />
            <Text style={styles.emptyStateTitle}>Không tìm thấy từ vựng</Text>
            <Text style={styles.emptyStateText}>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</Text>
          </View>
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseDetail}>
        {selectedVocabulary && (
          <VocabularyDetail
            vocabulary={selectedVocabulary}
            onClose={handleCloseDetail}
            onPlayAudio={() => {}}
            onAddToFavorites={() => toggleMarkForReview(selectedVocabulary.id)}
            isFavorite={selectedVocabulary.isBookmarked}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
  scrollView: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  flashcardButton: {
    backgroundColor: '#2563eb',
  },
  quizButton: {
    backgroundColor: colors.primary,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  searchFilter: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.foreground,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.mutedForeground,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});
