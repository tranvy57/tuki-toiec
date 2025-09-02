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

// Interceptor trước khi gửi request
api.interceptors.request.use(
  async (config) => {
    // check network
    if (navigator.onLine === false) {
      // addToast({
      // 	title: "Mất kết nối mạng",
      // 	description: "Vui lòng kiểm tra lại kết nối mạng",
      // 	color: "danger",
      // });
      return Promise.reject(new Error('Network is offline'));
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// // Interceptor xử lý lỗi
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (!error.response) {
//       return Promise.reject(error);
//     }

//     const errorResponse: ErrorResponse = error.response.data;

//     if (errorResponse.statusCode === 401) {
//       // addToast({
//       // 	title: "Phiên đăng nhập đã hết hạn",
//       // 	description: "Vui lòng đăng nhập lại",
//       // 	color: "danger",
//       // });
//       window.location.href = '/admin/login';
//     }

//     return Promise.reject(errorResponse);
//   }
// );
