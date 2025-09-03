export interface Answer {
  content: string;
  isCorrect: boolean;
  answerKey: "A" | "B" | "C" | "D";
}

export interface Question {
  numberLabel: number;
  content: string;
  explanation: string;
  answers: Answer[];
}

export interface Group {
  orderIndex: number;
  paragraphEn: string;
  paragraphVn: string;
  imageUrl: string;
  audioUrl: string;
  questions: Question[];
}

export interface Part {
  partNumber: number;
  directions: string;
  groups: Group[];
}

export interface Exam {
  title: string;
  audioUrl: string;
  parts: Part[];
}

export interface ExamFormData {
  title: string;
  audioUrl?: string;
  parts: PartFormData[];
}

export interface PartFormData {
  partNumber: number;
  directions: string;
  groups: GroupFormData[];
}

export interface GroupFormData {
  orderIndex: number;
  paragraphEn?: string;
  paragraphVn?: string;
  imageUrl?: string;
  audioUrl?: string;
  questions: QuestionFormData[];
}

export interface QuestionFormData {
  numberLabel: number;
  content: string;
  explanation?: string;
  answers: AnswerFormData[];
}

export interface AnswerFormData {
  content: string;
  isCorrect: boolean;
  answerKey: "A" | "B" | "C" | "D";
}

export interface ExcelImportResult {
  success: boolean;
  data?: ExamFormData;
  error?: string;
  warnings?: string[];
}
