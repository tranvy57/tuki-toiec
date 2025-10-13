export interface ExerciseType {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

export interface Exercise {
  id: string;
  type_id: string;
  audio_url: string;
  question: any;
  correct_answer: any;
  transcript: string;
  vocabulary: any[];
  difficulty: "easy" | "medium" | "hard";
  order: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  exercise_type_id: string;
  completed_count: number;
  total_count: number;
  last_practiced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExerciseAttempt {
  id: string;
  user_id: string;
  exercise_id: string;
  user_answer: any;
  is_correct: boolean;
  time_spent: number;
  created_at: string;
}
