import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishApi, restaurantDetailApi } from '@repo/api';
import type { Dish, MenuCategory } from '@repo/types';
import { useNotification } from '@repo/ui';
import { useMemo, useCallback } from 'react';

// ======== Types ========

export interface UseMyRestaurantMenuResult {
  // Data
  dishes: Dish[];
  categories: MenuCategory[];
  restaurantId: string | null;

  // Loading states
  isLoading: boolean;

  // Error states
  isError: boolean;
  error: Error | null;

  // Actions
  refetch: () => void;

  // Dish Mutations
  createDish: (dish: Omit<Dish, 'id' | 'restaurantId'>) => Promise<Dish | null>;
  updateDish: (dish: Dish) => Promise<Dish | null>;
  deleteDish: (id: string) => Promise<boolean>;

  // Dish Mutation states
  isCreatingDish: boolean;
  isUpdatingDish: boolean;
  isDeletingDish: boolean;
}

// ======== Query Keys ========

export const myRestaurantMenuKeys = {
  menu: () => ['my-restaurant', 'menu'] as const,
};

// ======== Hook ========

/**
 * Hook to fetch and manage current owner's restaurant menu (dishes + categories)
 * Uses the my-restaurant API - no restaurant ID needed
 * 
 * For category mutations, use the separate useMenuCategories hook
 * 
 * @param options Hook options
 * 
 * @example
 * ```tsx
 * const { 
 *   dishes, 
 *   categories, 
 *   restaurantId,
 *   isLoading, 
 *   createDish,
 *   updateDish,
 *   deleteDish,
 * } = useMyRestaurantMenu();
 * 
 * // For category mutations, use:
 * const { createCategory, updateCategory, deleteCategory } = useMenuCategories(restaurantId);
 * ```
 */
export function useMyRestaurantMenu(
  options: { enabled?: boolean; showNotifications?: boolean } = {}
): UseMyRestaurantMenuResult {
  const { enabled = true, showNotifications = true } = options;
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const queryKey = myRestaurantMenuKeys.menu();

  // ======== Query ========

  // Fetch menu using my-restaurant API
  const menuQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await restaurantDetailApi.getMyMenu();

      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tải thực đơn');
      }
      return response.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  // ======== Computed Values ========

  const dishes = useMemo(() => menuQuery.data?.dishes || [], [menuQuery.data]);
  const categories = useMemo(() => menuQuery.data?.categories || [], [menuQuery.data]);
  const restaurantId = useMemo(() => menuQuery.data?.restaurantId || null, [menuQuery.data]);

  const isLoading = menuQuery.isLoading;
  const isError = menuQuery.isError;
  const error = menuQuery.error;

  // ======== Mutations ========

  // Helper to invalidate menu cache
  const invalidateMenu = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  // Create dish mutation
  const createDishMutation = useMutation({
    mutationFn: async (dish: Omit<Dish, 'id' | 'restaurantId'>) => {
      // Get restaurantId from fetched menu data
      const targetRestaurantId = menuQuery.data?.restaurantId;
      if (!targetRestaurantId) {
        throw new Error('Không tìm thấy thông tin nhà hàng');
      }

      const dishWithRestaurant: Omit<Dish, 'id'> = {
        ...dish,
        restaurantId: targetRestaurantId,
      };

      const response = await dishApi.createDish(dishWithRestaurant);
      if (response.statusCode !== 201 && response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tạo món ăn');
      }
      return response.data;
    },
    onSuccess: () => {
      invalidateMenu();
      if (showNotifications) {
        showNotification({ message: 'Đã thêm món mới thành công!', type: 'success' });
      }
    },
    onError: (error: Error) => {
      if (showNotifications) {
        showNotification({ message: error.message, type: 'error' });
      }
    },
  });

  // Update dish mutation
  const updateDishMutation = useMutation({
    mutationFn: async (dish: Dish) => {
      const response = await dishApi.updateDish(dish);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể cập nhật món ăn');
      }
      return response.data;
    },
    onSuccess: () => {
      invalidateMenu();
      if (showNotifications) {
        showNotification({ message: 'Đã cập nhật món ăn thành công!', type: 'success' });
      }
    },
    onError: (error: Error) => {
      if (showNotifications) {
        showNotification({ message: error.message, type: 'error' });
      }
    },
  });

  // Delete dish mutation
  const deleteDishMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await dishApi.deleteDish(Number(id));
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể xóa món ăn');
      }
    },
    onSuccess: () => {
      invalidateMenu();
      if (showNotifications) {
        showNotification({ message: 'Đã xóa món ăn!', type: 'success' });
      }
    },
    onError: (error: Error) => {
      if (showNotifications) {
        showNotification({ message: error.message, type: 'error' });
      }
    },
  });

  // ======== Actions ========

  const refetch = useCallback(() => {
    menuQuery.refetch();
  }, [menuQuery]);

  const createDish = useCallback(async (dish: Omit<Dish, 'id' | 'restaurantId'>): Promise<Dish | null> => {
    try {
      const result = await createDishMutation.mutateAsync(dish);
      return result || null;
    } catch {
      return null;
    }
  }, [createDishMutation]);

  const updateDish = useCallback(async (dish: Dish): Promise<Dish | null> => {
    try {
      const result = await updateDishMutation.mutateAsync(dish);
      return result || null;
    } catch {
      return null;
    }
  }, [updateDishMutation]);

  const deleteDish = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteDishMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  }, [deleteDishMutation]);

  // ======== Return ========

  return {
    // Data
    dishes,
    categories,
    restaurantId,

    // Loading states
    isLoading,

    // Error states
    isError,
    error,

    // Actions
    refetch,

    // Dish Mutations
    createDish,
    updateDish,
    deleteDish,

    // Dish Mutation states
    isCreatingDish: createDishMutation.isPending,
    isUpdatingDish: updateDishMutation.isPending,
    isDeletingDish: deleteDishMutation.isPending,
  };
}

// ======== Re-export useMenuCategories ========
export { useMenuCategories } from './useMenuCategories';
