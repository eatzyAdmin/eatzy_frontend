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

    try {
      const res = await authApi.login({
        username: data.email,
        password: data.password,
      });

      if (res.data?.access_token && res.data?.user) {
        // Save to store (and local storage via persist middleware)
        setLogin(res.data.access_token, res.data.user);

        // Also save to raw localStorage for Axios interceptor to pick up immediately
        localStorage.setItem("access_token", res.data.access_token);

        // DO NOT setIsLoading(false) here on success
        // This keeps the spinner going while parent component redirects
        return true;
      }
      return false;
    } catch (err: any) {
      // Backend returns structured error (IBackendRes) via interceptor
      // Structure: { statusCode, message, error, data }
      if (err?.message) {
        // Backend often returns "message" as the human readable error
        // Sometimes detail is in "error" if it's a validation array, but usually message is good
        if (Array.isArray(err.message)) {
          setError(err.message[0]);
        } else {
          setError(err.message);
        }
      } else if (err?.error) {
        // Fallback to error field if message is missing
        if (Array.isArray(err.error)) {
          setError(err.error[0]);
        } else {
          setError(err.error);
        }
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }

      // Stop loading ONLY on error
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
