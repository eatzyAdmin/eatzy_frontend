/**
 * =============================================================================
 * WALLET DATA TYPES
 * =============================================================================
 * Interface and type definitions for wallet data structures.
 */

import { IBackendRes, ResultPaginationDTO } from '../backend';
import { WalletTransactionType, WalletTransactionStatus, WalletDisplayStatus } from './enums';

// ============================================================================
// API RESPONSE TYPES (from backend)
// ============================================================================

/**
 * Wallet data from backend API
 */
export interface WalletResponse {
  id: number;
  balance: number;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

/**
 * Wallet transaction data from backend API
 */
export interface WalletTransactionResponse {
  id: number;
  wallet: {
    id: number;
    user: {
      id: number;
      name: string;
    };
  };
  order: {
    id: number;
  } | null;
  amount: number;
  transactionType: WalletTransactionType | string;
  description: string;
  status: WalletTransactionStatus | string;
  balanceAfter: number;
  createdAt: string;
  transactionDate: string;
}

/**
 * Bank account information for withdrawals
 */
export interface BankAccountInfo {
  bankName: string;
  accountNumber: string;
  holderName: string;
  branch?: string;
}

// ============================================================================
// FRONTEND DISPLAY TYPES (transformed from API response)
// ============================================================================

/**
 * Generic wallet transaction for frontend display
 * Used in tables and lists (super-admin, restaurant)
 */
export interface WalletTransaction {
  id: string;
  originalId: number;
  date: string;
  type: WalletTransactionType | string;
  description: string;
  amount: number;
  status: WalletDisplayStatus | string;
  category: string;
  orderId?: number;
  balanceAfter: number;
  [key: string]: unknown; // For DataTable compatibility
}

/**
 * Driver wallet transaction for frontend display
 * Optimized for driver app mobile UI
 */
export interface DriverWalletTransaction {
  id: string;
  originalId: number;
  type: WalletTransactionType | string;
  amount: number;
  description: string;
  timestamp: string;
  status: WalletDisplayStatus;
  /** Order ID reference for order-related transactions */
  referenceId?: string;
  balanceAfter: number;
}

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

export type WalletBackendRes = IBackendRes<WalletResponse>;
export type WalletTransactionsBackendRes = IBackendRes<ResultPaginationDTO<WalletTransactionResponse[]>>;
