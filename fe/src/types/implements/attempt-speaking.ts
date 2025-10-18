import { z } from "zod";
import { BaseResponseSchema } from "../api-response";

export const EvaluateSpeakingResponseSchema = z.object({
  pronunciationScore: z.number(), // thêm .min(0).max(100) nếu điểm 0–100
  fluencyScore: z.number(), // ví dụ: z.number().gte(0).lte(100)
  grammarScore: z.number().optional(),
  contentScore: z.number().optional(),
  totalScore: z.number(),
  feedback: z.string().optional(),
});

export const EvaluateSpeakingResponseWrapped = BaseResponseSchema(
  EvaluateSpeakingResponseSchema
);

export type EvaluateSpeakingResponse = z.infer<
  typeof EvaluateSpeakingResponseWrapped
>;
