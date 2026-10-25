import type { WalletResponse, WalletTransactionResponse } from "@repo/types";

export interface WalletTransactionItem {
  id: string;
  type: "REVENUE" | "WITHDRAWAL" | "EARNING" | "TOP_UP" | "ORDER_PAYMENT";
  amount: number;
  description: string;
  timestamp: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  referenceId?: string;
  balanceAfter?: number;
}

export interface WalletData {
  id: number;
  availableBalance: number;
  pendingBalance: number;
  todayEarnings: number;
  totalWithdrawn: number;
  currency: string;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  transactions: WalletTransactionItem[];
}

export const MOCK_RESTAURANT_WALLET: WalletData = {
  id: 101,
  availableBalance: 14850000,
  pendingBalance: 1250000,
  todayEarnings: 2450000,
  totalWithdrawn: 45000000,
  currency: "VND",
  bankAccount: {
    bankName: "Vietcombank - CN Kỳ Đồng",
    accountNumber: "0071001234567",
    accountHolder: "TRAN THI MAI",
  },
  transactions: [
    {
      id: "TRX-101-1",
      type: "REVENUE",
      amount: 246000,
      description: "Doanh thu đơn hàng #ORD-1001",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: "COMPLETED",
      referenceId: "#ORD-1001",
      balanceAfter: 14850000,
    },
    {
      id: "TRX-101-2",
      type: "REVENUE",
      amount: 120000,
      description: "Doanh thu đơn hàng #ORD-1002",
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      status: "COMPLETED",
      referenceId: "#ORD-1002",
      balanceAfter: 14604000,
    },
    {
      id: "TRX-101-3",
      type: "WITHDRAWAL",
      amount: -5000000,
      description: "Rút tiền về Vietcombank *4567",
      timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      status: "COMPLETED",
      referenceId: "WD-8890",
      balanceAfter: 14484000,
    },
    {
      id: "TRX-101-4",
      type: "REVENUE",
      amount: 580000,
      description: "Doanh thu đơn hàng #ORD-998",
      timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
      status: "COMPLETED",
      referenceId: "#ORD-998",
      balanceAfter: 19484000,
    },
  ],
};

export const MOCK_DRIVER_WALLET: WalletData = {
  id: 201,
  availableBalance: 2850000,
  pendingBalance: 320000,
  todayEarnings: 480000,
  totalWithdrawn: 12000000,
  currency: "VND",
  bankAccount: {
    bankName: "Techcombank - CN Sài Gòn",
    accountNumber: "19034567891011",
    accountHolder: "LE HOANG PHUC",
  },
  transactions: [
    {
      id: "TX-DRV-1",
      type: "EARNING",
      amount: 32400,
      description: "Thu nhập giao đơn #ORD-1003",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: "COMPLETED",
      referenceId: "#ORD-1003",
      balanceAfter: 2850000,
    },
    {
      id: "TX-DRV-2",
      type: "EARNING",
      amount: 28500,
      description: "Thu nhập giao đơn #ORD-1004",
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      status: "COMPLETED",
      referenceId: "#ORD-1004",
      balanceAfter: 2817600,
    },
    {
      id: "TX-DRV-3",
      type: "WITHDRAWAL",
      amount: -1500000,
      description: "Rút tiền về Techcombank *1011",
      timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      status: "COMPLETED",
      referenceId: "WD-DRV-102",
      balanceAfter: 2789100,
    },
  ],
};

export const MOCK_RESTAURANT_WALLET_RESPONSE: WalletResponse = {
  id: 101,
  balance: 14850000,
  user: {
    id: 2,
    name: "Cơm Tấm Ba Ghiền",
    email: "restaurant@eatzy.vn",
  },
};

export const MOCK_DRIVER_WALLET_RESPONSE: WalletResponse = {
  id: 201,
  balance: 2850000,
  user: {
    id: 3,
    name: "Lê Hoàng Phúc",
    email: "driver@eatzy.vn",
  },
};

export const MOCK_WALLET_TRANSACTIONS_LIST: WalletTransactionResponse[] = [
  {
    id: 1001,
    wallet: { id: 101, user: { id: 2, name: "Cơm Tấm Ba Ghiền" } },
    order: { id: 1001 },
    amount: 246000,
    transactionType: "RESTAURANT_EARNING",
    description: "Doanh thu đơn hàng #ORD-1001",
    status: "SUCCESS",
    balanceAfter: 14850000,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    transactionDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 1002,
    wallet: { id: 101, user: { id: 2, name: "Cơm Tấm Ba Ghiền" } },
    order: { id: 1002 },
    amount: 120000,
    transactionType: "RESTAURANT_EARNING",
    description: "Doanh thu đơn hàng #ORD-1002",
    status: "SUCCESS",
    balanceAfter: 14604000,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    transactionDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 1003,
    wallet: { id: 101, user: { id: 2, name: "Cơm Tấm Ba Ghiền" } },
    order: null,
    amount: -5000000,
    transactionType: "WITHDRAWAL",
    description: "Rút tiền về Vietcombank *4567",
    status: "SUCCESS",
    balanceAfter: 14484000,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    transactionDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 2001,
    wallet: { id: 201, user: { id: 3, name: "Lê Hoàng Phúc" } },
    order: { id: 1003 },
    amount: 32400,
    transactionType: "DELIVERY_EARNING",
    description: "Thu nhập giao đơn #ORD-1003",
    status: "SUCCESS",
    balanceAfter: 2850000,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    transactionDate: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 2002,
    wallet: { id: 201, user: { id: 3, name: "Lê Hoàng Phúc" } },
    order: { id: 1004 },
    amount: 28500,
    transactionType: "DELIVERY_EARNING",
    description: "Thu nhập giao đơn #ORD-1004",
    status: "SUCCESS",
    balanceAfter: 2817600,
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    transactionDate: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: 2003,
    wallet: { id: 201, user: { id: 3, name: "Lê Hoàng Phúc" } },
    order: null,
    amount: -1500000,
    transactionType: "WITHDRAWAL",
    description: "Rút tiền về Techcombank *1011",
    status: "SUCCESS",
    balanceAfter: 2789100,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    transactionDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];

