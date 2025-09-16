import * as z from "zod";

export const VocabularySchema = z.object({
  word: z.string().min(2).max(100),
  meaning: z.string().min(2).max(500),
  pronunciation: z.string().min(2).max(100),
  partOfSpeech: z.string().min(2).max(100),
  exampleEn: z.string().min(2).max(500),
  exampleVn: z.string().min(2).max(500),
  audioUrl: z.string().url().nullable().optional(),
});

export type Vocabulary = z.infer<typeof VocabularySchema>;

export interface VocabularyCardProps {
  vocabulary: Vocabulary;
  onPress?: (vocabulary: Vocabulary) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

export interface VocabularyListProps {
  vocabularies: Vocabulary[];
  onVocabularyPress?: (vocabulary: Vocabulary) => void;
  searchQuery?: string;
  selectedCategory?: string;
}

export interface VocabularySearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export interface VocabularyStatsProps {
  totalWords: number;
  learnedWords: number;
  todayWords: number;
  weekStreak: number;
}

export interface VocabularyCategoriesProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export interface VocabularyDetailProps {
  vocabulary: Vocabulary;
  onClose: () => void;
  onPlayAudio: () => void;
  onAddToFavorites: () => void;
  isFavorite: boolean;
}
