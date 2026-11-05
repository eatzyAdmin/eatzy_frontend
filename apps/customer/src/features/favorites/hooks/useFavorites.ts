"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteApi } from "@repo/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCallback, useMemo } from "react";
import { sileo } from "@/components/DynamicIslandToast";

export function useFavorites(restaurantId?: number | null) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();
  const isLoggedIn = !!user?.id;

  const { data, isLoading: isQueryLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["favorites", "my", user?.id, restaurantId ?? null],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await favoriteApi.getPage(pageParam, restaurantId ?? undefined);
      if (!response.data) throw new Error("Không thể tải danh sách yêu thích");
      return response.data;
    },
    getNextPageParam: (last) => last.meta.page < last.meta.pages ? last.meta.page + 1 : undefined,
    enabled: isLoggedIn,
  });
  const favorites = useMemo(() => data?.pages.flatMap(page => page.result).filter(f => f.restaurant != null) ?? [], [data]);

  const isLoading = isAuthLoading || (isLoggedIn && isQueryLoading);

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
    mutationFn: (vars: { id: number; name: string }) =>
      favoriteApi.addFavorite({
        restaurant: { id: vars.id },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorites", "my"] });
      sileo.success({
        title: "Đã thêm vào danh sách yêu thích",
        description: variables.name,
        actionType: "favorite_add"
      } as any);
    },
    onError: (error) => {
      sileo.error({
        title: "Lỗi",
        description: error.message,
        actionType: "favorite_error"
      } as any);
    },
  });

  // Mutation to remove favorite
  const removeMutation = useMutation({
    mutationFn: (vars: { id: number; name: string }) => favoriteApi.removeFavorite(vars.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorites", "my"] });
      sileo.success({
        title: "Đã xóa khỏi danh sách yêu thích",
        description: variables.name,
        actionType: "favorite_remove"
      } as any);
    },
    onError: (error) => {
      sileo.error({
        title: "Lỗi",
        description: error.message,
        actionType: "favorite_error"
      } as any);
    },
  });

  const toggleFavorite = useCallback(
    async (restaurantId: number, restaurantName: string = "Nhà hàng") => {
      if (!isLoggedIn) {
        sileo.error({
          title: "Lỗi",
          description: "Vui lòng đăng nhập để thực hiện chức năng này",
        });
        return;
      }

      const existingFavoriteId = getFavoriteId(restaurantId);

      if (existingFavoriteId) {
        await removeMutation.mutateAsync({ id: existingFavoriteId, name: restaurantName });
      } else {
        await addMutation.mutateAsync({ id: restaurantId, name: restaurantName });
      }
    },
    [isLoggedIn, getFavoriteId, removeMutation, addMutation]
  );

  const isRestaurantMutating = useCallback(
    (restaurantId: number) => {
      const favoriteId = getFavoriteId(restaurantId);
      return (
        (addMutation.isPending && addMutation.variables?.id === restaurantId) ||
        (removeMutation.isPending && removeMutation.variables?.id === favoriteId)
      );
    },
    [addMutation.isPending, addMutation.variables, removeMutation.isPending, removeMutation.variables, getFavoriteId]
  );

  const refresh = useCallback(async () => {
    await Promise.all([
      queryClient.resetQueries({ queryKey: ["favorites", "my"] }),
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);
  }, [queryClient]);

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    isMutating: addMutation.isPending || removeMutation.isPending,
    isRestaurantMutating,
    refresh,
    error,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
  };
}
