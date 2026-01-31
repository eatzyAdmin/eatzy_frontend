'use client';

import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@repo/api';
import { OrderReportItemDTO } from '@repo/types';

export interface UseOrdersReportOptions {
  startDate: Date | null;
  endDate: Date | null;
  enabled?: boolean;
}

/**
 * Hook to fetch orders report data
 * Uses React Query for caching and automatic refetching
 */
export function useOrdersReport(options: UseOrdersReportOptions) {
  const { startDate, endDate, enabled = true } = options;

  const query = useQuery({
    queryKey: ['orders-report', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      if (!startDate || !endDate) return [];
      const response = await reportApi.getOrdersReport(
        startDate.toISOString(),
        endDate.toISOString()
      );
      return (response.data || []) as OrderReportItemDTO[];
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
