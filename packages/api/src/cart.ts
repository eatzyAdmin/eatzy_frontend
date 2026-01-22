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
   * This will filter getMyCarts result on frontend
   */
  getCartForRestaurant: async (restaurantId: number): Promise<IBackendRes<Cart | null>> => {
    const response = await cartApi.getMyCarts();
    if (response.statusCode === 200 && response.data) {
      const cart = response.data.find((c: Cart) => c.restaurant.id === restaurantId) || null;
      return { ...response, data: cart };
    }
    return { ...response, data: null };
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
