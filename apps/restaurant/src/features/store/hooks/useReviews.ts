'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi, ReviewDTO } from '@repo/api';
import { useNotification } from '@repo/ui';

// ======== Query Keys ========

export const reviewKeys = {
  all: ['reviews'] as const,
  myRestaurant: () => [...reviewKeys.all, 'my-restaurant'] as const,
  byId: (id: number) => [...reviewKeys.all, 'detail', id] as const,
};

// ======== Types ========

export interface UseMyRestaurantReviewsResult {
  reviews: ReviewDTO[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;
  // Stats
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
  unrepliedCount: number;
}

// ======== Hooks ========

/**
 * Hook to fetch reviews for current owner's restaurant
 */
export function useMyRestaurantReviews(): UseMyRestaurantReviewsResult {
  const query = useQuery({
    queryKey: reviewKeys.myRestaurant(),
    queryFn: async () => {
      const response = await reviewApi.getMyRestaurantReviews();
      if (response.statusCode === 200 && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch reviews');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });

  const reviews = query.data || [];

  // Calculate stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  const ratingDistribution = {
    oneStar: reviews.filter(r => r.rating === 1).length,
    twoStar: reviews.filter(r => r.rating === 2).length,
    threeStar: reviews.filter(r => r.rating === 3).length,
    fourStar: reviews.filter(r => r.rating === 4).length,
    fiveStar: reviews.filter(r => r.rating === 5).length,
  };

  const unrepliedCount = reviews.filter(r => !r.reply).length;

  return {
    reviews,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    totalReviews,
    averageRating,
    ratingDistribution,
    unrepliedCount,
  };
}

/**
 * Hook to reply to a review
 */
export function useReplyToReview() {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const mutation = useMutation({
    mutationFn: async ({ reviewId, reply }: { reviewId: number; reply: string }) => {
      const response = await reviewApi.replyToReview(reviewId, reply) as unknown as { statusCode: number; data?: unknown; message?: string };
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Failed to reply to review');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      showNotification({
        message: 'Phản hồi đã được gửi thành công!',
        type: 'success',
        autoHideDuration: 3000,
      });
    },
    onError: (error: Error) => {
      showNotification({
        message: 'Không thể gửi phản hồi',
        type: 'error',
        format: error.message,
        autoHideDuration: 3000,
      });
    },
  });

  return {
    replyToReview: mutation.mutateAsync,
    isReplying: mutation.isPending,
    error: mutation.error,
  };
}
