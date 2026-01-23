"use client";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@repo/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DriverHistoryOrder } from "../data/mockDriverHistory";
import { mapOrderResponseToDriverHistoryOrder } from "./useOrderDetail";

export interface UseDriverOrderHistoryResult {
    orders: DriverHistoryOrder[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
    totalOrders: number;
}

/**
 * Hook to get order history for the logged-in driver
 */
export function useDriverOrderHistory(params?: {
    page?: number;
    size?: number;
    status?: "ALL" | "DELIVERED" | "CANCELLED";
    search?: string;
}): UseDriverOrderHistoryResult {
    const { user } = useAuth();
    const isLoggedIn = !!user?.id;

    // Build filter for order statuses
    let statusFilter = "";
    if (params?.status === "DELIVERED") {
        statusFilter = "orderStatus~'DELIVERED'";
    } else if (params?.status === "CANCELLED") {
        statusFilter = "orderStatus~'CANCELLED'";
    } else {
        // For ALL, we might want to only show meaningful history (e.g. delivered and cancelled)
        statusFilter = "(orderStatus~'DELIVERED' or orderStatus~'CANCELLED')";
    }

    // Add search query if provided
    let finalFilter = statusFilter;
    if (params?.search) {
        const s = params.search.trim();
        if (s) {
            const searchQuery = `(id : ${s} or restaurant.name ~ '*${s}*' or deliveryAddress ~ '*${s}*')`;
            finalFilter = `${statusFilter} and ${searchQuery}`;
        }
    }

    const query = useQuery({
        queryKey: ["orders", "history", "driver", finalFilter, params?.page, params?.size],
        queryFn: async () => {
            const response = await orderApi.getMyDriverOrders({
                filter: finalFilter,
                page: params?.page ?? 0,
                size: params?.size ?? 50,
            });

            if (response.statusCode === 200 && response.data) {
                return (response.data.result || []).map(mapOrderResponseToDriverHistoryOrder);
            }
            return [];
        },
        enabled: isLoggedIn,
        staleTime: 60 * 1000, // 1 minute
    });

    const orders = query.data || [];

    return {
        orders,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        totalOrders: orders.length,
    };
}
