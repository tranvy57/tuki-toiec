export interface TestItem {
  test_id: number;
  title: string;
  description?: string;
  duration?: number;
  totalQuestions?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface TestResult {
  testId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: Date;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface TestAttempt {
  id: string;
  testId: number;
  userId: string;
  answers: Record<string, string>;
  startTime: Date;
  endTime?: Date;
  score?: number;
}
