'use client';

import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@repo/api';
import { ReviewSummaryDTO } from '@repo/types';

export interface UseReviewsReportOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch reviews summary report data
 * Uses React Query for caching and automatic refetching
 */
export function useReviewsReport(options: UseReviewsReportOptions = {}) {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: ['reviews-report'],
    queryFn: async () => {
      const response = await reportApi.getReviewSummary();
      return response.data as ReviewSummaryDTO;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch
  };
}
