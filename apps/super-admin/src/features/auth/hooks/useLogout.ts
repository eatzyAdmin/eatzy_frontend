import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@repo/api";
import { setAccessToken } from "@repo/api/http";
import { useAuthStore } from "@repo/store";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      setAccessToken(null);
      clearAuth();
      queryClient.clear();
      router.push("/login");
    },
    onError: (error: Error) => {
      console.error("Logout failed:", error);
      setAccessToken(null);
      clearAuth();
      queryClient.clear();
      router.push("/login");
    }
  });

  return {
    handleLogout: () => mutation.mutate(),
    isLoading: mutation.isPending,
  };
};
