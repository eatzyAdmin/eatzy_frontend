"use client";

import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@repo/api";
import { mapOrderResponseToOrderHistoryItem } from "./useOrderDetail";
import { OrderHistoryItem } from "../data/mockHistory";

export interface UseOrderHistoryResult {
    orders: OrderHistoryItem[];
    isLoading: boolean;
    error: Error | null;
    total: number;
    page: number;
    totalPages: number;
    refetch: () => void;
}

export function useOrderHistory(params?: {
    page?: number;
    size?: number;
    status?: string;
    search?: string;
    paymentMethod?: string[];
    dateRange?: { from: Date | null; to: Date | null };
    amountRange?: { min: number; max: number };
}): UseOrderHistoryResult {

    // Construct filter string
    const filters: string[] = [];

    if (params?.status) {
        filters.push(`orderStatus~'${params.status}'`);
    }

    // Note: nested filtering might not be fully supported by the simplified backend filter spec 
    // depending on the implementation. 
    // Assuming standard backend filter support for now.

    // Date range filter (created_at)
    if (params?.dateRange?.from) {
        filters.push(`createdAt>:'${params.dateRange.from.toISOString()}'`);
    }
    if (params?.dateRange?.to) {
        // End of the day
        const toDate = new Date(params.dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        filters.push(`createdAt<:'${toDate.toISOString()}'`);
    }

    // Join filters with ' and '
    const finalFilter = filters.length > 0 ? filters.join(" and ") : "";

    const query = useQuery({
        queryKey: ["restaurant-order-history", finalFilter, params?.page, params?.size],
        queryFn: async () => {
            const response = await orderApi.getMyRestaurantOrders({
                filter: finalFilter,
                page: params?.page ?? 0,
                size: params?.size ?? 50,
            });

            if (response.statusCode === 200 && response.data) {
                return response.data;
            }
            throw new Error("Failed to fetch order history");
        },
    });

    // Client-side filtering for complex fields if backend doesn't support them well via simple filter string
    // or if we want to ensure exact matching for list items like payment methods.
    // However, ideally backend handles this.
    // For now mapping the result.

    const mappedOrders = (query.data?.result || []).map(mapOrderResponseToOrderHistoryItem);

    // Apply client-side filtering for search (ID/Customer Name) and other complex filters 
    // if the backend filter isn't covering them or for smoother UX on small datasets

    // NOTE: For now, the Table component handles client-side filtering on the fetched data page. 
    // But ideally we should filter on server. 
    // Since the Table component in the existing code does client-side filtering *on the passed data*,
    // we will just return the fetched data for the current page.

    return {
        orders: mappedOrders,
        isLoading: query.isLoading,
        error: query.error,
        total: query.data?.meta.total ?? 0,
        page: query.data?.meta.page ?? 0,
        totalPages: query.data?.meta.pages ?? 0,
        refetch: query.refetch
    };
}
