import { LoginRequest, AuthResponse, LoginGoogleRequest, LoginFacebookRequest, LogoutRequest, CheckTokenRequest, ResetPasswordRequest } from "@/types";
import api from "@/libs/axios-config";
import { useQuery } from "@tanstack/react-query";



export const login = async (body: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", body);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const loginGoogle = async (body: LoginGoogleRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login/google", body);
    return response.data;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

export const loginFacebook = async (body: LoginFacebookRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<{ data: AuthResponse }>("/auth/login/facebook", body);
    return response.data.data;
  } catch (error) {
    console.error("Facebook login error:", error);
    throw error;
  }
};

export const logout = async (body: LogoutRequest): Promise<void> => {
  try {
    await api.post("/auth/logout", body);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const checkToken = async (): Promise<{ valid: boolean }> => {
  try {
    const response = await api.get<{ data: { valid: boolean } }>("/auth/introspect");
    if(response.data.data.valid) {
      return { valid: true };
    } else {
      return { valid: false };
    }
  } catch (error) {
    console.error("Token validation error:", error);
    // Return invalid if check fails
    return { valid: false };
  }
};

export const refreshToken = async (token: string): Promise<{ token: string }> => {
  try {
    const response = await api.post<{ data: { token: string } }>("/auth/refresh", { token });
    return response.data.data;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await api.post(`/auth/forgot-password?email=${email}`);
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

export const resetPassword = async (body: ResetPasswordRequest): Promise<void> => {
  try {
    await api.post("/auth/reset-password", body);
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};

export function usePremiumStatus() {
  return useQuery({
    queryKey: ["user", "premium-status"],
    queryFn: async () => {
      const res = await api.get("user-courses/is-premium");
      if (!res.status) throw new Error("Failed to fetch premium status");
      return res.data as Promise<{ isPremium: boolean }>;
    },
  });
}
