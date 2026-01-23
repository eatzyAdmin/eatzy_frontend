"use client";
import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@repo/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { WalletResponse } from "@repo/types";

export interface UseWalletResult {
    wallet: WalletResponse | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
}

/**
 * Hook to get the wallet for the logged-in user
 */
export function useWallet(): UseWalletResult {
    const { user } = useAuth();
    const isLoggedIn = !!user?.id;

    const query = useQuery({
        queryKey: ["wallet", "my"],
        queryFn: async () => {
            const response = await walletApi.getMyWallet();
            if (response.statusCode === 200 && response.data) {
                return response.data;
            }
            return null;
        },
        enabled: isLoggedIn,
        staleTime: 60 * 1000, // 1 minute
    });

    return {
        wallet: query.data || null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
