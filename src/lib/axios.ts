import {
  REFRESH_TOKEN_NAME,
  TOKEN_NAME,
  USER_DETAILS,
} from "@/utils/constants";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Dynamic Request Interceptor: Attach latest token from cookies
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get(TOKEN_NAME);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Catch 401, refresh token silently, and replay requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and request was not already retried and not a login/refresh request
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const storedRefreshToken = Cookies.get(REFRESH_TOKEN_NAME);

      if (!storedRefreshToken) {
        isRefreshing = false;
        // No refresh token available, clean up and return error
        Cookies.remove(TOKEN_NAME);
        Cookies.remove(REFRESH_TOKEN_NAME);
        Cookies.remove(USER_DETAILS);
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken: storedRefreshToken,
        });

        const newAccessToken = data?.accessToken || data?.token;
        const newRefreshToken = data?.refreshToken;

        if (newAccessToken) {
          Cookies.set(TOKEN_NAME, newAccessToken, { expires: 1 }); // 1 day
          if (newRefreshToken) {
            Cookies.set(REFRESH_TOKEN_NAME, newRefreshToken, { expires: 30 }); // 30 days
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          return axiosInstance(originalRequest);
        } else {
          throw new Error("No access token returned from refresh endpoint");
        }
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        Cookies.remove(TOKEN_NAME);
        Cookies.remove(REFRESH_TOKEN_NAME);
        Cookies.remove(USER_DETAILS);
        if (typeof window !== "undefined") {
          window.location.href = `/account/login?redirectUrl=${encodeURIComponent(
            window.location.pathname,
          )}`;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
