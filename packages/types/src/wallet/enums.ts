/**
 * =============================================================================
 * WALLET TRANSACTION ENUMS
 * =============================================================================
 * All enum definitions for wallet transactions.
 * Use these enums instead of string literals for type safety.
 */

// ============================================================================
// TRANSACTION TYPE
// ============================================================================

/**
 * All possible transaction types from backend
 */
export const WalletTransactionType = {
  // Credit/IN transactions (money comes in)
  DEPOSIT: 'DEPOSIT',
  DEPOSIT_VNPAY: 'DEPOSIT_VNPAY',
  REFUND: 'REFUND',
  DELIVERY_EARNING: 'DELIVERY_EARNING',
  RESTAURANT_EARNING: 'RESTAURANT_EARNING',
  VNPAY_RECEIVED: 'VNPAY_RECEIVED',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  COD_RECEIVED: 'COD_RECEIVED',
  // Debit/OUT transactions (money goes out)
  WITHDRAWAL: 'WITHDRAWAL',
  PAYMENT: 'PAYMENT',
  COMMISSION_PAID: 'COMMISSION_PAID',
} as const;

/** Type for WalletTransactionType values */
export type WalletTransactionType = typeof WalletTransactionType[keyof typeof WalletTransactionType];

// ============================================================================
// TRANSACTION STATUS
// ============================================================================

/**
 * Transaction status from backend
 * Note: Backend uses SUCCESS, frontend can map to COMPLETED for display
 */
export const WalletTransactionStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

/** Type for WalletTransactionStatus values */
export type WalletTransactionStatus = typeof WalletTransactionStatus[keyof typeof WalletTransactionStatus];

/**
 * Frontend display status (mapped from backend status)
 */
export const WalletDisplayStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

/** Type for WalletDisplayStatus values */
export type WalletDisplayStatus = typeof WalletDisplayStatus[keyof typeof WalletDisplayStatus];

// ============================================================================
// TYPE GROUPS (for filtering and categorization)
// ============================================================================

/**
 * Credit transaction types - money comes IN to the wallet
 */
export const WALLET_CREDIT_TYPES = [
  WalletTransactionType.DEPOSIT,
  WalletTransactionType.DEPOSIT_VNPAY,
  WalletTransactionType.REFUND,
  WalletTransactionType.DELIVERY_EARNING,
  WalletTransactionType.RESTAURANT_EARNING,
  WalletTransactionType.VNPAY_RECEIVED,
  WalletTransactionType.PAYMENT_RECEIVED,
  WalletTransactionType.COD_RECEIVED,
] as const;

/**
 * Debit transaction types - money goes OUT from the wallet
 */
export const WALLET_DEBIT_TYPES = [
  WalletTransactionType.WITHDRAWAL,
  WalletTransactionType.PAYMENT,
  WalletTransactionType.COMMISSION_PAID,
] as const;

/**
 * Earning-related transaction types (driver/restaurant income from orders)
 */
export const WALLET_EARNING_TYPES = [
  WalletTransactionType.DELIVERY_EARNING,
  WalletTransactionType.RESTAURANT_EARNING,
  WalletTransactionType.COD_RECEIVED,
] as const;

/**
 * Deposit transaction types
 */
export const WALLET_DEPOSIT_TYPES = [
  WalletTransactionType.DEPOSIT,
  WalletTransactionType.DEPOSIT_VNPAY,
] as const;
