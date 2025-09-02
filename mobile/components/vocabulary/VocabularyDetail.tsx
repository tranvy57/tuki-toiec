import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Vocabulary } from '../../types/vocabulary';
import { colors } from '../../constants/Color';

interface VocabularyDetailProps {
  vocabulary: Vocabulary;
  onClose?: () => void;
  onPlayAudio?: () => void;
  onAddToFavorites?: () => void;
  isFavorite?: boolean;
}

export const VocabularyDetail: React.FC<VocabularyDetailProps> = ({
  vocabulary,
  onClose,
  onPlayAudio,
  onAddToFavorites,
  isFavorite = false
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vocabulary Detail</Text>
        <TouchableOpacity onPress={onAddToFavorites} style={styles.favoriteButton}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? colors.error : colors.mutedForeground}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Word Section */}
        <View style={styles.wordSection}>
          <View style={styles.wordContainer}>
            <Text style={styles.word}>{vocabulary.word}</Text>
            {vocabulary.partOfSpeech && (
              <View style={styles.partOfSpeechContainer}>
                <Text style={styles.partOfSpeech}>{vocabulary.partOfSpeech}</Text>
              </View>
            )}
            {vocabulary.pronunciation && (
              <View style={styles.pronunciationContainer}>
                <Text style={styles.pronunciation}>{vocabulary.pronunciation}</Text>
                <TouchableOpacity onPress={onPlayAudio} style={styles.audioButton}>
                  <Ionicons name="volume-high" size={20} color={colors.brandCoral600} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Meaning Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meaning</Text>
          <View style={styles.meaningContainer}>
            <Text style={styles.meaning}>{vocabulary.meaning}</Text>
          </View>
        </View>

        {/* Example Section */}
        {vocabulary.exampleEn && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Example</Text>
            <View style={styles.exampleContainer}>
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color={colors.mutedForeground}
                style={styles.exampleIcon}
              />
              <Text style={styles.example}>{vocabulary.exampleEn}</Text>
            </View>
          </View>
        )}

        {vocabulary.exampleVn && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dịch</Text>
            <View style={styles.exampleContainer}>
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color={colors.mutedForeground}
                style={styles.exampleIcon}
              />
              <Text style={styles.example}>{vocabulary.exampleVn}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Save for Later</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Practice</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Study Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tip}>
              <Ionicons name="bulb-outline" size={16} color={colors.warning} />
              <Text style={styles.tipText}>Try to use this word in 3 different sentences</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="refresh-outline" size={16} color={colors.info} />
              <Text style={styles.tipText}>Review this word again in 24 hours</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="people-outline" size={16} color={colors.success} />
              <Text style={styles.tipText}>Practice pronunciation with a partner</Text>
            </View>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
  },
  favoriteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  wordSection: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  wordContainer: {
    alignItems: 'center',
  },
  word: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primaryForeground,
    marginBottom: 8,
    textAlign: 'center',
  },
  pronunciationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pronunciation: {
    fontSize: 16,
    color: colors.primaryForeground,
    marginRight: 8,
  },
  audioButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 12,
  },
  meaningContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  meaning: {
    fontSize: 16,
    color: colors.foreground,
    lineHeight: 24,
  },
  exampleContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  exampleIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  example: {
    fontSize: 16,
    color: colors.secondaryForeground,
    lineHeight: 24,
    fontStyle: 'italic',
    flex: 1,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  tipsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: colors.foreground,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  partOfSpeechContainer: {
    backgroundColor: colors.warning,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  partOfSpeech: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

