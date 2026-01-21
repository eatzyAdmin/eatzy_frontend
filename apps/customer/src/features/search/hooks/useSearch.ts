import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Restaurant, Dish, MenuCategory, RestaurantMagazine } from '@repo/types';
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

  let dishes: Dish[] = (magazine.category || []).flatMap(cat =>
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

  // Fallback: If no dishes, create a placeholder dish to prevent UI errors
  if (dishes.length === 0) {
    dishes = [{
      id: `placeholder-${magazine.id}`,
      name: magazine.name,
      description: magazine.description || 'Khám phá các món ăn tại đây',
      price: 0,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      restaurantId: String(magazine.id),
      menuCategoryId: 'default',
      availableQuantity: 0,
      isAvailable: true,
      rating: magazine.averageRating || 4.5,
    }];
  }

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
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

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
    isSearchMode && locationCoords ? {
      latitude: locationCoords.latitude,
      longitude: locationCoords.longitude,
      search: currentQuery,
    } : null,
    {
      enabled: isSearchMode && !isLocationLoading,
      showErrorNotification: true,
    }
  );

  // Convert API results to RestaurantWithMenu format
  const searchResults = useMemo<RestaurantWithMenu[]>(() => {
    if (!apiRestaurants.length) return [];
    return apiRestaurants.map((magazine, index) =>
      mapMagazineToRestaurantWithMenu(magazine, index)
    );
  }, [apiRestaurants]);

  // ===== Actions =====

  const performSearch = useCallback(async (query: string, newFilters?: Partial<SearchFilters>) => {
    if (!query.trim()) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('q', query);

    const filtersToUse = newFilters ? { ...filters, ...newFilters } : filters;
    if (filtersToUse.minPrice !== undefined) params.set('minPrice', filtersToUse.minPrice.toString());
    if (filtersToUse.maxPrice !== undefined) params.set('maxPrice', filtersToUse.maxPrice.toString());
    if (filtersToUse.sort) params.set('sort', filtersToUse.sort);
    if (filtersToUse.category) params.set('category', filtersToUse.category);
    else params.delete('category');

    setHasSearched(true);
    setLocalSearchQuery(query);

    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router, filters]);

  const clearSearch = useCallback(() => {
    setLocalSearchQuery('');
    setHasSearched(false);

    const next = new URLSearchParams(searchParams.toString());
    ['q', 'minPrice', 'maxPrice', 'sort', 'category'].forEach(key => next.delete(key));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [router, searchParams, pathname]);

  // Sync URL query changes
  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (!query || isApiLoading) return;

    if (query !== localSearchQuery) {
      setLocalSearchQuery(query);
      setHasSearched(true);
    }
  }, [searchParams, localSearchQuery, isApiLoading]);

  // ===== Return =====

  return {
    // State
    searchQuery: localSearchQuery,
    setSearchQuery: setLocalSearchQuery,
    searchResults,
    isSearching: isApiLoading,
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
    refetch: refetchApi,

    // Location
    userLocation: locationCoords,
    isLocationLoading,
  };
}
