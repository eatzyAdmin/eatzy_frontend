import { useState } from "react";
import { authApi } from "@repo/api";
import { useAuthStore } from "@repo/store";
import { LoginFormData } from "@repo/lib";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLogin } = useAuthStore();

  const handleLogin = async (data: LoginFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Clear old token before login to prevent sending invalid token in Authorization header
    // causing backend to reject the request with 401/403 despite login endpoint being public
    localStorage.removeItem("access_token");

    try {
      const res = await authApi.login({
        username: data.email,
        password: data.password,
      });

      if (res.data?.access_token && res.data?.user) {
        setLogin(res.data.access_token, res.data.user);
        localStorage.setItem("access_token", res.data.access_token);

        // CRITICAL: Set cookie for Driver middleware authentication
        // Middleware at apps/driver/src/middleware.ts checks for 'driver_auth=1' cookie
        // Without this, middleware redirects /home -> /login causing infinite loop
        document.cookie = "driver_auth=1; path=/; max-age=86400"; // 1 day expiry

        // DO NOT setIsLoading(false) here on success to keep spinner during redirect
        return true;
      }

      // FIX: Handle case where response is OK but data is invalid (e.g. Proxy error)
      setError("Đăng nhập thất bại. Phản hồi không hợp lệ.");
      setIsLoading(false);
      return false;

    } catch (err: unknown) {
      if (typeof err === "object" && err !== null) {
        const maybeMessage = (err as { message?: string | string[] }).message;
        if (maybeMessage) {
          if (Array.isArray(maybeMessage)) {
            setError(maybeMessage[0]);
          } else {
            setError(maybeMessage);
          }
        } else {
          const maybeError = (err as { error?: string | string[] }).error;
          if (maybeError) {
            if (Array.isArray(maybeError)) {
              setError(maybeError[0]);
            } else {
              setError(maybeError);
            }
          } else {
            setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
          }
        }
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }

      setIsLoading(false);
      return false;
    }
  };

  return {
    handleLogin,
    isLoading,
    error,
  };
};
