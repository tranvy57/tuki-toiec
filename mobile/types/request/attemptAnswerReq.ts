import z from "zod";

export const CreateAttemptAnswerReqSchema = z.object({
  attemptId: z.string().uuid(),
  questionId: z.string().uuid(),
  answerId: z.string().uuid(),
});

export type CreateAttemptAnswerReq = z.infer<typeof CreateAttemptAnswerReqSchema>;
