/**
 * =============================================================================
 * WALLET TRANSACTION HELPERS
 * =============================================================================
 * Helper functions and utilities for wallet transactions.
 */

import {
  WalletTransactionType,
  WALLET_CREDIT_TYPES,
  WALLET_DEBIT_TYPES,
  WALLET_EARNING_TYPES,
  WALLET_DEPOSIT_TYPES,
} from './enums';

// ============================================================================
// DISPLAY LABELS
// ============================================================================

/**
 * Display name mapping for transaction types
 */
export const WALLET_TRANSACTION_TYPE_LABELS: Record<WalletTransactionType, string> = {
  [WalletTransactionType.DEPOSIT]: 'Deposit',
  [WalletTransactionType.DEPOSIT_VNPAY]: 'VNPay Deposit',
  [WalletTransactionType.REFUND]: 'Refund',
  [WalletTransactionType.DELIVERY_EARNING]: 'Delivery Earning',
  [WalletTransactionType.RESTAURANT_EARNING]: 'Restaurant Earning',
  [WalletTransactionType.VNPAY_RECEIVED]: 'VNPay Received',
  [WalletTransactionType.PAYMENT_RECEIVED]: 'Payment Received',
  [WalletTransactionType.COD_RECEIVED]: 'COD Received',
  [WalletTransactionType.WITHDRAWAL]: 'Withdrawal',
  [WalletTransactionType.PAYMENT]: 'Payment',
  [WalletTransactionType.COMMISSION_PAID]: 'Commission',
};

// ============================================================================
// TYPE CHECK FUNCTIONS
// ============================================================================

/**
 * Get display name for a transaction type
 * @param type - The transaction type from backend
 * @returns Human-readable display name
 */
export function getWalletTransactionTypeLabel(type: WalletTransactionType | string): string {
  return WALLET_TRANSACTION_TYPE_LABELS[type as WalletTransactionType] || type;
}

/**
 * Check if a transaction type is a credit (money in)
 */
export function isWalletCreditType(type: WalletTransactionType | string): boolean {
  return (WALLET_CREDIT_TYPES as readonly string[]).includes(type);
}

/**
 * Check if a transaction type is a debit (money out)
 */
export function isWalletDebitType(type: WalletTransactionType | string): boolean {
  return (WALLET_DEBIT_TYPES as readonly string[]).includes(type);
}

/**
 * Check if a transaction type is an earning type
 */
export function isWalletEarningType(type: WalletTransactionType | string): boolean {
  return (WALLET_EARNING_TYPES as readonly string[]).includes(type);
}

/**
 * Check if a transaction type is a deposit type
 */
export function isWalletDepositType(type: WalletTransactionType | string): boolean {
  return (WALLET_DEPOSIT_TYPES as readonly string[]).includes(type);
}
