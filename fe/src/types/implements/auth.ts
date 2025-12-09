import z from "zod";
import { UserSchema } from "./user";
import { BaseResponseSchema } from "../api-response";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

export const AuthResponseWrapped = BaseResponseSchema(AuthResponseSchema);

export type AuthResponse = z.infer<typeof AuthResponseWrapped>;

// API Types
export interface LogoutRequest {
  token: string;
}

export interface CheckTokenRequest {
  token: string;
}

export interface LoginGoogleRequest {
  idToken: string;
}

export interface LoginFacebookRequest {
  accessToken: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  otp: string;
}
