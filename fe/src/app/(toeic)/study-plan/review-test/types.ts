export interface TOEICPart {
  id: number;
  name: string;
  description: string;
  questions: number;
  skill: "Listening" | "Reading";
  icon: any;
  color: string;
}

export interface Question {
  id: number;
  part: number;
  partName: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  passage?: string; // Optional passage for reading comprehension (Part 7)
  passageId?: string; // Group questions that share the same passage
  questionNumber?: number; // Question number within the passage (1, 2, 3...)
}

export interface TestResults {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  estimatedBand: string;
  level: string;
  timeSpent: number;
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
