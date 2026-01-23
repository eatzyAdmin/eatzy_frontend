import { http } from "./http";
import type { WalletTransactionsBackendRes, WalletBackendRes } from "../../types/src";

/**
 * Wallet API endpoints
 * Handles wallet transactions and balance
 */
export const walletApi = {
    /**
     * Get wallet transactions for current logged-in user
     * GET /api/v1/wallet-transactions/my-transactions
     */
    getMyWalletTransactions: async (params?: {
        filter?: string;
        page?: number;
        size?: number;
        sort?: string;
    }): Promise<WalletTransactionsBackendRes> => {
        return http.get<WalletTransactionsBackendRes>("/api/v1/wallet-transactions/my-transactions", {
            params,
        }) as unknown as Promise<WalletTransactionsBackendRes>;
    },

    /**
     * Get wallet for current logged-in user
     * GET /api/v1/wallets/my-wallet
     */
    getMyWallet: async (): Promise<WalletBackendRes> => {
        return http.get<WalletBackendRes>("/api/v1/wallets/my-wallet") as unknown as Promise<WalletBackendRes>;
    },
};
