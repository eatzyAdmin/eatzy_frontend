import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { STORAGE_KEYS } from '@repo/ui';

export interface RestaurantWithMenu {
  restaurant: Restaurant;
  dishes: Dish[];
  menuCategories: MenuCategory[];
  layoutType: number; // 1-5 for different magazine layouts
}

// Helper functions to get data from localStorage
function getRestaurantsFromStorage(): Restaurant[] {
  try {
    const restaurantsStr = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
    return restaurantsStr ? JSON.parse(restaurantsStr) : [];
  } catch (error) {
    console.error('Error loading restaurants:', error);
    return [];
  }
}

function getDishesFromStorage(): Dish[] {
  try {
    const dishesStr = localStorage.getItem(STORAGE_KEYS.DISHES);
    return dishesStr ? JSON.parse(dishesStr) : [];
  } catch (error) {
    console.error('Error loading dishes:', error);
    return [];
  }
}

// Search restaurants by query
function searchRestaurants(query: string): Restaurant[] {
  if (!query || query.trim() === '') {
    return getRestaurantsFromStorage();
  }

  const allRestaurants = getRestaurantsFromStorage();
  const allDishes = getDishesFromStorage();
  const lowerQuery = query.toLowerCase().trim();

  return allRestaurants.filter(restaurant => {
    // Search in restaurant name
    if (restaurant.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in restaurant description
    if (restaurant.description?.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in restaurant categories
    if (restaurant.categories.some(cat => cat.name.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    // Search in dishes
    const restaurantDishes = allDishes.filter(dish => dish.restaurantId === restaurant.id);
    if (restaurantDishes.some(dish =>
      dish.name.toLowerCase().includes(lowerQuery) ||
      dish.description.toLowerCase().includes(lowerQuery)
    )) {
      return true;
    }

    return false;
  });
}

// Get dishes for a restaurant
function getDishesForRestaurant(restaurantId: string): Dish[] {
  const allDishes = getDishesFromStorage();
  return allDishes.filter(dish => dish.restaurantId === restaurantId);
}

// Get menu categories for a restaurant (simplified - just return empty for now)
function getMenuCategoriesForRestaurant(restaurantId: string): MenuCategory[] {
  // For now, return empty array since we don't have menu categories in localStorage yet
  // You can add this later if needed
  return [];
}

export function useSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState<RestaurantWithMenu[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Check if we're in search mode (has search query param)
  const isSearchMode = searchParams.has('q');

  // Perform search
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      return;
    }

    const alreadyInSearchMode = searchParams.has('q');
    setIsSearching(true);

    // If we're already in search mode (compact search bar), push URL first so other instances react immediately
    if (alreadyInSearchMode) {
      const paramsEarly = new URLSearchParams(searchParams.toString());
      paramsEarly.set('q', query);
      router.push(`?${paramsEarly.toString()}`, { scroll: false });
    }

    // Simulate loading for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get search results from localStorage
    const restaurants = searchRestaurants(query);

    // Prepare results with dishes and random layout types
    const resultsWithMenu: RestaurantWithMenu[] = restaurants.map(restaurant => ({
      restaurant,
      dishes: getDishesForRestaurant(restaurant.id),
      menuCategories: getMenuCategoriesForRestaurant(restaurant.id),
      layoutType: Math.floor(Math.random() * 10) + 1,
    }));

    setSearchResults(resultsWithMenu);
    setIsSearching(false);
    setHasSearched(true);
    setSearchQuery(query);

    // If we were NOT in search mode (overlay search on home), only update URL after loading finishes
    if (!alreadyInSearchMode) {
      const paramsLate = new URLSearchParams(searchParams.toString());
      paramsLate.set('q', query);
      router.push(`?${paramsLate.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  // Clear search and return to home
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setIsSearching(false);

    const next = new URLSearchParams(searchParams.toString());
    next.delete('q');
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [router, searchParams, pathname]);

  // Load search results on mount if query param exists
  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (!query) return;
    if (isSearching) return;
    // Trigger when URL param changes OR on reload when we haven't searched yet
    if (query !== searchQuery || !hasSearched) {
      performSearch(query);
    }
  }, [searchParams, searchQuery, performSearch, isSearching, hasSearched]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    hasSearched,
    isSearchMode,
    performSearch,
    clearSearch,
  };
}
