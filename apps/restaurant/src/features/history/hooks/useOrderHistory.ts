'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { orderApi } from '@repo/api';
import { OrderHistoryItem } from '@repo/types';
import { mapOrderResponseToOrderHistoryItem } from './useOrderDetail';

/**
 * Hook to fetch order history for the current restaurant
 * Uses infinite query pattern like usePromotions for server-side pagination
 * 
 * @param search - Search term for order ID or customer name  
 * @param filterStr - Filter string in Spring Filter format
 */
export function useOrderHistory(search?: string, filterStr?: string) {
    const {
        data,
        isLoading,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['restaurant-order-history', search, filterStr],
        queryFn: async ({ pageParam = 1 }) => {
            const params: any = {
                page: pageParam,
                size: 15
            };

            // Build filter string
            let filter = filterStr || '';
            if (search) {
                // Search by order ID
                const searchFilter = `id ~ '${search}'`;
                filter = filter ? `${filter} and ${searchFilter}` : searchFilter;
            }

            if (filter) {
                params.filter = filter;
            }

            const response = await orderApi.getMyRestaurantOrders(params);
            const result = response.data?.result || [];
            const meta = response.data?.meta;

            return {
                items: result.map(mapOrderResponseToOrderHistoryItem) as OrderHistoryItem[],
                nextPage: meta && meta.page < meta.pages ? meta.page + 1 : undefined,
                total: meta?.total || 0,
                pages: meta?.pages || 0
            };
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    // Flatten all pages into single array
    const orders = data?.pages.flatMap(page => page.items) || [];

    return {
        orders,
        isLoading,
        isFetchingNextPage,
        hasNextPage: hasNextPage ?? false,
        fetchNextPage,
        error,
        refetch,
        total: data?.pages[0]?.total || 0,
        pages: data?.pages[0]?.pages || 0
    };
}
