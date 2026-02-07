import { http } from "../http";
import type { IBackendRes, Dish } from "../../../types/src";

// ======== Backend DTO ========

export type BackendDishDTO = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  availabilityQuantity: number;
  restaurant?: { id: number };
  category?: { id: number; name: string };
  menuOptionGroups?: Array<{
    id: number;
    title: string;
    required: boolean;
    minSelect: number;
    maxSelect: number;
    options: Array<{ id: number; name: string; price: number }>;
  }>;
};

import { mapBackendDishToFrontend, mapFrontendDishToBackend } from "./mappers/dish.mapper";

// ======== API ========

export const dishApi = {
  // Get dishes by restaurant ID
  getDishesByRestaurantId: async (restaurantId: number): Promise<IBackendRes<Dish[]>> => {
    const response = await http.get<IBackendRes<BackendDishDTO[]>>(
      `/api/v1/dishes/restaurant/${restaurantId}`
    ) as unknown as IBackendRes<BackendDishDTO[]>;

    return {
      ...response,
      data: response.data?.map(mapBackendDishToFrontend) || [],
    };
  },

  // Get dishes by category ID
  getDishesByCategoryId: async (categoryId: number): Promise<IBackendRes<Dish[]>> => {
    const response = await http.get<IBackendRes<BackendDishDTO[]>>(
      `/api/v1/dishes/category/${categoryId}`
    ) as unknown as IBackendRes<BackendDishDTO[]>;

    return {
      ...response,
      data: response.data?.map(mapBackendDishToFrontend) || [],
    };
  },

  // Get single dish by ID
  getDishById: async (id: number): Promise<IBackendRes<Dish>> => {
    const response = await http.get<IBackendRes<BackendDishDTO>>(
      `/api/v1/dishes/${id}`
    ) as unknown as IBackendRes<BackendDishDTO>;

    return {
      ...response,
      data: response.data ? mapBackendDishToFrontend(response.data) : undefined,
    } as IBackendRes<Dish>;
  },

  // Create new dish
  createDish: async (dish: Omit<Dish, 'id'>): Promise<IBackendRes<Dish>> => {
    const backendDish = mapFrontendDishToBackend(dish);
    const response = await http.post<IBackendRes<BackendDishDTO>>(
      `/api/v1/dishes`,
      backendDish
    ) as unknown as IBackendRes<BackendDishDTO>;

    return {
      ...response,
      data: response.data ? mapBackendDishToFrontend(response.data) : undefined,
    } as IBackendRes<Dish>;
  },

  // Update dish
  updateDish: async (dish: Dish): Promise<IBackendRes<Dish>> => {
    const backendDish = mapFrontendDishToBackend(dish);
    const response = await http.put<IBackendRes<BackendDishDTO>>(
      `/api/v1/dishes`,
      backendDish
    ) as unknown as IBackendRes<BackendDishDTO>;

    return {
      ...response,
      data: response.data ? mapBackendDishToFrontend(response.data) : undefined,
    } as IBackendRes<Dish>;
  },

  // Delete dish
  deleteDish: (id: number) => {
    return http.delete<IBackendRes<void>>(
      `/api/v1/dishes/${id}`
    ) as unknown as Promise<IBackendRes<void>>;
  },
};
