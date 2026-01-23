import { http } from "./http";
import type { IBackendRes, CreateOrderRequest, OrderResponse } from "../../types/src";

/**
 * Order API endpoints
 * Handles order creation, retrieval, and management
 */
export const orderApi = {
  /**
   * Create a new order
   * POST /api/v1/orders
   */
  createOrder: async (request: CreateOrderRequest): Promise<IBackendRes<OrderResponse>> => {
    return http.post<IBackendRes<OrderResponse>>("/api/v1/orders", request) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Get order by ID
   * GET /api/v1/orders/:id
   */
  getOrderById: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.get<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}`) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Get orders by customer ID
   * GET /api/v1/orders/customer/:customerId
   */
  getOrdersByCustomerId: async (customerId: number): Promise<IBackendRes<OrderResponse[]>> => {
    return http.get<IBackendRes<OrderResponse[]>>(`/api/v1/orders/customer/${customerId}`) as unknown as Promise<IBackendRes<OrderResponse[]>>;
  },

  /**
   * Get orders by customer ID and status
   * GET /api/v1/orders/customer/:customerId/status/:orderStatus
   */
  getOrdersByCustomerIdAndStatus: async (
    customerId: number,
    orderStatus: string
  ): Promise<IBackendRes<OrderResponse[]>> => {
    return http.get<IBackendRes<OrderResponse[]>>(`/api/v1/orders/customer/${customerId}/status/${orderStatus}`) as unknown as Promise<IBackendRes<OrderResponse[]>>;
  },

  /**
   * Get orders for current logged-in customer (uses auth context)
   * GET /api/v1/orders/my-customer
   * Supports filter via query params: filter=orderStatus:'PENDING' or 'PLACED' etc.
   */
  getMyCustomerOrders: async (params?: {
    filter?: string;
    page?: number;
    size?: number;
  }): Promise<IBackendRes<{ result: OrderResponse[]; meta: { page: number; pages: number; total: number; pageSize: number } }>> => {
    return http.get<IBackendRes<{ result: OrderResponse[]; meta: { page: number; pages: number; total: number; pageSize: number } }>>("/api/v1/orders/my-customer", {
      params,
    }) as unknown as Promise<IBackendRes<{ result: OrderResponse[]; meta: { page: number; pages: number; total: number; pageSize: number } }>>;
  },

  /**
   * Cancel an order
   * PUT /api/v1/orders/:id/cancel
   */
  cancelOrder: async (orderId: number, reason: string): Promise<IBackendRes<OrderResponse>> => {
    return http.put<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/cancel`, { reason }) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Get orders by restaurant ID
   * GET /api/v1/orders/restaurant/:restaurantId
   */
  getOrdersByRestaurantId: async (restaurantId: number): Promise<IBackendRes<OrderResponse[]>> => {
    return http.get<IBackendRes<OrderResponse[]>>(`/api/v1/orders/restaurant/${restaurantId}`) as unknown as Promise<IBackendRes<OrderResponse[]>>;
  },

  /**
   * Get orders by restaurant ID and status
   * GET /api/v1/orders/restaurant/:restaurantId/status/:orderStatus
   */
  getOrdersByRestaurantIdAndStatus: async (
    restaurantId: number,
    orderStatus: string
  ): Promise<IBackendRes<OrderResponse[]>> => {
    return http.get<IBackendRes<OrderResponse[]>>(`/api/v1/orders/restaurant/${restaurantId}/status/${orderStatus}`) as unknown as Promise<IBackendRes<OrderResponse[]>>;
  },

  /**
   * Get orders by driver ID
   * GET /api/v1/orders/driver/:driverId
   */
  getOrdersByDriverId: async (driverId: number): Promise<IBackendRes<OrderResponse[]>> => {
    return http.get<IBackendRes<OrderResponse[]>>(`/api/v1/orders/driver/${driverId}`) as unknown as Promise<IBackendRes<OrderResponse[]>>;
  },

  /**
   * Mark order as ready (restaurant)
   * PUT /api/v1/orders/:id/ready
   */
  markOrderAsReady: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.put<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/ready`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Accept order (restaurant)
   * PUT /api/v1/orders/:id/accept
   */
  acceptOrder: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.put<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/accept`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Accept order by driver
   * PUT /api/v1/orders/:id/accept-driver
   */
  acceptOrderByDriver: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.put<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/accept-driver`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Mark order as picked up (driver)
   * PUT /api/v1/orders/:id/picked-up
   */
  markOrderAsPickedUp: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.put<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/picked-up`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Mark order as arrived (driver)
   * PUT /api/v1/orders/:id/arrived
   */
  markOrderAsArrived: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.put<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/arrived`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Mark order as delivered (driver)
   * PUT /api/v1/orders/:id/delivered
   */
  markOrderAsDelivered: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.put<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/delivered`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Assign driver to order
   * PUT /api/v1/orders/:id/assign-driver
   */
  assignDriver: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.put<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/assign-driver`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },
};
