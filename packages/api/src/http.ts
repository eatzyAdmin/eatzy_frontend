import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { handleMockRequest } from "./mockAdapter";

// ======= Memory Storage for Access Token =======
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// ======= Mock Mode Controller =======
/**
 * Check if mock mode is active.
 * Default is TRUE in development to allow smooth UI work when backend is down.
 */
export const isMockModeEnabled = (): boolean => {
  if (typeof window !== "undefined") {
    const localSetting = window.localStorage.getItem("eatzy_mock_mode");
    if (localSetting === "false") return false;
    if (localSetting === "true") return true;
  }
  // Check environment variables
  if (process.env.NEXT_PUBLIC_ENABLE_MOCK === "false") return false;
  return true;
};

export const setMockMode = (enabled: boolean) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("eatzy_mock_mode", enabled ? "true" : "false");
    window.location.reload();
  }
};

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
  baseURL: "/api/proxy",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach Token & Handle Mock Adapter
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // If Mock Mode is enabled, route through Mock Adapter
    if (isMockModeEnabled() && config.url) {
      config.adapter = async (cfg) => {
        let parsedData = cfg.data;
        if (typeof cfg.data === "string") {
          try {
            parsedData = JSON.parse(cfg.data);
          } catch {
            parsedData = cfg.data;
          }
        }
        const mockResult = await handleMockRequest(cfg.url || "", cfg.method || "GET", parsedData, cfg.params);

        const response: AxiosResponse = {
          data: mockResult,
          status: 200,
          statusText: "OK",
          headers: {},
          config: cfg,
        };
        return response;
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401, Refresh Token & Mock Fallback
http.interceptors.response.use(
  (response) => {
    return response.data ?? response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If network failed (backend is down / unreachable), attempt seamless fallback to mock data
    if (error.code === "ERR_NETWORK" || !error.response || (error.response.status >= 500 && error.response.status <= 504)) {
      if (originalRequest?.url) {
        console.warn(`[Eatzy Mock Fallback] Backend unreachable at ${originalRequest.url}. Serving mock data.`);
        let parsedData = originalRequest.data;
        if (typeof originalRequest.data === "string") {
          try {
            parsedData = JSON.parse(originalRequest.data);
          } catch {
            parsedData = originalRequest.data;
          }
        }
        const mockData = await handleMockRequest(originalRequest.url, originalRequest.method, parsedData, originalRequest.params);
        return mockData;
      }
    }

    // If 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loops if the refresh endpoint itself fails
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
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
        const res: any = await http.get("/api/v1/auth/refresh");
        const newAccessToken = res?.access_token || res?.data?.access_token;

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          isRefreshing = false;
          onRefreshed(newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return http(originalRequest);
        } else {
          isRefreshing = false;
          setAccessToken(null);

          // Only redirect if NOT in mock mode
          if (!isMockModeEnabled() && typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
            window.localStorage.setItem("auth_expired", "true");
            window.location.href = "/login";
          }

          return Promise.reject(error);
        }
      } catch (refreshError) {
        isRefreshing = false;
        setAccessToken(null);
        refreshSubscribers = [];

        // Only redirect if NOT in mock mode
        if (!isMockModeEnabled() && typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.localStorage.setItem("auth_expired", "true");
          window.location.href = "/login";
        }

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