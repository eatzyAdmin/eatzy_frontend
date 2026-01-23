"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantApi } from "@repo/api";
import { useNotification } from "@repo/ui";

// ======== Types ========

export type RestaurantStatus = "OPEN" | "CLOSED" | "ACTIVE" | "INACTIVE";

export interface UseRestaurantStatusResult {
  /** Current status of the restaurant */
  status: RestaurantStatus | null;
  /** Whether the restaurant is currently open (accepting orders) */
  isOpen: boolean;
  /** Loading state for initial status fetch */
  isLoading: boolean;
  /** Loading state for status update operations */
  isUpdating: boolean;
  /** Error from the last operation */
  error: Error | null;
  /** Open the restaurant */
  openRestaurant: () => Promise<void>;
  /** Close the restaurant */
  closeRestaurant: () => Promise<void>;
  /** Toggle between open and closed */
  toggleStatus: () => Promise<void>;
  /** Refetch status from server */
  refetch: () => void;
}

// ======== Query Keys ========

export const restaurantStatusKeys = {
  all: ["restaurant-status"] as const,
  myStatus: () => [...restaurantStatusKeys.all, "my-status"] as const,
};

// ======== Hook ========

/**
 * Hook to manage restaurant open/close status
 * Uses the /api/v1/restaurants/my-restaurant/status endpoint
 */
export function useRestaurantStatus(): UseRestaurantStatusResult {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  // Query for fetching current status
  const query = useQuery({
    queryKey: restaurantStatusKeys.myStatus(),
    queryFn: async () => {
      const response = await restaurantApi.getMyRestaurantStatus() as unknown as { statusCode: number; data?: { status: string }; message?: string };
      if (response.statusCode === 200 && response.data) {
        return response.data.status as RestaurantStatus;
      }
      throw new Error(response.message || "Failed to fetch restaurant status");
    },
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });

  // Mutation for opening restaurant
  const openMutation = useMutation({
    mutationFn: async () => {
      const response = await restaurantApi.openMyRestaurant() as unknown as { statusCode: number; data?: unknown; message?: string };
      if (response.statusCode !== 200) {
        throw new Error(response.message || "Failed to open restaurant");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantStatusKeys.all });
      showNotification({
        message: "Mở nhà hàng thành công!",
        type: "success",
        format: "Nhà hàng đang mở và sẵn sàng nhận đơn hàng mới!",
        autoHideDuration: 3000,
      });
    },
    onError: (error: Error) => {
      showNotification({
        message: "Không thể mở nhà hàng",
        type: "error",
        format: error.message,
        autoHideDuration: 3000,
      });
    },
  });

  // Mutation for closing restaurant
  const closeMutation = useMutation({
    mutationFn: async () => {
      const response = await restaurantApi.closeMyRestaurant() as unknown as { statusCode: number; data?: unknown; message?: string };
      if (response.statusCode !== 200) {
        throw new Error(response.message || "Failed to close restaurant");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantStatusKeys.all });
      showNotification({
        message: "Nhà hàng đã tạm đóng cửa",
        type: "success",
        format: "Nhà hàng đã tạm đóng cửa. Bạn sẽ không nhận được đơn hàng mới.",
        autoHideDuration: 3000,
      });
    },
    onError: (error: Error) => {
      showNotification({
        message: "Không thể đóng nhà hàng",
        type: "error",
        format: error.message,
        autoHideDuration: 3000,
      });
    },
  });

  // Computed values
  const status = query.data || null;
  const isOpen = status === "OPEN";
  const isUpdating = openMutation.isPending || closeMutation.isPending;

  // Actions
  const openRestaurant = useCallback(async () => {
    await openMutation.mutateAsync();
  }, [openMutation]);

  const closeRestaurant = useCallback(async () => {
    await closeMutation.mutateAsync();
  }, [closeMutation]);

  const toggleStatus = useCallback(async () => {
    if (isOpen) {
      await closeRestaurant();
    } else {
      await openRestaurant();
    }
  }, [isOpen, openRestaurant, closeRestaurant]);

  return {
    status,
    isOpen,
    isLoading: query.isLoading,
    isUpdating,
    error: query.error || openMutation.error || closeMutation.error,
    openRestaurant,
    closeRestaurant,
    toggleStatus,
    refetch: query.refetch,
  };
}
