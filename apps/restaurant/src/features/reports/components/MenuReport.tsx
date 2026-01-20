'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { MenuSummaryDto, MenuAnalyticsItem, CategoryAnalyticsItem } from '../services/reportService';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  UtensilsCrossed,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  Crown,
  CheckCircle,
  Building2,
} from 'lucide-react';

interface MenuReportProps {
  data: MenuSummaryDto;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const formatCompact = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

const CATEGORY_COLORS = ['#84cc16', '#1A1A1A', '#3b82f6', '#8b5cf6', '#ec4899'];

const TrendBadge = ({ trend, percent }: { trend: 'up' | 'down' | 'stable'; percent: number }) => {
  if (trend === 'up') {
    return (
      <span className="flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-600">
        <TrendingUp className="w-3 h-3" /> +{percent.toFixed(1)}%
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span className="flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-600">
        <TrendingDown className="w-3 h-3" /> {percent.toFixed(1)}%
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
      <Minus className="w-3 h-3" /> {percent.toFixed(1)}%
    </span>
  );
};

const DishCard = ({ dish, rank }: { dish: MenuAnalyticsItem; rank?: number }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="p-4 rounded-2xl border-2 flex flex-col gap-2 bg-white border-gray-100 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {rank && rank <= 3 && (
            <span className={`text-lg ${rank === 1 ? '' : rank === 2 ? '' : ''}`}>
              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
            </span>
          )}
          <span className="text-lg font-semibold text-gray-900">{dish.dishName}</span>
        </div>
        <TrendBadge trend={dish.trend} percent={dish.trendPercent} />
      </div>
      <div className="flex flex-col gap-1 mt-1">
        <span className="text-xs font-bold text-gray-500 uppercase truncate" title={dish.categoryName}>{dish.categoryName}</span>
        <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 mt-2 pt-2 border-t border-black/5">
          <span className="flex items-center gap-1">
            <ShoppingCart className="w-3 h-3" /> {dish.totalOrdered} đã bán
          </span>
          <span className="font-bold text-lime-600">{formatCompact(dish.totalRevenue)}</span>
        </div>
      </div>
    </motion.div>
  );
};

const SummaryCard = ({
  title,
  count,
  icon: Icon,
  colorClass,
  bgClass,
  borderClass
}: {
  title: string;
  count: number;
  icon: any;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}) => {
  return (
    <div className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left w-full h-full flex flex-col justify-between ${bgClass} ${borderClass}`}>
      <div className="flex justify-between items-start w-full">
        <span className={`text-xs font-bold uppercase tracking-wider ${colorClass}`}>
          {title}
        </span>
        <div className="p-2 rounded-xl bg-white/50 transition-colors">
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
      </div>
      <div className="mt-2">
        <span className="text-3xl font-anton text-gray-900">{count}</span>
      </div>
    </div>
  );
};

export default function MenuReport({ data }: MenuReportProps) {
  const [viewMode, setViewMode] = useState<'top' | 'low'>('top');

  if (!data) {
    return (
      <div className="p-12 text-center text-gray-400 font-medium bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg">Không có dữ liệu phân tích thực đơn.</p>
      </div>
    );
  }

  const totalMenuRevenue = data.categoryBreakdown.reduce((sum, c) => sum + c.totalRevenue, 0);

  // Prepare pie chart data
  const pieData = data.categoryBreakdown.map((cat, i) => ({
    name: cat.categoryName,
    value: cat.totalRevenue,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <SummaryCard
          title="Tổng Món"
          count={data.totalDishes}
          icon={Building2}
          bgClass="bg-gray-100"
          borderClass="border-gray-300"
          colorClass="text-gray-700"
        />
        <SummaryCard
          title="Đang Bán"
          count={data.activeDishes}
          icon={CheckCircle}
          bgClass="bg-green-50"
          borderClass="border-green-200"
          colorClass="text-green-700"
        />
        <SummaryCard
          title="Hết Hàng"
          count={data.outOfStockDishes}
          icon={AlertTriangle}
          bgClass="bg-red-50"
          borderClass="border-red-200"
          colorClass="text-red-700"
        />
        <div className="col-span-2 bg-[#1A1A1A] p-6 rounded-2xl text-white flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tổng Doanh Thu</span>
          <div className="mt-2">
            <span className="text-3xl font-anton text-lime-400">{formatCompact(totalMenuRevenue)}</span>
            <p className="text-xs text-gray-400 mt-1">Từ thực đơn</p>
          </div>
        </div>
      </div>

      {/* Category Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm">
          <h4 className="text-lg font-bold text-gray-900 mb-6">Phân Bố Danh Mục</h4>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Revenue List */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm">
          <h4 className="text-lg font-bold text-gray-900 mb-6">Doanh Thu Theo Danh Mục</h4>
          <div className="space-y-4">
            {data.categoryBreakdown.map((category, i) => (
              <div key={category.categoryId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-700">{category.categoryName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">{category.totalDishes} món</span>
                  <span className="text-sm font-bold text-gray-900">{formatCompact(category.totalRevenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dishes Section */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-lg shadow-gray-100/50 min-h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center text-lime-600">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {viewMode === 'top' ? 'Món Bán Chạy' : 'Món Cần Cải Thiện'}
              </h4>
              <p className="text-xs text-gray-400">
                {viewMode === 'top' ? 'Top 5 món có doanh số cao nhất' : 'Các món cần xem xét'}
              </p>
            </div>
          </div>

          {/* Toggle */}
          <div className="bg-gray-100 p-1 rounded-xl inline-flex">
            <button
              onClick={() => setViewMode('top')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'top'
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              🔥 Bán chạy
            </button>
            <button
              onClick={() => setViewMode('low')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'low'
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              ⚠️ Cần cải thiện
            </button>
          </div>
        </div>

        {/* Dishes Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {(viewMode === 'top' ? data.topSellingDishes : data.lowPerformingDishes).map((dish, index) => (
              <DishCard key={dish.dishId} dish={dish} rank={viewMode === 'top' ? index + 1 : undefined} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
