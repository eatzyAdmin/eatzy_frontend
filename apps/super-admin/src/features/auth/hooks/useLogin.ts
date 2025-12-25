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
    localStorage.removeItem("access_token");

    try {
      const res = await authApi.login({
        username: data.email,
        password: data.password,
      });

      if (res.data?.access_token && res.data?.user) {
        setLogin(res.data.access_token, res.data.user);
        localStorage.setItem("access_token", res.data.access_token);
        return true;
      }

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
