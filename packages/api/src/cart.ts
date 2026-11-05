import { http } from "./http";
import type { IBackendRes, Cart, AddToCartRequest } from "../../types/src";

// ======== Cart API ========

export const cartApi = {
  /**
   * Get current user's carts (one per restaurant)
   * Endpoint: GET /api/v1/carts/my-carts
   */
  getMyCarts: () => {
    return http.get<IBackendRes<Cart[]>>(
      `/api/v1/carts/my-carts`
    ) as unknown as Promise<IBackendRes<Cart[]>>;
  },

  /**
   * Get cart by ID
   * Endpoint: GET /api/v1/carts/{id}
   */
  getCartById: (id: number) => {
    return http.get<IBackendRes<Cart>>(
      `/api/v1/carts/${id}`
    ) as unknown as Promise<IBackendRes<Cart>>;
  },

  /**
   * Get cart for specific restaurant (for current user)
   * Uses the owner-scoped page endpoint; does not load carts for other restaurants.
   */
  getCartForRestaurant: async (restaurantId: number): Promise<IBackendRes<Cart | null>> => {
    if (!Number.isSafeInteger(restaurantId) || restaurantId <= 0) throw new Error("Invalid restaurant ID");
    const response = await http.get<IBackendRes<{ result: Cart[] }>>("/api/v1/carts", {
      params: { page: 1, size: 1, filter: `restaurantId:${restaurantId}` },
    }) as unknown as IBackendRes<{ result: Cart[] }>;
    return { ...response, data: response.data?.result[0] ?? null };
  },

  /**
   * Add/Update cart (save or update)
   * Endpoint: POST /api/v1/carts
   * 
   * If cart exists for customer+restaurant, it will be updated.
   * Otherwise, a new cart is created.
   */
  saveOrUpdateCart: (data: AddToCartRequest) => {
    return http.post<IBackendRes<Cart>>(
      `/api/v1/carts`,
      data
    ) as unknown as Promise<IBackendRes<Cart>>;
  },

  /**
   * Delete cart by ID
   * Endpoint: DELETE /api/v1/carts/{id}
   */
  deleteCart: (id: number) => {
    return http.delete<IBackendRes<void>>(
      `/api/v1/carts/${id}`
    ) as unknown as Promise<IBackendRes<void>>;
  },

  /**
   * Clear all items from a cart (delete the cart)
   */
  clearCart: (cartId: number) => {
    return cartApi.deleteCart(cartId);
  },
};
