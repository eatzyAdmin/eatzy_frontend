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

export type WalletBackendRes = IBackendRes<WalletResponse>;
export type WalletTransactionsBackendRes = IBackendRes<ResultPaginationDTO<WalletTransactionResponse[]>>;
