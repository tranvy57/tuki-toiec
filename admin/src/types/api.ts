// Common API types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
  timestamp?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Course types
export interface Course {
  id: string;
  title: string;
  band: "beginner" | "intermediate" | "advanced" | "expert";
  durationDays: number;
  price: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userCoursesCount?: number;
  phasesCount?: number;
  ordersCount?: number;
}

export interface CreateCourseDto {
  title: string;
  band: "beginner" | "intermediate" | "advanced" | "expert";
  durationDays: number;
  price: number;
  description?: string;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}

// Test types
export interface Test {
  id: string;
  title: string;
  type?: "listening" | "reading" | "speaking" | "writing" | "full";
  questionsCount?: number;
  duration?: number;
  difficulty?: "easy" | "medium" | "hard";
  status?: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestDto {
  title: string;
  audioUrl?: string;
  duration?: number;
  description?: string;
  parts: {
    partNumber: number;
    direction?: string;
    groups: {
      orderIndex: number;
      paragraphEn?: string;
      paragraphVn?: string;
      imageUrl?: string;
      audioUrl?: string;
      questions: {
        numberLabel: number;
        content: string;
        explanation?: string;
        answers: {
          content: string;
          isCorrect: boolean;
          answerKey: string;
        }[];
      }[];
    }[];
  }[];
}

export interface UpdateTestDto extends Partial<CreateTestDto> {}

// Vocabulary types
export interface Vocabulary {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  partOfSpeech: string;
  exampleEn: string;
  exampleVn: string;
  audioUrl?: string;
  lemma?: string;
  type?: "ai_generated" | "toeic" | "exercise";
  isPhrase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVocabularyDto {
  word: string;
  pronunciation?: string;
  meaning: string;
  partOfSpeech?: string;
  exampleEn?: string;
  exampleVn?: string;
  audioUrl?: string;
  lemma?: string;
  type?: "ai_generated" | "toeic" | "exercise";
  isPhrase?: boolean;
}

export interface UpdateVocabularyDto extends Partial<CreateVocabularyDto> {}

// Order types
export interface Order {
  id: string;
  code: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "cancelled";
  bankCode?: string;
  vnpTransactionNo?: string;
  vnpPayDate?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  course?: {
    id: string;
    title: string;
    price: number;
  };
}

export interface CreateOrderDto {
  courseId: string;
  amount: number;
}

// Question types
export interface Question {
  id: string;
  content: string;
  part?: number;
  skill?: string;
  difficulty?: "easy" | "medium" | "hard";
  status?: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  answers?: Answer[];
  tags?: QuestionTag[];
}

export interface Answer {
  id: string;
  content: string;
  isCorrect: boolean;
  questionId: string;
}

export interface QuestionTag {
  id: string;
  name: string;
}

export interface CreateQuestionDto {
  content: string;
  part?: number;
  skill?: string;
  difficulty?: string;
  answers?: Array<{
    content: string;
    isCorrect: boolean;
  }>;
}

export interface UpdateQuestionDto extends Partial<CreateQuestionDto> {}

// Lesson types
export interface Lesson {
  id: string;
  name: string;
  description?: string;
  type: "plan" | "exercise" | "mock" | "review" | "ai";
  level?: string;
  order: number;
  unitId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonDto {
  name: string;
  description?: string;
  type: "plan" | "exercise" | "mock" | "review" | "ai";
  level?: string;
  order: number;
  unitId?: string;
}

export interface UpdateLessonDto extends Partial<CreateLessonDto> {}

// Phase types
export interface Phase {
  id: string;
  title: string;
  status: "locked" | "active" | "done";
  order: number;
  flag?: string;
  startAt?: string;
  completedAt?: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePhaseDto {
  title: string;
  status: "locked" | "active" | "done";
  order: number;
  flag?: string;
  courseId: string;
}

export interface UpdatePhaseDto extends Partial<CreatePhaseDto> {}
