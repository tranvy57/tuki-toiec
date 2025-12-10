import * as z from 'zod';

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

// Extended interfaces for vocabulary review features
export interface WeakVocabulary {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  partOfSpeech: string;
  exampleEn: string;
  exampleVn: string;
  audioUrl?: string;
  wrongCount: number;
  correctCount: number;
  weaknessLevel: 'critical' | 'moderate' | 'mild' | 'none';
  strength: number;
  timesReviewed: number;
  lastReviewedAt?: Date;
  nextReviewAt?: Date | null;
  isBookmarked: boolean;
  status: 'learning' | 'learned' | 'review' | 'new';
}

export interface ReviewSession {
  correct: number;
  total: number;
  sessionActive: boolean;
}

export type ReviewMode = 'flashcard' | 'quiz' | null;
export type QuizType = 'mcq' | 'cloze' | 'pronunciation' | null;

export interface VocabularyCardProps {
  vocabulary: Vocabulary;
  onPress?: (vocabulary: Vocabulary) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

export interface VocabularyListProps {
  vocabularies: Vocabulary[];
  onVocabularyPress?: (vocabulary: Vocabulary) => void;
  searchQuery?: string;
}

export interface VocabularySearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}
