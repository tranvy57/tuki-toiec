import { z } from "zod";
import { BaseResponseSchema } from "../api-response";
import { SkillSchema } from "./skill";
import { title } from "process";

export const AnswerSchema = z.object({
  id: z.string(),
  content: z.string(), // nội dung đáp án
  answerKey: z.string(), // 'A', 'B', 'C', 'D'
  isCorrect: z.boolean(), // true nếu đáp án đúng, false nếu sai
});

export const QuestionSchema = z.object({
  id: z.string(),
  numberLabel: z.number(), // số câu
  content: z.string(), // nội dung câu hỏi
  explanation: z.string().nullable().optional(),
  answers: z.array(AnswerSchema), // các đáp án
});

export const GroupSchema = z.object({
  id: z.string(),
  orderIndex: z.number(),
  paragraphEn: z.string().nullable(),
  paragraphVn: z.string().nullable(),
  imageUrl: z.string().nullable(),
  audioUrl: z.string().nullable(),
  questions: z.array(QuestionSchema),
});

export const PartSchema = z.object({
  id: z.string(),
  partNumber: z.number().min(1).max(7), // từ 1-7
  directions: z.string().optional(),
  groups: z.array(GroupSchema),
});

export const TestSchema = z.object({
  id: z.string(),
  title: z.string(),
  audioUrl: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(), // có thể refine .datetime() nếu muốn
  updatedAt: z.string(),
});

export const PracticeTestResponseSchema = z.object({
  id: z.string(),
  mode: z.enum(["practice", "test", "review"]),
  test: TestSchema,
  parts: z.array(PartSchema),
  startedAt: z.string(),
  finishAt: z.string().nullable(),
  totalScore: z.number().nullable(),
  score: z.number().nullable().optional(),
  status: z.enum(["in_progress", "submitted"]),
});

export const ResultQuestionSchema = z.object({
  id: z.string(),
  numberLabel: z.number(), // số câu
  content: z.string(), // nội dung câu hỏi
});

export const UserAnswerSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  question: ResultQuestionSchema, // câu hỏi
  answer: AnswerSchema, // các đáp án
  isCorrect: z.boolean().nullable(),
});

export const SubmitQuestionSchema = z.object({
  id: z.string(),
  numberLabel: z.number(), // số câu
  content: z.string(), // nội dung câu hỏi
  explanation: z.string().nullable().optional(),
  answers: z.array(AnswerSchema), // các đáp án
  userAnswer: UserAnswerSchema.optional().nullable(),
});
export const SubmitGroupSchema = z.object({
  id: z.string(),
  orderIndex: z.number(),
  paragraphEn: z.string().nullable(),
  paragraphVn: z.string().nullable(),
  imageUrl: z.string().nullable(),
  audioUrl: z.string().nullable(),
  questions: z.array(SubmitQuestionSchema),
});

export const SubmitPartSchema = z.object({
  id: z.string(),
  partNumber: z.number().min(1).max(7), // từ 1-7
  directions: z.string().optional(),
  groups: z.array(SubmitGroupSchema),
});

export const FullPartSchema = z.object({
  id: z.string(),
  partNumber: z.number().min(1).max(7), // từ 1-7
  directions: z.string().optional(),
  groups: z.array(SubmitGroupSchema),
  skills: z.array(SkillSchema), 
});

export const ResultTestResponseSchema = z.object({
  id: z.string(),
  mode: z.enum(["practice", "test"]),
  parts: z.array(SubmitPartSchema),
  startedAt: z.string(),
  finishAt: z.string().nullable(),
  totalScore: z.number().nullable(),
  status: z.enum(["in_progress", "submitted"]),
});

export const FullTestResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  parts: z.array(FullPartSchema),
  audioUrl: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(), // có thể refine .datetime() nếu muốn
  updatedAt: z.string(),
});

export type Answer = z.infer<typeof AnswerSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Group = z.infer<typeof GroupSchema>;
export type Part = z.infer<typeof PartSchema>;
export type Test = z.infer<typeof TestSchema>;
export type PracticeTestResponse = z.infer<typeof PracticeTestResponseSchema>;
export type ResultTestResponse = z.infer<typeof ResultTestResponseSchema>;
export type FullTestResponse = z.infer<typeof FullTestResponseSchema>;
export type BaseResponse<T> = z.infer<ReturnType<typeof BaseResponseSchema>>;
