import { http } from "../http";
import type { IBackendRes, ResultPaginationDTO, Restaurant, RestaurantMagazine, NearbyRestaurantsParams } from "../../../types/src";

// ======== Types ========

export type PaginationParams = {
  page?: number;
  size?: number;
  sort?: string;
};

export type RestaurantSearchParams = PaginationParams & {
  filter?: string;
};

// ======== Restaurant DTO ========

export type ResRestaurantDTO = {
  id: number;
  name: string;
  slug: string;
  address: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  averageRating?: number;
  schedule?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  // Rating counts
  oneStarCount?: number;
  twoStarCount?: number;
  threeStarCount?: number;
  fourStarCount?: number;
  fiveStarCount?: number;
};


// ======== API ========

export const restaurantApi = {
  // Get all restaurants with pagination
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
    return http.get<IBackendRes<ResRestaurantDTO>>(`/api/v1/restaurants/${id}`);
  },

  // Get restaurant by slug
  getRestaurantBySlug: (slug: string) => {
    return http.get<IBackendRes<ResRestaurantDTO>>(`/api/v1/restaurants/slug/${slug}`);
  },

  // Get restaurant menu by ID
  getRestaurantMenu: (id: number) => {
    return http.get<IBackendRes<unknown>>(`/api/v1/restaurants/${id}/menu`);
  },

  // Search restaurants by name
  searchRestaurants: (query: string, params?: PaginationParams) => {
    const searchParams: RestaurantSearchParams = {
      ...params,
      filter: `name~'${query}'`,
    };
    return restaurantApi.getRestaurants(searchParams);
  },

  // Get nearby restaurants with personalized ranking
  getNearbyRestaurants: (params: NearbyRestaurantsParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append('latitude', params.latitude.toString());
    queryParams.append('longitude', params.longitude.toString());

    if (params.search?.trim()) {
      queryParams.append('search', params.search.trim());
    }
    // Filter by restaurant type/category ID using JPA Specification filter syntax
    if (params.typeId !== undefined) {
      queryParams.append('filter', `restaurantTypes.id:${params.typeId}`);
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

  // Open restaurant (for owner)
  openRestaurant: (id: number) => {
    return http.post<IBackendRes<ResRestaurantDTO>>(`/api/v1/restaurants/${id}/open`, {});
  },

  // Close restaurant (for owner)
  closeRestaurant: (id: number) => {
    return http.post<IBackendRes<ResRestaurantDTO>>(`/api/v1/restaurants/${id}/close`, {});
  },

  // Delete restaurant
  deleteRestaurant: (id: number) => {
    return http.delete<IBackendRes<void>>(`/api/v1/restaurants/${id}`);
  },

  // Open my restaurant (for current owner)
  openMyRestaurant: () => {
    return http.post<IBackendRes<ResRestaurantDTO>>(`/api/v1/restaurants/open`, {});
  },

  // Close my restaurant (for current owner)
  closeMyRestaurant: () => {
    return http.post<IBackendRes<ResRestaurantDTO>>(`/api/v1/restaurants/close`, {});
  },

  // Get my restaurant status
  getMyRestaurantStatus: () => {
    return http.get<IBackendRes<{ status: string }>>(`/api/v1/restaurants/my-restaurant/status`);
  },
};
