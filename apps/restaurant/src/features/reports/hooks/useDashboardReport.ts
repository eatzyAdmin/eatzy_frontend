'use client';

import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@repo/api';
import { FullReportDTO } from '@repo/types';

export interface UseDashboardReportOptions {
  startDate: Date | null;
  endDate: Date | null;
  enabled?: boolean;
}

/**
 * Hook to fetch full dashboard report data
 * Uses React Query for caching and automatic refetching
 */
export function useDashboardReport(options: UseDashboardReportOptions) {
  const { startDate, endDate, enabled = true } = options;

  const query = useQuery({
    queryKey: ['dashboard-report', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      if (!startDate || !endDate) return null;
      const response = await reportApi.getFullReport(
        startDate.toISOString(),
        endDate.toISOString()
      );
      return response.data as FullReportDTO;
    },
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch
  };
}
