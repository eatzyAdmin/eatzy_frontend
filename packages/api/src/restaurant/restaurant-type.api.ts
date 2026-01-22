import { http } from "../http";
import type { IBackendRes, ResultPaginationDTO, RestaurantCategory } from "../../../types/src";

// ======== API ========

export const restaurantTypeApi = {
  /**
   * Get all restaurant types (categories)
   * Endpoint: GET /api/v1/restaurant-types
   */
  getAllRestaurantTypes: async (params?: { page?: number, size?: number }): Promise<IBackendRes<ResultPaginationDTO<RestaurantCategory[]>>> => {
    const queryParams = new URLSearchParams();
    
    // Default to a large size if not provided to get all types at once
    const page = params?.page ?? 0;
    const size = params?.size ?? 100;

    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());

    return http.get<IBackendRes<ResultPaginationDTO<RestaurantCategory[]>>>(
      `/api/v1/restaurant-types?${queryParams.toString()}`
    ) as unknown as Promise<IBackendRes<ResultPaginationDTO<RestaurantCategory[]>>>;
  },

  /**
   * Get restaurant type by ID
   * Endpoint: GET /api/v1/restaurant-types/{id}
   */
  getRestaurantTypeById: async (id: number): Promise<IBackendRes<RestaurantCategory>> => {
    return http.get<IBackendRes<RestaurantCategory>>(`/api/v1/restaurant-types/${id}`) as unknown as Promise<IBackendRes<RestaurantCategory>>;
  },
};
