'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverApi } from '@repo/api';
import { DriverProfile, CreateDriverProfileDto, UpdateDriverProfileDto } from '@repo/types';
import { useNotification } from '@repo/ui';

export function useDrivers(search?: string, filterStr?: string, sortField?: string, sortDirection?: 'asc' | 'desc') {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['drivers', search, filterStr, sortField, sortDirection],
    queryFn: async ({ pageParam = 1 }) => {
      const params: any = {
        page: pageParam,
        size: 15
      };

      if (sortField) {
        params.sort = `${sortField},${sortDirection || 'asc'}`;
      }

      let filter = filterStr || '';
      if (search) {
        const searchFilter = `(user.name ~ '${search}' or user.email ~ '${search}' or national_id_number ~ '${search}')`;
        filter = filter ? `${filter} and ${searchFilter}` : searchFilter;
      }

      if (filter) {
        params.filter = filter;
      }

      const res = await driverApi.getAllDriverProfiles(params);
      const result = res.data?.result || [];
      const meta = res.data?.meta;

      return {
        items: result as DriverProfile[],
        nextPage: meta && meta.page < meta.pages ? meta.page + 1 : undefined,
        total: meta?.total || 0,
        pages: meta?.pages || 0
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const drivers = data?.pages.flatMap(page => page.items) || [];

  const createMutation = useMutation({
    mutationFn: (data: CreateDriverProfileDto) => driverApi.createDriverProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      showNotification({ message: 'Tạo tài xế thành công', type: 'success', format: "Đã tạo hồ sơ tài xế mới." });
    },
    onError: (err: any) => {
      showNotification({ message: err.message || 'Tạo tài xế thất bại', type: 'error', format: `${err.message}` });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateDriverProfileDto) => driverApi.updateDriverProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      showNotification({ message: 'Cập nhật tài xế thành công', type: 'success', format: "Đồ sơ tài xế đã được cập nhật." });
    },
    onError: (err: any) => {
      showNotification({ message: err.message || 'Cập nhật tài xế thất bại', type: 'error', format: `${err.message}` });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => driverApi.deleteDriverProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      showNotification({ message: 'Xóa tài xế thành công', type: 'success', format: "Đã xóa hồ sơ tài xế." });
    },
    onError: (err: any) => {
      showNotification({ message: err.message || 'Xóa tài xế thất bại', type: 'error', format: `${err.message}` });
    }
  });

  const toggleAccountStatusMutation = useMutation({
    mutationFn: async ({ id, userId, isActive }: { id: number, userId: number, isActive: boolean }) => {
      const { userApi } = await import('@repo/api');
      return userApi.updateUserStatus(userId, !isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      showNotification({
        type: 'success',
        message: 'Thành công',
        format: 'Đã cập nhật trạng thái tài khoản tài xế.'
      });
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        message: 'Lỗi',
        format: `Không thể cập nhật trạng thái: ${error.message}`
      });
    }
  });

  return {
    drivers,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
    createDriver: createMutation.mutateAsync,
    updateDriver: updateMutation.mutateAsync,
    deleteDriver: deleteMutation.mutateAsync,
    toggleStatus: toggleAccountStatusMutation.mutateAsync,
    isActionLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || toggleAccountStatusMutation.isPending
  };
}
