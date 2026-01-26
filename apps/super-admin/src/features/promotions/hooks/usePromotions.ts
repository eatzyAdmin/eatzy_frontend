'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { voucherApi } from '@repo/api';
import { Voucher, CreateVoucherDto } from '@repo/types';
import { useNotification } from '@repo/ui';

export function usePromotions(search?: string, filterStr?: string) {
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
    queryKey: ['promotions', search, filterStr],
    queryFn: async ({ pageParam = 1 }) => {
      const params: any = {
        page: pageParam,
        size: 15
      };

      let filter = filterStr || '';
      if (search) {
        const searchFilter = `(code ~ '${search}' or description ~ '${search}')`;
        filter = filter ? `${filter} and ${searchFilter}` : searchFilter;
      }

      if (filter) {
        params.filter = filter;
      }

      const res = await voucherApi.getAllVouchers(params);
      const result = res.data?.result || [];
      const meta = res.data?.meta;

      return {
        items: result as Voucher[],
        nextPage: meta && meta.page < meta.pages ? meta.page + 1 : undefined,
        total: meta?.total || 0,
        pages: meta?.pages || 0
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const promotions = data?.pages.flatMap(page => page.items) || [];

  const createMutation = useMutation({
    mutationFn: (data: CreateVoucherDto) => voucherApi.createVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      showNotification({ message: 'Tạo chiến dịch thành công', type: 'success', format: "Tạo chiến dịch thành công." });
    },
    onError: (err: any) => {
      showNotification({ message: err.message || 'Tạo chiến dịch thất bại', type: 'error', format: `${err.message}` });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateVoucherDto) => voucherApi.updateVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      showNotification({ message: 'Cập nhật chiến dịch thành công', type: 'success', format: "Đã cập nhật chiến dịch." });
    },
    onError: (err: any) => {
      showNotification({ message: err.message || 'Cập nhật chiến dịch thất bại', type: 'error', format: `${err.message}` });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => voucherApi.deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      showNotification({ message: 'Xóa chiến dịch thành công', type: 'success', format: "Đã xóa chiến dịch." });
    },
    onError: (err: any) => {
      showNotification({ message: err.message || 'Xóa chiến dịch thất bại', type: 'error', format: `${err.message}` });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => voucherApi.toggleVoucherActive(id),
    onSuccess: () => {
      showNotification({ message: 'Cập nhật trạng thái thành công', type: 'success', format: "Đã cập nhật trạng thái." });
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
    onError: (err: any) => {
      showNotification({ message: err.message || 'Cập nhật trạng thái thất bại', type: 'error', format: `${err.message}` });
    }
  });

  return {
    promotions,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
    createPromotion: createMutation.mutateAsync,
    updatePromotion: updateMutation.mutateAsync,
    deletePromotion: deleteMutation.mutateAsync,
    togglePromotion: toggleMutation.mutateAsync,
    isActionLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || toggleMutation.isPending
  };
}
