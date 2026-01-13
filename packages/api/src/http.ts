import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// ======= Memory Storage for Access Token =======
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// ======= Token Refresh Logic =======
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// ===============================================

export const http = axios.create({
  // Use Next.js Rewrite Proxy to solve Mixed Content (HTTP backend vs HTTPS frontend)
  baseURL: "/api/proxy",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach Token from Memory
http.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh Token
http.interceptors.response.use(
  (response) => {
    return response.data ?? response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loops if the refresh endpoint itself fails
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(http(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint
        // Verify the path matches packages/api/src/auth.ts (which is /api/v1/auth/refresh)
        // We use 'http' instance here but we need to bypass interceptors loop if needed.
        // Actually, since it's a new request and we check url above, it's fine.
        const res: any = await http.get("/api/v1/auth/refresh");

        // res.data is already unwrapped by the success interceptor
        const newAccessToken = res?.access_token || res?.data?.access_token;

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          isRefreshing = false;
          onRefreshed(newAccessToken);

          // Retry the original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return http(originalRequest);
        } else {
          // Failed to get token
          isRefreshing = false;
          setAccessToken(null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        isRefreshing = false;
        setAccessToken(null);
        // We might want to clear subscribers here too or reject them
        refreshSubscribers = [];
        return Promise.reject(refreshError);
      }
    }

    // Return specific error data if available
    if (error?.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);