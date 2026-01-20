'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  Download,
  Calendar,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  UtensilsCrossed,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export type ReportTab = 'dashboard' | 'revenue' | 'orders' | 'menu' | 'reviews';

interface ReportHeaderProps {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
  onExport: (type: 'excel' | 'pdf') => void;
}

const MonthPicker = ({
  currentDate,
  onClose,
  onSelect
}: {
  currentDate: Date;
  onClose: () => void;
  onSelect: (start: Date, end: Date) => void;
}) => {
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const start = new Date(viewYear, monthIndex, 1);
    const end = new Date(viewYear, monthIndex + 1, 0);
    onSelect(start, end);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="bg-white rounded-3xl p-5 border-4 border-gray-100 shadow-xl w-[320px]"
    >
      <div className="flex items-center justify-between mb-6 relative">
        <button
          onClick={() => setViewYear(prev => prev - 1)}
          className="w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all text-gray-500"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-bold font-anton text-gray-800 text-xl tracking-wide select-none">
          {viewYear}
        </span>

        <button
          onClick={() => setViewYear(prev => prev + 1)}
          className="w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all text-gray-500"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {monthNames.map((month, index) => {
          const isSelected = currentDate.getMonth() === index && currentDate.getFullYear() === viewYear;
          const isCurrentMonth = new Date().getMonth() === index && new Date().getFullYear() === viewYear;

          return (
            <motion.button
              key={month}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMonthSelect(index)}
              className={`
                py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all
                ${isSelected
                  ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/30'
                  : isCurrentMonth
                    ? 'bg-lime-50 text-lime-700 border border-lime-200'
                    : 'bg-white border border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              {month}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default function ReportHeader({
  activeTab,
  onTabChange,
  startDate,
  endDate,
  onDateChange,
  onExport
}: ReportHeaderProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabs = [
    { id: 'dashboard' as ReportTab, label: 'Tổng quan', icon: BarChart3 },
    { id: 'revenue' as ReportTab, label: 'Doanh thu', icon: TrendingUp },
    { id: 'orders' as ReportTab, label: 'Đơn hàng', icon: ShoppingBag },
    { id: 'menu' as ReportTab, label: 'Thực đơn', icon: UtensilsCrossed },
    { id: 'reviews' as ReportTab, label: 'Đánh giá', icon: Star },
  ];

  return (
    <div className="mb-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-1"
          >
            <span className="px-2 py-0.5 rounded-md bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider">
              Restaurant Analytics
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-anton text-gray-900 uppercase tracking-tight">
            Reports Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Picker Trigger */}
          <div className="relative" ref={datePickerRef}>
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm hover:border-lime-200 hover:shadow-md transition-all group"
            >
              <div className="p-1.5 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-lime-50 group-hover:text-lime-600 transition-colors">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start min-w-[120px]">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-lime-600">Thời gian</span>
                <span className="text-sm font-bold text-gray-900 leading-tight">
                  {format(startDate, 'MMMM yyyy', { locale: vi })}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDatePickerOpen && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <MonthPicker
                    currentDate={startDate}
                    onClose={() => setIsDatePickerOpen(false)}
                    onSelect={onDateChange}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Export Dropdown */}
          <div className="relative" ref={exportRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-2 bg-[#1A1A1A] text-white pl-4 pr-3 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-black/10 hover:shadow-xl transition-all"
            >
              <span>Xuất Báo Cáo</span>
              <div className="w-px h-4 bg-white/20 mx-1"></div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {isExportOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-40 p-1"
                >
                  <button
                    onClick={() => { onExport('excel'); setIsExportOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-gray-900">Excel</span>
                      <span className="block text-[10px] font-medium text-gray-400">Bảng tính .xlsx</span>
                    </div>
                  </button>
                  <button
                    onClick={() => { onExport('pdf'); setIsExportOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-gray-900">PDF</span>
                      <span className="block text-[10px] font-medium text-gray-400">Tài liệu .pdf</span>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-gray-100/50 p-1.5 rounded-2xl inline-flex flex-wrap gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all outline-none md:flex-1 md:min-w-[120px]"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-white shadow-sm border border-gray-100 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <span className={`relative z-10 flex items-center justify-center gap-2 whitespace-nowrap ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-lime-600' : ''}`} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
