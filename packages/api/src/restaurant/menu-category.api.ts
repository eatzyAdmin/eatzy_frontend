import { http } from "../http";
import type { IBackendRes } from "../../../types/src";

// ======== Types ========

export type MenuCategoryDTO = {
  id: number;
  name: string;
  slug?: string;
  restaurant?: { id: number };
  displayOrder?: number;
};

// ======== API ========

export const menuCategoryApi = {
  // Get all categories for a restaurant
  getCategoriesByRestaurantId: (restaurantId: number) => {
    return http.get<IBackendRes<MenuCategoryDTO[]>>(
      `/api/v1/dish-categories/restaurant/${restaurantId}`
    ) as unknown as Promise<IBackendRes<MenuCategoryDTO[]>>;
  },

  // Get single category by ID
  getCategoryById: (id: number) => {
    return http.get<IBackendRes<MenuCategoryDTO>>(
      `/api/v1/dish-categories/${id}`
    ) as unknown as Promise<IBackendRes<MenuCategoryDTO>>;
  },

  // Create new category
  createCategory: (category: Omit<MenuCategoryDTO, 'id'>) => {
    return http.post<IBackendRes<MenuCategoryDTO>>(
      `/api/v1/dish-categories`,
      category
    ) as unknown as Promise<IBackendRes<MenuCategoryDTO>>;
  },

  // Update category
  updateCategory: (category: MenuCategoryDTO) => {
    return http.put<IBackendRes<MenuCategoryDTO>>(
      `/api/v1/dish-categories`,
      category
    ) as unknown as Promise<IBackendRes<MenuCategoryDTO>>;
  },

  // Delete category
  deleteCategory: (id: number) => {
    return http.delete<IBackendRes<void>>(
      `/api/v1/dish-categories/${id}`
    ) as unknown as Promise<IBackendRes<void>>;
  },
};
