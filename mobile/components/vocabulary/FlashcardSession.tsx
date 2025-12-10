import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { WeakVocabulary } from '~/types/vocabulary';
import { colors } from '~/constants/Color';
import { Audio } from 'expo-av';

interface FlashcardSessionProps {
  currentWord: WeakVocabulary;
  showAnswer: boolean;
  onShowAnswer: () => void;
  onNext: () => void;
  isLastCard: boolean;
}

export const FlashcardSession: React.FC<FlashcardSessionProps> = ({
  currentWord,
  showAnswer,
  onShowAnswer,
  onNext,
  isLastCard,
}) => {
  const handlePlayAudio = async () => {
    if (!currentWord.audioUrl) return;

    try {
      const { sound } = await Audio.Sound.createAsync({ uri: currentWord.audioUrl });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Front side - Word */}
        <View style={styles.frontSide}>
          <View style={styles.wordHeader}>
            <Text style={styles.word}>{currentWord.word}</Text>
            {currentWord.audioUrl && (
              <TouchableOpacity style={styles.audioButton} onPress={handlePlayAudio}>
                <Feather name="volume-2" size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.pronunciation}>{currentWord.pronunciation}</Text>
          <Text style={styles.partOfSpeech}>[{currentWord.partOfSpeech}]</Text>
        </View>

        {/* Back side - Meaning and examples (shown when revealed) */}
        {showAnswer && (
          <View style={styles.backSide}>
            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Nghĩa:</Text>
            <Text style={styles.meaning}>{currentWord.meaning}</Text>

            <Text style={styles.sectionTitle}>Ví dụ:</Text>
            <Text style={styles.example}>{currentWord.exampleEn}</Text>
            <Text style={styles.exampleTranslation}>{currentWord.exampleVn}</Text>

            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Đúng:</Text>
                <Text style={[styles.statValue, styles.correctValue]}>
                  {currentWord.correctCount}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Sai:</Text>
                <Text style={[styles.statValue, styles.wrongValue]}>{currentWord.wrongCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Ôn tập:</Text>
                <Text style={styles.statValue}>{currentWord.timesReviewed}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        {!showAnswer ? (
          <TouchableOpacity style={styles.primaryButton} onPress={onShowAnswer}>
            <Feather name="eye" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Xem đáp án</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
            <Text style={styles.primaryButtonText}>{isLastCard ? 'Hoàn thành' : 'Tiếp theo'}</Text>
            {!isLastCard && <Feather name="arrow-right" size={20} color="#fff" />}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  frontSide: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  word: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pronunciation: {
    fontSize: 18,
    color: colors.mutedForeground,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  partOfSpeech: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  backSide: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
    marginTop: 12,
    marginBottom: 6,
  },
  meaning: {
    fontSize: 18,
    color: colors.foreground,
    lineHeight: 26,
  },
  example: {
    fontSize: 15,
    color: colors.foreground,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  exampleTranslation: {
    fontSize: 15,
    color: colors.mutedForeground,
    lineHeight: 22,
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
  },
  correctValue: {
    color: '#22c55e',
  },
  wrongValue: {
    color: '#ef4444',
  },
  actions: {
    width: '100%',
    maxWidth: 500,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
