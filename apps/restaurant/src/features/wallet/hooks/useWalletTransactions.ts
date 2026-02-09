'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { walletApi } from '@repo/api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
    WalletTransactionResponse,
    WalletTransaction,
    WalletTransactionType,
    WalletTransactionStatus,
    WALLET_CREDIT_TYPES,
    WALLET_DEBIT_TYPES,
} from '@repo/types';
import { walletKeys } from './useWallet';

export interface WalletSearchFields {
    id: string;
    description: string;
}

/**
 * Hook to fetch wallet transactions for current restaurant
 * Uses infinite query pattern for server-side pagination
 */
export function useWalletTransactions(
    searchFields?: WalletSearchFields,
    filterStr?: string,
    type?: 'ALL' | 'IN' | 'OUT'
) {
    const { user } = useAuth();
    const isLoggedIn = !!user?.id;

    const buildTypeFilter = (types: readonly string[]) => {
        return `(${types.map(t => `transactionType:'${t}'`).join(' or ')})`;
    };

    const {
        data,
        isLoading,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: walletKeys.transactionsWithFilters(searchFields?.id, searchFields?.description, filterStr, type),
        queryFn: async ({ pageParam = 1 }) => {
            // Build filter string
            let filter = filterStr || '';

            // Add type filter using shared constants
            if (type === 'IN') {
                const typeFilter = buildTypeFilter(WALLET_CREDIT_TYPES);
                filter = filter ? `${filter} and ${typeFilter}` : typeFilter;
            } else if (type === 'OUT') {
                const typeFilter = buildTypeFilter(WALLET_DEBIT_TYPES);
                filter = filter ? `${filter} and ${typeFilter}` : typeFilter;
            }

            // Add search filters
            const searchConditions: string[] = [];
            if (searchFields?.id?.trim()) {
                searchConditions.push(`id ~ '${searchFields.id.trim()}'`);
            }
            if (searchFields?.description?.trim()) {
                searchConditions.push(`description ~ '*${searchFields.description.trim()}*'`);
            }

            if (searchConditions.length > 0) {
                const searchQuery = searchConditions.length === 1
                    ? searchConditions[0]
                    : `(${searchConditions.join(' or ')})`;
                filter = filter ? `${filter} and ${searchQuery}` : searchQuery;
            }

            const response = await walletApi.getMyWalletTransactions({
                filter: filter || undefined,
                page: pageParam,
                size: 15,
                sort: 'createdAt,desc'
            });

            if (response.statusCode === 200 && response.data) {
                const result = response.data.result || [];
                const meta = response.data.meta;

                const transactions: WalletTransaction[] = result.map((tx: WalletTransactionResponse) => {
                    let category = 'Other';
                    if (tx.transactionType === WalletTransactionType.RESTAURANT_EARNING) category = 'Food Order';
                    else if (tx.transactionType === WalletTransactionType.WITHDRAWAL) category = 'Withdrawal';
                    else if (tx.transactionType === WalletTransactionType.COMMISSION_PAID) category = 'Commission';
                    else if (tx.transactionType === WalletTransactionType.PAYMENT) category = 'Order Payment';
                    else if (tx.transactionType === WalletTransactionType.REFUND) category = 'Refund';

                    return {
                        id: `TRX-${tx.id}`,
                        originalId: tx.id,
                        date: tx.createdAt,
                        type: tx.amount > 0 ? 'revenue' : 'withdrawal',
                        description: tx.description,
                        amount: tx.amount,
                        status: tx.status === WalletTransactionStatus.SUCCESS ? 'success' : 'failed',
                        category: category,
                        orderId: tx.order?.id,
                        balanceAfter: tx.balanceAfter
                    };
                });

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
        getNextPageParam: (lastPage: { nextPage?: number }) => lastPage.nextPage,
        enabled: isLoggedIn
    });

    // Flatten all pages into single array
    const transactions = data?.pages.flatMap((page: { items: WalletTransaction[] }) => page.items) || [];

    return {
        transactions,
        isLoading,
        isFetchingNextPage,
        hasNextPage: hasNextPage ?? false,
        fetchNextPage,
        error,
        refetch,
        total: data?.pages[0]?.total || 0
    };
}
