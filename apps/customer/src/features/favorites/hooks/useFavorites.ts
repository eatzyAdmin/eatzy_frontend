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
  const isLoggedIn = !!user?.id;

  // Fetch all favorites for current user (uses backend auth context)
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", "my"],
    queryFn: async () => {
      const response = await favoriteApi.getMyFavorites();
      return response.data || [];
    },
    enabled: isLoggedIn,
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
        restaurant: { id: restaurantId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", "my"] });
      showNotification({
        message: "Đã thêm vào yêu thích",
        type: "success",
        format: "Dữ liệu đã cập nhật thành công."
      });
    },
    onError: (error) => {
      showNotification({
        message: "Không thể thêm vào yêu thích",
        type: "error",
        format: `${error.message}`
      });
    },
  });

  // Mutation to remove favorite
  const removeMutation = useMutation({
    mutationFn: (favoriteId: number) => favoriteApi.removeFavorite(favoriteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", "my"] });
      showNotification({
        message: "Đã xóa khỏi yêu thích",
        type: "success",
        format: "Dữ liệu đã cập nhật thành công."
      });
    },
    onError: (error) => {
      showNotification({
        message: "Không thể xóa khỏi yêu thích",
        type: "error",
        format: `${error.message}`
      });
    },
  });

  const toggleFavorite = useCallback(
    async (restaurantId: number) => {
      if (!isLoggedIn) {
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
    [isLoggedIn, getFavoriteId, removeMutation, addMutation, showNotification]
  );

  const isRestaurantMutating = useCallback(
    (restaurantId: number) => {
      const favoriteId = getFavoriteId(restaurantId);
      return (
        (addMutation.isPending && addMutation.variables === restaurantId) ||
        (removeMutation.isPending && removeMutation.variables === favoriteId)
      );
    },
    [addMutation.isPending, addMutation.variables, removeMutation.isPending, removeMutation.variables, getFavoriteId]
  );

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    isMutating: addMutation.isPending || removeMutation.isPending,
    isRestaurantMutating,
  };
}
