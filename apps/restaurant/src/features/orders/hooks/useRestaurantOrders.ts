"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@repo/api";
import type { OrderResponse } from "@repo/types";
import type { Order, OrderItem } from "@repo/types";

export const restaurantOrdersKeys = {
  all: ["orders", "my-restaurant"] as const,
  active: () => [...restaurantOrdersKeys.all, "active"] as const,
};

// Active order statuses for restaurant view
const ACTIVE_ORDER_STATUSES = [
  "PENDING",
  "PLACED",
  "PREPARING",
  "DRIVER_ASSIGNED",
  "READY",
];

/**
 * Map OrderResponse from API to Order type used by UI components
 */
function mapOrderResponseToOrder(response: OrderResponse): Order {
  return {
    id: String(response.id),
    code: `#${response.id}`,
    restaurantId: String(response.restaurant?.id ?? 0),
    status: mapApiStatusToOrderStatus(response.orderStatus),
    deliveryLocation: {
      lat: response.deliveryLatitude ?? 0,
      lng: response.deliveryLongitude ?? 0,
      address: response.deliveryAddress,
    },
    restaurantLocation: {
      lat: 0, // Could be added to API response if needed
      lng: 0,
      name: response.restaurant?.name,
    },
    driverLocation: {
      lat: 0,
      lng: 0,
      name: response.driver?.name,
    },
    items: (response.orderItems ?? []).map((item): OrderItem => ({
      id: String(item.id),
      name: item.dish?.name ?? "",
      price: item.priceAtPurchase ?? item.dish?.price ?? 0,
      quantity: item.quantity,
      restaurantId: String(response.restaurant?.id ?? 0),
    })),
    subtotal: response.subtotal ?? 0,
    fee: response.deliveryFee ?? 0,
    discount: response.discountAmount ?? 0,
    total: response.totalAmount ?? 0,
    createdAt: response.createdAt,
    customer: {
      id: response.customer?.id,
      name: response.customer?.name ?? "Khách hàng",
      phoneNumber: response.customer?.phoneNumber,
    },
  };
}

function mapApiStatusToOrderStatus(apiStatus: string): Order["status"] {
  switch (apiStatus) {
    case "PENDING":
      return "PENDING";
    case "PLACED":
      return "PLACED";
    case "PREPARING":
    case "DRIVER_ASSIGNED":
      return "PREPARED";
    case "READY":
      return "PICKED";
    case "PICKED_UP":
    case "ARRIVED":
    case "DELIVERED":
      return "DELIVERED";
    case "CANCELLED":
    case "REJECTED":
      return "CANCELLED";
    default:
      return "PENDING";
  }
}

export interface UseRestaurantOrdersResult {
  orders: Order[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  pendingOrders: Order[];
  inProgressOrders: Order[];
  waitingForDriverOrders: Order[];
  acceptOrder: (orderId: string) => Promise<any>;
  rejectOrder: (orderId: string, reason: string) => Promise<any>;
  markAsReady: (orderId: string) => Promise<any>;
  isActionLoading: boolean;
}

/**
 * Hook to get active orders for the current restaurant owner
 * Uses the /api/v1/orders/my-restaurant endpoint
 */
export function useRestaurantOrders(): UseRestaurantOrdersResult {
  const queryClient = useQueryClient();
  // Build filter for active statuses
  const statusFilter = ACTIVE_ORDER_STATUSES.map(s => `orderStatus~'${s}'`).join(' or ');

  const query = useQuery({
    queryKey: restaurantOrdersKeys.active(),
    queryFn: async () => {
      const response = await orderApi.getMyRestaurantOrders({
        filter: statusFilter,
        size: 100,
      });

      if (response.statusCode === 200 && response.data) {
        return (response.data.result || []).map(mapOrderResponseToOrder);
      }
      return [];
    },
    // Real-time simulation: always fetch fresh data
    staleTime: 0,
    // Poll every 5 seconds to simulate WebSocket real-time updates
    refetchInterval: 5 * 1000,
  });

  const acceptMutation = useMutation({
    mutationFn: (orderId: string) => orderApi.acceptOrder(Number(orderId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantOrdersKeys.all });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      orderApi.rejectOrderByRestaurant(Number(orderId), reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantOrdersKeys.all });
    },
  });

  const readyMutation = useMutation({
    mutationFn: (orderId: string) => orderApi.markOrderAsReady(Number(orderId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantOrdersKeys.all });
    },
  });

  const orders = query.data || [];

  // Categorize orders by status
  const pendingOrders = orders.filter(o => o.status === "PLACED" || o.status === "PENDING");
  const inProgressOrders = orders.filter(o => o.status === "PREPARED");
  const waitingForDriverOrders = orders.filter(o => o.status === "PICKED");

  return {
    orders,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    pendingOrders,
    inProgressOrders,
    waitingForDriverOrders,
    acceptOrder: async (orderId: string) => acceptMutation.mutateAsync(orderId),
    rejectOrder: async (orderId: string, reason: string) => rejectMutation.mutateAsync({ orderId, reason }),
    markAsReady: async (orderId: string) => readyMutation.mutateAsync(orderId),
    isActionLoading: acceptMutation.isPending || rejectMutation.isPending || readyMutation.isPending,
  };
}
