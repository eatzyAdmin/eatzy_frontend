import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@repo/api";
import { setAccessToken } from "@repo/api/http";
import { useAuthStore } from "@repo/store";
import { LoginFormData } from "@repo/lib";
import type { IBackendRes, IResLoginDTO } from "@repo/types";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setToken } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await authApi.login({
        username: data.email,
        password: data.password,
      });
      return res as IBackendRes<IResLoginDTO>;
    },
    onSuccess: (data: IBackendRes<IResLoginDTO>) => {
      const payload = data.data;

      if (payload?.access_token && payload?.user) {
        // 1. Clear ALL React Query cache first (prevent data leakage between accounts)
        queryClient.clear();

        // 2. Set Access Token in Memory (Http Client)
        setAccessToken(payload.access_token);

        // 3. Update Store (User info only)
        setUser(payload.user);
        setToken(null);
      }
    },
    onError: (error: Error) => {
      console.error("Login failed:", error);
    }
  });

  return {
    handleLogin: (data: LoginFormData) => mutation.mutateAsync(data).then(() => true).catch(() => false),
    isLoading: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message || "Đăng nhập thất bại" : null,
  };
};
