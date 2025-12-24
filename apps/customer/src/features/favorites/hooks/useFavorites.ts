"use client";

import { useState, useCallback } from 'react';
import { getFavoriteIds } from '@/features/favorites/data/mockFavorites';

// Custom hook to manage favorites state
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getFavoriteIds());

  const isFavorite = useCallback((restaurantId: string): boolean => {
    return favoriteIds.includes(restaurantId);
  }, [favoriteIds]);

  const toggleFavorite = useCallback((restaurantId: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(restaurantId)) {
        // Remove from favorites
        return prev.filter((id) => id !== restaurantId);
      } else {
        // Add to favorites
        return [...prev, restaurantId];
      }
    });
  }, []);

  const addFavorite = useCallback((restaurantId: string) => {
    setFavoriteIds((prev) => {
      if (!prev.includes(restaurantId)) {
        return [...prev, restaurantId];
      }
      return prev;
    });
  }, []);

  const removeFavorite = useCallback((restaurantId: string) => {
    setFavoriteIds((prev) => prev.filter((id) => id !== restaurantId));
  }, []);

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
  };
}
