'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemConfigApi } from '@repo/api';
import { SystemParameter } from '@repo/types';
import { useNotification } from '@repo/ui';

export type ConfigGroupKey = 'financial' | 'delivery' | 'operational' | 'timeouts' | 'general';

export const CONFIG_GROUPS: Record<string, ConfigGroupKey> = {
  'RESTAURANT_COMMISSION_RATE': 'financial',
  'DRIVER_COMMISSION_RATE': 'financial',
  'DELIVERY_BASE_FEE': 'delivery',
  'DELIVERY_BASE_DISTANCE': 'delivery',
  'DELIVERY_PER_KM_FEE': 'delivery',
  'DELIVERY_MIN_FEE': 'delivery',
  'DRIVER_SEARCH_RADIUS_KM': 'operational',
  'DRIVER_ACCEPT_TIMEOUT_SEC': 'operational',
  'MAX_RESTAURANT_DISTANCE_KM': 'operational',
  'RESTAURANT_RESPONSE_TIMEOUT_MINUTES': 'timeouts',
  'DRIVER_ASSIGNMENT_TIMEOUT_MINUTES': 'timeouts',
  'SUPPORT_HOTLINE': 'general',
  'MAINTENANCE_MODE': 'general',
};

export function useSystemConfig() {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const { data: configs = [], isLoading, error, refetch } = useQuery<SystemParameter[]>({
    queryKey: ['system-configs'],
    queryFn: async () => {
      const res = await systemConfigApi.getAllConfigs({ size: 100 });
      return res.data?.result || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedConfig: SystemParameter) => {
      const res = await systemConfigApi.updateConfig({
        id: updatedConfig.id,
        configKey: updatedConfig.configKey,
        configValue: updatedConfig.configValue,
        description: updatedConfig.description
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-configs'] });
      showNotification({
        message: 'Cập nhật cấu hình thành công',
        type: 'success',
        format: 'Config'
      });
    },
    onError: (err: any) => {
      showNotification({
        message: err.message || 'Cập nhật cấu hình thất bại',
        type: 'error',
        format: 'Config'
      });
    }
  });

  const groupedConfigs = configs.reduce((acc, config) => {
    const groupKey = CONFIG_GROUPS[config.configKey] || 'general';
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(config);
    return acc;
  }, {} as Record<ConfigGroupKey, SystemParameter[]>);

  return {
    configs,
    groupedConfigs,
    isLoading,
    error,
    refetch,
    updateConfig: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending
  };
}
