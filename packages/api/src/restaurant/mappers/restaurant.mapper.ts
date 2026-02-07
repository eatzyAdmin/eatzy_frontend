import type {
  RestaurantDetail,
  RestaurantMenu,
  StoreInfo,
  OpeningHour,
  MenuCategory,
  Dish,
  UpdateStoreRequest
} from "../../../../types/src";
import type {
  BackendRestaurantDetailDTO,
  BackendRestaurantMenuDTO,
  BackendMenuOptionGroupDTO,
  BackendMenuDishDTO
} from "../restaurant-detail.api";

// ======== Helpers ========

export function parseSchedule(scheduleJson?: string): OpeningHour[] {
  if (!scheduleJson) {
    return getDefaultSchedule();
  }
  try {
    const parsed = JSON.parse(scheduleJson);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return getDefaultSchedule();
  } catch {
    return getDefaultSchedule();
  }
}

export function getDefaultSchedule(): OpeningHour[] {
  return [
    { day: 'Thứ 2', isOpen: true, shifts: [{ open: '08:00', close: '22:00' }] },
    { day: 'Thứ 3', isOpen: true, shifts: [{ open: '08:00', close: '22:00' }] },
    { day: 'Thứ 4', isOpen: true, shifts: [{ open: '08:00', close: '22:00' }] },
    { day: 'Thứ 5', isOpen: true, shifts: [{ open: '08:00', close: '22:00' }] },
    { day: 'Thứ 6', isOpen: true, shifts: [{ open: '08:00', close: '23:00' }] },
    { day: 'Thứ 7', isOpen: true, shifts: [{ open: '09:00', close: '23:00' }] },
    { day: 'Chủ Nhật', isOpen: false, shifts: [] },
  ];
}

// ======== Mappers ========

export function mapBackendRestaurantDetail(dto: BackendRestaurantDetailDTO): RestaurantDetail {
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
    avatarUrl: dto.avatarUrl,
    coverImageUrl: dto.coverImageUrl,
    oneStarCount,
    twoStarCount,
    threeStarCount,
    fourStarCount,
    fiveStarCount,
  };
}

export function mapRestaurantDetailToStoreInfo(detail: RestaurantDetail): StoreInfo {
  return {
    id: Number(detail.id),
    name: detail.name,
    description: detail.description || '',
    address: detail.address,
    coords: {
      lat: detail.latitude || 0,
      lng: detail.longitude || 0,
    },
    slug: detail.slug,
    commissionRate: 10, // Default
    phone: detail.contactPhone || '',
    email: '',
    rating: detail.rating,
    reviewCount: detail.reviewCount,
    status: detail.status,
    imageUrl: detail.avatarUrl || '',
    coverImageUrl: detail.coverImageUrl,
    schedule: detail.schedule,
    openingHours: parseSchedule(detail.schedule),
    images: [], // Images need separate endpoint if available
  };
}

export function mapBackendRestaurantMenu(dto: BackendRestaurantMenuDTO): RestaurantMenu {
  const restaurantId = String(dto.id);
  const categories: MenuCategory[] = [];
  const dishes: Dish[] = [];

  dto.dishes?.forEach((category, index) => {
    const categoryId = String(category.id);

    categories.push({
      id: categoryId,
      name: category.name,
      restaurantId,
      displayOrder: index + 1,
    });

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

function mapBackendMenuOptionGroup(dto: BackendMenuOptionGroupDTO) {
  return {
    id: String(dto.id),
    title: dto.name,
    minSelect: dto.minChoices,
    maxSelect: dto.maxChoices,
    required: (dto.minChoices || 0) > 0,
    options: dto.menuOptions.map(opt => ({
      id: String(opt.id),
      name: opt.name,
      price: opt.priceAdjustment || 0,
    })),
  };
}

export function mapStoreUpdatesToApi(updates: Record<string, any>): UpdateStoreRequest {
  const apiUpdates: any = {
    name: updates.name,
    description: updates.description,
    address: updates.address,
    contactPhone: updates.phone,
    schedule: updates.openingHours ? JSON.stringify(updates.openingHours) : undefined,
    avatarUrl: updates.imageUrl,
    coverImageUrl: updates.coverImageUrl,
  };

  if (updates.coords) {
    apiUpdates.latitude = updates.coords.lat;
    apiUpdates.longitude = updates.coords.lng;
  }

  // Filter out undefined values to support partial updates
  return Object.fromEntries(
    Object.entries(apiUpdates).filter(([_, value]) => value !== undefined)
  ) as UpdateStoreRequest;
}
