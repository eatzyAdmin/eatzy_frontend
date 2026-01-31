'use client';

import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@repo/api';
import { RevenueReportItemDTO } from '@repo/types';

export interface UseRevenueReportOptions {
  startDate: Date | null;
  endDate: Date | null;
  enabled?: boolean;
}

/**
 * Hook to fetch revenue report data
 * Uses React Query for caching and automatic refetching
 */
export function useRevenueReport(options: UseRevenueReportOptions) {
  const { startDate, endDate, enabled = true } = options;

  const query = useQuery({
    queryKey: ['revenue-report', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      if (!startDate || !endDate) return [];
      const response = await reportApi.getRevenueReport(
        startDate.toISOString(),
        endDate.toISOString()
      );
      return (response.data || []) as RevenueReportItemDTO[];
    },
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch
  };
}
