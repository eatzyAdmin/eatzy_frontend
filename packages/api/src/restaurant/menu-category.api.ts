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

import { mapCategoryDTOToMenuCategory, mapMenuCategoryToDTO } from "./mappers/menu-category.mapper";
import type { MenuCategory } from "../../../types/src";

// ======== API ========

export const menuCategoryApi = {
  // Get all categories for a restaurant
  getCategoriesByRestaurantId: async (restaurantId: number): Promise<IBackendRes<MenuCategory[]>> => {
    const response = await http.get<IBackendRes<MenuCategoryDTO[]>>(
      `/api/v1/dish-categories/restaurant/${restaurantId}`
    ) as unknown as IBackendRes<MenuCategoryDTO[]>;

    return {
      ...response,
      data: response.data?.map(mapCategoryDTOToMenuCategory) || [],
    };
  },

  // Get single category by ID
  getCategoryById: async (id: number): Promise<IBackendRes<MenuCategory>> => {
    const response = await http.get<IBackendRes<MenuCategoryDTO>>(
      `/api/v1/dish-categories/${id}`
    ) as unknown as IBackendRes<MenuCategoryDTO>;

    return {
      ...response,
      data: response.data ? mapCategoryDTOToMenuCategory(response.data) : undefined,
    } as IBackendRes<MenuCategory>;
  },

  // Create new category
  createCategory: async (category: Omit<MenuCategory, 'id' | 'restaurantId'>, restaurantId: number): Promise<IBackendRes<MenuCategory>> => {
    const dto = mapMenuCategoryToDTO({ ...category, id: '0', restaurantId: String(restaurantId) } as MenuCategory, restaurantId);
    const response = await http.post<IBackendRes<MenuCategoryDTO>>(
      `/api/v1/dish-categories`,
      dto
    ) as unknown as IBackendRes<MenuCategoryDTO>;

    return {
      ...response,
      data: response.data ? mapCategoryDTOToMenuCategory(response.data) : undefined,
    } as IBackendRes<MenuCategory>;
  },

  // Update category
  updateCategory: async (category: MenuCategory, restaurantId: number): Promise<IBackendRes<MenuCategory>> => {
    const dto = mapMenuCategoryToDTO(category, restaurantId);
    const response = await http.put<IBackendRes<MenuCategoryDTO>>(
      `/api/v1/dish-categories`,
      dto
    ) as unknown as IBackendRes<MenuCategoryDTO>;

    return {
      ...response,
      data: response.data ? mapCategoryDTOToMenuCategory(response.data) : undefined,
    } as IBackendRes<MenuCategory>;
  },

  // Delete category
  deleteCategory: (id: number) => {
    return http.delete<IBackendRes<void>>(
      `/api/v1/dish-categories/${id}`
    ) as unknown as Promise<IBackendRes<void>>;
  },
};
