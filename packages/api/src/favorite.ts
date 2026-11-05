import { http } from "./http";
import type { IBackendRes, FavoriteRequest, FavoriteResponse, ResultPaginationDTO } from "../../types/src";

/**
 * Favorite API endpoints
 * Handles customer's favorite restaurants
 */
export const favoriteApi = {
  getPage: async (page = 1, restaurantId?: number): Promise<IBackendRes<ResultPaginationDTO<FavoriteResponse[]>>> => {
    return http.get("/api/v1/favorites", { params: {
      page, size: 20, sort: "id,desc",
      ...(restaurantId ? { filter: `restaurantId : ${restaurantId}` } : {}),
    } }) as unknown as Promise<IBackendRes<ResultPaginationDTO<FavoriteResponse[]>>>;
  },
  /**
   * Add a restaurant to favorites
   * POST /api/v1/favorites
   */
  addFavorite: async (request: FavoriteRequest): Promise<IBackendRes<FavoriteResponse>> => {
    return http.post<IBackendRes<FavoriteResponse>>("/api/v1/favorites", request) as unknown as Promise<IBackendRes<FavoriteResponse>>;
  },

  /**
   * Remove a restaurant from favorites
   * DELETE /api/v1/favorites/:id
   */
  removeFavorite: async (id: number): Promise<IBackendRes<void>> => {
    return http.delete<IBackendRes<void>>(`/api/v1/favorites/${id}`) as unknown as Promise<IBackendRes<void>>;
  },

  /**
   * Get all favorites for current logged-in user
   * GET /api/v1/favorites/my-favorites
   */
  getMyFavorites: async (): Promise<IBackendRes<FavoriteResponse[]>> => {
    return http.get<IBackendRes<FavoriteResponse[]>>("/api/v1/favorites/my-favorites") as unknown as Promise<IBackendRes<FavoriteResponse[]>>;
  },
};
