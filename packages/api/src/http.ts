import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

let accessToken: string | null = null;
let tokenGeneration = 0;
let refreshInFlight: Promise<string> | null = null;
type SessionRequest = InternalAxiosRequestConfig & { _retry?: boolean; _authGeneration?: number };
class SessionChangedError extends Error {}

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  tokenGeneration++;
};
export const getAccessToken = () => accessToken;

const usesOwnCredentials = (url = "") => {
  const path = url.split("?")[0];
  return ["/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/refresh"].includes(path)
    || path.startsWith("/api/v1/email/");
};

export const http = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

http.interceptors.request.use((config: SessionRequest) => {
  if (config._authGeneration !== undefined && config._authGeneration !== tokenGeneration) {
    throw new SessionChangedError("Session changed before request retry");
  }
  config._authGeneration = tokenGeneration;
  if (usesOwnCredentials(config.url)) config.headers.delete("Authorization");
  else if (accessToken) config.headers.set("Authorization", `Bearer ${accessToken}`);
  return config;
});

function refreshAccessToken(): Promise<string> {
  if (refreshInFlight) return refreshInFlight;
  const generation = tokenGeneration;
  const pending = (async () => {
    try {
      const body: unknown = await http.get("/api/v1/auth/refresh", { timeout: 5000 });
      const record = body as { access_token?: unknown; data?: { access_token?: unknown } } | null;
      const token = record?.data?.access_token ?? record?.access_token;
      if (generation !== tokenGeneration) throw new SessionChangedError("Session changed during refresh");
      if (typeof token !== "string" || !token.trim()) throw new Error("Refresh response has no access token");
      // Automatic rotation preserves the account generation; explicit login/logout changes it.
      accessToken = token;
      return token;
    } catch (error) {
      if (generation !== tokenGeneration && !(error instanceof SessionChangedError)) {
        throw new SessionChangedError("Session changed during refresh");
      }
      if (!(error instanceof SessionChangedError)) {
        setAccessToken(null);
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.localStorage.setItem("auth_expired", "true");
          window.location.href = "/login";
        }
      }
      throw error;
    }
  })();
  refreshInFlight = pending;
  void pending.then(
    () => { if (refreshInFlight === pending) refreshInFlight = null; },
    () => { if (refreshInFlight === pending) refreshInFlight = null; },
  );
  return pending;
}

http.interceptors.response.use(
  (response) => response.data ?? response,
  async (error: AxiosError) => {
    const request = error.config as SessionRequest | undefined;
    if (request && error.response?.status === 401 && !request._retry && !usesOwnCredentials(request.url)) {
      request._retry = true;
      if (request._authGeneration !== tokenGeneration) {
        throw new SessionChangedError("Session changed while request was in flight");
      }
      const sentToken = request.headers.get("Authorization");
      // An older request may fail after another request already refreshed the session.
      const token = accessToken && sentToken !== `Bearer ${accessToken}`
        ? accessToken : await refreshAccessToken();
      request.headers.set("Authorization", `Bearer ${token}`);
      return http(request);
    }
    return Promise.reject(error.response?.data ?? error);
  },
);
