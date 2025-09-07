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
  baseURL: process.env.NEXT_PUBLIC_API,
  timeout: REQUEST_TIMEOUT_MS,
  timeoutErrorMessage: "Thời gian chờ kết nối quá lâu",
  headers: { "Content-Type": "application/json" },
});

// // Interceptor trước khi gửi request
// api.interceptors.request.use(
//   async (config) => {
//     // Kiểm tra nếu headers đã có token và id-device thì không làm gì thêm
//     if (config.headers["Authorization"] && config.headers["ip-device"]) {
//       return config;
//     }

//     // Lấy token và idDevice từ localStorage
//     let token = localStorage.getItem(LocalStorage.token);

//     // Nếu có token, gán cả token và idDevice vào headers
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     // check network
//     if (navigator.onLine === false) {
//       // addToast({
//       // 	title: "Mất kết nối mạng",
//       // 	description: "Vui lòng kiểm tra lại kết nối mạng",
//       // 	color: "danger",
//       // });
//       return Promise.reject(new Error("Network is offline"));
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // // Interceptor xử lý lỗi
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
//     //   warning("Phiên đăng nhập đã hết hạn", "Vui lòng đăng nhập lại");
//       localStorage.removeItem(LocalStorage.userId);
//       localStorage.removeItem(LocalStorage.token);
//       window.location.href = "/admin/login";
//     }

//     return Promise.reject(errorResponse);
//   }
// );
