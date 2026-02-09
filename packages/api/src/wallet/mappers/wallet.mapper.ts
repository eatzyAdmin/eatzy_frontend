import {
  WalletTransactionResponse,
  DriverWalletTransaction,
  WalletTransactionStatus,
  WalletDisplayStatus,
} from "@repo/types";

/**
 * Map WalletTransactionResponse from backend to DriverWalletTransaction for driver app UI
 * 
 * Note: We preserve the original transaction type from backend.
 * The UI layer (TransactionDetailDrawer, TransactionCard) handles display logic.
 * 
 * @param tx - The wallet transaction response from backend API
 * @returns Mapped DriverWalletTransaction for driver app consumption
 */
export function mapWalletTransactionToDriverWalletTransaction(tx: WalletTransactionResponse): DriverWalletTransaction {
  return {
    id: tx.id.toString(),
    originalId: tx.id,
    // Keep original backend type - UI layer handles display mapping
    type: tx.transactionType,
    amount: tx.amount,
    description: tx.description,
    // Prefer transactionDate (business date) over createdAt (system date)
    timestamp: tx.transactionDate || tx.createdAt,
    // Map backend SUCCESS to frontend COMPLETED for display
    status: tx.status === WalletTransactionStatus.SUCCESS
      ? WalletDisplayStatus.COMPLETED
      : tx.status === WalletTransactionStatus.PENDING
        ? WalletDisplayStatus.PENDING
        : WalletDisplayStatus.FAILED,
    referenceId: tx.order?.id?.toString(),
    balanceAfter: tx.balanceAfter
  };
}
