import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishApi, menuCategoryApi, type MenuCategoryDTO } from '@repo/api';
import type { Dish, MenuCategory } from '@repo/types';
import { useNotification } from '@repo/ui';
import { useMemo, useCallback } from 'react';

// ======== Types ========

export interface UseRestaurantMenuResult {
  // Data
  dishes: Dish[];
  categories: MenuCategory[];

  // Loading states
  isLoading: boolean;
  isDishesLoading: boolean;
  isCategoriesLoading: boolean;

  // Error states
  isError: boolean;
  error: Error | null;

  // Actions
  refetch: () => void;

  // Mutations
  createDish: (dish: Omit<Dish, 'id'>) => Promise<Dish | null>;
  updateDish: (dish: Dish) => Promise<Dish | null>;
  deleteDish: (id: string) => Promise<boolean>;

  createCategory: (category: Omit<MenuCategory, 'id'>) => Promise<MenuCategory | null>;
  updateCategory: (category: MenuCategory) => Promise<MenuCategory | null>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Mutation states
  isCreatingDish: boolean;
  isUpdatingDish: boolean;
  isDeletingDish: boolean;
  isCreatingCategory: boolean;
  isUpdatingCategory: boolean;
  isDeletingCategory: boolean;
}

// ======== Query Keys ========

export const restaurantMenuKeys = {
  all: (restaurantId: number) => ['restaurant', restaurantId, 'menu'] as const,
  dishes: (restaurantId: number) => [...restaurantMenuKeys.all(restaurantId), 'dishes'] as const,
  categories: (restaurantId: number) => [...restaurantMenuKeys.all(restaurantId), 'categories'] as const,
};

// ======== Mapper Functions ========

function mapCategoryDTOToMenuCategory(dto: MenuCategoryDTO): MenuCategory {
  return {
    id: String(dto.id),
    name: dto.name,
    restaurantId: dto.restaurant?.id ? String(dto.restaurant.id) : '',
    displayOrder: dto.displayOrder,
  };
}

function mapMenuCategoryToDTO(category: MenuCategory, restaurantId: number): MenuCategoryDTO {
  return {
    id: Number(category.id),
    name: category.name,
    restaurant: { id: restaurantId },
    displayOrder: category.displayOrder,
  };
}

// ======== Hook ========

/**
 * Hook to fetch and manage restaurant menu (dishes + categories)
 * Fetches all data at once (no pagination needed for restaurant menu)
 * 
 * @param restaurantId The restaurant ID (number)
 * @param options Hook options
 * 
 * @example
 * ```tsx
 * const { 
 *   dishes, 
 *   categories, 
 *   isLoading, 
 *   createDish,
 *   updateDish,
 *   deleteDish,
 * } = useRestaurantMenu(restaurantId);
 * 
 * // Display dishes by category
 * categories.forEach(cat => {
 *   const catDishes = dishes.filter(d => d.menuCategoryId === cat.id);
 *   // render...
 * });
 * ```
 */
export function useRestaurantMenu(
  restaurantId: number | null,
  options: { enabled?: boolean; showNotifications?: boolean } = {}
): UseRestaurantMenuResult {
  const { enabled = true, showNotifications = true } = options;
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const isValidId = restaurantId !== null && restaurantId > 0;

  // ======== Queries ========

  // Fetch dishes
  const dishesQuery = useQuery({
    queryKey: restaurantMenuKeys.dishes(restaurantId || 0),
    queryFn: async () => {
      if (!restaurantId) throw new Error('Invalid restaurant ID');
      const response = await dishApi.getDishesByRestaurantId(restaurantId);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tải danh sách món ăn');
      }
      return response.data || [];
    },
    enabled: enabled && isValidId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch categories
  const categoriesQuery = useQuery({
    queryKey: restaurantMenuKeys.categories(restaurantId || 0),
    queryFn: async () => {
      if (!restaurantId) throw new Error('Invalid restaurant ID');
      const response = await menuCategoryApi.getCategoriesByRestaurantId(restaurantId);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tải danh mục món ăn');
      }
      return (response.data || []).map(mapCategoryDTOToMenuCategory);
    },
    enabled: enabled && isValidId,
    staleTime: 5 * 60 * 1000,
  });

  // ======== Mutations ========

  // Create dish mutation
  const createDishMutation = useMutation({
    mutationFn: async (dish: Omit<Dish, 'id'>) => {
      const response = await dishApi.createDish(dish);
      if (response.statusCode !== 201 && response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tạo món ăn');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantMenuKeys.dishes(restaurantId || 0) });
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
      queryClient.invalidateQueries({ queryKey: restaurantMenuKeys.dishes(restaurantId || 0) });
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
      queryClient.invalidateQueries({ queryKey: restaurantMenuKeys.dishes(restaurantId || 0) });
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

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (category: Omit<MenuCategory, 'id'>) => {
      const dto: Omit<MenuCategoryDTO, 'id'> = {
        name: category.name,
        restaurant: { id: restaurantId || 0 },
        displayOrder: category.displayOrder,
      };
      const response = await menuCategoryApi.createCategory(dto);
      if (response.statusCode !== 201 && response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tạo danh mục');
      }
      return mapCategoryDTOToMenuCategory(response.data!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantMenuKeys.categories(restaurantId || 0) });
      if (showNotifications) {
        showNotification({ message: 'Đã thêm danh mục mới!', type: 'success' });
      }
    },
    onError: (error: Error) => {
      if (showNotifications) {
        showNotification({ message: error.message, type: 'error' });
      }
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async (category: MenuCategory) => {
      const dto = mapMenuCategoryToDTO(category, restaurantId || 0);
      const response = await menuCategoryApi.updateCategory(dto);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể cập nhật danh mục');
      }
      return mapCategoryDTOToMenuCategory(response.data!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantMenuKeys.categories(restaurantId || 0) });
      if (showNotifications) {
        showNotification({ message: 'Đã cập nhật danh mục!', type: 'success' });
      }
    },
    onError: (error: Error) => {
      if (showNotifications) {
        showNotification({ message: error.message, type: 'error' });
      }
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await menuCategoryApi.deleteCategory(Number(id));
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể xóa danh mục');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantMenuKeys.categories(restaurantId || 0) });
      if (showNotifications) {
        showNotification({ message: 'Đã xóa danh mục!', type: 'success' });
      }
    },
    onError: (error: Error) => {
      if (showNotifications) {
        showNotification({ message: error.message, type: 'error' });
      }
    },
  });

  // ======== Computed Values ========

  const dishes = useMemo(() => dishesQuery.data || [], [dishesQuery.data]);
  const categories = useMemo(() => categoriesQuery.data || [], [categoriesQuery.data]);

  const isLoading = dishesQuery.isLoading || categoriesQuery.isLoading;
  const isError = dishesQuery.isError || categoriesQuery.isError;
  const error = dishesQuery.error || categoriesQuery.error;

  // ======== Actions ========

  const refetch = useCallback(() => {
    dishesQuery.refetch();
    categoriesQuery.refetch();
  }, [dishesQuery, categoriesQuery]);

  const createDish = useCallback(async (dish: Omit<Dish, 'id'>): Promise<Dish | null> => {
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

  const createCategory = useCallback(async (category: Omit<MenuCategory, 'id'>): Promise<MenuCategory | null> => {
    try {
      return await createCategoryMutation.mutateAsync(category);
    } catch {
      return null;
    }
  }, [createCategoryMutation]);

  const updateCategory = useCallback(async (category: MenuCategory): Promise<MenuCategory | null> => {
    try {
      return await updateCategoryMutation.mutateAsync(category);
    } catch {
      return null;
    }
  }, [updateCategoryMutation]);

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteCategoryMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  }, [deleteCategoryMutation]);

  // ======== Return ========

  return {
    // Data
    dishes,
    categories,

    // Loading states
    isLoading,
    isDishesLoading: dishesQuery.isLoading,
    isCategoriesLoading: categoriesQuery.isLoading,

    // Error states
    isError,
    error,

    // Actions
    refetch,

    // Mutations
    createDish,
    updateDish,
    deleteDish,
    createCategory,
    updateCategory,
    deleteCategory,

    // Mutation states
    isCreatingDish: createDishMutation.isPending,
    isUpdatingDish: updateDishMutation.isPending,
    isDeletingDish: deleteDishMutation.isPending,
    isCreatingCategory: createCategoryMutation.isPending,
    isUpdatingCategory: updateCategoryMutation.isPending,
    isDeletingCategory: deleteCategoryMutation.isPending,
  };
}
