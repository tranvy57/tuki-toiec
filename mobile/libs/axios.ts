import axios from 'axios';
// import { addToast } from "@heroui/toast";

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: Date;
  path: string;
}

// Request timeout in milliseconds
const REQUEST_TIMEOUT_MS = 20000;

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: REQUEST_TIMEOUT_MS,
  timeoutErrorMessage: 'Thời gian chờ kết nối quá lâu',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    console.log('➡️ [Request]', config);
    return config;
  },
  (error) => {
    console.log('❌ [Request Error]', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ [Response]', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.log('❌ [Response Error]', error);
    } else if (error.request) {
      console.log('❌ [Network Error]', error.message);
    } else {
      console.log('❌ [Axios Error]', error.message);
    }
    return Promise.reject(error);
  }
);