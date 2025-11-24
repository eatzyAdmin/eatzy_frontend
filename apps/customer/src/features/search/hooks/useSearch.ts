import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import {
  searchRestaurants,
  getDishesForRestaurant,
  getMenuCategoriesForRestaurant,
} from '../data/mockSearchData';

export interface RestaurantWithMenu {
  restaurant: Restaurant;
  dishes: Dish[];
  menuCategories: MenuCategory[];
  layoutType: number; // 1-5 for different magazine layouts
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

    // Get search results
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
