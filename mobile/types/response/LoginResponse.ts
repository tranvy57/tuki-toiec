import z from "zod";
import { BaseResponseSchema } from "./BaseResponse";
import { UserSchema } from "./UserResponse";

export const LoginResponseSchema = BaseResponseSchema(
  z.object({
    token: z.string(),
    user: UserSchema,
  })
);

export type LoginResponse = z.infer<typeof LoginResponseSchema>;