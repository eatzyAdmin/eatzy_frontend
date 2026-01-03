import { useState, useCallback, useEffect, useMemo } from 'react';
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
  // Parse filters from URL
  // Check if we're in search mode (has search query param)
  // Parse filters from URL
  const filters = useMemo(() => ({
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 500000,
    sort: searchParams.get('sort') || 'recommended',
    category: searchParams.get('category') || null,
  }), [searchParams]);

  // Check if we're in search mode (has search query param)
  const isSearchMode = searchParams.has('q');

  // Perform search
  const performSearch = useCallback(async (query: string, newFilters?: Partial<typeof filters>) => {
    if (!query.trim()) {
      return;
    }

    const alreadyInSearchMode = searchParams.has('q');
    setIsSearching(true);

    // Construct URL Params
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', query);

    // Apply new filters or keep existing if not provided (but if specifically passed as object? assume passed = override)
    // Actually, usually performSearch is called with NEW values.
    const filtersToUse = newFilters || filters;

    if (filtersToUse.minPrice !== undefined) params.set('minPrice', filtersToUse.minPrice.toString());
    if (filtersToUse.maxPrice !== undefined) params.set('maxPrice', filtersToUse.maxPrice.toString());
    if (filtersToUse.sort) params.set('sort', filtersToUse.sort);
    if (filtersToUse.category) params.set('category', filtersToUse.category);
    else params.delete('category');


    // If we're already in search mode (compact search bar), push URL first so other instances react immediately
    if (alreadyInSearchMode) {
      router.push(`?${params.toString()}`, { scroll: false });
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
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router, filters]); // Added filters to dep

  // Clear search and return to home
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setIsSearching(false);

    const next = new URLSearchParams(searchParams.toString());
    next.delete('q');
    next.delete('minPrice');
    next.delete('maxPrice');
    next.delete('sort');
    next.delete('category');
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [router, searchParams, pathname]);

  // Load search results on mount if query param exists
  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (!query) return;
    if (isSearching) return;
    // Trigger when URL param changes OR on reload when we haven't searched yet
    // Also trigger if filters changed?
    // We can check if params changed roughly.
    // For simplicity, strict check or just react to searchParams
    const currentParams = new URLSearchParams(searchParams.toString());
    const queryChanged = query !== searchQuery;
    const filtersChanged =
      Number(currentParams.get('minPrice') || 0) !== filters.minPrice ||
      Number(currentParams.get('maxPrice') || 500000) !== filters.maxPrice ||
      (currentParams.get('sort') || 'recommended') !== filters.sort ||
      (currentParams.get('category') || null) !== filters.category;

    if (queryChanged || filtersChanged || !hasSearched) {
      // Pass null to newFilters to let performSearch use current URL/state filters
      // But performSearch uses 'filters' from closure which might be stale?
      // Actually 'filters' is derived from 'searchParams' at top level.
      // So calling performSearch(query, filters) works.
      performSearch(query, filters);
    }
  }, [searchParams, searchQuery, performSearch, isSearching, hasSearched, filters]); // Removed filters from dep loop to avoid strict object eq issues, relying on searchParams

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    hasSearched,
    isSearchMode,
    performSearch,
    clearSearch,
    filters,
  };
}
