import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Restaurant, Dish, MenuCategory, RestaurantMagazine } from '@repo/types';
import { useSearchRestaurants } from './useSearchRestaurants';
import { useDeliveryLocationStore } from '@/store/deliveryLocationStore';
import { DEFAULT_LOCATION_HCMC } from '@repo/hooks';
import { mapMagazineToRestaurantWithMenu } from '../utils/mappers';

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

// ======== Main Hook ========

export function useSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Local state
  // We remove localSearchQuery and hasSearched states because they conflict with the URL during router transitions.

  // Get delivery location from store (selected location or GPS fallback)
  const selectedLocation = useDeliveryLocationStore((state) => state.selectedLocation);
  const isLocationLoading = !selectedLocation;
  const locationCoords = selectedLocation
    ? { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }
    : DEFAULT_LOCATION_HCMC;

  // Parse filters from URL
  const filters = useMemo<SearchFilters>(() => ({
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 500000,
    sort: searchParams.get('sort') || 'recommended',
    category: searchParams.get('category') || null,
  }), [searchParams]);

  // Check if in search mode
  const isSearchMode = searchParams.has('q') || searchParams.has('category');
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
      typeId: filters.category ? Number(filters.category) : undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
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
      mapMagazineToRestaurantWithMenu(magazine, index, currentQuery)
    );
  }, [apiRestaurants]);

  // ===== Actions =====

  const performSearch = useCallback(async (query: string, newFilters?: Partial<SearchFilters>) => {
    const filtersToUse = newFilters ? { ...filters, ...newFilters } : filters;

    const params = new URLSearchParams(searchParams.toString());

    // Always set q to keep us in search mode, even if it's empty
    params.set('q', query.trim());

    if (filtersToUse.minPrice !== undefined) params.set('minPrice', filtersToUse.minPrice.toString());
    if (filtersToUse.maxPrice !== undefined) params.set('maxPrice', filtersToUse.maxPrice.toString());
    if (filtersToUse.sort) params.set('sort', filtersToUse.sort);
    if (filtersToUse.category) params.set('category', filtersToUse.category);
    else params.delete('category');

    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router, filters]);

  const clearSearch = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    ['q', 'minPrice', 'maxPrice', 'sort', 'category'].forEach(key => next.delete(key));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [router, searchParams, pathname]);

  // ===== Return =====

  return {
    // State
    searchQuery: currentQuery,
    setSearchQuery: () => { }, // No-op for backwards compatibility
    searchResults,
    isSearching: isApiLoading,
    hasSearched: isSearchMode,
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
