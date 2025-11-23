import axios from "axios";
import { LocalStorage } from "./localStorage";

// import { addToast } from "@heroui/toast";

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: Date;
  path: string;
}

// Request timeout in milliseconds
const REQUEST_TIMEOUT_MS = 60_000;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.tukitoeic.app",
  timeout: REQUEST_TIMEOUT_MS,
  timeoutErrorMessage: "Thời gian chờ kết nối quá lâu",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    if (config.headers["Authorization"]) {
      return config;
    }

    const token = localStorage.getItem(LocalStorage.token);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // check network
    if (navigator.onLine === false) {
      return Promise.reject(new Error("Network is offline"));
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const errorResponse: ErrorResponse = error.response.data;

    if (errorResponse.statusCode === 401) {
      localStorage.removeItem(LocalStorage.userId);
      localStorage.removeItem(LocalStorage.token);
      window.location.href = "/auth/login";
    }

    return Promise.reject(errorResponse);
  }
);
