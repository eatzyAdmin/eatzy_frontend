'use client';

import { useQuery } from '@tanstack/react-query';
import { voucherApi } from '@repo/api';
import type { Voucher } from '@repo/types';

export const restaurantVoucherKeys = {
  all: ['restaurant-vouchers'] as const,
  byRestaurantId: (id: number) => [...restaurantVoucherKeys.all, id] as const,
};

export function useRestaurantVouchers(restaurantId: number | null) {
  return useQuery({
    queryKey: restaurantVoucherKeys.byRestaurantId(restaurantId || 0),
    queryFn: async () => {
      if (!restaurantId) return [];
      const response = await voucherApi.getVouchersByRestaurantId(restaurantId);
      if (response.statusCode === 200 && response.data) {
        return response.data;
      }
      return [];
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
