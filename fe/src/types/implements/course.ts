import z from "zod";
import { BaseResponseSchema } from "../api-response";

export const courseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(120),
  band: z.number().int().min(10).max(990).multipleOf(5), // TOEIC 10–990, bội số 5
  durationDays: z.number().int().min(1).max(365),
  price: z.number().int().min(0), // VND
  description: z.string().min(10).max(1000),
});

export type Course = z.infer<typeof courseSchema>;

export const CoursesResponse = BaseResponseSchema(z.array(courseSchema));

export type CoursesResponse = z.infer<typeof CoursesResponse>;
