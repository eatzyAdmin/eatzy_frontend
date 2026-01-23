"use client";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@repo/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { OrderResponse } from "@repo/types";

// Order statuses for history (completed or failed)
const HISTORY_ORDER_STATUSES = [
  "DELIVERED",
  "CANCELLED",
  "REJECTED",
];

export interface UseOrderHistoryResult {
  orders: OrderResponse[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  totalOrders: number;
}

/**
 * Hook to get order history (completed/cancelled) for the logged-in customer
 */
export function useOrderHistory(params?: {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
}): UseOrderHistoryResult {
  const { user } = useAuth();
  const isLoggedIn = !!user?.id;

  // Build filter for history statuses
  let baseFilter = "";
  if (params?.status === "CANCELLED") {
    // If user specifically wants cancelled, show both CANCELLED and REJECTED
    baseFilter = "(orderStatus~'CANCELLED' or orderStatus~'REJECTED')";
  } else if (params?.status && params.status !== "ALL") {
    baseFilter = `orderStatus~'${params.status}'`;
  } else {
    // Show all history (completed + cancelled + rejected)
    baseFilter = `(${HISTORY_ORDER_STATUSES.map(s => `orderStatus~'${s}'`).join(' or ')})`;
  }

  // Add search query if provided
  let finalFilter = baseFilter;
  if (params?.search) {
    const s = params.search.trim();
    if (s) {
      const searchQuery = `(id : ${s} or restaurant.name ~ '*${s}*' or deliveryAddress ~ '*${s}*')`;
      finalFilter = `${baseFilter} and ${searchQuery}`;
    }
  }

  const query = useQuery({
    queryKey: ["orders", "history", "my", finalFilter, params?.page, params?.size],
    queryFn: async () => {
      const response = await orderApi.getMyCustomerOrders({
        filter: finalFilter,
        page: params?.page ?? 0,
        size: params?.size ?? 50,
      });

      if (response.statusCode === 200 && response.data) {
        return response.data.result || [];
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
