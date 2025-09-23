"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VocabularySearch } from "@/components/toeic/vocabulary/vocabulary-search";
import { VocabularyStats } from "@/components/toeic/vocabulary/vocabulary-stats";
import { VocabularyCategories } from "@/components/toeic/vocabulary/vocabulary-categories";
import { VocabularyList } from "@/components/toeic/vocabulary/vocabulary-list";
import { VocabularyDetail } from "@/components/toeic/vocabulary/vocabulary-detail";
import { Vocabulary } from "@/types/vocabulary";
import { getVocabularies, getWordAudioUrl } from "@/libs/vocabulary-data";

export default function VocabularyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedVocabulary, setSelectedVocabulary] =
    useState<Vocabulary | null>(null);
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

    try {
      const url = await getWordAudioUrl(selectedVocabulary.word);
      if (url) {
        const audio = new Audio(url);
        await audio.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handleAddToFavorites = () => {
    // TODO: Implement favorites functionality
    console.log("Add to favorites:", selectedVocabulary?.word);
  };

  useEffect(() => {
    const fetchVocabularies = async () => {
      try {
        const response = await getVocabularies();
        setVocabularies(response.data);
      } catch (error) {
        console.error("Error fetching vocabularies:", error);
      }
    };

    fetchVocabularies();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Vocabulary</CardTitle>
          <p className="text-muted-foreground">
            Learn and practice new words to improve your TOEIC score
          </p>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <VocabularySearch
            onSearch={handleSearch}
            placeholder="Search words, meanings, examples..."
          />
        </CardContent>
      </Card>

      {/* Stats */}
      <VocabularyStats
        totalWords={vocabularies.length}
        learnedWords={22}
        todayWords={8}
        weekStreak={7}
      />

      {/* Categories */}
      <Card>
        <CardContent className="p-4">
          <VocabularyCategories
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </CardContent>
      </Card>

      {/* Vocabulary List */}
      <VocabularyList
        vocabularies={vocabularies}
        onVocabularyPress={handleVocabularyPress}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />

      {/* Detail Modal */}
      {isDetailModalVisible && selectedVocabulary && (
        <VocabularyDetail
          vocabulary={selectedVocabulary}
          onClose={handleCloseDetail}
          onPlayAudio={handlePlayAudio}
          onAddToFavorites={handleAddToFavorites}
          isFavorite={false}
        />
      )}
    </div>
  );
}
