"use client";
import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@repo/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { WalletTransactionResponse } from "@repo/types";

export interface UseWalletTransactionsResult {
    transactions: WalletTransactionResponse[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
    totalTransactions: number;
}

/**
 * Hook to get wallet transactions for the logged-in driver
 */
export function useWalletTransactions(params?: {
    page?: number;
    size?: number;
    type?: 'ALL' | 'IN' | 'OUT';
    search?: string;
}): UseWalletTransactionsResult {
    const { user } = useAuth();
    const isLoggedIn = !!user?.id;

    // Build filter for transaction types
    // IN: DEPOSIT, REFUND, DELIVERY_EARNING, TOP_UP, EARNING
    // OUT: WITHDRAWAL, PAYMENT, COMMISSION_PAID, ORDER_PAYMENT
    let typeFilter = "";
    if (params?.type === "IN") {
        typeFilter = "(transactionType~'DEPOSIT' or transactionType~'REFUND' or transactionType~'DELIVERY_EARNING' or transactionType~'TOP_UP' or transactionType~'EARNING')";
    } else if (params?.type === "OUT") {
        typeFilter = "(transactionType~'WITHDRAWAL' or transactionType~'PAYMENT' or transactionType~'COMMISSION_PAID' or transactionType~'ORDER_PAYMENT')";
    }

    // Add search query if provided (e.g. searching in description)
    let finalFilter = typeFilter;
    if (params?.search) {
        const s = params.search.trim();
        if (s) {
            const searchQuery = `description ~ '*${s}*'`;
            finalFilter = finalFilter ? `${finalFilter} and ${searchQuery}` : searchQuery;
        }
    }

    const query = useQuery({
        queryKey: ["wallet-transactions", "my", finalFilter, params?.page, params?.size],
        queryFn: async () => {
            const response = await walletApi.getMyWalletTransactions({
                filter: finalFilter,
                page: params?.page ?? 0,
                size: params?.size ?? 50,
                sort: "createdAt,desc",
            });

            if (response.statusCode === 200 && response.data) {
                return response.data.result || [];
            }
            return [];
        },
        enabled: isLoggedIn,
        staleTime: 30 * 1000, // 30 seconds
    });

    const transactions = query.data || [];

    return {
        transactions,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        totalTransactions: transactions.length,
    };
}
