import { useState, useCallback, useEffect } from "react";
import { walletApi } from "@repo/api";
import { WalletResponse } from "@repo/types";

export const useWallet = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await walletApi.getMyWallet();
      if (response.data) {
        setBalance(response.data.balance);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch wallet");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return {
    balance,
    isLoading,
    error,
    refreshWallet: fetchWallet,
  };
};
