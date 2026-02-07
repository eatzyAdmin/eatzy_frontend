import { http } from "../http";
import type { IBackendRes, RestaurantDetail, RestaurantMenu } from "../../../types/src";
import { mapBackendRestaurantDetail, mapBackendRestaurantMenu } from "./mappers/restaurant.mapper";

// ======== Backend DTOs ========

// Menu Option DTO
export type BackendMenuOptionDTO = {
  id: number;
  name: string;
  priceAdjustment: number;
  isAvailable: boolean;
};

// Menu Option Group DTO
export type BackendMenuOptionGroupDTO = {
  id: number;
  name: string;
  minChoices?: number;
  maxChoices?: number;
  menuOptions: BackendMenuOptionDTO[];
};

// Dish DTO in menu
export type BackendMenuDishDTO = {
  id: number;
  name: string;
  description: string;
  price: number;
  availabilityQuantity: number;
  imageUrl: string;
  menuOptionGroupCount: number;
  menuOptionGroups: BackendMenuOptionGroupDTO[];
};

// Dish Category DTO in menu
export type BackendDishCategoryDTO = {
  id: number;
  name: string;
  dishes: BackendMenuDishDTO[];
};

// Restaurant Menu DTO (GET /restaurants/{id}/menu)
export type BackendRestaurantMenuDTO = {
  id: number;
  name: string;
  dishes: BackendDishCategoryDTO[]; // This is actually categories with dishes inside
};

// Restaurant Detail DTO (GET /restaurants/{id})
export type BackendRestaurantDetailDTO = {
  id: number;
  name: string;
  slug: string;
  address: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  status: string;
  commissionRate?: number;
  oneStarCount?: number;
  twoStarCount?: number;
  threeStarCount?: number;
  fourStarCount?: number;
  fiveStarCount?: number;
  averageRating?: number;
  schedule?: string;
  distance?: number;
  avatarUrl?: string;
  coverImageUrl?: string;
  owner?: { id: number; name: string };
  restaurantTypes?: { id: number; name: string };
};

// ======== API ========

export const restaurantDetailApi = {
  /**
   * Get restaurant details by ID
   * Endpoint: GET /api/v1/restaurants/{id}
   */
  getById: async (id: number): Promise<IBackendRes<RestaurantDetail>> => {
    const response = await http.get<IBackendRes<BackendRestaurantDetailDTO>>(
      `/api/v1/restaurants/${id}`
    ) as unknown as IBackendRes<BackendRestaurantDetailDTO>;

    return {
      ...response,
      data: response.data ? mapBackendRestaurantDetail(response.data) : undefined,
    } as IBackendRes<RestaurantDetail>;
  },

  /**
   * Get restaurant details by slug
   * Endpoint: GET /api/v1/restaurants/slug/{slug}
   */
  getBySlug: async (slug: string): Promise<IBackendRes<RestaurantDetail>> => {
    const response = await http.get<IBackendRes<BackendRestaurantDetailDTO>>(
      `/api/v1/restaurants/slug/${slug}`
    ) as unknown as IBackendRes<BackendRestaurantDetailDTO>;

    return {
      ...response,
      data: response.data ? mapBackendRestaurantDetail(response.data) : undefined,
    } as IBackendRes<RestaurantDetail>;
  },

  /**
   * Get restaurant menu (categories + dishes) by restaurant ID
   * Endpoint: GET /api/v1/restaurants/{id}/menu
   */
  getMenu: async (id: number): Promise<IBackendRes<RestaurantMenu>> => {
    const response = await http.get<IBackendRes<BackendRestaurantMenuDTO>>(
      `/api/v1/restaurants/${id}/menu`
    ) as unknown as IBackendRes<BackendRestaurantMenuDTO>;

    return {
      ...response,
      data: response.data ? mapBackendRestaurantMenu(response.data) : undefined,
    } as IBackendRes<RestaurantMenu>;
  },

  /**
   * Get current owner's restaurant menu (no ID required)
   * Endpoint: GET /api/v1/restaurants/my-restaurant/menu
   */
  getMyMenu: async (): Promise<IBackendRes<RestaurantMenu>> => {
    const response = await http.get<IBackendRes<BackendRestaurantMenuDTO>>(
      `/api/v1/restaurants/my-restaurant/menu`
    ) as unknown as IBackendRes<BackendRestaurantMenuDTO>;

    return {
      ...response,
      data: response.data ? mapBackendRestaurantMenu(response.data) : undefined,
    } as IBackendRes<RestaurantMenu>;
  },

  /**
   * Open restaurant (for owner)
   * Endpoint: POST /api/v1/restaurants/{id}/open
   */
  open: async (id: number): Promise<IBackendRes<RestaurantDetail>> => {
    const response = await http.post<IBackendRes<BackendRestaurantDetailDTO>>(
      `/api/v1/restaurants/${id}/open`,
      {}
    ) as unknown as IBackendRes<BackendRestaurantDetailDTO>;

    return {
      ...response,
      data: response.data ? mapBackendRestaurantDetail(response.data) : undefined,
    } as IBackendRes<RestaurantDetail>;
  },

  /**
   * Close restaurant (for owner)
   * Endpoint: POST /api/v1/restaurants/{id}/close
   */
  close: async (id: number): Promise<IBackendRes<RestaurantDetail>> => {
    const response = await http.post<IBackendRes<BackendRestaurantDetailDTO>>(
      `/api/v1/restaurants/${id}/close`,
      {}
    ) as unknown as IBackendRes<BackendRestaurantDetailDTO>;

    return {
      ...response,
      data: response.data ? mapBackendRestaurantDetail(response.data) : undefined,
    } as IBackendRes<RestaurantDetail>;
  },

  /**
   * Get current owner's restaurant details (no ID required)
   * Endpoint: GET /api/v1/restaurants/my-restaurant
   */
  getMyRestaurant: async (): Promise<IBackendRes<RestaurantDetail>> => {
    const response = await http.get<IBackendRes<BackendRestaurantDetailDTO>>(
      `/api/v1/restaurants/my-restaurant`
    ) as unknown as IBackendRes<BackendRestaurantDetailDTO>;

    return {
      ...response,
      data: response.data ? mapBackendRestaurantDetail(response.data) : undefined,
    } as IBackendRes<RestaurantDetail>;
  },

  /**
   * Update current owner's restaurant details (no ID required)
   * Endpoint: PUT /api/v1/restaurants/my-restaurant
   */
  updateMyRestaurant: async (updates: any): Promise<IBackendRes<RestaurantDetail>> => {
    const response = await http.put<IBackendRes<BackendRestaurantDetailDTO>>(
      `/api/v1/restaurants/my-restaurant`,
      updates
    ) as unknown as IBackendRes<BackendRestaurantDetailDTO>;

    return {
      ...response,
      data: response.data ? mapBackendRestaurantDetail(response.data) : undefined,
    } as IBackendRes<RestaurantDetail>;
  },
};
