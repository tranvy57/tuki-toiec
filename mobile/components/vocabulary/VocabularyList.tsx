import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VocabularyCard } from './VocabularyCard';
import { colors } from '../../constants/Color';
import { Vocabulary } from '~/types/vocabulary';

interface VocabularyListProps {
  vocabularies: Vocabulary[];
  onVocabularyPress?: (vocabulary: any) => void;
  searchQuery?: string;
  selectedCategory?: string;
}

export const VocabularyList: React.FC<VocabularyListProps> = ({
  vocabularies,
  onVocabularyPress,
  searchQuery = '',
  selectedCategory = ''
}) => {


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {vocabularies.length} vocabulary{vocabularies.length !== 1 ? ' words' : ' word'}
        </Text>
        {searchQuery && (
          <Text style={styles.searchInfo}>
            Results for "{searchQuery}"
          </Text>
        )}
      </View>

      {/* Vocabulary Cards */}
      <View style={styles.listContainer}>
        {vocabularies.map((vocabulary, index) => (
          <VocabularyCard
            key={`vocab-${index}`}
            vocabulary={vocabulary}
            onPress={onVocabularyPress}
            variant="default"
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  searchInfo: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
});
