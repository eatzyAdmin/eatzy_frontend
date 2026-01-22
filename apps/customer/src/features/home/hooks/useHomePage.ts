import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { restaurantTypeApi, restaurantApi } from '@repo/api';
import type { RestaurantCategory, RestaurantMagazine, Restaurant } from '@repo/types';
import { useUserLocation, DEFAULT_LOCATION_HCMC } from '@repo/hooks';
import { mapMagazineToRestaurantWithMenu } from '@/features/search/utils/mappers';

// Helper to get category background (still static or needs DB field)
const getCategoryBackgroundImage = (slug: string) => {
  // Mapping from static data or fallback
  const backgrounds: Record<string, string> = {
    'pho': 'https://images.unsplash.com/photo-1582878826629-297527132b04?w=1600&q=80',
    'sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1600&q=80',
    'barbecue': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80',
    'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&q=80',
    'pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1600&q=80',
    'breakfast': 'https://images.unsplash.com/photo-1533089862017-5614ec45e25a?w=1600&q=80',
  };
  return backgrounds[slug] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80';
};

const PAGE_SIZE = 10;

export function useHomePage() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeRestaurantIndex, setActiveRestaurantIndex] = useState(0);
  const [filter, setFilter] = useState('All recipes');

  // 1. Get Categories
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['restaurant-types', 'all'],
    queryFn: async () => {
      const res = await restaurantTypeApi.getAllRestaurantTypes();
      if (res.statusCode === 200 && res.data) {
        return res.data.result;
      }
      return [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  const categories = categoriesData || [];
  const activeCategory = categories[activeCategoryIndex];

  // 2. Get Location
  const { location } = useUserLocation();
  const locationCoords = location || DEFAULT_LOCATION_HCMC;

  // 3. Get Restaurants for Active Category with Infinite Scroll
  const {
    data: restaurantsPages,
    isLoading: isRestaurantsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['restaurants', 'by-category', activeCategory?.id, locationCoords.latitude, locationCoords.longitude],
    queryFn: async ({ pageParam = 1 }) => {
      if (!activeCategory) return { result: [], meta: { page: 1, pages: 1, total: 0 } };

      const res = await restaurantApi.getNearbyRestaurants({
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude,
        typeId: Number(activeCategory.id), // Filter by category
        page: pageParam,
        size: PAGE_SIZE,
      });

      if (res.statusCode === 200 && res.data) {
        return {
          result: res.data.result || [],
          meta: res.data.meta || { page: pageParam, pages: 1, total: 0 },
        };
      }
      return { result: [], meta: { page: pageParam, pages: 1, total: 0 } };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.pages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!activeCategory,
  });

  // Flatten all pages into single array
  const allRestaurantMagazines = useMemo(() => {
    if (!restaurantsPages) return [];
    return restaurantsPages.pages.flatMap(page => page.result);
  }, [restaurantsPages]);

  // Map to Restaurant type for slider
  const mappedRestaurants = useMemo(() => {
    return allRestaurantMagazines.map((magazine, index) =>
      mapMagazineToRestaurantWithMenu(magazine as RestaurantMagazine, index).restaurant
    );
  }, [allRestaurantMagazines]);

  const restaurantsInCategory = mappedRestaurants;
  const activeRestaurant = restaurantsInCategory[activeRestaurantIndex];

  const backgroundImage = getCategoryBackgroundImage(activeCategory?.slug || '');

  // Reset restaurant index when category changes
  useEffect(() => {
    setActiveRestaurantIndex(0);
  }, [activeCategoryIndex]);

  const handleCategoryChange = useCallback((index: number) => {
    if (index >= 0 && index < categories.length) {
      setActiveCategoryIndex(index);
    }
  }, [categories.length]);

  // Load more restaurants when approaching end of list
  const handleRestaurantChange = useCallback((index: number) => {
    if (index >= 0 && index < restaurantsInCategory.length) {
      setActiveRestaurantIndex(index);

      // Trigger load more when reaching near the end (within last 3 items)
      if (index >= restaurantsInCategory.length - 3 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [restaurantsInCategory.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
  }, []);

  // Navigation methods
  const goToNextCategory = useCallback(() => {
    if (activeCategoryIndex < categories.length - 1) {
      handleCategoryChange(activeCategoryIndex + 1);
    }
  }, [activeCategoryIndex, categories.length, handleCategoryChange]);

  const goToPreviousCategory = useCallback(() => {
    if (activeCategoryIndex > 0) {
      handleCategoryChange(activeCategoryIndex - 1);
    }
  }, [activeCategoryIndex, handleCategoryChange]);

  // Next restaurant with load more and loop back only when NO more data
  const goToNextRestaurant = useCallback(() => {
    if (activeRestaurantIndex < restaurantsInCategory.length - 1) {
      handleRestaurantChange(activeRestaurantIndex + 1);
    } else if (hasNextPage && !isFetchingNextPage) {
      // At end but more pages available - load next page
      fetchNextPage();
    } else if (!hasNextPage) {
      // At end and no more pages - loop back to start
      handleRestaurantChange(0);
    }
  }, [activeRestaurantIndex, restaurantsInCategory.length, hasNextPage, isFetchingNextPage, fetchNextPage, handleRestaurantChange]);

  const goToPreviousRestaurant = useCallback(() => {
    if (activeRestaurantIndex > 0) {
      handleRestaurantChange(activeRestaurantIndex - 1);
    } else {
      // At start - loop to end
      handleRestaurantChange(restaurantsInCategory.length - 1);
    }
  }, [activeRestaurantIndex, handleRestaurantChange, restaurantsInCategory.length]);

  return {
    // State
    categories,
    activeCategoryIndex,
    activeCategory,
    restaurantsInCategory,
    activeRestaurantIndex,
    activeRestaurant,
    backgroundImage,
    filter,

    // Handlers
    handleCategoryChange,
    handleRestaurantChange,
    handleFilterChange,

    // Navigation
    goToNextCategory,
    goToPreviousCategory,
    goToNextRestaurant,
    goToPreviousRestaurant,

    // Status
    isCategoriesLoading,
    isRestaurantsLoading,
    isFetchingNextPage,
    hasNextPage: hasNextPage || false,
    canGoToNextCategory: activeCategoryIndex < categories.length - 1,
    canGoToPreviousCategory: activeCategoryIndex > 0,
    canGoToNextRestaurant: activeRestaurantIndex < restaurantsInCategory.length - 1 || hasNextPage,
    canGoToPreviousRestaurant: activeRestaurantIndex > 0,
  };
}
