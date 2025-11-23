import { useMutation } from "@tanstack/react-query";

export interface ChatRequest {
  chat_id: string;
  user_input: string;
  user_id: string;
}

export interface ChatResponse {
  data: {
    result: string;
  };
  statusCode: number;
}

// Chat API function
const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  const response = await fetch("http://34.143.141.5:8000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to send chat message: ${response.status}`);
  }

  return response.json();
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

// Default user ID (you might want to get this from auth context)
export const DEFAULT_USER_ID = "4014b648-0960-44c0-8791-365165a8e50d";
