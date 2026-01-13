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
      // res is IBackendRes<IUserGetAccount>
      // Based on http.ts, it returns res.data ?? res.
      // If backend returns { data: ... }, axios returns that.
      // We assume res.data contains the payload if using standard response wrapper.
      // If your backend returns unwrapped data, then res is the data.
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

  // Sync with global store (optional, but good if other disconnected parts use store)
  useEffect(() => {
    if (data && data.data && data.data.user) {
      // Assuming data structure based on authApi types
      // Adjust if necessary based on real response
      setUser(data.data.user);
    } else if (isError) {
      // If error (after retries/interceptor), we are likely not logged in
      clearAuth();
    }
  }, [data, isError, setUser, clearAuth]);

  return {
    user: data?.data?.user ?? null,
    isAuthenticated: !!data?.data?.user,
    isLoading,
    error,
    refetch,
  };
};
