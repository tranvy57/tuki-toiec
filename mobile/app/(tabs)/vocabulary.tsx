import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Modal, ScrollView } from 'react-native';
import { VocabularyList, VocabularySearch, VocabularyDetail, VocabularyCategories, VocabularyStats } from '../../components/vocabulary';
import { Vocabulary } from '../../types/vocabulary';
import { colors } from '../../constants/Color';
import { StatusBar } from 'expo-status-bar';
import { getVocabularies, getWordAudioUrl } from '~/api/vocabularies';
import { Audio } from 'expo-av';

export default function VocabularyScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedVocabulary, setSelectedVocabulary] = useState<Vocabulary | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleVocabularyPress = (vocabulary: Vocabulary) => {
    setSelectedVocabulary(vocabulary);
    setIsDetailModalVisible(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalVisible(false);
    setSelectedVocabulary(null);
  };

  const handlePlayAudio = async () => {
    if (!selectedVocabulary) return;

    const url = await getWordAudioUrl(selectedVocabulary.word);
    if (!url) return;

    const { sound } = await Audio.Sound.createAsync({ uri: url });
    await sound.playAsync();
  };

  const handleAddToFavorites = () => {
    // TODO: Implement favorites functionality
    console.log('Add to favorites:', selectedVocabulary?.word);
  };

  useEffect(() => {
    const fetchVocabularies = async () => {
      try {
        const response = await getVocabularies();
        setVocabularies(response.data); 
      } catch (error) {
        console.error('Error fetching vocabularies:', error);
      }
    };

    fetchVocabularies();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vocabulary</Text>
        <Text style={styles.headerSubtitle}>Learn and practice new words</Text>
      </View>

      {/* Search */}
      <VocabularySearch 
        onSearch={handleSearch}
        placeholder="Search words, meanings, examples..."
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Stats */}
        <VocabularyStats
          totalWords={vocabularies.length}
          learnedWords={22}
          todayWords={8}
          weekStreak={7}
        />

        {/* Categories */}
        <VocabularyCategories
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Vocabulary List */}
        <VocabularyList
          vocabularies={vocabularies}
          onVocabularyPress={handleVocabularyPress}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseDetail}
      >
        {selectedVocabulary && (
          <VocabularyDetail
            vocabulary={selectedVocabulary}
            onClose={handleCloseDetail}
            onPlayAudio={handlePlayAudio}
            onAddToFavorites={handleAddToFavorites}
            isFavorite={false}
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
});
