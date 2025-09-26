import z from "zod";

export const BaseEntitySchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserRole = "ADMIN" | "USER";
export type TestMode = "practice" | "test";
export type TestStatus = "in_progress" | "submitted";
export type AnswerKey = "A" | "B" | "C" | "D";
export type PartNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
