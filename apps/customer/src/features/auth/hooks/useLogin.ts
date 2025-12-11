import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@repo/api";
import { useAuthStore } from "@repo/store";
import { LoginFormData } from "@repo/lib";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setLogin } = useAuthStore();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await authApi.login({
        username: data.email,
        password: data.password,
      });

      // res is IBackendRes<IResLoginDTO>
      // The actual login data is inside res.data
      if (res.data?.access_token && res.data?.user) {
        // Save to store (and local storage via persist middleware)
        setLogin(res.data.access_token, res.data.user);

        // Also save to raw localStorage for Axios interceptor to pick up immediately
        localStorage.setItem("access_token", res.data.access_token);

        // Redirect
        router.push("/home");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    isLoading,
    error,
  };
};
