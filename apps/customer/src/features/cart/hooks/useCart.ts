import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@repo/api';
import type { Cart, CartItem, AddToCartRequest } from '@repo/types';
import { useMemo, useCallback } from 'react';
import { useNotification } from '@repo/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';

// ======== Query Keys ========

export const cartKeys = {
  all: ['carts'] as const,
  myCarts: () => [...cartKeys.all, 'my-carts'] as const,
  forRestaurant: (restaurantId: number) => [...cartKeys.all, 'restaurant', restaurantId] as const,
};

// ======== Types ========

export interface UseCartResult {
  carts: Cart[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  // Computed
  totalItems: number;
  totalPrice: number;
  // Actions
  clearAllCarts: () => Promise<void>;
}

export interface UseRestaurantCartResult {
  cart: Cart | null;
  cartItems: CartItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  // Computed
  totalItems: number;
  totalPrice: number;
  // Actions
  addToCart: (dishId: number, quantity: number, options?: { id: number }[]) => Promise<Cart | null>;
  updateItemQuantity: (itemId: number, quantity: number) => Promise<Cart | null>;
  removeItem: (itemId: number) => Promise<Cart | null>;
  clearCart: () => Promise<void>;
  // Mutation states
  isAddingToCart: boolean;
  isUpdating: boolean;
  isClearing: boolean;
}

// ======== Hook: Get All User Carts ========

export function useCart(): UseCartResult {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: cartKeys.myCarts(),
    queryFn: async () => {
      const response = await cartApi.getMyCarts();
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tải giỏ hàng');
      }
      return response.data || [];
    },
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds
  });

  const carts = query.data || [];

  const totalItems = useMemo(() => {
    return carts.reduce((sum, cart) => {
      return sum + cart.cartItems.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);
  }, [carts]);

  const totalPrice = useMemo(() => {
    return carts.reduce((sum, cart) => {
      return sum + cart.cartItems.reduce((itemSum, item) => itemSum + item.totalPrice, 0);
    }, 0);
  }, [carts]);

  const queryClient = useQueryClient();

  const clearAllCarts = useCallback(async () => {
    for (const cart of carts) {
      await cartApi.deleteCart(cart.id);
    }
    queryClient.invalidateQueries({ queryKey: cartKeys.all });
  }, [carts, queryClient]);

  return {
    carts,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    totalItems,
    totalPrice,
    clearAllCarts,
  };
}

// ======== Hook: Cart for Specific Restaurant ========

export function useRestaurantCart(restaurantId: number | null): UseRestaurantCartResult {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const isValidId = restaurantId !== null && restaurantId > 0;

  // Query cart for this restaurant
  const query = useQuery({
    queryKey: isValidId ? cartKeys.forRestaurant(restaurantId) : cartKeys.all,
    queryFn: async () => {
      if (!restaurantId) return null;
      const response = await cartApi.getCartForRestaurant(restaurantId);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tải giỏ hàng');
      }
      return response.data;
    },
    enabled: !!user && isValidId,
    staleTime: 30 * 1000,
  });

  const cart = query.data || null;
  const cartItems = cart?.cartItems || [];

  // Computed values
  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
  }, [cartItems]);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ dishId, quantity, options }: { dishId: number; quantity: number; options?: { id: number }[] }) => {
      if (!user || !restaurantId) throw new Error('Missing user or restaurant');

      // Build request - merge with existing items
      const existingItems = cartItems.map(item => ({
        id: item.id,
        dish: { id: item.dish.id },
        quantity: item.quantity,
        cartItemOptions: item.cartItemOptions?.map(opt => ({
          id: opt.id,
          menuOption: { id: opt.menuOption.id },
        })),
      }));

      // Check if item already exists
      const existingIndex = existingItems.findIndex(item => item.dish.id === dishId);

      if (existingIndex >= 0) {
        // Update quantity
        existingItems[existingIndex].quantity += quantity;
      } else {
        // Add new item
        existingItems.push({
          id: undefined as unknown as number,
          dish: { id: dishId },
          quantity,
          cartItemOptions: options?.map(opt => ({
            id: undefined as unknown as number,
            menuOption: { id: opt.id },
          })),
        });
      }

      const request: AddToCartRequest = {
        customer: { id: Number(user.id) },
        restaurant: { id: restaurantId },
        cartItems: existingItems,
      };

      const response = await cartApi.saveOrUpdateCart(request);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể thêm vào giỏ hàng');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      showNotification({ message: 'Đã thêm vào giỏ hàng!', type: 'success', format: "Thêm vào giỏ hàng thành công" });
    },
    onError: (error: Error) => {
      showNotification({ message: error.message, type: 'error', format: `${error.message}` });
    },
  });

  // Update item quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      if (!user || !restaurantId || !cart) throw new Error('Missing data');

      const updatedItems = cartItems
        .map(item => ({
          id: item.id,
          dish: { id: item.dish.id },
          quantity: item.id === itemId ? quantity : item.quantity,
          cartItemOptions: item.cartItemOptions?.map(opt => ({
            id: opt.id,
            menuOption: { id: opt.menuOption.id },
          })),
        }))
        .filter(item => item.quantity > 0); // Remove items with 0 quantity

      const request: AddToCartRequest = {
        customer: { id: Number(user.id) },
        restaurant: { id: restaurantId },
        cartItems: updatedItems,
      };

      const response = await cartApi.saveOrUpdateCart(request);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể cập nhật giỏ hàng');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error: Error) => {
      showNotification({ message: error.message, type: 'error' });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!cart) return;
      const response = await cartApi.deleteCart(cart.id);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể xóa giỏ hàng');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error: Error) => {
      showNotification({ message: error.message, type: 'error', format: `${error.message}` });
    },
  });

  // Action functions
  const addToCart = useCallback(async (dishId: number, quantity: number, options?: { id: number }[]) => {
    try {
      return await addToCartMutation.mutateAsync({ dishId, quantity, options }) || null;
    } catch {
      return null;
    }
  }, [addToCartMutation]);

  const updateItemQuantity = useCallback(async (itemId: number, quantity: number) => {
    try {
      return await updateQuantityMutation.mutateAsync({ itemId, quantity }) || null;
    } catch {
      return null;
    }
  }, [updateQuantityMutation]);

  const removeItem = useCallback(async (itemId: number) => {
    return updateItemQuantity(itemId, 0);
  }, [updateItemQuantity]);

  const clearCart = useCallback(async () => {
    try {
      await clearCartMutation.mutateAsync();
    } catch {
      // Error handled in mutation
    }
  }, [clearCartMutation]);

  return {
    cart,
    cartItems,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    totalItems,
    totalPrice,
    addToCart,
    updateItemQuantity,
    removeItem,
    clearCart,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
}
