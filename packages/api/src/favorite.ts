import { http } from "./http";
import type { IBackendRes, FavoriteRequest, FavoriteResponse } from "../../types/src";

/**
 * Favorite API endpoints
 * Handles customer's favorite restaurants
 */
export const favoriteApi = {
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
