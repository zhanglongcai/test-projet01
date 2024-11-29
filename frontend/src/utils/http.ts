import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { auth } from './auth';
import { toastManager } from './toast-manager';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  time: number;
  data: T;
}

export const ErrorCode = {
  SUCCESS: 0,
  PARAM_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
} as const;

// 请求队列，用于处理并发请求时的token刷新
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

export const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
http.interceptors.request.use(
  async (config) => {
    const token = auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data as ApiResponse;
    
    if (code !== ErrorCode.SUCCESS) {
      return Promise.reject(new Error(message));
    }
    
    return data;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

    // 处理 token 过期
    if (error.response?.status === ErrorCode.UNAUTHORIZED && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const newToken = await auth.refreshToken();
          isRefreshing = false;
          onTokenRefreshed(newToken);
          
          // 重试原始请求
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return http(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          auth.handleSessionExpiry();
          return Promise.reject(refreshError);
        }
      } else {
        // 等待 token 刷新完成
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(http(originalRequest));
          });
        });
      }
    }

    // 处理其他错误
    if (error.code === 'ECONNABORTED') {
      // 超时重试
      const retryCount = (originalRequest._retryCount || 0) + 1;
      if (retryCount <= 3) {
        originalRequest._retryCount = retryCount;
        return http(originalRequest);
      }
      toastManager.error('请求超时，请重试');
      return Promise.reject(error);
    }

    if (!error.response) {
      toastManager.error('网络连接失败，请检查网络设置');
      return Promise.reject(error);
    }

    const errorMessage = error.response.data?.message || error.message || '请求失败';
    toastManager.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);