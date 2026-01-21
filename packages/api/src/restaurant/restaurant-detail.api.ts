import { http } from "../http";
import type { IBackendRes, Restaurant, Dish, MenuCategory, OptionGroup } from "../../../types/src";

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
  owner?: { id: number; name: string };
  restaurantTypes?: { id: number; name: string };
};

// ======== Frontend Types ========

export type RestaurantDetail = {
  id: string;
  name: string;
  slug: string;
  address: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  status: string;
  rating: number;
  reviewCount: number;
  schedule?: string;
  distance?: number;
  ownerName?: string;
  restaurantType?: string;
  // Star counts for rating breakdown
  oneStarCount: number;
  twoStarCount: number;
  threeStarCount: number;
  fourStarCount: number;
  fiveStarCount: number;
};

export type RestaurantMenu = {
  restaurantId: string;
  restaurantName: string;
  categories: MenuCategory[];
  dishes: Dish[];
};

// ======== Mappers ========

function mapBackendRestaurantDetail(dto: BackendRestaurantDetailDTO): RestaurantDetail {
  const oneStarCount = dto.oneStarCount || 0;
  const twoStarCount = dto.twoStarCount || 0;
  const threeStarCount = dto.threeStarCount || 0;
  const fourStarCount = dto.fourStarCount || 0;
  const fiveStarCount = dto.fiveStarCount || 0;
  const reviewCount = oneStarCount + twoStarCount + threeStarCount + fourStarCount + fiveStarCount;

  return {
    id: String(dto.id),
    name: dto.name,
    slug: dto.slug,
    address: dto.address,
    description: dto.description,
    latitude: dto.latitude,
    longitude: dto.longitude,
    contactPhone: dto.contactPhone,
    status: dto.status,
    rating: dto.averageRating || 0,
    reviewCount,
    schedule: dto.schedule,
    distance: dto.distance,
    ownerName: dto.owner?.name,
    restaurantType: dto.restaurantTypes?.name,
    oneStarCount,
    twoStarCount,
    threeStarCount,
    fourStarCount,
    fiveStarCount,
  };
}

function mapBackendMenuOptionGroup(dto: BackendMenuOptionGroupDTO): OptionGroup {
  return {
    id: String(dto.id),
    title: dto.name,
    options: dto.menuOptions.map(opt => ({
      id: String(opt.id),
      name: opt.name,
      price: opt.priceAdjustment || 0,
    })),
  };
}

function mapBackendMenuDish(dto: BackendMenuDishDTO, categoryId: string, restaurantId: string): Dish {
  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description || '',
    price: dto.price,
    imageUrl: dto.imageUrl || '',
    restaurantId,
    menuCategoryId: categoryId,
    availableQuantity: dto.availabilityQuantity || 0,
    isAvailable: dto.availabilityQuantity > 0,
    optionGroups: dto.menuOptionGroups?.map(mapBackendMenuOptionGroup),
  };
}

function mapBackendRestaurantMenu(dto: BackendRestaurantMenuDTO): RestaurantMenu {
  const restaurantId = String(dto.id);
  const categories: MenuCategory[] = [];
  const dishes: Dish[] = [];

  // "dishes" field is actually array of categories with dishes inside
  dto.dishes?.forEach((category, index) => {
    const categoryId = String(category.id);

    // Add category
    categories.push({
      id: categoryId,
      name: category.name,
      restaurantId,
      displayOrder: index + 1,
    });

    // Add dishes from this category
    category.dishes?.forEach(dish => {
      dishes.push(mapBackendMenuDish(dish, categoryId, restaurantId));
    });
  });

  return {
    restaurantId,
    restaurantName: dto.name,
    categories,
    dishes,
  };
}

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
};
