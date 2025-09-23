import { ApiResponse } from '@/types';
import api from "@/libs/axios-config";
import { showError } from "@/libs/toast";
import { IUser } from "@/types/implements";
import { log } from "console";

export interface LoginRequest {
  username: string;
  password: string;
}

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

export const login = async (body: LoginRequest) => {
  try {
    
    const response = await api.post<
      ApiResponse<{ token: string; user: IUser }>
    >(`/auth/login`, body);


    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginGoogle = async (body: LoginGoogleRequest) => {
  try {
    const response = await api.post<
      ApiResponse<{ token: string; user: IUser }>
    >(`/auth/login/google`, body);

    // console.log("Login response at api:", response);

    return response.data;
  } catch (error) {
    // console.log("Login error at api:", error);
    throw error;
  }
};

export const loginFacebook = async (body: LoginFacebookRequest) => {
  try {
    const response = await api.post<
      ApiResponse<{ token: string; user: IUser }>
    >(`/auth/login/facbook`, body);

    // console.log("Login response at api:", response);

    return response.data;
  } catch (error) {
    // console.log("Login error at api:", error);
    throw error;
  }
};

export const logout = async (body: LogoutRequest) => {
  try {
    const response = await api.post<ApiResponse<void>>(`/auth/logout`, body);
    // console.log("Logout response at api:", response);
    return response.data;
  } catch (error) {
    console.log("Logout error at api:", error);
    showError("Logout failed. Please try again.");
    throw error;
  }
};

export const checkToken = async (body: CheckTokenRequest) => {
  try {
    // const response = await api.post<ApiResponse<{ valid: boolean }>>(
    //   `/auth/introspect`,
    //   body
    // );
    // console.log("Check token response at api:", response);
    // return response.data;
    return { success: true, data: { valid: true }, message: "Token is valid" };
  } catch (error) {
    console.log("Check token error at api:", error);
    showError("Token validation failed. Please log in again.");
    throw error;
  }
};

export const refreshToken = async (token: string) => {
  try {
    const response = await api.post<ApiResponse<{ token: string }>>(
      `/auth/refresh`,
      { token }
    );
    // console.log("Refresh token response at api:", response);
    return response.data;
  } catch (error) {
    console.log("Refresh token error at api:", error);
    showError("Token refresh failed. Please log in again.");
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post<ApiResponse<void>>(
      `/auth/forgot-password?email=${email}`
    );
    // console.log("Forgot password response at api:", response);
    return response.data;
  } catch (error) {
    console.log("Forgot password error at api:", error);
    showError("Failed to send reset password email. Please try again.");
    throw error;
  }
};

export const resetPassword = async (body: ResetPasswordRequest) => {
  try {
    const response = await api.post<ApiResponse<void>>(
      `/auth/reset-password`,
      body
    );
    // console.log("Reset password response at api:", response);
    return response.data;
  } catch (error) {
    console.log("Reset password error at api:", error);
    showError("Failed to reset password. Please try again.");
    throw error;
  }
};
