'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { Loader2 } from 'lucide-react';
import { useNotification } from '@repo/ui';

import ReportHeader, { ReportTab } from '@/features/reports/components/ReportHeader';
import DashboardReport from '@/features/reports/components/DashboardReport';
import RevenueReport from '@/features/reports/components/RevenueReport';
import OrdersReport from '@/features/reports/components/OrdersReport';
import MenuReport from '@/features/reports/components/MenuReport';
import ReviewsReport from '@/features/reports/components/ReviewsReport';
import {
  reportService,
  RevenueReportItem,
  OrderReportItem,
  MenuSummaryDto,
  ReviewSummaryDto,
  FullReportDto,
} from '@/features/reports/services/reportService';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('dashboard');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  const { showNotification } = useNotification();
  const restaurantId = 'restaurant-001'; // Mock restaurant ID

  // Initialize dates on client mount to avoid hydration mismatch
  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(firstDayOfMonth);
    setEndDate(lastDayOfMonth);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !startDate || !endDate) return;
    // Reset data immediately when tab or filters change
    setReportData(null);
    fetchReportData();
  }, [activeTab, startDate, endDate, isMounted]);

  const fetchReportData = async () => {
    if (!startDate || !endDate) return;

    setIsLoading(true);
    try {
      let data;
      switch (activeTab) {
        case 'revenue':
          data = await reportService.getRevenueReport(restaurantId, startDate, endDate);
          break;
        case 'orders':
          data = await reportService.getOrdersReport(restaurantId, startDate, endDate);
          break;
        case 'menu':
          data = await reportService.getMenuAnalytics(restaurantId);
          break;
        case 'reviews':
          data = await reportService.getReviewSummary(restaurantId);
          break;
        case 'dashboard':
        default:
          data = await reportService.getFullReport(restaurantId, startDate, endDate);
          break;
      }
      setReportData(data);
    } catch (error) {
      showNotification({ message: 'Không thể tải dữ liệu báo cáo', type: 'error' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (type: 'excel' | 'pdf') => {
    showNotification({
      message: `Đang xuất báo cáo ${activeTab === 'dashboard' ? 'tổng quan' : activeTab} sang ${type.toUpperCase()}...`,
      type: 'success',
    });
    // TODO: Integrate with actual export API
  };

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
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

    if (!reportData) return null;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && <DashboardReport data={reportData as FullReportDto} />}
          {activeTab === 'revenue' && <RevenueReport data={reportData as RevenueReportItem[]} />}
          {activeTab === 'orders' && <OrdersReport data={reportData as OrderReportItem[]} />}
          {activeTab === 'menu' && <MenuReport data={reportData as MenuSummaryDto} />}
          {activeTab === 'reviews' && <ReviewsReport data={reportData as ReviewSummaryDto} />}
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
