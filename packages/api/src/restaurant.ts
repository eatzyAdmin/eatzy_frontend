import { http } from "./http";
import type { IBackendRes, ResultPaginationDTO, Restaurant, Dish } from "../../types/src";


// Pagination params matching Spring Boot
export type PaginationParams = {
  page?: number; // 0-indexed
  size?: number;
  sort?: string; // e.g. "name,asc" or "averageRating,desc"
};

// Search/Filter params for restaurants
export type RestaurantSearchParams = PaginationParams & {
  filter?: string; // Spring Filter syntax e.g. "name~'pizza'" or "status:'ACTIVE'"
};

// Restaurant API
export const restaurantApi = {
  // Get all restaurants with pagination and filters
  getRestaurants: (params?: RestaurantSearchParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.filter) queryParams.append('filter', params.filter);

    return http.get<IBackendRes<ResultPaginationDTO<Restaurant[]>>>(
      `/api/v1/restaurants${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    ) as unknown as Promise<IBackendRes<ResultPaginationDTO<Restaurant[]>>>;
  },

  // Get restaurant by ID
  getRestaurantById: (id: number) => {
    return http.get<IBackendRes<Restaurant>>(`/api/v1/restaurants/${id}`);
  },

  // Get restaurant by slug
  getRestaurantBySlug: (slug: string) => {
    return http.get<IBackendRes<Restaurant>>(`/api/v1/restaurants/slug/${slug}`);
  },

  // Search restaurants by name (using filter)
  searchRestaurants: (query: string, params?: PaginationParams) => {
    const searchParams: RestaurantSearchParams = {
      ...params,
      filter: `name~'${query}'`, // Contains search
    };
    return restaurantApi.getRestaurants(searchParams);
  },
};

// Dish API
export const dishApi = {
  // Get dishes by restaurant ID
  getDishesByRestaurantId: (restaurantId: number) => {
    return http.get<IBackendRes<Dish[]>>(`/api/v1/dishes/restaurant/${restaurantId}`) as unknown as Promise<IBackendRes<Dish[]>>;
  },
};

