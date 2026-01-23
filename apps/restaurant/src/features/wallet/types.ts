export interface Transaction {
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
    [key: string]: any; // For DataTable compatibility
}
