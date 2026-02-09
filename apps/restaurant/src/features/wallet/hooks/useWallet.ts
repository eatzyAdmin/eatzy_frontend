'use client';

import { useQuery } from '@tanstack/react-query';
import { walletApi } from '@repo/api';
import type { WalletResponse } from '@repo/types';

// ======== Query Keys ========

export const walletKeys = {
  all: ['wallet'] as const,
  myWallet: () => [...walletKeys.all, 'my-wallet'] as const,
  transactions: () => [...walletKeys.all, 'transactions'] as const,
  transactionsWithFilters: (searchId?: string, searchDesc?: string, filter?: string, type?: string) =>
    [...walletKeys.transactions(), { searchId, searchDesc, filter, type }] as const,
};

// ======== Hooks ========

/**
 * Hook to fetch current user's wallet info (balance, bank details, etc.)
 * Uses the my-wallet API - no ID required
 */
export function useMyWallet() {
  const query = useQuery({
    queryKey: walletKeys.myWallet(),
    queryFn: async (): Promise<WalletResponse> => {
      const response = await walletApi.getMyWallet();
      if (response.statusCode !== 200 || !response.data) {
        throw new Error('Failed to fetch wallet info');
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes
  });

  return {
    wallet: query.data,
    balance: query.data?.balance ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
