import type { Restaurant, RestaurantCategory } from '@repo/types';

export async function fetchRestaurants(): Promise<Restaurant[]> {
  return Promise.resolve([]);
}

export async function fetchCategories(): Promise<RestaurantCategory[]> {
  return Promise.resolve([]);
}