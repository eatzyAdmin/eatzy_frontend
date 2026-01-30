import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuCategoryApi, type MenuCategoryDTO } from '@repo/api';
import type { MenuCategory } from '@repo/types';
import { useNotification } from '@repo/ui';
import { useCallback } from 'react';
import { myRestaurantMenuKeys } from './useMenu';

// ======== Types ========

export interface UseMenuCategoriesResult {
  // Mutations
  createCategory: (category: Omit<MenuCategory, 'id' | 'restaurantId'>) => Promise<MenuCategory | null>;
  updateCategory: (category: MenuCategory) => Promise<MenuCategory | null>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Mutation states
  isCreatingCategory: boolean;
  isUpdatingCategory: boolean;
  isDeletingCategory: boolean;
}

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
 * Hook to manage menu categories for the current owner's restaurant
 * Uses restaurantId from menu data to perform category operations
 * 
 * @param restaurantId The restaurant ID obtained from useMyRestaurantMenu
 * @param options Hook options
 * 
 * @example
 * ```tsx
 * const { restaurantId, categories } = useMyRestaurantMenu();
 * const { createCategory, updateCategory, deleteCategory } = useMenuCategories(restaurantId);
 * 
 * // Create a new category
 * await createCategory({ name: 'New Category', displayOrder: 1 });
 * ```
 */
export function useMenuCategories(
  restaurantId: string | null,
  options: { showNotifications?: boolean } = {}
): UseMenuCategoriesResult {
  const { showNotifications = true } = options;
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const queryKey = myRestaurantMenuKeys.menu();

  // Helper to invalidate menu cache
  const invalidateMenu = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  // ======== Mutations ========

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (category: Omit<MenuCategory, 'id' | 'restaurantId'>) => {
      const targetRestaurantId = Number(restaurantId || 0);
      if (!targetRestaurantId) {
        throw new Error('Không tìm thấy thông tin nhà hàng');
      }

      const dto: Omit<MenuCategoryDTO, 'id'> = {
        name: category.name,
        restaurant: { id: targetRestaurantId },
        displayOrder: category.displayOrder,
      };
      const response = await menuCategoryApi.createCategory(dto);
      if (response.statusCode !== 201 && response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tạo danh mục');
      }
      return mapCategoryDTOToMenuCategory(response.data!);
    },
    onSuccess: () => {
      invalidateMenu();
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
      const targetRestaurantId = Number(restaurantId || 0);
      if (!targetRestaurantId) {
        throw new Error('Không tìm thấy thông tin nhà hàng');
      }

      const dto = mapMenuCategoryToDTO(category, targetRestaurantId);
      const response = await menuCategoryApi.updateCategory(dto);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể cập nhật danh mục');
      }
      return mapCategoryDTOToMenuCategory(response.data!);
    },
    onSuccess: () => {
      invalidateMenu();
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
      invalidateMenu();
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

  // ======== Actions ========

  const createCategory = useCallback(async (category: Omit<MenuCategory, 'id' | 'restaurantId'>): Promise<MenuCategory | null> => {
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
    // Mutations
    createCategory,
    updateCategory,
    deleteCategory,

    // Mutation states
    isCreatingCategory: createCategoryMutation.isPending,
    isUpdatingCategory: updateCategoryMutation.isPending,
    isDeletingCategory: deleteCategoryMutation.isPending,
  };
}
