"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { orderApi, mapOrderResponseToDriverHistoryOrder } from "@repo/api";
import type { DriverHistoryOrder } from "@repo/types";

export interface UseDriverOrderHistoryParams {
    /** Filter by order status */
    status?: "ALL" | "DELIVERED" | "CANCELLED";
    /** Search term for order ID, restaurant name, or address */
    search?: string;
}

export interface UseDriverOrderHistoryResult {
    /** List of driver's historical orders */
    orders: DriverHistoryOrder[];
    /** Whether initial loading is in progress */
    isLoading: boolean;
    /** Whether fetching next page is in progress */
    isFetchingNextPage: boolean;
    /** Whether there are more pages to load */
    hasNextPage: boolean;
    /** Function to fetch the next page */
    fetchNextPage: () => void;
    /** Error if any occurred */
    error: Error | null;
    /** Function to refetch data */
    refetch: () => void;
    /** Total number of orders */
    total: number;
    /** Total number of pages */
    pages: number;
}

// ======== Hook ========

/**
 * Hook to get order history for the logged-in driver
 * Uses infinite query pattern for server-side pagination
 * 
 * @param params - Filter and search parameters
 * @returns Order history data and pagination controls
 * 
 * @example
 * ```tsx
 * const { orders, isLoading, hasNextPage, fetchNextPage } = useDriverOrderHistory({
 *   status: "DELIVERED",
 *   search: "Pizza"
 * });
 * ```
 */
export function useDriverOrderHistory(params?: UseDriverOrderHistoryParams): UseDriverOrderHistoryResult {
    // Build filter for order statuses
    // Springfilter syntax: ':' for equals, '~' for contains (like)
    let statusFilter = "";
    if (params?.status === "DELIVERED") {
        statusFilter = "orderStatus:'DELIVERED'";
    } else if (params?.status === "CANCELLED") {
        statusFilter = "orderStatus:'CANCELLED'";
    } else {
        // For ALL, show meaningful history (delivered and cancelled)
        statusFilter = "(orderStatus:'DELIVERED' or orderStatus:'CANCELLED')";
    }

    // Add search query if provided
    // Springfilter: '~' with wildcards for string contains
    let finalFilter = statusFilter;
    if (params?.search) {
        const s = params.search.trim();
        if (s) {
            // Search in restaurant name and delivery address (text fields)
            const searchQuery = `(restaurant.name~'*${s}*' or deliveryAddress~'*${s}*')`;
            finalFilter = `${statusFilter} and ${searchQuery}`;
        }
    }

    const {
        data,
        isLoading,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["orders", "history", "driver", finalFilter],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await orderApi.getMyDriverOrders({
                filter: finalFilter,
                page: pageParam,
                size: 15,
            });

            if (response.statusCode === 200 && response.data) {
                const result = response.data.result || [];
                const meta = response.data.meta;

                return {
                    items: result.map(mapOrderResponseToDriverHistoryOrder) as DriverHistoryOrder[],
                    nextPage: meta && meta.page < meta.pages ? meta.page + 1 : undefined,
                    total: meta?.total || 0,
                    pages: meta?.pages || 0
                };
            }

            return { items: [], nextPage: undefined, total: 0, pages: 0 };
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 60 * 1000, // 1 minute
    });

    // Flatten all pages into single array
    const orders = data?.pages.flatMap(page => page.items) || [];

    return {
        orders,
        isLoading,
        isFetchingNextPage,
        hasNextPage: hasNextPage ?? false,
        fetchNextPage,
        error: error as Error | null,
        refetch,
        total: data?.pages[0]?.total || 0,
        pages: data?.pages[0]?.pages || 0
    };
}
