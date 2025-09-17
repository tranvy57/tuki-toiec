import axios from 'axios';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { getValueFor, remove } from './secure-store';

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
  async (config) => {
    const token = await getValueFor('token');
    console.log(token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
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
      const { status, config } = error.response;
      console.log('❌ [Response Error]', { url: config?.url, status, data: error.response.data });

      // Check 401 Unauthorized
      if (status === 401) {
        remove('token'); // xoá token trong localStorage/cookie        
      }
    } else if (error.request) {
      console.log('❌ [Network Error]', error.message);
    } else {
      console.log('❌ [Axios Error]', error);
    }
    return Promise.reject(error);
  }
);
