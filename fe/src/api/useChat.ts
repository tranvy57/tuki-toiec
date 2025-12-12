import { useMutation } from "@tanstack/react-query";
import api from "@/libs/axios-config";

export interface ChatRequest {
  chat_id: string;
  user_input: string;
  user_id: string;
}

export interface ChatResponse {
  statusCode: number;
  message: string;
  data: string; // The result text directly
}

// Chat API function using axios
const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>("/chat", request);
  return response.data;
};

// Hook for sending chat messages
export const useChatMessage = () => {
  return useMutation({
    mutationFn: sendChatMessage,
    onError: (error) => {
      console.error("Chat API error:", error);
    },
  });
};

// Generate unique chat ID
export const generateChatId = () => {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get user ID from localStorage
export const getUserId = (): string => {
  if (typeof window === "undefined") return "";
  try {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.id || "";
    } 
  } catch (error) {
    console.error("Error getting user ID:", error);
  }
  return "";
};

// Default user ID (fallback)
export const DEFAULT_USER_ID = "4014b648-0960-44c0-8791-365165a8e50d";
