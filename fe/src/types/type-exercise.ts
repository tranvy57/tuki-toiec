// Lesson type definitions matching the JSON schema

export type VocabFlashcardItem = {
  id: string;
  term: string;
  ipa: string;
  meaning: string;
  example_en: string;
  example_vi: string;
  tts_en: string;
  tags: string[];
};

export type VocabListeningItem = {
  id: string;
  audio_tts: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  vi_explanation: string;
};

export type ListeningClozeItem = {
  id: string;
  audio_tts: string;
  text_with_blanks: string;
  blanks: string[];
  keywords: string[][];
  explanation: string;
  vi_explanation: string;
};

export type ListeningMCQItem = {
  id: string;
  audio_tts: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  vi_explanation: string;
};

export type ReadingTranslateItem = {
  id: string;
  sentence_en: string;
  target_vi: string;
  keywords: string[];
  explanation: string;
  vi_explanation: string;
};

export type ReadingMCQItem = {
  id: string;
  passage_en: string;
  questions: {
    q: string;
    options: string[];
    correct_index: number;
    explanation: string;
    vi_explanation: string;
  }[];
};

export type GrammarClozeItem = {
  id: string;
  sentence_with_blank: string;
  options: string[];
  correct_index: number;
  rule: string;
  explanation: string;
  vi_explanation: string;
};

export type GrammarFormulaItem = {
  id: string;
  prompt: string;
  options: string[];
  correct_index: number;
  rule: string;
  explanation: string;
  vi_explanation: string;
};

export type Lesson =
  | {
      type: "vocab_flashcard";
      title: string;
      estimated_minutes: number;
      items: VocabFlashcardItem[];
    }
  | {
      type: "vocab_listening";
      title: string;
      estimated_minutes: number;
      items: VocabListeningItem[];
    }
  | {
      type: "listening_cloze";
      title: string;
      estimated_minutes: number;
      items: ListeningClozeItem[];
    }
  | {
      type: "listening_mcq";
      title: string;
      estimated_minutes: number;
      items: ListeningMCQItem[];
    }
  | {
      type: "reading_translate";
      title: string;
      estimated_minutes: number;
      items: ReadingTranslateItem[];
    }
  | {
      type: "reading_mcq";
      title: string;
      estimated_minutes: number;
      items: ReadingMCQItem[];
    }
  | {
      type: "grammar_cloze";
      title: string;
      estimated_minutes: number;
      items: GrammarClozeItem[];
    }
  | {
      type: "grammar_formula";
      title: string;
      estimated_minutes: number;
      items: GrammarFormulaItem[];
    };

export interface AnswerResult {
  correct: boolean;
  itemId: string;
  userAnswer: any;
}

export interface LessonSummary {
  correctCount: number;
  total: number;
  detail: AnswerResult[];
}
