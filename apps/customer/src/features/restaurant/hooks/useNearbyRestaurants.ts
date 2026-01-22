import { useQuery } from '@tanstack/react-query';
import { restaurantApi } from '@repo/api';
import type { RestaurantMagazine, NearbyRestaurantsParams } from '@repo/types';
import { useMemo } from 'react';

// ======== Types ========

export interface UseNearbyRestaurantsResult {
  restaurants: RestaurantMagazine[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  // Pagination info
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// ======== Query Keys ========

export const nearbyRestaurantsKeys = {
  all: ['nearby-restaurants'] as const,
  list: (params: NearbyRestaurantsParams) => [...nearbyRestaurantsKeys.all, params] as const,
};

// ======== Hook ========

/**
 * Hook to fetch nearby restaurants based on user location
 * Uses personalized ranking from backend (type preference, loyalty, distance, quality)
 * 
 * @param params Latitude, longitude, and optional search/pagination params
 * @param options Hook options
 * 
 * @example
 * ```tsx
 * const { restaurants, isLoading } = useNearbyRestaurants({
 *   latitude: 10.7769,
 *   longitude: 106.7009,
 *   size: 10,
 * });
 * ```
 */
export function useNearbyRestaurants(
  params: NearbyRestaurantsParams | null,
  options: { enabled?: boolean } = {}
): UseNearbyRestaurantsResult {
  const { enabled = true } = options;

  const isValidParams = params !== null &&
    params.latitude !== undefined &&
    params.longitude !== undefined;

  const query = useQuery({
    queryKey: isValidParams ? nearbyRestaurantsKeys.list(params) : nearbyRestaurantsKeys.all,
    queryFn: async () => {
      if (!params) throw new Error('Invalid params');

      const response = await restaurantApi.getNearbyRestaurants(params);

      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tải danh sách quán ăn gần đây');
      }

      return response.data;
    },
    enabled: enabled && isValidParams,
    staleTime: 2 * 60 * 1000, // 2 minutes - location-based data can change
    refetchOnWindowFocus: false,
  });

  const restaurants = useMemo(() => {
    return query.data?.result || [];
  }, [query.data]);

  return {
    restaurants,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    // Pagination
    totalItems: query.data?.meta?.total || 0,
    totalPages: query.data?.meta?.pages || 0,
    currentPage: query.data?.meta?.page || 1,
  };
}

// ======== Helper: Get user location ========

export function useUserLocation() {
  const query = useQuery({
    queryKey: ['user-location'],
    queryFn: () => {
      return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            // Default to Ho Chi Minh City center if location denied
            console.warn('Geolocation error, using default location:', error.message);
            resolve({
              latitude: 10.7769,
              longitude: 106.7009,
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5 * 60 * 1000, // Cache for 5 minutes
          }
        );
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  return {
    location: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
