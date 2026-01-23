"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteApi } from "@repo/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNotification } from "@repo/ui";
import { useCallback } from "react";

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const customerId = user?.id ? Number(user.id) : null;

  // Fetch all favorites
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const response = await favoriteApi.getFavoritesByCustomerId(customerId);
      return response.data || [];
    },
    enabled: !!customerId,
  });

  const isFavorite = useCallback(
    (restaurantId: number) => {
      return favorites.some((f) => f.restaurant.id === restaurantId);
    },
    [favorites]
  );

  const getFavoriteId = useCallback(
    (restaurantId: number) => {
      return favorites.find((f) => f.restaurant.id === restaurantId)?.id;
    },
    [favorites]
  );

  // Mutation to add favorite
  const addMutation = useMutation({
    mutationFn: (restaurantId: number) =>
      favoriteApi.addFavorite({
        customer: { id: customerId! },
        restaurant: { id: restaurantId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", customerId] });
      showNotification({
        message: "Đã thêm vào yêu thích",
        type: "success",
      });
    },
    onError: () => {
      showNotification({
        message: "Không thể thêm vào yêu thích",
        type: "error",
      });
    },
  });

  // Mutation to remove favorite
  const removeMutation = useMutation({
    mutationFn: (favoriteId: number) => favoriteApi.removeFavorite(favoriteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", customerId] });
      showNotification({
        message: "Đã xóa khỏi yêu thích",
        type: "success",
      });
    },
    onError: () => {
      showNotification({
        message: "Không thể xóa khỏi yêu thích",
        type: "error",
      });
    },
  });

  const toggleFavorite = useCallback(
    async (restaurantId: number) => {
      if (!customerId) {
        showNotification({
          message: "Vui lòng đăng nhập để thực hiện chức năng này",
          type: "error",
        });
        return;
      }

      const existingFavoriteId = getFavoriteId(restaurantId);

      if (existingFavoriteId) {
        await removeMutation.mutateAsync(existingFavoriteId);
      } else {
        await addMutation.mutateAsync(restaurantId);
      }
    },
    [customerId, getFavoriteId, removeMutation, addMutation, showNotification]
  );

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    isMutating: addMutation.isPending || removeMutation.isPending,
  };
}

