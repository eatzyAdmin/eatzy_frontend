'use client';

import { DashboardStats as DashboardStatsType } from "../hooks/useDashboard";
import { DashboardStats } from "./DashboardStats";
import { OrderGoalCard } from "./OrderGoalCard";
import { OrderTrendChart } from "./OrderTrendChart";
import { OverviewChart } from "./OverviewChart";
import { TopRestaurantsScroll } from "./TopRestaurantsScroll";
import { ModernActivityList } from "./ModernActivityList";

interface DashboardBodyProps {
  stats: DashboardStatsType;
  revenueChartData: any;
  orderTrendData: any;
  topRestaurants: any;
  recentActivities: any;
}

export function DashboardBody({
  stats,
  revenueChartData,
  orderTrendData,
  topRestaurants,
  recentActivities
}: DashboardBodyProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
      {/* Left Column (1/3) - Statistics */}
      <div className="space-y-6 xl:col-span-1">
        <DashboardStats stats={stats} />

        <OrderGoalCard
          completedOrders={stats.completedOrders}
          totalOrders={stats.totalOrders}
          averageOrderValue={stats.averageOrderValue}
        />

        <OrderTrendChart data={orderTrendData} />
      </div>

      {/* Right Column (2/3) - Charts & Content */}
      <div className="xl:col-span-2 space-y-8">
        <div className="h-[350px]">
          <OverviewChart data={revenueChartData} />
        </div>

        <TopRestaurantsScroll restaurants={topRestaurants} />

        <ModernActivityList activities={recentActivities} />
      </div>
    </div>
  );
}
