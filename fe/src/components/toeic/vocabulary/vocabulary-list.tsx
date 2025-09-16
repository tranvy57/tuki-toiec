"use client";

import { VocabularyListProps } from "@/types/vocabulary";
import { VocabularyCard } from "./vocabulary-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo } from "react";

export function VocabularyList({
  vocabularies,
  onVocabularyPress,
  searchQuery = '',
  selectedCategory = ''
}: VocabularyListProps) {
  const filteredVocabularies = useMemo(() => {
    return vocabularies.filter(vocab => {
      const matchesSearch = searchQuery === '' || 
        vocab.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vocab.meaning.toLowerCase().includes(searchQuery.toLowerCase());
      
      // For now, we'll just filter by search. Category filtering can be implemented
      // when we have category data in vocabulary objects
      return matchesSearch;
    });
  }, [vocabularies, searchQuery, selectedCategory]);

  if (filteredVocabularies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {searchQuery ? 'No vocabulary found matching your search.' : 'No vocabulary available.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-foreground">
          Vocabulary List
        </h3>
        <span className="text-xs text-muted-foreground">
          {filteredVocabularies.length} words
        </span>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="space-y-4 pr-4">
          {filteredVocabularies.map((vocabulary, index) => (
            <VocabularyCard
              key={`${vocabulary.word}-${index}`}
              vocabulary={vocabulary}
              onPress={onVocabularyPress}
              variant="default"
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
