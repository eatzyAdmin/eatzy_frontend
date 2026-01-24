'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@repo/api';
import { OrderResponse } from '@repo/types';
import { format, subDays, startOfDay } from 'date-fns';

export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  todayOrders: number;
  orderGrowth: number;
  activeOrders: number;
  completedOrders: number;
  totalCustomers: number;
  totalRestaurants: number;
  activeDrivers: number;
  userGrowth: number;
  averageOrderValue: number;
}
export function useDashboard() {
  const { data: orders = [], isLoading, error } = useQuery<OrderResponse[]>({
    queryKey: ['dashboard-orders'],
    queryFn: async () => {
      const res = await orderApi.getAllOrders({ size: 1000 });
      if (res.data?.result) {
        return res.data.result;
      }
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);

    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
    const completedOrders = orders.filter(o => o.orderStatus === 'DELIVERED');

    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const todayRevenue = todayOrders.filter(o => o.orderStatus === 'DELIVERED').reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Assumption of growth data (in a real app, this might come from the API)
    const revenueGrowth = 12.5;
    const orderGrowth = 8.2;
    const userGrowth = 5.4;

    return {
      totalRevenue,
      todayRevenue,
      revenueGrowth,
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      orderGrowth,
      activeOrders: orders.filter(o => !['DELIVERED', 'CANCELLED', 'REJECTED'].includes(o.orderStatus)).length,
      completedOrders: completedOrders.length,
      totalCustomers: new Set(orders.map(o => o.customer?.id).filter(Boolean)).size,
      totalRestaurants: new Set(orders.map(o => o.restaurant?.id).filter(Boolean)).size,
      activeDrivers: new Set(orders.filter(o => o.driver?.id).map(o => o.driver?.id).filter(Boolean)).size,
      userGrowth,
      averageOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0
    };
  }, [orders]);

  // Revenue chart data (last 30 days)
  const revenueChartData = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      const label = format(date, 'dd/MM');
      const value = orders
        .filter(o => o.orderStatus === 'DELIVERED' && format(new Date(o.createdAt), 'dd/MM') === label)
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      return { label, value };
    });
    return days;
  }, [orders]);

  // Order trend data (last 7 days)
  const orderTrendData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const label = format(date, 'EEE');
      const value = orders.filter(o => format(new Date(o.createdAt), 'EEE') === label).length;
      return { label, value };
    });
    return days;
  }, [orders]);

  // Top restaurants (derived from order data)
  const topRestaurants = useMemo(() => {
    const restaurantStats = orders.reduce((acc, o) => {
      if (o.orderStatus !== 'DELIVERED' || !o.restaurant?.id) return acc;
      const id = o.restaurant.id.toString();
      if (!acc[id]) {
        acc[id] = {
          id,
          name: o.restaurant.name || `Restaurant ${id}`,
          revenue: 0,
          type: 'Đồ ăn',
          image: `https://ui-avatars.com/api/?name=${o.restaurant.name || id}&background=random`
        };
      }
      acc[id].revenue += o.totalAmount || 0;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(restaurantStats)
      .sort((a, b: any) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  // Recent activities
  const recentActivities = useMemo(() => {
    return orders.slice(0, 8).map(o => ({
      id: o.id.toString(),
      type: 'order' as const,
      description: `Đơn hàng mới từ ${o.customer?.name || 'Khách hàng'}`,
      timestamp: o.createdAt,
      status: o.orderStatus
    }));
  }, [orders]);

  return {
    stats,
    revenueChartData,
    orderTrendData,
    topRestaurants,
    recentActivities,
    isLoading,
    error
  };
}
