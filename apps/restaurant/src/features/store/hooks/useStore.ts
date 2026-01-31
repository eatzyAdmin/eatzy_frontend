'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantApi, restaurantDetailApi, fileApi } from '@repo/api';
import { useNotification } from '@repo/ui';

// ======== Types ========

export interface StoreInfo {
  id: number;
  name: string;
  description: string;
  address: string;
  coords: { lat: number; lng: number };
  slug: string;
  commissionRate: number;
  phone: string;
  rating: number;
  reviewCount: number;
  status: 'OPEN' | 'CLOSED' | string;
  imageUrl: string;
  coverImageUrl?: string;
  schedule?: string;
  openingHours: OpeningHour[];
  images: string[];
}

export interface OpeningHour {
  day: string;
  isOpen: boolean;
  shifts: { open: string; close: string }[];
}

export interface UpdateStoreRequest {
  id: number;
  name?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  schedule?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
}

// ======== Query Keys ========

export const storeKeys = {
  all: ['store'] as const,
  myStore: () => [...storeKeys.all, 'my-store'] as const,
  myMenu: () => [...storeKeys.all, 'my-menu'] as const,
};

// ======== Helpers ========

/**
 * Parse schedule JSON string to OpeningHours array
 */
function parseSchedule(scheduleJson?: string): OpeningHour[] {
  if (!scheduleJson) {
    return getDefaultSchedule();
  }
  try {
    const parsed = JSON.parse(scheduleJson);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return getDefaultSchedule();
  } catch {
    return getDefaultSchedule();
  }
}

function getDefaultSchedule(): OpeningHour[] {
  return [
    { day: 'Thứ 2', isOpen: true, shifts: [{ open: '08:00', close: '22:00' }] },
    { day: 'Thứ 3', isOpen: true, shifts: [{ open: '08:00', close: '22:00' }] },
    { day: 'Thứ 4', isOpen: true, shifts: [{ open: '08:00', close: '22:00' }] },
    { day: 'Thứ 5', isOpen: true, shifts: [{ open: '08:00', close: '22:00' }] },
    { day: 'Thứ 6', isOpen: true, shifts: [{ open: '08:00', close: '23:00' }] },
    { day: 'Thứ 7', isOpen: true, shifts: [{ open: '09:00', close: '23:00' }] },
    { day: 'Chủ Nhật', isOpen: false, shifts: [] },
  ];
}

// ======== Hooks ========

/**
 * Hook to fetch current owner's restaurant info
 * Uses menu endpoint as workaround to get restaurant ID, then fetches full detail
 */
export function useMyStore() {
  const query = useQuery({
    queryKey: storeKeys.myStore(),
    queryFn: async () => {
      // Get menu first (to retrieve restaurant ID)
      const menuResponse = await restaurantDetailApi.getMyMenu();
      if (menuResponse.statusCode !== 200 || !menuResponse.data) {
        throw new Error('Failed to fetch restaurant info');
      }

      const restaurantId = parseInt(menuResponse.data.restaurantId, 10);

      // Then get full restaurant details
      const detailResponse = await restaurantDetailApi.getById(restaurantId);
      if (detailResponse.statusCode !== 200 || !detailResponse.data) {
        throw new Error('Failed to fetch restaurant details');
      }

      const detail = detailResponse.data;

      // Map to StoreInfo
      const storeInfo: StoreInfo = {
        id: restaurantId,
        name: detail.name,
        description: detail.description || '',
        address: detail.address,
        coords: {
          lat: detail.latitude || 0,
          lng: detail.longitude || 0,
        },
        slug: detail.slug,
        commissionRate: 10, // Default, could be fetched if available
        phone: detail.contactPhone || '',
        rating: detail.rating,
        reviewCount: detail.reviewCount,
        status: detail.status,
        imageUrl: detail.avatarUrl || '',
        coverImageUrl: detail.coverImageUrl,
        schedule: detail.schedule,
        openingHours: parseSchedule(detail.schedule),
        images: [], // Images need separate endpoint if available
      };

      return storeInfo;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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
 */
export function useUpdateStore() {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const mutation = useMutation({
    mutationFn: async (updates: UpdateStoreRequest) => {
      const response = await restaurantApi.updateRestaurant(updates) as unknown as { statusCode: number; data?: unknown; message?: string };
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
