/**
 * =============================================================================
 * WALLET MODULE
 * =============================================================================
 * Central export for all wallet-related types, enums, and helpers.
 * 
 * Usage:
 * ```typescript
 * import { 
 *   WalletTransactionType, 
 *   WalletTransactionStatus,
 *   isWalletCreditType,
 *   DriverWalletTransaction 
 * } from '@repo/types';
 * 
 * // Use enum values for type safety
 * if (tx.type === WalletTransactionType.DELIVERY_EARNING) {
 *   // ...
 * }
 * 
 * // Use helper functions
 * if (isWalletCreditType(tx.type)) {
 *   // This is a credit transaction
 * }
 * ```
 */

// Enums and constants
export {
  WalletTransactionType,
  WalletTransactionStatus,
  WalletDisplayStatus,
  WALLET_CREDIT_TYPES,
  WALLET_DEBIT_TYPES,
  WALLET_EARNING_TYPES,
  WALLET_DEPOSIT_TYPES,
} from './enums';

// Helper functions and labels
export {
  WALLET_TRANSACTION_TYPE_LABELS,
  getWalletTransactionTypeLabel,
  isWalletCreditType,
  isWalletDebitType,
  isWalletEarningType,
  isWalletDepositType,
} from './helpers';

// Type definitions
export type {
  WalletResponse,
  WalletTransactionResponse,
  BankAccountInfo,
  WalletTransaction,
  DriverWalletTransaction,
  WalletBackendRes,
  WalletTransactionsBackendRes,
} from './types';
