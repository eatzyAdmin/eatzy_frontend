import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@repo/api";
import { WalletResponse } from "@repo/types";

export const useWallet = (userId?: number) => {
  return useQuery<WalletResponse | null>({
    queryKey: ["wallet", userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await walletApi.getWalletByUserId(userId);
      return res.data || null;
    },
    enabled: !!userId,
  });
};
