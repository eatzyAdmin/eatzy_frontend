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
        setAccessToken(payload.access_token);
        setUser(payload.user);
        setToken(null);
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
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
