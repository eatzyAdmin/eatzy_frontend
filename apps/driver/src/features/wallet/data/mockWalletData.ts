export type TransactionType = "EARNING" | "WITHDRAWAL" | "TOP_UP" | "COD_REMITTANCE";

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  referenceId?: string; // Order ID or Bank Ref
}

export interface WalletStats {
  availableBalance: number;
  pendingBalance: number;
  todayEarnings: number;
  totalWithdrawn: number;
}

export const mockWalletStats: WalletStats = {
  availableBalance: 2500000,
  pendingBalance: 350000,
  todayEarnings: 450000,
  totalWithdrawn: 10000000,
};

export const mockTransactions: WalletTransaction[] = [
  {
    id: "tx-1",
    type: "EARNING",
    amount: 35000,
    description: "Thu nhập đơn #8291",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    status: "COMPLETED",
    referenceId: "#8291",
  },
  {
    id: "tx-2",
    type: "EARNING",
    amount: 42000,
    description: "Thu nhập đơn #9921",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: "COMPLETED",
    referenceId: "#9921",
  },
  {
    id: "tx-3",
    type: "COD_REMITTANCE",
    amount: -500000,
    description: "Nộp tiền COD về hệ thống",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    status: "COMPLETED",
  },
  {
    id: "tx-4",
    type: "WITHDRAWAL",
    amount: -2000000,
    description: "Rút tiền về Techcombank",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: "PENDING",
  },
  {
    id: "tx-5",
    type: "TOP_UP",
    amount: 1000000,
    description: "Nạp tiền vào ví",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1 day ago
    status: "COMPLETED",
  },
  {
    id: "tx-6",
    type: "EARNING",
    amount: 55000,
    description: "Thu nhập đơn #3399",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    status: "COMPLETED",
    referenceId: "#3399",
  },
  {
    id: "tx-7",
    type: "EARNING",
    amount: 25000,
    description: "Thu nhập đơn #7744",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), // 2 days ago
    status: "COMPLETED",
    referenceId: "#7744",
  },
];
