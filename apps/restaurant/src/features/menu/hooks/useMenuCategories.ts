import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuCategoryApi } from '@repo/api';
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
  updateAllCategories: (currentCategories: MenuCategory[], newCategories: MenuCategory[]) => Promise<void>;

  // Mutation states
  isCreatingCategory: boolean;
  isUpdatingCategory: boolean;
  isDeletingCategory: boolean;
  isUpdatingAll: boolean;
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

      const response = await menuCategoryApi.createCategory(category, targetRestaurantId);
      if (response.statusCode !== 201 && response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tạo danh mục');
      }
      return response.data!;
    },
    onSuccess: () => {
      invalidateMenu();
      if (showNotifications) {
        showNotification({ message: 'Đã thêm danh mục mới!', type: 'success' });
      }
    },
    onError: (error: Error) => {
      if (showNotifications) {
        showNotification({ message: 'Cập nhật thất bại', type: 'error', format: error.message });
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

      const response = await menuCategoryApi.updateCategory(category, targetRestaurantId);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể cập nhật danh mục');
      }
      return response.data!;
    },
    onSuccess: () => {
      invalidateMenu();
      if (showNotifications) {
        showNotification({ message: 'Đã cập nhật danh mục!', type: 'success' });
      }
    },
    onError: (error: Error) => {
      if (showNotifications) {
        showNotification({ message: 'Cập nhật thất bại', type: 'error', format: error.message });
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
        showNotification({ message: 'Cập nhật thất bại', type: 'error', format: error.message });
      }
    },
  });

  // Update all categories (bulk) mutation
  const updateAllCategoriesMutation = useMutation({
    mutationFn: async ({ current, next }: { current: MenuCategory[], next: MenuCategory[] }) => {
      const targetRestaurantId = Number(restaurantId || 0);
      if (!targetRestaurantId) {
        throw new Error('Không tìm thấy thông tin nhà hàng');
      }

      const originalIds = new Set(current.map(c => c.id));
      const nextIds = new Set(next.map(c => c.id));

      // 1. Delete
      const toDelete = current.filter(c => !nextIds.has(c.id));
      for (const cat of toDelete) {
        await menuCategoryApi.deleteCategory(Number(cat.id));
      }

      // 2. Create & Update
      for (const cat of next) {
        if (!originalIds.has(cat.id)) {
          // Create
          await menuCategoryApi.createCategory(cat, targetRestaurantId);
        } else {
          // Update
          const original = current.find(c => c.id === cat.id);
          if (original && (original.name !== cat.name || original.displayOrder !== cat.displayOrder)) {
            await menuCategoryApi.updateCategory(cat, targetRestaurantId);
          }
        }
      }
    },
    onSuccess: () => {
      invalidateMenu();
      if (showNotifications) {
        showNotification({ message: 'Cập nhật danh mục thành công!', type: 'success' });
      }
    },
    onError: (error: Error) => {
      if (showNotifications) {
        showNotification({ message: 'Cập nhật thất bại', type: 'error', format: error.message });
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

  const updateAllCategories = useCallback(async (current: MenuCategory[], next: MenuCategory[]) => {
    await updateAllCategoriesMutation.mutateAsync({ current, next });
  }, [updateAllCategoriesMutation]);

  // ======== Return ========

  return {
    // Mutations
    createCategory,
    updateCategory,
    deleteCategory,
    updateAllCategories,

    // Mutation states
    isCreatingCategory: createCategoryMutation.isPending,
    isUpdatingCategory: updateCategoryMutation.isPending,
    isDeletingCategory: deleteCategoryMutation.isPending,
    isUpdatingAll: updateAllCategoriesMutation.isPending,
  };
}
