"use client";
import { useState } from "react";
import { orderApi, mapOrderResponseToDriverHistoryOrder } from "@repo/api";
import type { DriverHistoryOrder } from "@repo/types";

export interface UseOrderDetailResult {
    /** The fetched order details */
    order: DriverHistoryOrder | null;
    /** Whether loading is in progress */
    isLoading: boolean;
    /** Error message if any occurred */
    error: string | null;
    /** Function to fetch order by ID */
    fetchOrder: (orderId: number) => void;
    /** Function to clear the current order */
    clearOrder: () => void;
}

/**
 * Hook to fetch a single order's details by ID
 * Used for viewing order details from transaction history
 * 
 * @returns Order detail data and control functions
 * 
 * @example
 * ```tsx
 * const { order, isLoading, fetchOrder, clearOrder } = useOrderDetail();
 * 
 * // Fetch order when needed
 * fetchOrder(123);
 * 
 * // Clear when done
 * clearOrder();
 * ```
 */
export function useOrderDetail(): UseOrderDetailResult {
    const [order, setOrder] = useState<DriverHistoryOrder | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrder = (orderId: number) => {
        setIsLoading(true);
        setError(null);

        orderApi.getOrderById(orderId)
            .then((response) => {
                if (response.statusCode === 200 && response.data) {
                    setOrder(mapOrderResponseToDriverHistoryOrder(response.data));
                } else {
                    setError("Failed to fetch order details");
                }
            })
            .catch(() => {
                setError("An error occurred while fetching order details");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const clearOrder = () => {
        setOrder(null);
        setError(null);
    };

    return { order, isLoading, error, fetchOrder, clearOrder };
}
