"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { walletApi, mapWalletTransactionToDriverWalletTransaction } from "@repo/api";
import type { DriverWalletTransaction } from "@repo/types";
import { WALLET_CREDIT_TYPES, WALLET_DEBIT_TYPES } from "@repo/types";

export interface UseWalletTransactionsParams {
    /** Transaction type filter */
    type?: 'ALL' | 'IN' | 'OUT';
    /** Search term for description */
    search?: string;
}

export interface UseWalletTransactionsResult {
    /** List of wallet transactions */
    transactions: DriverWalletTransaction[];
    /** Whether initial loading is in progress */
    isLoading: boolean;
    /** Whether fetching next page is in progress */
    isFetchingNextPage: boolean;
    /** Whether there are more pages to load */
    hasNextPage: boolean;
    /** Fetch the next page */
    fetchNextPage: () => void;
    /** Error if any */
    error: Error | null;
    /** Refetch function */
    refetch: () => void;
    /** Total number of transactions */
    total: number;
}

// Query key factory for wallet queries
export const driverWalletKeys = {
    all: ['driver-wallet'] as const,
    transactions: () => [...driverWalletKeys.all, 'transactions'] as const,
    transactionsWithFilters: (type?: string, search?: string) =>
        [...driverWalletKeys.transactions(), { type, search }] as const,
};

// ======== Hook ========

/**
 * Hook to fetch wallet transactions with filtering and pagination
 * Uses infinite query for load-more functionality
 * 
 * @param params - Filter and search parameters
 * @returns Wallet transactions data and pagination controls
 * 
 * @example
 * ```tsx
 * const { transactions, isLoading, hasNextPage, fetchNextPage } = useWalletTransactions({
 *   type: 'IN', // Filter by credit transactions
 *   search: 'delivery' // Search in description
 * });
 * ```
 */
export function useWalletTransactions(params?: UseWalletTransactionsParams): UseWalletTransactionsResult {
    // Build filter for transaction types using shared constants
    // Springfilter syntax: ':' for equals (enum), '~' for contains (string like)
    const buildTypeFilter = (types: readonly string[]) => {
        return `(${types.map(t => `transactionType:'${t}'`).join(' or ')})`;
    };

    let typeFilter = "";
    if (params?.type === "IN") {
        typeFilter = buildTypeFilter(WALLET_CREDIT_TYPES);
    } else if (params?.type === "OUT") {
        typeFilter = buildTypeFilter(WALLET_DEBIT_TYPES);
    }

    // Add search query if provided (searching in description - text field)
    // Springfilter: '~' with wildcards for string contains
    let finalFilter = typeFilter;
    if (params?.search) {
        const s = params.search.trim();
        if (s) {
            const searchQuery = `description~'*${s}*'`;
            finalFilter = finalFilter ? `${finalFilter} and ${searchQuery}` : searchQuery;
        }
    }

    const {
        data,
        isLoading,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: driverWalletKeys.transactionsWithFilters(params?.type, params?.search),
        queryFn: async ({ pageParam = 1 }) => {
            const response = await walletApi.getMyWalletTransactions({
                filter: finalFilter || undefined,
                page: pageParam,
                size: 15,
                sort: "createdAt,desc",
            });

            if (response.statusCode === 200 && response.data) {
                const result = response.data.result || [];
                const meta = response.data.meta;

                // Use mapper from @repo/api
                const transactions: DriverWalletTransaction[] = result.map(mapWalletTransactionToDriverWalletTransaction);

                return {
                    items: transactions,
                    nextPage: meta && meta.page < meta.pages ? meta.page + 1 : undefined,
                    total: meta?.total || 0,
                    pages: meta?.pages || 0
                };
            }

            return { items: [], nextPage: undefined, total: 0, pages: 0 };
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 30 * 1000, // 30 seconds
    });

    // Flatten all pages into single array
    const transactions = data?.pages.flatMap(page => page.items) || [];

    return {
        transactions,
        isLoading,
        isFetchingNextPage,
        hasNextPage: hasNextPage ?? false,
        fetchNextPage,
        error: error as Error | null,
        refetch,
        total: data?.pages[0]?.total || 0
    };
}
