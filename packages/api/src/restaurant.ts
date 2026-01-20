import { http } from "./http";
import type { IBackendRes, ResultPaginationDTO, Restaurant, Dish, RestaurantMagazine, NearbyRestaurantsParams } from "../../types/src";


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

  /**
   * Get nearby restaurants with personalized ranking
   * This API searches restaurants within configured distance and sorts by:
   * - Personalized score (if user is logged in): typeScore, loyaltyScore, distanceScore, qualityScore
   * - Distance (if user is not logged in)
   * 
   * @param params NearbyRestaurantsParams with latitude, longitude, optional search keyword
   * @returns Paginated list of RestaurantMagazine with ranking scores
   */
  getNearbyRestaurants: (params: NearbyRestaurantsParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append('latitude', params.latitude.toString());
    queryParams.append('longitude', params.longitude.toString());

    if (params.search?.trim()) {
      queryParams.append('search', params.search.trim());
    }
    if (params.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params.size !== undefined) {
      queryParams.append('size', params.size.toString());
    }

    return http.get<IBackendRes<ResultPaginationDTO<RestaurantMagazine[]>>>(
      `/api/v1/restaurants/nearby?${queryParams.toString()}`
    ) as unknown as Promise<IBackendRes<ResultPaginationDTO<RestaurantMagazine[]>>>;
  },
};

// ======== Dish API ========

export const dishApi = {
  // Get dishes by restaurant ID (returns all dishes, no pagination)
  getDishesByRestaurantId: (restaurantId: number) => {
    return http.get<IBackendRes<Dish[]>>(
      `/api/v1/dishes/restaurant/${restaurantId}`
    ) as unknown as Promise<IBackendRes<Dish[]>>;
  },

  // Get dishes by category ID
  getDishesByCategoryId: (categoryId: number) => {
    return http.get<IBackendRes<Dish[]>>(
      `/api/v1/dishes/category/${categoryId}`
    ) as unknown as Promise<IBackendRes<Dish[]>>;
  },

  // Get single dish by ID
  getDishById: (id: number) => {
    return http.get<IBackendRes<Dish>>(
      `/api/v1/dishes/${id}`
    ) as unknown as Promise<IBackendRes<Dish>>;
  },

  // Create new dish
  createDish: (dish: Omit<Dish, 'id'>) => {
    return http.post<IBackendRes<Dish>>(
      `/api/v1/dishes`,
      dish
    ) as unknown as Promise<IBackendRes<Dish>>;
  },

  // Update dish
  updateDish: (dish: Dish) => {
    return http.put<IBackendRes<Dish>>(
      `/api/v1/dishes`,
      dish
    ) as unknown as Promise<IBackendRes<Dish>>;
  },

  // Delete dish
  deleteDish: (id: number) => {
    return http.delete<IBackendRes<void>>(
      `/api/v1/dishes/${id}`
    ) as unknown as Promise<IBackendRes<void>>;
  },
};

// ======== Menu Category API (DishCategory in backend) ========

export type MenuCategoryDTO = {
  id: number;
  name: string;
  restaurant?: { id: number };
  displayOrder?: number;
};

export const menuCategoryApi = {
  // Get all categories for a restaurant (no pagination, returns full list)
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
