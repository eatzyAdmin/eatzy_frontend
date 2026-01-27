import { http } from "../http";
import { IBackendRes, WalletResponse, WalletTransactionsBackendRes } from "../../../types/src";

export const walletApi = {
  getMyWallet: () => {
    return http.get<IBackendRes<WalletResponse>>("/api/v1/wallets/my-wallet") as unknown as Promise<IBackendRes<WalletResponse>>;
  },
  getMyWalletTransactions: (params?: {
    filter?: string;
    page?: number;
    size?: number;
    sort?: string;
  }) => {
    return http.get<WalletTransactionsBackendRes>("/api/v1/wallet-transactions/my-transactions", {
      params,
    }) as unknown as Promise<WalletTransactionsBackendRes>;
  },
  getWalletByUserId: (userId: number) => {
    return http.get<IBackendRes<WalletResponse>>(`/api/v1/wallets/user/${userId}`) as unknown as Promise<IBackendRes<WalletResponse>>;
  },
  getWalletById: (id: number) => {
    return http.get<IBackendRes<WalletResponse>>(`/api/v1/wallets/${id}`) as unknown as Promise<IBackendRes<WalletResponse>>;
  },
  addBalance: (id: number, amount: number) => {
    return http.put<IBackendRes<WalletResponse>>(`/api/v1/wallets/${id}/add-balance`, amount) as unknown as Promise<IBackendRes<WalletResponse>>;
  },
  subtractBalance: (id: number, amount: number) => {
    return http.put<IBackendRes<WalletResponse>>(`/api/v1/wallets/${id}/subtract-balance`, amount) as unknown as Promise<IBackendRes<WalletResponse>>;
  },
};
