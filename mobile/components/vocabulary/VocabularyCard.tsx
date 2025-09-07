import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { VocabularyCardProps } from '../../types/vocabulary';
import { colors } from '../../constants/Color';

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  vocabulary,
  onPress,
  variant = 'default'
}) => {
  const handlePress = () => {
    onPress?.(vocabulary);
  };

  const getCardStyle = () => {
    switch (variant) {
      case 'compact':
        return [styles.card, styles.compactCard];
      case 'detailed':
        return [styles.card, styles.detailedCard];
      default:
        return styles.card;
    }
  };

  return (
    <TouchableOpacity
      style={getCardStyle()}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Header with word and pronunciation */}
      <View style={styles.header}>
        <Text style={styles.word}>{vocabulary.word}</Text>
        {vocabulary.pronunciation && (
          <Text style={styles.pronunciation}>{vocabulary.pronunciation}</Text>
        )}
      </View>

      {/* Meaning */}
      <Text style={styles.meaning}>{vocabulary.meaning}</Text>

      {/* Example sentence (for detailed variant) */}
      {variant === 'detailed' && vocabulary.example_sentence && (
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleLabel}>Example:</Text>
          <Text style={styles.example}>{vocabulary.example_sentence}</Text>
        </View>
      )}

      {/* Learning indicator */}
      <View style={styles.indicator} />
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
  compactCard: {
    padding: 12,
    marginVertical: 4,
  },
  detailedCard: {
    padding: 20,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  word: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
  },
  pronunciation: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontStyle: 'italic',
    marginLeft: 8,
  },
  meaning: {
    fontSize: 16,
    color: colors.foreground,
    lineHeight: 22,
    marginBottom: 8,
  },
  exampleContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  example: {
    fontSize: 14,
    color: colors.secondaryForeground,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  indicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
});

