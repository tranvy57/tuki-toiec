import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { WeakVocabulary } from '~/types/vocabulary';
import { colors } from '~/constants/Color';
import { Audio } from 'expo-av';

interface VocabularyCardProps {
  vocabulary: WeakVocabulary;
  onToggleMarkForReview: (id: string) => void;
  onPress?: (vocabulary: WeakVocabulary) => void;
}

const getWeaknessColor = (level?: string) => {
  switch (level) {
    case 'critical':
      return styles.badgeCritical;
    case 'moderate':
      return styles.badgeModerate;
    case 'mild':
      return styles.badgeMild;
    default:
      return styles.badgeNone;
  }
};

const getWeaknessLabel = (strength?: number, timesReviewed?: number) => {
  if (!timesReviewed || timesReviewed < 10) return 'Từ mới';
  if (!strength) return 'Chưa xác định';
  if (strength >= 0.15) return 'Trung bình';
  if (strength >= 0.1) return 'Hơi yếu';
  return 'Rất yếu';
};

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  vocabulary,
  onToggleMarkForReview,
  onPress,
}) => {
  const handlePlayAudio = async () => {
    if (!vocabulary.audioUrl) return;

    try {
      const { sound } = await Audio.Sound.createAsync({ uri: vocabulary.audioUrl });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handlePress = () => {
    onPress?.(vocabulary);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.wordInfo}>
          <Text style={styles.word}>{vocabulary.word}</Text>
          <Text style={styles.pronunciation}>{vocabulary.pronunciation}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.audioButton}
            onPress={handlePlayAudio}
            disabled={!vocabulary.audioUrl}>
            <Feather
              name="volume-2"
              size={20}
              color={vocabulary.audioUrl ? colors.primary : colors.mutedForeground}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bookmarkButton, vocabulary.isBookmarked && styles.bookmarkButtonActive]}
            onPress={() => onToggleMarkForReview(vocabulary.id)}>
            <Feather
              name="star"
              size={20}
              color={vocabulary.isBookmarked ? '#fff' : colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Badges */}
      <View style={styles.badges}>
        <View style={[styles.badge, getWeaknessColor(vocabulary.weaknessLevel)]}>
          <Text style={styles.badgeText}>
            {getWeaknessLabel(vocabulary.strength, vocabulary.timesReviewed)}
          </Text>
        </View>

        {vocabulary.timesReviewed > 0 && (
          <View style={[styles.badge, styles.badgeReviewed]}>
            <Text style={[styles.badgeText, styles.badgeReviewedText]}>
              Đã ôn {vocabulary.timesReviewed} lần
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.partOfSpeech}>[{vocabulary.partOfSpeech}]</Text>
        <Text style={styles.meaning}>{vocabulary.meaning}</Text>
      </View>

      {/* Examples */}
      <View style={styles.examples}>
        <Text style={styles.exampleEn}>
          <Text style={styles.exampleLabel}>Ví dụ: </Text>
          {vocabulary.exampleEn}
        </Text>
        <Text style={styles.exampleVn}>
          <Text style={styles.exampleLabel}>Dịch: </Text>
          {vocabulary.exampleVn}
        </Text>
      </View>

      {/* Last reviewed */}
      {vocabulary.lastReviewedAt && (
        <Text style={styles.lastReviewed}>
          Ôn tập lần cuối: {new Date(vocabulary.lastReviewedAt).toLocaleDateString('vi-VN')}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.warmGray900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  wordInfo: {
    flex: 1,
    gap: 4,
  },
  word: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
  },
  pronunciation: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  audioButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  bookmarkButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  badgeCritical: {
    backgroundColor: '#ef4444',
  },
  badgeModerate: {
    backgroundColor: '#f97316',
  },
  badgeMild: {
    backgroundColor: '#eab308',
  },
  badgeNone: {
    backgroundColor: colors.primary,
  },
  badgeReviewed: {
    backgroundColor: '#22c55e',
  },
  badgeReviewedText: {
    color: '#fff',
  },
  content: {
    marginBottom: 8,
  },
  partOfSpeech: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  meaning: {
    fontSize: 15,
    color: colors.foreground,
    lineHeight: 22,
  },
  examples: {
    marginTop: 8,
    gap: 4,
  },
  exampleLabel: {
    fontWeight: '600',
    color: colors.foreground,
  },
  exampleEn: {
    fontSize: 13,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  exampleVn: {
    fontSize: 13,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  lastReviewed: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
