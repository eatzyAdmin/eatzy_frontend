// import type { Restaurant } from '@repo/types';

// Mock favorite restaurants - in real app this would come from API/database
export const mockFavoriteRestaurantIds = [
  'rest-1',  // Phở Hà Nội
  'rest-2',  // Sushi Sakura
  'rest-6',  // Korean BBQ House
  'rest-9',  // Dim Sum Palace
  'rest-10', // Mediterranean Delight
];

// Helper to check if a restaurant is favorited
export const isFavorite = (restaurantId: string): boolean => {
  return mockFavoriteRestaurantIds.includes(restaurantId);
};

// Helper to get all favorite restaurant IDs
export const getFavoriteIds = (): string[] => {
  return mockFavoriteRestaurantIds;
};

// In a real app, these would be API calls:
// export const addFavorite = async (restaurantId: string) => { ... }
// export const removeFavorite = async (restaurantId: string) => { ... }
