'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { walletApi } from '@repo/api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { WalletTransactionResponse } from '@repo/types';
import { Transaction } from '../types';

export interface WalletSearchFields {
    id: string;
    description: string;
}

/**
 * Hook to fetch wallet transactions for current restaurant
 * Uses infinite query pattern for server-side pagination
 * 
 * @param searchFields - Search fields object with id and description
 * @param filterStr - Filter string in Spring Filter format
 * @param type - Transaction type filter: 'ALL' | 'IN' | 'OUT'
 */
export function useWalletTransactions(
    searchFields?: WalletSearchFields,
    filterStr?: string,
    type?: 'ALL' | 'IN' | 'OUT'
) {
    const { user } = useAuth();
    const isLoggedIn = !!user?.id;

    const {
        data,
        isLoading,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['wallet-transactions', 'my', searchFields?.id, searchFields?.description, filterStr, type],
        queryFn: async ({ pageParam = 1 }) => {
            // Build filter string
            let filter = filterStr || '';

            // Add type filter
            if (type === 'IN') {
                const typeFilter = "(transactionType~'RESTAURANT_EARNING')";
                filter = filter ? `${filter} and ${typeFilter}` : typeFilter;
            } else if (type === 'OUT') {
                const typeFilter = "(transactionType~'WITHDRAWAL' or transactionType~'COMMISSION_PAID' or transactionType~'ORDER_PAYMENT')";
                filter = filter ? `${filter} and ${typeFilter}` : typeFilter;
            }

            // Add search filters
            const searchConditions: string[] = [];

            // Search by ID
            if (searchFields?.id?.trim()) {
                searchConditions.push(`id ~ '${searchFields.id.trim()}'`);
            }

            // Search by description
            if (searchFields?.description?.trim()) {
                searchConditions.push(`description ~ '*${searchFields.description.trim()}*'`);
            }

            // Combine search conditions with OR
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

                // Map to local Transaction interface
                const transactions: Transaction[] = result.map((tx: WalletTransactionResponse) => {
                    let category = 'Unknown';
                    if (tx.transactionType === 'RESTAURANT_EARNING' || tx.transactionType === 'EARNING') category = 'Food Order';
                    else if (tx.transactionType === 'WITHDRAWAL') category = 'Withdrawal';
                    else if (tx.transactionType === 'COMMISSION_PAID') category = 'Commission';
                    else if (tx.transactionType === 'ORDER_PAYMENT') category = 'Payment';

                    return {
                        id: `TRX-${tx.id}`,
                        originalId: tx.id,
                        date: tx.createdAt,
                        type: tx.amount > 0 ? 'revenue' : 'withdrawal',
                        description: tx.description,
                        amount: tx.amount,
                        status: tx.status === 'SUCCESS' ? 'success' : 'failed',
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
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: isLoggedIn
    });

    // Flatten all pages into single array
    const transactions = data?.pages.flatMap(page => page.items) || [];

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
