"use client";

import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "@repo/api";
import { WalletResponse, WalletTransactionResponse, ResultPaginationDTO } from "@repo/types";

export const useCustomerWalletTransactions = () => {
  const queryClient = useQueryClient();

  // 1. Core Wallet Balance Query
  const { 
    data: wallet, 
    isLoading: isWalletLoading,
    refetch: refreshWallet,
    error: walletError 
  } = useQuery<WalletResponse | undefined>({
    queryKey: ["customer", "wallet", "me"],
    queryFn: async () => {
      const res = await walletApi.getMyWallet();
      return res.data;
    },
    staleTime: 30 * 1000, // Cache for 30 seconds
  });

  // 2. Transactions Infinite Query
  const {
    data: transactionsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isTransactionsLoading,
    refetch: refreshTransactions,
    error: transactionsError
  } = useInfiniteQuery<ResultPaginationDTO<WalletTransactionResponse[]>>({
    queryKey: ["customer", "wallet", "transactions"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await walletApi.getMyWalletTransactions({ 
        page: pageParam as number, 
        size: 20, 
        sort: "transactionDate,desc" 
      });
      return res.data!;
    },
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.meta;
      return page < pages - 1 ? page + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 60 * 1000, // Cache transactions for 60 seconds
  });

  // Combine data
  const transactions = transactionsData?.pages.flatMap(page => page.result) || [];
  const isLoading = isWalletLoading || isTransactionsLoading;
  const error = (walletError || transactionsError) ? "Không thể tải dữ liệu ví" : null;

  return {
    wallet: wallet ?? null,
    transactions,
    isLoading,
    isFetchingTransactions: isFetchingNextPage,
    hasNextPage,
    error,
    refresh: async () => {
      await Promise.all([
        queryClient.resetQueries({ queryKey: ["customer", "wallet"] }),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
    },
    fetchMoreTransactions: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };
};
