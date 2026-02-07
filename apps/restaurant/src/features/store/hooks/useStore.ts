import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantDetailApi, mapRestaurantDetailToStoreInfo, mapStoreUpdatesToApi, fileApi } from '@repo/api';
import type { StoreInfo, UpdateStoreRequest } from '@repo/types';
import { useNotification } from '@repo/ui';

// ======== Query Keys ========

export const storeKeys = {
  all: ['store'] as const,
  myStore: () => [...storeKeys.all, 'my-store'] as const,
  myMenu: () => [...storeKeys.all, 'my-menu'] as const,
};

// ======== Hooks ========

/**
 * Hook to fetch current owner's restaurant info
 * Uses the my-restaurant API - no ID required
 */
export function useMyStore() {
  const query = useQuery({
    queryKey: storeKeys.myStore(),
    queryFn: async () => {
      // Get full restaurant details directly
      const response = await restaurantDetailApi.getMyRestaurant();
      if (response.statusCode !== 200 || !response.data) {
        throw new Error('Failed to fetch restaurant details');
      }

      const detail = response.data;
      return mapRestaurantDetailToStoreInfo(detail);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    store: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to update restaurant info
 * Uses the my-restaurant API - no ID required
 */
export function useUpdateStore() {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const mutation = useMutation({
    mutationFn: async (updates: Record<string, any>) => {
      const apiUpdates = mapStoreUpdatesToApi(updates);
      const response = await restaurantDetailApi.updateMyRestaurant(apiUpdates);
      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Failed to update restaurant');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      showNotification({
        message: 'Thông tin cửa hàng đã được cập nhật!',
        type: 'success',
        format: 'Dữ liệu được cập nhật thành công.',
        autoHideDuration: 3000,
      });
    },
    onError: (error: Error) => {
      showNotification({
        message: 'Không thể cập nhật thông tin',
        type: 'error',
        format: error.message,
        autoHideDuration: 3000,
      });
    },
  });

  return {
    updateStore: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * Hook to upload store images
 */
export function useUploadStoreImage() {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const mutation = useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder?: string }) => {
      const response = await fileApi.uploadFile(file, folder);
      if (response.statusCode !== 200 || !response.data) {
        throw new Error(response.message || 'Failed to upload image');
      }
      return response.data;
    },
    onSuccess: () => {
      showNotification({
        message: 'Ảnh đã được tải lên thành công!',
        type: 'success',
        autoHideDuration: 3000,
      });
    },
    onError: (error: Error) => {
      showNotification({
        message: 'Không thể tải ảnh lên',
        type: 'error',
        format: error.message,
        autoHideDuration: 3000,
      });
    },
  });

  return {
    uploadImage: mutation.mutateAsync,
    isUploading: mutation.isPending,
    error: mutation.error,
  };
}
