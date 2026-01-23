'use client';

import { useQuery } from '@tanstack/react-query';
import { restaurantDetailApi, type RestaurantDetail, type RestaurantMenu } from '@repo/api';
import type { Dish, MenuCategory, Restaurant } from '@repo/types';
import { useMemo } from 'react';

// ======== Query Keys ========

export const restaurantDetailKeys = {
  all: ['restaurant-detail'] as const,
  byId: (id: number) => [...restaurantDetailKeys.all, 'id', id] as const,
  bySlug: (slug: string) => [...restaurantDetailKeys.all, 'slug', slug] as const,
  menu: (id: number) => [...restaurantDetailKeys.all, 'menu', id] as const,
};

// ======== Type Conversion ========

/**
 * Convert RestaurantDetail to legacy Restaurant type for backward compatibility
 */
function toRestaurantType(detail: RestaurantDetail): Restaurant {
  return {
    id: detail.id,
    name: detail.name,
    slug: detail.slug,
    address: detail.address || '',
    description: detail.description,
    rating: detail.rating || 0,
    imageUrl: detail.coverImageUrl || '',
    avatarUrl: detail.avatarUrl,
    coverImageUrl: detail.coverImageUrl,
    categories: [], // Categories are fetched separately via menu API
    status: (detail.status as 'OPEN' | 'CLOSED' | 'LOCKED') || 'OPEN',
    reviewCount: detail.reviewCount || 0,
  };
}

// ======== Hooks ========

export interface UseRestaurantDetailOptions {
  enabled?: boolean;
}

export interface UseRestaurantDetailResult {
  // Original detail type
  detail: RestaurantDetail | null;
  // Backward compatible Restaurant type
  restaurant: Restaurant | null;
  // States
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  // Actions
  refetch: () => void;
}

/**
 * Hook to fetch restaurant detail by ID
 */
export function useRestaurantDetailById(
  id: number | null,
  options: UseRestaurantDetailOptions = {}
): UseRestaurantDetailResult {
  const { enabled = true } = options;
  const isValidId = id !== null && id > 0;

  const query = useQuery({
    queryKey: restaurantDetailKeys.byId(id || 0),
    queryFn: async () => {
      if (!id) throw new Error('Invalid restaurant ID');
      const response = await restaurantDetailApi.getById(id);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tải thông tin quán');
      }
      return response.data;
    },
    enabled: enabled && isValidId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const restaurant = useMemo(() =>
    query.data ? toRestaurantType(query.data) : null,
    [query.data]
  );

  return {
    detail: query.data || null,
    restaurant,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to fetch restaurant detail by slug
 */
export function useRestaurantDetailBySlug(
  slug: string | null,
  options: UseRestaurantDetailOptions = {}
): UseRestaurantDetailResult {
  const { enabled = true } = options;
  const isValidSlug = slug !== null && slug.length > 0;

  const query = useQuery({
    queryKey: restaurantDetailKeys.bySlug(slug || ''),
    queryFn: async () => {
      if (!slug) throw new Error('Invalid restaurant slug');
      const response = await restaurantDetailApi.getBySlug(slug);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tải thông tin quán');
      }
      return response.data;
    },
    enabled: enabled && isValidSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const restaurant = useMemo(() =>
    query.data ? toRestaurantType(query.data) : null,
    [query.data]
  );

  return {
    detail: query.data || null,
    restaurant,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export interface UseRestaurantMenuResult {
  menu: RestaurantMenu | null;
  categories: MenuCategory[];
  dishes: Dish[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch restaurant menu (categories + dishes)
 */
export function useRestaurantMenu(
  restaurantId: number | null,
  options: UseRestaurantDetailOptions = {}
): UseRestaurantMenuResult {
  const { enabled = true } = options;
  const isValidId = restaurantId !== null && restaurantId > 0;

  const query = useQuery({
    queryKey: restaurantDetailKeys.menu(restaurantId || 0),
    queryFn: async () => {
      if (!restaurantId) throw new Error('Invalid restaurant ID');
      const response = await restaurantDetailApi.getMenu(restaurantId);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tải menu');
      }
      return response.data;
    },
    enabled: enabled && isValidId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    menu: query.data || null,
    categories: query.data?.categories || [],
    dishes: query.data?.dishes || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Combined hook to fetch both restaurant detail and menu
 */
export function useRestaurantWithMenu(
  slug: string | null,
  options: UseRestaurantDetailOptions = {}
) {
  const detailResult = useRestaurantDetailBySlug(slug, options);

  // Get restaurant ID from detail for menu fetch
  const restaurantId = detailResult.detail?.id ? Number(detailResult.detail.id) : null;

  const menuResult = useRestaurantMenu(restaurantId, {
    enabled: options.enabled !== false && !!restaurantId,
  });

  return {
    // Restaurant detail
    detail: detailResult.detail,
    restaurant: detailResult.restaurant,

    // Menu
    categories: menuResult.categories,
    dishes: menuResult.dishes,

    // Combined states
    isLoading: detailResult.isLoading || menuResult.isLoading,
    isError: detailResult.isError || menuResult.isError,
    error: detailResult.error || menuResult.error,

    // Actions
    refetchDetail: detailResult.refetch,
    refetchMenu: menuResult.refetch,
    refetchAll: () => {
      detailResult.refetch();
      menuResult.refetch();
    },
  };
}
