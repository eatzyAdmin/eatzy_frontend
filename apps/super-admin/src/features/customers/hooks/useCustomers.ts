import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '@repo/api';
import { useNotification } from '@repo/ui';

export const useCustomers = (searchTerm: string, filter: string) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const query = useInfiniteQuery({
    queryKey: ['customers', searchTerm, filter],
    queryFn: async ({ pageParam = 1 }) => {
      const params: any = {
        page: pageParam,
        size: 10,
        sort: 'id,desc'
      };

      let filterQuery = '';
      if (searchTerm) {
        filterQuery = `(user.name ~ '*${searchTerm}*' or user.phoneNumber ~ '*${searchTerm}*' or hometown ~ '*${searchTerm}*')`;
      }

      if (filter) {
        filterQuery = filterQuery ? `${filterQuery} and (${filter})` : filter;
      }

      if (filterQuery) {
        params.filter = filterQuery;
      }

      const res = await customerApi.getAllCustomers(params);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.meta) return undefined;
      const { page, pages } = lastPage.meta;
      // meta.page is 1-indexed. If current page < total pages, fetch page + 1
      return page < pages ? page + 1 : undefined;
    },
    initialPageParam: 1
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => customerApi.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      showNotification({
        type: 'success',
        message: 'Thành công',
        format: 'Đã xóa hồ sơ khách hàng vĩnh viễn.'
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: 'Lỗi',
        format: 'Không thể xóa hồ sơ khách hàng. Vui lòng thử lại.'
      });
    }
  });

  const updateCustomerFullMutation = useMutation({
    mutationFn: async ({ id, userId, data }: { id: number, userId: number, data: { name: string; hometown: string; dateOfBirth: string } }) => {
      const { userApi } = await import('@repo/api');

      // 1. Update User (Name)
      await userApi.updateUser({
        id: userId,
        name: data.name
      });

      // 2. Update Customer Profile (Hometown, DOB)
      return customerApi.updateCustomer({
        id: id,
        dateOfBirth: data.dateOfBirth,
        hometown: data.hometown
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      showNotification({
        type: 'success',
        message: 'Thành công',
        format: 'Thông tin khách hàng đã được cập nhật đồng bộ.'
      });
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        message: 'Lỗi: không thể cập nhật thông tin. Vui lòng thử lại.',
        format: `${error.message}`
      });
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, userId, isActive }: { id: number, userId: number, isActive: boolean }) => {
      const { userApi } = await import('@repo/api');
      return userApi.updateUserStatus(userId, !isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      showNotification({
        type: 'success',
        message: 'Thành công',
        format: 'Đã cập nhật trạng thái tài khoản khách hàng.'
      });
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        message: 'Lỗi: không thể cập nhật trạng thái. Vui lòng thử lại.',
        format: `${error.message}`
      });
    }
  });

  return {
    customers: query.data?.pages.flatMap(page => page?.result || []) || [],
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    deleteCustomer: deleteMutation.mutateAsync,
    updateCustomer: updateCustomerFullMutation.mutateAsync,
    toggleStatus: toggleStatusMutation.mutateAsync
  };
};
