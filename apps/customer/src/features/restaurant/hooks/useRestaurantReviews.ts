'use client';

import { useQuery } from '@tanstack/react-query';
import { reviewApi, type ReviewDTO } from '@repo/api';
import type { ReviewDisplayItem } from '@repo/types';
import { useMemo } from 'react';

// ======== Query Keys ========

export const restaurantReviewKeys = {
  all: ['restaurant-reviews'] as const,
  byTarget: (targetName: string) => [...restaurantReviewKeys.all, 'target', targetName] as const,
};

// ======== Type Conversion ========

/**
 * Convert ReviewDTO (backend) to ReviewDisplayItem (frontend)
 */
function toReviewDisplayItem(dto: ReviewDTO): ReviewDisplayItem {
  return {
    id: dto.id.toString(),
    authorName: dto.customer.name,
    // We can generate an avatar if it's missing, or handle it in the component
    authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dto.customer.name}`,
    rating: dto.rating,
    date: new Date(dto.createdAt).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    content: dto.comment,
    reply: dto.reply,
  };
}

// ======== Hooks ========

export interface UseRestaurantReviewsOptions {
  enabled?: boolean;
}

export interface UseRestaurantReviewsResult {
  reviews: ReviewDisplayItem[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch reviews for a restaurant with backend filtering and sorting
 */
export function useRestaurantReviews(
  restaurantName: string | null,
  params: {
    search?: string;
    rating?: number | null;
    sort?: string;
  } = {},
  options: UseRestaurantReviewsOptions = {}
): UseRestaurantReviewsResult {
  const { enabled = true } = options;
  const { search, rating, sort } = params;
  const isValidName = restaurantName !== null && restaurantName.length > 0;

  // Map UI sort values to Spring Data sort format
  const getSortString = (uiSort?: string) => {
    switch (uiSort) {
      case 'recent': return 'createdAt,desc';
      case 'highest': return 'rating,desc';
      case 'lowest': return 'rating,asc';
      default: return 'createdAt,desc'; // Fallback to recent
    }
  };

  const query = useQuery({
    queryKey: [...restaurantReviewKeys.byTarget(restaurantName || ''), search, rating, sort],
    queryFn: async () => {
      if (!restaurantName) throw new Error('Cần tên nhà hàng để tải đánh giá');

      // Build spring-filter string
      let filter = `reviewTarget:'restaurant' and targetName:'${restaurantName.replace(/'/g, "\\'")}'`;

      if (rating) {
        filter += ` and rating:${rating}`;
      }

      if (search && search.trim()) {
        const s = search.trim().replace(/'/g, "\\'");
        filter += ` and (comment ~ '*${s}*' or customer.name ~ '*${s}*')`;
      }

      const response = await reviewApi.getAllReviews({
        filter,
        sort: getSortString(sort),
        size: 100, // Load a good amount, can be extended for true pagination later
      });

      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Không thể tải đánh giá');
      }

      if (!response.data || !response.data.result) {
        return [];
      }

      return response.data.result;
    },
    enabled: enabled && isValidName,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // Keep data while fetching for smoother UX
  });

  const reviews = useMemo(() =>
    query.data ? query.data.map(toReviewDisplayItem) : [],
    [query.data]
  );

  return {
    reviews,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
