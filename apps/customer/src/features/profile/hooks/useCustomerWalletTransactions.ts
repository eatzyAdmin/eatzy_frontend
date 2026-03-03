import { useState, useCallback, useEffect } from "react";
import { walletApi } from "@repo/api";
import { WalletResponse, WalletTransactionResponse, ResultPaginationDTO } from "@repo/types";

export const useCustomerWalletTransactions = () => {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [transactionsRes, setTransactionsRes] = useState<ResultPaginationDTO<WalletTransactionResponse[]> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingTransactions, setIsFetchingTransactions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [walletRes, transRes] = await Promise.all([
        walletApi.getMyWallet(),
        walletApi.getMyWalletTransactions({ page: 0, size: 20, sort: "transactionDate,desc" })
      ]);

      if (walletRes.data) {
        setWallet(walletRes.data);
      }
      if (transRes.data) {
        setTransactionsRes(transRes.data);
      }
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu ví");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMoreTransactions = useCallback(async (page: number) => {
    setIsFetchingTransactions(true);
    try {
      const transRes = await walletApi.getMyWalletTransactions({ page, size: 20, sort: "transactionDate,desc" });
      if (transRes.data) {
        setTransactionsRes(prev => {
          if (!prev) return transRes.data!;
          return {
            ...transRes.data!,
            result: [...prev.result, ...transRes.data!.result]
          };
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingTransactions(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasNextPage = transactionsRes ? transactionsRes.meta.page < transactionsRes.meta.pages - 1 : false;

  return {
    wallet,
    transactions: transactionsRes?.result || [],
    meta: transactionsRes?.meta,
    isLoading,
    isFetchingTransactions,
    hasNextPage,
    error,
    refresh: fetchData,
    fetchMoreTransactions: () => {
      if (hasNextPage && !isFetchingTransactions) {
        fetchMoreTransactions(transactionsRes!.meta.page + 1);
      }
    }
  };
};
