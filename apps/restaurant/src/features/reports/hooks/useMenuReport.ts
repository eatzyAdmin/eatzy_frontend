'use client';

import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@repo/api';
import { MenuSummaryDTO } from '@repo/types';

export interface UseMenuReportOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch menu analytics report data
 * Uses React Query for caching and automatic refetching
 */
export function useMenuReport(options: UseMenuReportOptions = {}) {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: ['menu-report'],
    queryFn: async () => {
      const response = await reportApi.getMenuAnalytics();
      return response.data as MenuSummaryDTO;
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
