import { useQuery } from "@tanstack/react-query";
import { getAccount } from "../api";
import { useAuthStore } from "@repo/store";
import { useEffect } from "react";

export const useAuth = () => {
  const { setUser, clearAuth } = useAuthStore();

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await getAccount();
      return res;
    },
    // Don't retry if it's an auth error (handled by interceptor)
    retry: (failureCount, error: any) => {
      if (error?.statusCode === 401) return false;
      return failureCount < 1;
    },
    // Stale time: User profile doesn't change often, keep for 5 mins
    staleTime: 5 * 60 * 1000,
    // Refetch on window focus to ensure checking session
    refetchOnWindowFocus: true,
  });

  // Sync with global store
  useEffect(() => {
    if (data && data.data && data.data.user) {
      setUser(data.data.user);
    } else if (isError) {
      clearAuth();
    }
  }, [data, isError, setUser, clearAuth]);

  return {
    user: data?.data?.user ?? null,
    isAuthenticated: !!data?.data?.user,
    isLoading,
    error,
    isError,
    refetch,
  };
};
