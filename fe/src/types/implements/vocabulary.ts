export interface WeakVocabulary {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  partOfSpeech: string;
  exampleEn: string;
  exampleVn: string;
  weaknessLevel: "critical" | "moderate" | "mild";
  mistakeCount: number;
  lastReviewDate: string;
  isMarkedForReview: boolean;
  audioUrl?: string;
}

export interface ReviewSession {
  correct: number;
  total: number;
  sessionActive: boolean;
}

export type ReviewMode = "flashcard" | "quiz" | null;
export type QuizType = "multiple-choice" | "fill-blank" | "audio" | null;

import { BaseResponseSchema } from "../api-response";
import * as z from "zod";

export const VocabularySchema = z.object({
  word: z.string().min(2).max(100),
  meaning: z.string().min(2).max(500),
  pronunciation: z.string().min(2).max(100),
  partOfSpeech: z.string().min(2).max(100),
  exampleEn: z.string().min(2).max(500),
  exampleVn: z.string().min(2).max(500),
  audioUrl: z.string().url().nullable().optional(),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isActive: z.boolean(),
  isPhrase: z.boolean(),
  lemma: z.string(),
  type: z.string(),
});

export const UserVocabularySchema = z.object({
  vocabulary: VocabularySchema,
  wrongCount: z.number(),
  correctCount: z.number(),
  status: z.enum(["learning", "learned", "review", "new"]),
});

export const UserVocabularyResponseSchema = BaseResponseSchema(
  z.array(UserVocabularySchema)
);

export type UserVocabulary = z.infer<typeof UserVocabularySchema>;

export type Vocabulary = z.infer<typeof VocabularySchema>;

export type UserVocabularyResponse = z.infer<
  typeof UserVocabularyResponseSchema
>;
