"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "@repo/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { WalletResponse } from "@repo/types";

export interface UseWalletResult {
    wallet: WalletResponse | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    /** Refetch function */
    refetch: () => void;
    /** Hard refresh (bypass cache) */
    refresh: () => Promise<void>;
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

    const queryClient = useQueryClient();

    /**
     * Hard refresh: bypass cache and force reload
     */
    const refresh = async () => {
        await queryClient.invalidateQueries({ queryKey: ["wallet", "my"] });
    };

    return {
        wallet: query.data || null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        refresh,
    };
}
