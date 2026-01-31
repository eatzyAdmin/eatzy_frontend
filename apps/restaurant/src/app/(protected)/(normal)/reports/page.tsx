'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { useNotification } from '@repo/ui';

import ReportHeader, { ReportTab } from '@/features/reports/components/ReportHeader';
import DashboardReport from '@/features/reports/components/DashboardReport';
import RevenueReport from '@/features/reports/components/RevenueReport';
import OrdersReport from '@/features/reports/components/OrdersReport';
import MenuReport from '@/features/reports/components/MenuReport';
import ReviewsReport from '@/features/reports/components/ReviewsReport';

import {
  useReportDates,
  useDashboardReport,
  useRevenueReport,
  useOrdersReport,
  useMenuReport,
  useReviewsReport
} from '@/features/reports/hooks';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('dashboard');
  const { showNotification } = useNotification();

  // Date range management with hydration safety
  const {
    startDate,
    endDate,
    isMounted,
    handleDateChange
  } = useReportDates();

  // Fetch data based on active tab
  const dashboardQuery = useDashboardReport({
    startDate,
    endDate,
    enabled: activeTab === 'dashboard'
  });

  const revenueQuery = useRevenueReport({
    startDate,
    endDate,
    enabled: activeTab === 'revenue'
  });

  const ordersQuery = useOrdersReport({
    startDate,
    endDate,
    enabled: activeTab === 'orders'
  });

  const menuQuery = useMenuReport({
    enabled: activeTab === 'menu'
  });

  const reviewsQuery = useReviewsReport({
    enabled: activeTab === 'reviews'
  });

  // Get current loading state based on active tab
  const isLoading = (() => {
    switch (activeTab) {
      case 'dashboard': return dashboardQuery.isLoading;
      case 'revenue': return revenueQuery.isLoading;
      case 'orders': return ordersQuery.isLoading;
      case 'menu': return menuQuery.isLoading;
      case 'reviews': return reviewsQuery.isLoading;
      default: return false;
    }
  })();

  const handleExport = (type: 'excel' | 'pdf') => {
    showNotification({
      message: `Đang xuất báo cáo ${activeTab === 'dashboard' ? 'tổng quan' : activeTab} sang ${type.toUpperCase()}...`,
      type: 'success',
    });
    // TODO: Integrate with actual export API
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[400px]"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-lime-100 border-t-lime-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-lime-500/20 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 font-medium mt-6 animate-pulse">Đang phân tích dữ liệu...</p>
        </motion.div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && dashboardQuery.data && (
            <DashboardReport data={dashboardQuery.data} />
          )}
          {activeTab === 'revenue' && revenueQuery.data && (
            <RevenueReport data={revenueQuery.data} />
          )}
          {activeTab === 'orders' && ordersQuery.data && (
            <OrdersReport data={ordersQuery.data} />
          )}
          {activeTab === 'menu' && menuQuery.data && (
            <MenuReport data={menuQuery.data} />
          )}
          {activeTab === 'reviews' && reviewsQuery.data && (
            <ReviewsReport data={reviewsQuery.data} />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  // Don't render until client-mounted and dates initialized
  if (!isMounted || !startDate || !endDate) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-lime-100 border-t-lime-500 animate-spin" />
          <p className="text-gray-400 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 pb-32">
      <div className="max-w-[1600px] mx-auto">
        <ReportHeader
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          onExport={handleExport}
        />

        <div className="relative min-h-[600px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
