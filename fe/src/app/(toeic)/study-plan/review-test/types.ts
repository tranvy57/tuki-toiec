export interface TOEICPart {
  id: number;
  name: string;
  description: string;
  questions: number;
  skill: "Listening" | "Reading";
  icon: any;
  color: string;
}

export interface Group {
  id: string;
  partNumber: number;
  partName: string;
  orderIndex: number;
  audioUrl?: string;
  imageUrl?: string;
  paragraphEn?: string;
  paragraphVn?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  part: number;
  partName: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  questionNumber: number; // Question number within the group (1, 2, 3...)
  groupId: string; // Reference to the group this question belongs to
}

export interface ApiGroup {
  id: string;
  orderIndex: number;
  audioUrl: string | null;
  imageUrl: string | null;
  paragraphEn: string | null;
  paragraphVn: string | null;
  questions: ApiQuestion[];
}

export interface ApiQuestion {
  id: string;
  numberLabel: number;
  content: string;
  answers: {
    id: string;
    answerKey: string;
    content: string;
    isCorrect: boolean;
  }[];
  explanation?: string | null;
}

export interface ApiPart {
  id: string;
  partNumber: number;
  groups: ApiGroup[];
  directions?: string;
}

export interface ApiTestData {
  id: string;
  mode: "test" | "review" | "practice";
  status: string;
  startedAt: string;
  finishAt: string | null;
  totalScore: number | null;
  parts: ApiPart[];
}

export interface TestResults {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  estimatedBand: string;
  level: string;
  recommendations: string[];
  weakAreas: TOEICPart[];
  strongAreas: TOEICPart[];
}

export interface BandScoreMapping {
  band: string;
  level: string;
  color: string;
}

export type ReviewTestStage = "intro" | "test" | "results" | "recommendations";
