import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Restaurant, Dish, MenuCategory, RestaurantMagazine } from '@repo/types';
import {
  searchRestaurants as mockSearchRestaurants,
  getDishesForRestaurant,
  getMenuCategoriesForRestaurant,
} from '../data/mockSearchData';
import { useSearchRestaurants } from './useSearchRestaurants';
import { useUserLocation, DEFAULT_LOCATION_HCMC } from '@repo/hooks';

// ======== Types ========

export interface RestaurantWithMenu {
  restaurant: Restaurant;
  dishes: Dish[];
  menuCategories: MenuCategory[];
  layoutType: number; // 1-10 for different magazine layouts
  distance?: number;
  finalScore?: number;
}

export interface SearchFilters {
  minPrice: number;
  maxPrice: number;
  sort: string;
  category: string | null;
}

// ======== Constants ========

const USE_MOCK_DATA = false; // Set to true to use mock data instead of API

// ======== Mapper Function ========

function mapMagazineToRestaurantWithMenu(
  magazine: RestaurantMagazine,
  layoutIndex: number
): RestaurantWithMenu {
  const menuCategories: MenuCategory[] = (magazine.category || []).map((cat, idx) => ({
    id: String(cat.id),
    name: cat.name,
    restaurantId: String(magazine.id),
    displayOrder: idx + 1,
  }));

  const dishes: Dish[] = (magazine.category || []).flatMap(cat =>
    (cat.dishes || []).map(dish => ({
      id: String(dish.id),
      name: dish.name,
      description: dish.description || '',
      price: dish.price,
      imageUrl: dish.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      restaurantId: String(magazine.id),
      menuCategoryId: String(cat.id),
      availableQuantity: 100,
      isAvailable: true,
      rating: magazine.averageRating || 4.5,
    }))
  );

  const restaurant: Restaurant = {
    id: String(magazine.id),
    name: magazine.name,
    slug: magazine.slug,
    categories: [],
    status: 'OPEN',
    rating: magazine.averageRating || 0,
    address: magazine.address,
    description: magazine.description,
    imageUrl: dishes[0]?.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    reviewCount: (magazine.oneStarCount || 0) + (magazine.twoStarCount || 0) +
      (magazine.threeStarCount || 0) + (magazine.fourStarCount || 0) +
      (magazine.fiveStarCount || 0),
  };

  return {
    restaurant,
    dishes,
    menuCategories,
    layoutType: (layoutIndex % 10) + 1,
    distance: magazine.distance,
    finalScore: magazine.finalScore,
  };
}

// ======== Main Hook ========

export function useSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Local state
  const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('q') || '');
  const [mockResults, setMockResults] = useState<RestaurantWithMenu[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMockSearching, setIsMockSearching] = useState(false);

  // Get user location
  const { location: userLocation, isLoading: isLocationLoading } = useUserLocation();
  const locationCoords = userLocation || DEFAULT_LOCATION_HCMC;

  // Parse filters from URL
  const filters = useMemo<SearchFilters>(() => ({
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 500000,
    sort: searchParams.get('sort') || 'recommended',
    category: searchParams.get('category') || null,
  }), [searchParams]);

  // Check if in search mode
  const isSearchMode = searchParams.has('q');
  const currentQuery = searchParams.get('q') || '';

  // ===== useInfiniteQuery via useSearchRestaurants =====
  const {
    restaurants: apiRestaurants,
    totalCount,
    isLoading: isApiLoading,
    isFetchingNextPage,
    isError: isApiError,
    hasNextPage,
    fetchNextPage,
    refetch: refetchApi,
  } = useSearchRestaurants(
    !USE_MOCK_DATA && isSearchMode && locationCoords ? {
      latitude: locationCoords.latitude,
      longitude: locationCoords.longitude,
      search: currentQuery,
    } : null,
    {
      enabled: !USE_MOCK_DATA && isSearchMode && !isLocationLoading,
      showErrorNotification: true,
    }
  );

  // Convert API results to RestaurantWithMenu format
  const apiSearchResults = useMemo<RestaurantWithMenu[]>(() => {
    if (USE_MOCK_DATA || !apiRestaurants.length) return [];
    return apiRestaurants.map((magazine, index) =>
      mapMagazineToRestaurantWithMenu(magazine, index)
    );
  }, [apiRestaurants]);

  // Combined search results
  const searchResults = USE_MOCK_DATA ? mockResults : apiSearchResults;
  const isSearching = USE_MOCK_DATA ? isMockSearching : isApiLoading;

  // ===== Actions =====

  const performSearch = useCallback(async (query: string, newFilters?: Partial<SearchFilters>) => {
    if (!query.trim()) return;

    const alreadyInSearchMode = searchParams.has('q');
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', query);

    const filtersToUse = newFilters ? { ...filters, ...newFilters } : filters;
    if (filtersToUse.minPrice !== undefined) params.set('minPrice', filtersToUse.minPrice.toString());
    if (filtersToUse.maxPrice !== undefined) params.set('maxPrice', filtersToUse.maxPrice.toString());
    if (filtersToUse.sort) params.set('sort', filtersToUse.sort);
    if (filtersToUse.category) params.set('category', filtersToUse.category);
    else params.delete('category');

    if (alreadyInSearchMode) {
      router.push(`?${params.toString()}`, { scroll: false });
    }

    // Mock data simulation
    if (USE_MOCK_DATA) {
      setIsMockSearching(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const restaurants = mockSearchRestaurants(query);
      const resultsWithMenu: RestaurantWithMenu[] = restaurants.map((restaurant, index) => ({
        restaurant,
        dishes: getDishesForRestaurant(restaurant.id),
        menuCategories: getMenuCategoriesForRestaurant(restaurant.id),
        layoutType: (index % 10) + 1,
      }));
      setMockResults(resultsWithMenu);
      setIsMockSearching(false);
    }

    setHasSearched(true);
    setLocalSearchQuery(query);

    if (!alreadyInSearchMode) {
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router, filters]);

  const clearSearch = useCallback(() => {
    setLocalSearchQuery('');
    setMockResults([]);
    setHasSearched(false);
    setIsMockSearching(false);

    const next = new URLSearchParams(searchParams.toString());
    ['q', 'minPrice', 'maxPrice', 'sort', 'category'].forEach(key => next.delete(key));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [router, searchParams, pathname]);

  // Sync URL query changes
  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (!query || isSearching) return;

    if (query !== localSearchQuery) {
      setLocalSearchQuery(query);
      setHasSearched(true);
      if (USE_MOCK_DATA) {
        performSearch(query, filters);
      }
    }
  }, [searchParams, localSearchQuery, performSearch, isSearching, filters]);

  // ===== Return =====

  return {
    // State
    searchQuery: localSearchQuery,
    setSearchQuery: setLocalSearchQuery,
    searchResults,
    isSearching,
    hasSearched,
    isSearchMode,
    filters,

    // Pagination (from useInfiniteQuery)
    isLoadingMore: isFetchingNextPage,
    hasMore: hasNextPage ?? false,
    totalResults: totalCount || searchResults.length,

    // API specific
    isApiError,

    // Actions
    performSearch,
    clearSearch,
    loadMore: fetchNextPage,
    refetch: USE_MOCK_DATA ? () => performSearch(localSearchQuery) : refetchApi,

    // Location
    userLocation: locationCoords,
    isLocationLoading,
  };
}
