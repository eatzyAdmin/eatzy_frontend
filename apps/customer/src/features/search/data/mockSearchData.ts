import type { Restaurant, Dish, Voucher } from '@repo/types';
import { MOCK_RESTAURANTS, toTypeRestaurant, MOCK_DISHES, MOCK_VOUCHERS } from '@repo/mock';

// Mock restaurants for search adapted from unified @repo/mock
export const mockSearchRestaurants: Restaurant[] = MOCK_RESTAURANTS.map(toTypeRestaurant);

export function searchRestaurants(query: string): Restaurant[] {
  if (!query.trim()) {
    return mockSearchRestaurants;
  }
  const lowerQuery = query.toLowerCase();
  return mockSearchRestaurants.filter(restaurant => {
    return (
      restaurant.name.toLowerCase().includes(lowerQuery) ||
      (restaurant.address || '').toLowerCase().includes(lowerQuery) ||
      (restaurant.description || '').toLowerCase().includes(lowerQuery)
    );
  });
}

export function getRestaurantById(id: number | string): Restaurant | undefined {
  return mockSearchRestaurants.find(r => String(r.id) === String(id));
}

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return mockSearchRestaurants.find(r => r.slug === slug);
}

export function getVouchersForRestaurant(_restaurantId?: number | string): Voucher[] {
  return MOCK_VOUCHERS;
}
