import { useEffect, useMemo, useState } from 'react';
import { fetchRestaurants, fetchCategories } from '@/services/restaurants';
import type { Restaurant, RestaurantCategory, RestaurantStatus } from '@repo/types';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<RestaurantCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([fetchRestaurants(), fetchCategories()])
      .then(([rs, cats]) => { if (!mounted) return; setRestaurants(rs); setCategories(cats); })
      .catch((e) => { if (!mounted) return; setError(String(e?.message || e)); })
      .finally(() => { if (!mounted) return; setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const activeRestaurants = useMemo(() => restaurants.filter(r => r.status === 'ACTIVE' as RestaurantStatus), [restaurants]);

  return { restaurants, categories, activeRestaurants, loading, error };
};

export default useRestaurants;