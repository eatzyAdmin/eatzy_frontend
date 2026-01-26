'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { restaurantApi } from '@repo/api';
import { Restaurant } from '@repo/types';

export function useRestaurants(search: string) {
  return useInfiniteQuery({
    queryKey: ['restaurants', 'selection', search],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await restaurantApi.getAllRestaurants({
        page: (pageParam as number) + 1,
        size: 10,
        filter: search ? `name~'${search}'` : undefined
      });

      // Adaptation for the specific response structure seen in the previous view_file
      const result = (res as any).data?.result || [];
      const meta = (res as any).data?.meta;

      return {
        items: result as Restaurant[],
        nextPage: meta && meta.page < meta.pages ? meta.page : undefined,
        total: meta?.total || 0,
        pages: meta?.pages || 0
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
