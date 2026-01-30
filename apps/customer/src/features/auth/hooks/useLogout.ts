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
      // Clear access token from memory
      setAccessToken(null);
      // Clear auth store (user info)
      clearAuth();
      // Clear ALL React Query cache to prevent data leakage between accounts
      queryClient.clear();
      // Redirect to login
      router.push("/login");
    },
    onError: (error: Error) => {
      console.error("Logout failed:", error);
      // Even on error, clear local state and redirect
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
