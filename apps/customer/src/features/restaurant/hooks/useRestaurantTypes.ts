import { useQuery } from '@tanstack/react-query';
import { restaurantTypeApi } from '@repo/api';
import type { RestaurantCategory } from '@repo/types';

export function useRestaurantTypes() {
  return useQuery({
    queryKey: ['restaurant-types', 'all'],
    queryFn: async () => {
      const res = await restaurantTypeApi.getAllRestaurantTypes();
      if (res.statusCode === 200 && res.data) {
        return res.data.result as RestaurantCategory[];
      }
      return [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
