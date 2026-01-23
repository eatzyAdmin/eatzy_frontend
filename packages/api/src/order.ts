import { http } from "./http";
import type {
  IBackendRes,
  CreateOrderRequest,
  OrderResponse,
  CalculateDeliveryFeeRequest,
  DeliveryFeeResponse
} from "../../types/src";

/**
 * Order API endpoints
 * Handles order creation, retrieval, and management
 */
export const orderApi = {
  /**
   * Calculate delivery fee
   * POST /api/v1/orders/delivery-fee
   */
  calculateDeliveryFee: async (request: CalculateDeliveryFeeRequest): Promise<IBackendRes<DeliveryFeeResponse>> => {
    return http.post<IBackendRes<DeliveryFeeResponse>>("/api/v1/orders/delivery-fee", request) as unknown as Promise<IBackendRes<DeliveryFeeResponse>>;
  },

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
   * Cancel an order (customer)
   * PATCH /api/v1/orders/:id/customer/cancel
   */
  cancelOrder: async (orderId: number, cancellationReason: string): Promise<IBackendRes<OrderResponse>> => {
    return http.patch<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/customer/cancel`, { cancellationReason }) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Get orders for current owner's restaurant (uses auth context)
   * GET /api/v1/orders/my-restaurant
   * Supports filter via query params: filter=orderStatus~'PENDING' or 'PLACED' etc.
   */
  getMyRestaurantOrders: async (params?: {
    filter?: string;
    page?: number;
    size?: number;
  }): Promise<IBackendRes<{ result: OrderResponse[]; meta: { page: number; pages: number; total: number; pageSize: number } }>> => {
    return http.get<IBackendRes<{ result: OrderResponse[]; meta: { page: number; pages: number; total: number; pageSize: number } }>>("/api/v1/orders/my-restaurant", {
      params,
    }) as unknown as Promise<IBackendRes<{ result: OrderResponse[]; meta: { page: number; pages: number; total: number; pageSize: number } }>>;
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
   * PATCH /api/v1/orders/:id/restaurant/ready
   */
  markOrderAsReady: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.patch<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/restaurant/ready`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Accept order (restaurant)
   * PATCH /api/v1/orders/:id/restaurant/accept
   */
  acceptOrder: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.patch<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/restaurant/accept`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Reject order (restaurant)
   * PATCH /api/v1/orders/:id/restaurant/reject
   */
  rejectOrderByRestaurant: async (orderId: number, cancellationReason: string): Promise<IBackendRes<OrderResponse>> => {
    return http.patch<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/restaurant/reject`, { cancellationReason }) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Driver accepts order
   * PATCH /api/v1/orders/:id/driver/accept
   */
  acceptOrderByDriver: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.patch<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/driver/accept`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Driver rejects order
   * PATCH /api/v1/orders/:id/driver/reject
   */
  rejectOrderByDriver: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.patch<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/driver/reject`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Mark order as picked up (driver)
   * PATCH /api/v1/orders/:id/driver/picked-up
   */
  markOrderAsPickedUp: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.patch<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/driver/picked-up`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Mark order as arrived (driver)
   * PATCH /api/v1/orders/:id/driver/arrived
   */
  markOrderAsArrived: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.patch<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/driver/arrived`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Mark order as delivered (driver)
   * PATCH /api/v1/orders/:id/driver/delivered
   */
  markOrderAsDelivered: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.patch<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/driver/delivered`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Assign driver to order
   * PATCH /api/v1/orders/:id/assign-driver
   */
  assignDriver: async (orderId: number): Promise<IBackendRes<OrderResponse>> => {
    return http.patch<IBackendRes<OrderResponse>>(`/api/v1/orders/${orderId}/assign-driver`, {}) as unknown as Promise<IBackendRes<OrderResponse>>;
  },

  /**
   * Get orders for current logged-in driver (uses auth context)
   * GET /api/v1/orders/my-driver
   * Supports filter via query params: filter=orderStatus != 'DELIVERED' and orderStatus != 'REJECTED'
   */
  getMyDriverOrders: async (params?: {
    filter?: string;
    page?: number;
    size?: number;
  }): Promise<IBackendRes<{ result: OrderResponse[]; meta: { page: number; pages: number; total: number; pageSize: number } }>> => {
    return http.get<IBackendRes<{ result: OrderResponse[]; meta: { page: number; pages: number; total: number; pageSize: number } }>>("/api/v1/orders/my-driver", {
      params,
    }) as unknown as Promise<IBackendRes<{ result: OrderResponse[]; meta: { page: number; pages: number; total: number; pageSize: number } }>>;
  },
};
