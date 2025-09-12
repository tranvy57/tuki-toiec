import z from "zod";

export const LoginReqSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
})

export type LoginReqType = z.infer<typeof LoginReqSchema>;