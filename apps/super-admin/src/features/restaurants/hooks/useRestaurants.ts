'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantApi } from '@repo/api';
import { Restaurant, RestaurantStatus } from '@repo/types';
import { useNotification } from '@repo/ui';

export function useRestaurants(search?: string, filterStr?: string) {
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
    queryKey: ['restaurants', 'admin-list', search, filterStr],
    queryFn: async ({ pageParam = 1 }) => {
      const params: any = {
        page: pageParam,
        size: 15
      };

      let filter = filterStr || '';
      if (search) {
        const searchFilter = `name ~ '${search}'`;
        filter = filter ? `${filter} and ${searchFilter}` : searchFilter;
      }

      if (filter) {
        params.filter = filter;
      }

      const res = await restaurantApi.getAllRestaurants(params);

      // Adaptation for the specific response structure
      const result = (res as any).data?.result || [];
      const meta = (res as any).data?.meta;

      return {
        items: result as Restaurant[],
        nextPage: meta && meta.page < meta.pages ? meta.page + 1 : undefined,
        total: meta?.total || 0,
        pages: meta?.pages || 0
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const restaurants = data?.pages.flatMap(page => page.items) || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => restaurantApi.createRestaurant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'admin-list'] });
      showNotification({ message: 'Store created successfully', type: 'success', format: "Store has been created." });
    },
    onError: (err: any) => {
      showNotification({ message: err.message || 'Failed to create store', type: 'error', format: `${err.message}` });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => restaurantApi.updateRestaurant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'admin-list'] });
      showNotification({ message: 'Store updated successfully', type: 'success', format: "Store has been updated." });
    },
    onError: (err: any) => {
      showNotification({ message: err.message || 'Failed to update store', type: 'error', format: `${err.message}` });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restaurantApi.deleteRestaurant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'admin-list'] });
      showNotification({ message: 'Store deleted successfully', type: 'success', format: "Store has been deleted." });
    },
    onError: (err: any) => {
      showNotification({ message: err.message || 'Failed to delete store', type: 'error', format: `${err.message}` });
    }
  });

  // Toggling status (OPEN/CLOSED) is often done via dedicated endpoints in some apps, 
  // but here we can use updateRestaurant if generic, or dedicated if they exist.
  // Backend has /restaurants/open and /restaurants/close but they are for "current owner".
  // As Super Admin, we probably just update the status field via PUT /restaurants.
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: RestaurantStatus }) => {
      return restaurantApi.updateRestaurant({ id, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'admin-list'] });
      showNotification({ message: 'Status updated successfully', type: 'success', format: "Store status has been updated." });
    },
    onError: (err: any) => {
      showNotification({ message: err.message || 'Failed to update status', type: 'error', format: `${err.message}` });
    }
  });

  const toggleAccountStatusMutation = useMutation({
    mutationFn: async ({ id, userId, isActive }: { id: number, userId: number, isActive: boolean }) => {
      const { userApi } = await import('@repo/api');
      return userApi.updateUserStatus(userId, !isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants', 'admin-list'] });
      showNotification({
        type: 'success',
        message: 'Success',
        format: 'Owner account status has been updated.'
      });
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        message: 'Error',
        format: `Unable to update status: ${error.message}`
      });
    }
  });

  return {
    restaurants,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
    createRestaurant: createMutation.mutateAsync,
    updateRestaurant: updateMutation.mutateAsync,
    deleteRestaurant: deleteMutation.mutateAsync,
    toggleRestaurantStatus: toggleStatusMutation.mutateAsync,
    toggleStatus: toggleAccountStatusMutation.mutateAsync,
    isActionLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || toggleStatusMutation.isPending || toggleAccountStatusMutation.isPending
  };
}
