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
  "DRIVER_ASSIGNED",
  "READY",
  "PICKED_UP",
  "ARRIVED",
];

export interface UseCurrentOrdersOptions {
  /** When true, enables aggressive polling (5s) to simulate real-time updates */
  isDrawerOpen?: boolean;
}

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
 * Uses new /my-customer API with filter to fetch only active orders
 * 
 * When isDrawerOpen is true:
 * - Data is immediately invalidated (staleTime: 0)
 * - Polling interval is 5 seconds (simulates WebSocket real-time updates)
 * 
 * When isDrawerOpen is false:
 * - Normal staleTime of 30 seconds
 * - Polling interval of 60 seconds
 */
export function useCurrentOrders(options: UseCurrentOrdersOptions = {}): UseCurrentOrdersResult {
  const { isDrawerOpen = false } = options;
  const { user } = useAuth();
  const isLoggedIn = !!user?.id;

  // Build filter for active statuses using Spring Filter syntax
  // Filter format: orderStatus~'PENDING' or orderStatus~'PLACED' etc.
  const statusFilter = ACTIVE_ORDER_STATUSES.map(s => `orderStatus~'${s}'`).join(' or ');

  // Polling configuration based on drawer state
  // When drawer is open: poll every 5s for real-time feel
  // When drawer is closed: poll every 60s for background updates
  const pollingInterval = isDrawerOpen ? 5 * 1000 : 60 * 1000;
  const staleTime = isDrawerOpen ? 0 : 30 * 1000;

  const query = useQuery({
    queryKey: ["orders", "current", "my"],
    queryFn: async () => {
      const response = await orderApi.getMyCustomerOrders({
        filter: statusFilter,
        size: 50, // Get up to 50 active orders
      });

      if (response.statusCode === 200 && response.data) {
        return response.data.result || [];
      }
      return [];
    },
    enabled: isLoggedIn,
    staleTime: staleTime,
    refetchInterval: pollingInterval,
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
