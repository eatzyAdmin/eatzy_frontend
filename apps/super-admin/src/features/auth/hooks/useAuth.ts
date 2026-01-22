import { useQuery } from "@tanstack/react-query";
import { getAccount } from "../api";
import { useAuthStore } from "@repo/store";
import { useEffect } from "react";
import type { IBackendRes, IUserGetAccount } from "@repo/types";

export const useAuth = () => {
  const { setUser, clearAuth } = useAuthStore();

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await getAccount();
      return res as IBackendRes<IUserGetAccount>;
    },
    retry: (failureCount: number, err: Error & { statusCode?: number }) => {
      if (err?.statusCode === 401) return false;
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

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
