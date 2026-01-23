"use client";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@repo/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { OrderResponse } from "@repo/types";

// Order status that means "active/in-progress" (not completed or cancelled)
const ACTIVE_ORDER_STATUSES = [
  "PENDING",
  "PLACED",
  "PREPARING",
  "READY",
  "PICKED_UP",
  "ARRIVED",
];

export interface UseCurrentOrdersResult {
  orders: OrderResponse[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  activeOrdersCount: number;
}

/**
 * Hook to get current (active/in-progress) orders for the logged-in customer
 * Filters out DELIVERED and CANCELLED orders
 */
export function useCurrentOrders(): UseCurrentOrdersResult {
  const { user } = useAuth();
  const customerId = user?.id ? Number(user.id) : null;

  const query = useQuery({
    queryKey: ["orders", "current", customerId],
    queryFn: async () => {
      if (!customerId) return [];

      const response = await orderApi.getOrdersByCustomerId(customerId);
      if (response.statusCode === 200 && response.data) {
        // Filter to only active orders
        return response.data.filter((order) =>
          ACTIVE_ORDER_STATUSES.includes(order.orderStatus)
        );
      }
      return [];
    },
    enabled: !!customerId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every 60 seconds to get status updates
  });

  const orders = query.data || [];

  return {
    orders,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    activeOrdersCount: orders.length,
  };
}

/**
 * Hook to get a single order by ID
 */
export function useOrder(orderId: number | null) {
  const query = useQuery({
    queryKey: ["orders", "detail", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const response = await orderApi.getOrderById(orderId);
      if (response.statusCode === 200 && response.data) {
        return response.data;
      }
      return null;
    },
    enabled: !!orderId,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000, // Refetch more frequently for order tracking
  });

  return {
    order: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
