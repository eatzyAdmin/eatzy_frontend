'use client';
import { DashboardHeader, DashboardBody, DashboardSkeleton } from "@/features/dashboard/components";
import { useDashboard } from "@/features/dashboard";

export default function DashboardPage() {
  const {
    stats,
    revenueChartData,
    orderTrendData,
    topRestaurants,
    recentActivities,
    isLoading,
    error
  } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Đã có lỗi xảy ra</h2>
          <p className="text-gray-600">Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

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

        <DashboardBody
          stats={stats}
          revenueChartData={revenueChartData}
          orderTrendData={orderTrendData}
          topRestaurants={topRestaurants}
          recentActivities={recentActivities}
        />
      </div>
    </div>
  );
}
