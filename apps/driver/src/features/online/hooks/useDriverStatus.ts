"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { driverApi } from "@repo/api";
import { useNotification } from "@repo/ui";
import { IBackendRes } from "@repo/types";

// ======== Types ========

export type DriverStatus = "OFFLINE" | "AVAILABLE" | "UNAVAILABLE" | "BUSY";

export interface UseDriverStatusResult {
  /** Current status of the driver */
  status: DriverStatus | null;
  /** Whether the driver is currently online (ready to receive or delivering orders) */
  isOnline: boolean;
  /** Loading state for initial status fetch */
  isLoading: boolean;
  /** Loading state for status update operations */
  isUpdating: boolean;
  /** Error from the last operation */
  error: Error | null;
  /** Go online */
  goOnline: () => Promise<void>;
  /** Go offline */
  goOffline: () => Promise<void>;
  /** Toggle between online and offline */
  toggleStatus: () => Promise<void>;
  /** Refetch status from server */
  refetch: () => void;
}

// ======== Query Keys ========

export const driverStatusKeys = {
  all: ["driver-status"] as const,
  myStatus: () => [...driverStatusKeys.all, "my-status"] as const,
};

// ======== Hook ========

/**
 * Hook to manage driver online/offline status
 * Uses the /api/v1/driver-profiles/my-profile/status endpoint
 */
export function useDriverStatus(): UseDriverStatusResult {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  // Query for fetching current status
  const query = useQuery({
    queryKey: driverStatusKeys.myStatus(),
    queryFn: async () => {
      const response = await driverApi.getMyDriverStatus() as unknown as IBackendRes<{ status: string }>;
      if (response.statusCode === 200 && response.data) {
        return response.data.status as DriverStatus;
      }
      throw new Error(response.message || "Failed to fetch driver status");
    },
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });

  // Mutation for going online
  const onlineMutation = useMutation({
    mutationFn: async () => {
      const response = await driverApi.goOnline() as unknown as IBackendRes<{ status: DriverStatus }>;
      if (response.statusCode !== 200) {
        throw new Error(response.message || "Failed to go online");
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.status) {
        queryClient.setQueryData(driverStatusKeys.myStatus(), data.status);
      }
      queryClient.invalidateQueries({ queryKey: driverStatusKeys.all });
      showNotification({
        message: "Bật kết nối thành công!",
        type: "success",
        format: "Bạn đã sẵn sàng nhận đơn hàng mới!",
        autoHideDuration: 3000,
      });
    },
    onError: (error: Error) => {
      showNotification({
        message: "Không thể bật kết nối",
        type: "error",
        format: error.message,
        autoHideDuration: 3000,
      });
    },
  });

  // Mutation for going offline
  const offlineMutation = useMutation({
    mutationFn: async () => {
      const response = await driverApi.goOffline() as unknown as IBackendRes<{ status: DriverStatus }>;
      if (response.statusCode !== 200) {
        throw new Error(response.message || "Failed to go offline");
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.status) {
        queryClient.setQueryData(driverStatusKeys.myStatus(), data.status);
      }
      queryClient.invalidateQueries({ queryKey: driverStatusKeys.all });
      showNotification({
        message: "Đã tắt kết nối",
        type: "success",
        format: "Bạn tạm thời sẽ không nhận đơn hàng mới.",
        autoHideDuration: 3000,
      });
    },
    onError: (error: Error) => {
      showNotification({
        message: "Không thể tắt kết nối",
        type: "error",
        format: error.message,
        autoHideDuration: 3000,
      });
    },
  });

  // Computed values
  const status = query.data || null;
  const isOnline = status?.toUpperCase() === "AVAILABLE" || status?.toUpperCase() === "UNAVAILABLE";
  const isUpdating = onlineMutation.isPending || offlineMutation.isPending;

  // Actions
  const goOnline = useCallback(async () => {
    await onlineMutation.mutateAsync();
  }, [onlineMutation]);

  const goOffline = useCallback(async () => {
    await offlineMutation.mutateAsync();
  }, [offlineMutation]);

  const toggleStatus = useCallback(async () => {
    if (isOnline) {
      await goOffline();
    } else {
      await goOnline();
    }
  }, [isOnline, goOnline, goOffline]);

  return {
    status,
    isOnline,
    isLoading: query.isLoading,
    isUpdating,
    error: query.error || onlineMutation.error || offlineMutation.error,
    goOnline,
    goOffline,
    toggleStatus,
    refetch: query.refetch,
  };
}
