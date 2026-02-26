import { useInfiniteQuery } from "@tanstack/react-query";
import { restaurantApi } from "@repo/api";
import type { RestaurantMagazine, NearbyRestaurantsParams } from "@repo/types";
import { sileo } from "@/components/DynamicIslandToast";
import { useEffect, useMemo } from "react";

// ======== Types ========

export interface UseSearchRestaurantsOptions {
  enabled?: boolean;
  showErrorNotification?: boolean;
}

// ======== Constants ========

const DEFAULT_PAGE_SIZE = 10;
const STALE_TIME = 5 * 60 * 1000; // 5 minutes (matches backend cache TTL)

// Query key factory for better cache management
export const searchRestaurantsKeys = {
  all: ["restaurants", "nearby"] as const,
  search: (params: Omit<NearbyRestaurantsParams, 'page'>) =>
    [...searchRestaurantsKeys.all, params] as const,
};

// ======== Hook ========

/**
 * Hook to search nearby restaurants with infinite scroll pagination
 * Uses React Query's useInfiniteQuery for automatic pagination management
 * 
 * Features:
 * - Auto-fetches when location and search params change
 * - Built-in infinite scroll with fetchNextPage
 * - Shows error notification via useNotification
 * - Returns flat array of RestaurantMagazine with ranking scores
 * 
 * @param params Search parameters (latitude, longitude, search keyword)
 * @param options Hook options (enabled, showErrorNotification)
 * 
 * @example
 * ```tsx
 * const { 
 *   restaurants, 
 *   isLoading, 
 *   isFetchingNextPage,
 *   hasNextPage,
 *   fetchNextPage,
 * } = useSearchRestaurants({
 *   latitude: 10.762622,
 *   longitude: 106.660172,
 *   search: "phở",
 * });
 * 
 * // In InfiniteScrollContainer
 * <InfiniteScrollContainer
 *   isLoadingMore={isFetchingNextPage}
 *   hasMore={hasNextPage}
 *   onLoadMore={fetchNextPage}
 * >
 *   {restaurants.map(...)}
 * </InfiniteScrollContainer>
 * ```
 */
export function useSearchRestaurants(
  params: Omit<NearbyRestaurantsParams, 'page' | 'size'> | null,
  options: UseSearchRestaurantsOptions = {}
) {
  const { enabled = true, showErrorNotification = true } = options;

  // Validate params - check if we have valid location
  const hasValidLocation = params?.latitude !== undefined &&
    params?.longitude !== undefined &&
    !isNaN(params.latitude) &&
    !isNaN(params.longitude);

  // Build base params (without page)
  const baseParams = hasValidLocation && params ? {
    latitude: params.latitude,
    longitude: params.longitude,
    search: params.search?.trim() || undefined,
  } : null;

  // Main infinite query
  const query = useInfiniteQuery({
    queryKey: baseParams ? searchRestaurantsKeys.search(baseParams) : ["restaurants", "nearby", "disabled"],

    queryFn: async ({ pageParam = 0 }) => {
      if (!baseParams) {
        throw new Error("Invalid search parameters");
      }

      const response = await restaurantApi.getNearbyRestaurants({
        ...baseParams,
        page: pageParam,
        size: DEFAULT_PAGE_SIZE,
      });

      // Check for API error
      if (response.statusCode !== 200 && response.statusCode !== undefined) {
        throw new Error(response.message || "Không thể tải danh sách nhà hàng");
      }

      return response.data;
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      // If last page has fewer items than page size, we've reached the end
      if (!lastPage?.result || lastPage.result.length < DEFAULT_PAGE_SIZE) {
        return undefined;
      }
      // Return next page number
      return allPages.length;
    },

    enabled: enabled && hasValidLocation && !!baseParams,
    staleTime: STALE_TIME,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Handle error notification
  useEffect(() => {
    if (query.isError && showErrorNotification) {
      const errorMessage = query.error instanceof Error
        ? query.error.message
        : "Đã có lỗi xảy ra khi tìm kiếm nhà hàng";

      sileo.error({
        title: "Lỗi tìm kiếm",
        description: errorMessage,
        duration: 5000,
      });
    }
  }, [query.isError, query.error, showErrorNotification]);

  // Flatten all pages into a single array
  const restaurants = useMemo(() => {
    if (!query.data?.pages) return [];
    return query.data.pages.flatMap(page => page?.result || []);
  }, [query.data?.pages]);

  // Get total count from first page's meta
  const totalCount = query.data?.pages[0]?.meta?.total || 0;

  return {
    // Data
    restaurants,
    totalCount,

    // Loading states
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    isError: query.isError,
    error: query.error,

    // Pagination
    hasNextPage: query.hasNextPage ?? false,
    fetchNextPage: query.fetchNextPage,

    // Actions
    refetch: query.refetch,
  };
}

// ======== Utility Functions ========

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number | undefined): string {
  if (distanceKm === undefined || distanceKm === null) return "";
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Calculate average rating from star counts
 */
export function calculateAverageRating(restaurant: RestaurantMagazine): number {
  const { oneStarCount = 0, twoStarCount = 0, threeStarCount = 0, fourStarCount = 0, fiveStarCount = 0 } = restaurant;
  const totalReviews = oneStarCount + twoStarCount + threeStarCount + fourStarCount + fiveStarCount;
  if (totalReviews === 0) return 0;
  const totalScore = (oneStarCount * 1) + (twoStarCount * 2) + (threeStarCount * 3) + (fourStarCount * 4) + (fiveStarCount * 5);
  return totalScore / totalReviews;
}

/**
 * Get total review count
 */
export function getTotalReviewCount(restaurant: RestaurantMagazine): number {
  const { oneStarCount = 0, twoStarCount = 0, threeStarCount = 0, fourStarCount = 0, fiveStarCount = 0 } = restaurant;
  return oneStarCount + twoStarCount + threeStarCount + fourStarCount + fiveStarCount;
}
