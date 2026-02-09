import { IBackendRes, ResultPaginationDTO } from "./backend";

export type WalletTransactionType =
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "PAYMENT"
    | "REFUND"
    | "DELIVERY_EARNING"
    | "RESTAURANT_EARNING"
    | "COMMISSION_PAID"
    | "TOP_UP"
    | "ORDER_PAYMENT"
    | "EARNING";

export type WalletTransactionStatus = "PENDING" | "SUCCESS" | "FAILED" | "COMPLETED";

export interface WalletResponse {
    id: number;
    balance: number;
    user: {
        id: number;
        email: string;
        name: string;
    };
}

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
    status: WalletTransactionStatus;
    balanceAfter: number;
    createdAt: string;
    transactionDate: string;
}

export interface BankAccountInfo {
    bankName: string;
    accountNumber: string;
    holderName: string;
    branch?: string;
}

/**
 * Mapped transaction type for frontend display (transformed from WalletTransactionResponse)
 */
export interface WalletTransaction {
    id: string;
    originalId: number; // Keep original ID for API calls
    date: string;
    type: string;
    description: string;
    amount: number;
    status: string;
    category: string;
    orderId?: number;
    balanceAfter: number;
    [key: string]: unknown; // For DataTable compatibility
}

export type WalletBackendRes = IBackendRes<WalletResponse>;
export type WalletTransactionsBackendRes = IBackendRes<ResultPaginationDTO<WalletTransactionResponse[]>>;
