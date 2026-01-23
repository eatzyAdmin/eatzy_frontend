'use client';

import { useEffect, useState, useMemo } from "react";
import {
  BadgeDollarSign,
  Users,
  Store,
  Truck,
  Star,
  CalendarCheck,
  ShoppingBag
} from "lucide-react";
import { useLoading } from "@repo/ui";
import { orderApi } from "@repo/api";
import { OrderResponse } from "@repo/types";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { MetricCard } from "@/features/dashboard/components/MetricCard";
import { OrderGoalCard } from "@/features/dashboard/components/OrderGoalCard";
import { OverviewChart } from "@/features/dashboard/components/OverviewChart";
import { TopRestaurantsScroll } from "@/features/dashboard/components/TopRestaurantsScroll";
import { ModernActivityList } from "@/features/dashboard/components/ModernActivityList";
import { OrderTrendChart } from "@/features/dashboard/components/OrderTrendChart";
import { format, subDays, startOfDay, isWithinInterval } from "date-fns";

export default function DashboardPage() {
  const { hide } = useLoading();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getAllOrders({ size: 1000 }); // Lấy toàn bộ đơn hàng (giả định max 1000)
        if (res.data?.result) {
          setOrders(res.data.result);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
        hide();
      }
    };

    fetchOrders();
  }, [hide]);

  // Xử lý dữ liệu thống kê
  const stats = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
    const completedOrders = orders.filter(o => o.orderStatus === 'DELIVERED');
    
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const todayRevenue = todayOrders.filter(o => o.orderStatus === 'DELIVERED').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    // Giả định dữ liệu tăng trưởng
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

  // Dữ liệu biểu đồ doanh thu (30 ngày qua)
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

  // Dữ liệu biểu đồ đơn hàng (7 ngày qua)
  const orderTrendData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const label = format(date, 'EEE');
      const value = orders.filter(o => format(new Date(o.createdAt), 'EEE') === label).length;
      return { label, value };
    });
    return days;
  }, [orders]);

  // Top cửa hàng (giả định từ dữ liệu đơn hàng)
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
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  // Hoạt động gần đây
  const recentActivities = useMemo(() => {
    return orders.slice(0, 8).map(o => ({
      id: o.id.toString(),
      type: 'order' as const,
      description: `Đơn hàng mới từ ${o.customer?.name || 'Khách hàng'}`,
      timestamp: o.createdAt,
      status: o.orderStatus
    }));
  }, [orders]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader
          title="Tổng quan hệ thống"
          subtitle="Chào mừng Super Admin, đây là tình hình hệ thống hôm nay."
          stats={{
            activeOrders: stats.activeOrders,
            totalRestaurants: stats.totalRestaurants,
            activeDrivers: stats.activeDrivers,
            totalCustomers: stats.totalCustomers
          }}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Cột trái (1/3) - Thống kê */}
          <div className="space-y-6 xl:col-span-1">
            <div className="relative h-[250px] md:h-[300px] xl:h-[220px]">
              {/* Card 3: Khách hàng */}
              <div className="absolute top-8 left-0 right-0 transform scale-90 opacity-40 z-0">
                <MetricCard
                  label="Khách hàng"
                  value={stats.totalCustomers.toString()}
                  subValue="Tổng số người dùng"
                  trend={stats.userGrowth}
                  color="purple"
                  icon={Users}
                />
              </div>
              {/* Card 2: Đơn hàng */}
              <div className="absolute top-4 left-0 right-0 transform scale-95 opacity-70 z-10 transition-transform hover:translate-y-[-10px]">
                <MetricCard
                  label="Tổng đơn hàng"
                  value={stats.totalOrders.toString()}
                  subValue={`${stats.todayOrders} đơn hôm nay`}
                  trend={stats.orderGrowth}
                  color="orange"
                  icon={ShoppingBag}
                />
              </div>
              {/* Card 1: Doanh thu */}
              <div className="relative z-20 transition-transform hover:translate-y-[-5px]">
                <MetricCard
                  label="Tổng doanh thu"
                  value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: "compact" }).format(stats.totalRevenue)}
                  subValue="Toàn bộ thời gian"
                  trend={stats.revenueGrowth}
                  color="blue"
                  icon={BadgeDollarSign}
                />
              </div>
            </div>

            <OrderGoalCard 
              completedOrders={stats.completedOrders} 
              totalOrders={stats.totalOrders}
              averageOrderValue={stats.averageOrderValue}
            />

            <OrderTrendChart data={orderTrendData} />
          </div>

          {/* Cột phải (2/3) - Biểu đồ & Nội dung */}
          <div className="xl:col-span-2 space-y-8">
            <div className="h-[350px]">
              <OverviewChart data={revenueChartData} />
            </div>

            <TopRestaurantsScroll restaurants={topRestaurants} />

            <ModernActivityList activities={recentActivities} />
          </div>
        </div>
      </div>
    </div>
  );
}
