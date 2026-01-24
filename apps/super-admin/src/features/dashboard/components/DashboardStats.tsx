'use client';

import { Users, ShoppingBag, BadgeDollarSign } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface DashboardStatsProps {
  stats: {
    totalCustomers: number;
    userGrowth: number;
    totalOrders: number;
    todayOrders: number;
    orderGrowth: number;
    totalRevenue: number;
    revenueGrowth: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
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
  );
}
