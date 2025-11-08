// Base content interface
export interface BaseContentData {
  id: string;
  type: 'strategy' | 'video' | 'quiz' | 'explanation' | 'vocabulary';
  title: string;
  content: string;
  order: number;
  isPremium: boolean;
  isCompleted?: boolean;
  duration?: number; // in minutes
}

// Strategy content - learning strategies and tips
export interface StrategyContent extends BaseContentData {
  type: 'strategy';
  tips: string[];
  examples?: string[];
  keyPoints: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Video content - instructional videos
export interface VideoContent extends BaseContentData {
  type: 'video';
  videoUrl: string;
  thumbnailUrl?: string;
  subtitles?: string;
  transcript?: string;
  chapters?: VideoChapter[];
}

export interface VideoChapter {
  id: string;
  title: string;
  startTime: number; // in seconds
  endTime: number;
}

// Quiz content - interactive exercises
export interface QuizContent extends BaseContentData {
  type: 'quiz';
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // in minutes
  attempts: number;
  maxAttempts: number;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching' | 'ordering' | 'dictation';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  media?: {
    type: 'image' | 'audio';
    url: string;
  };
  // Dictation specific fields
  title?: string;
  audioUrl?: string;
  sentences?: string[];
  correctAnswers?: string[];
  difficulty?: string;
  bandHint?: number;
}

// Explanation content - detailed explanations
export interface ExplanationContent extends BaseContentData {
  type: 'explanation';
  sections: ExplanationSection[];
  relatedTopics?: string[];
  summary: string;
}

export interface ExplanationSection {
  id: string;
  title: string;
  content: string;
  examples?: Example[];
  notes?: string[];
}

export interface Example {
  id: string;
  text: string;
  explanation: string;
  isCorrect: boolean;
}

// Vocabulary content - word learning
export interface VocabularyContent extends BaseContentData {
  type: 'vocabulary';
  words: VocabularyWord[];
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  practiceMode: 'flashcard' | 'spelling' | 'pronunciation' | 'usage';
}

export interface VocabularyWord {
  id: string;
  word: string;
  pronunciation: string;
  phonetic?: string;
  definitions: Definition[];
  examples: WordExample[];
  audioUrl?: string;
  imageUrl?: string;
  synonyms?: string[];
  antonyms?: string[];
  difficulty: number; // 1-5
}

export interface Definition {
  id: string;
  partOfSpeech:
    | 'noun'
    | 'verb'
    | 'adjective'
    | 'adverb'
    | 'preposition'
    | 'conjunction'
    | 'interjection';
  meaning: string;
  example?: string;
}

export interface WordExample {
  id: string;
  sentence: string;
  translation?: string;
  context: string;
}

// Union type for all content types
export type ContentData =
  | StrategyContent
  | VideoContent
  | QuizContent
  | ExplanationContent
  | VocabularyContent;

// Content progress tracking
export interface ContentProgress {
  contentId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // in seconds
  score?: number;
  attempts: number;
  currentPosition?: number; // for video/audio content
  answers?: any[]; // for quiz content
  isCompleted: boolean;
}

// Content display props
export interface ContentDisplayProps {
  content: ContentData;
  progress?: ContentProgress;
  onComplete: (score?: number) => void;
  onProgress: (progress: Partial<ContentProgress>) => void;
  isPreview?: boolean;
}
