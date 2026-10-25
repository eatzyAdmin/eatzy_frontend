'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { MenuSummaryDTO, MenuAnalyticsItemDTO } from '@repo/types';
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
  data: MenuSummaryDTO;
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

const DishCard = ({ dish, rank }: { dish: MenuAnalyticsItemDTO; rank?: number }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`
        p-4 rounded-2xl border-2 flex flex-col gap-2 bg-white border-gray-100 hover:shadow-lg transition-shadow
        max-md:bg-gray-200/40 max-md:rounded-[24px] max-md:border-none max-md:p-4 max-md:gap-2
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {rank && rank <= 3 && (
            <>
              <span className={`text-lg max-md:hidden ${rank === 1 ? '' : rank === 2 ? '' : ''}`}>
                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
              </span>
              <span className="hidden max-md:inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1A1A1A] text-white text-[10px] font-bold tracking-tight shrink-0">
                #{rank}
              </span>
            </>
          )}
          <span className="text-lg font-semibold text-gray-900 max-md:text-sm max-md:font-bold max-md:text-[#1A1A1A] max-md:tracking-tight">{dish.dishName}</span>
        </div>
        <TrendBadge trend={dish.trend as 'up' | 'down' | 'stable'} percent={dish.trendPercent} />
      </div>
      <div className="flex flex-col gap-1 mt-1">
        <span className="text-xs font-bold text-gray-400 uppercase truncate max-md:text-[10px] max-md:font-semibold max-md:text-gray-400 max-md:tracking-tight" title={dish.categoryName}>{dish.categoryName}</span>
        <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 mt-2 pt-2 border-t border-black/5 max-md:mt-1 max-md:pt-1">
          <span className="flex items-center gap-1 max-md:text-[11px] max-md:font-semibold max-md:text-gray-500">
            <ShoppingCart className="w-3 h-3" /> {dish.totalOrdered} đã bán
          </span>
          <span className="font-bold text-lime-600 max-md:text-[11px] max-md:font-bold max-md:text-lime-650">{formatCompact(dish.totalRevenue)}</span>
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
    <div className={`
      transition-all duration-200 text-left w-full h-full flex flex-col justify-between
      md:p-4 md:rounded-2xl md:border-2 ${bgClass} ${borderClass}
      max-md:bg-gray-200/60 max-md:rounded-[32px] max-md:p-5 max-md:h-auto max-md:space-y-1.5 max-md:border-none max-md:shadow-none
    `}>
      <div className="flex justify-between items-start w-full">
        <span className={`
          text-xs font-bold uppercase tracking-wider ${colorClass} block
          max-md:text-[10px] max-md:font-bold max-md:text-gray-500 max-md:uppercase max-md:tracking-widest max-md:mb-0.5 max-md:text-left
        `}>
          {title}
        </span>
        <div className="p-2 rounded-xl bg-white/50 transition-colors max-md:hidden">
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
      </div>
      <div className="mt-2 max-md:mt-0">
        <span className="
          text-3xl font-anton text-gray-900 block
          max-md:text-2xl max-md:font-black max-md:text-[#1A1A1A] max-md:tracking-tighter
        ">
          {count}
        </span>
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

  const categoryBreakdown = Array.isArray(data?.categoryBreakdown) ? data.categoryBreakdown : [];
  const totalMenuRevenue = categoryBreakdown.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);

  // Prepare pie chart data
  const pieData = categoryBreakdown.map((cat, i) => ({
    name: cat.categoryName,
    value: cat.totalRevenue || 0,
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
        <div className="
          col-span-2 bg-[#1A1A1A] text-white flex flex-col justify-between
          md:p-6 md:rounded-2xl
          max-md:rounded-[32px] max-md:p-5 max-md:h-auto max-md:space-y-1.5
        ">
          <span className="
            text-xs font-bold text-gray-400 uppercase tracking-wider block
            max-md:text-[10px] max-md:font-bold max-md:text-gray-400 max-md:uppercase max-md:tracking-widest max-md:mb-0.5
          ">
            Tổng Doanh Thu
          </span>
          <div className="mt-2 max-md:mt-0 flex flex-col justify-end">
            <span className="
              text-3xl font-anton text-lime-400 block
              max-md:text-2xl max-md:font-black max-md:tracking-tighter
            ">
              {formatCompact(totalMenuRevenue)}
            </span>
            <p className="
              text-xs text-gray-400 mt-1
              max-md:mt-0 max-md:text-xs max-md:text-gray-400 max-md:font-medium max-md:tracking-tight
            ">
              Từ thực đơn
            </p>
          </div>
        </div>
      </div>

      {/* Category Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="
          bg-white shadow-sm
          md:p-6 md:rounded-[32px] md:border md:border-gray-200
          max-md:rounded-[32px] max-md:p-5 max-md:shadow-[0_4px_25px_rgba(0,0,0,0.03)] max-md:border max-md:border-gray-100/50
        ">
          <h4 className="
            text-lg font-bold text-gray-900 mb-6
            max-md:text-[16px] max-md:font-bold max-md:text-gray-500 max-md:tracking-tight
          ">
            Phân Bố Danh Mục
          </h4>
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
        <div className="
          bg-white shadow-sm
          md:p-6 md:rounded-[32px] md:border md:border-gray-200
          max-md:rounded-[32px] max-md:p-5 max-md:shadow-[0_4px_25px_rgba(0,0,0,0.03)] max-md:border max-md:border-gray-100/50
        ">
          <h4 className="
            text-lg font-bold text-gray-900 mb-6
            max-md:text-[16px] max-md:font-bold max-md:text-gray-500 max-md:tracking-tight
          ">
            Doanh Thu Theo Danh Mục
          </h4>
          <div className="space-y-4">
            {data.categoryBreakdown.map((category, i) => (
              <div key={category.categoryId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-700 max-md:text-sm max-md:font-semibold max-md:text-[#1A1A1A] max-md:tracking-tight">{category.categoryName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 max-md:text-xs max-md:font-medium max-md:text-gray-400 max-md:tracking-tight">{category.totalDishes} món</span>
                  <span className="text-sm font-bold text-gray-900 max-md:text-sm max-md:font-bold max-md:text-lime-650">{formatCompact(category.totalRevenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dishes Section */}
      <div className="
        bg-white shadow-lg shadow-gray-100/50 min-h-[400px]
        md:p-6 md:rounded-[32px] md:border md:border-gray-200
        max-md:rounded-[32px] max-md:p-5 max-md:shadow-[0_4px_25px_rgba(0,0,0,0.03)] max-md:border max-md:border-gray-100/50
      ">
        <div className="
          flex items-center justify-between mb-6
          max-md:flex-col max-md:items-start max-md:gap-4
        ">
          <div className="flex items-center gap-3">
            <div className="
              w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center text-lime-600
              max-md:w-8 max-md:h-8 max-md:rounded-xl max-md:bg-lime-500 max-md:text-white max-md:shadow-sm
            ">
              <Crown className="w-6 h-6 max-md:w-4 max-md:h-4" />
            </div>
            <div>
              <h4 className="
                text-lg font-bold text-gray-900 flex items-center gap-2
                max-md:text-[16px] max-md:font-bold max-md:text-gray-500 max-md:tracking-tight
              ">
                {viewMode === 'top' ? 'Món Bán Chạy' : 'Món Cần Cải Thiện'}
              </h4>
              <p className="
                text-xs text-gray-400
                max-md:text-xs max-md:text-gray-400 max-md:font-medium max-md:tracking-tight max-md:mt-0.5
              ">
                {viewMode === 'top' ? 'Top 5 món có doanh số cao nhất' : 'Các món cần xem xét'}
              </p>
            </div>
          </div>

          {/* Toggle */}
          <div className="bg-gray-100 p-1 rounded-2xl inline-flex max-md:w-full">
            <button
              onClick={() => setViewMode('top')}
              className={`
                px-4 py-2 rounded-xl text-sm font-bold transition-all max-md:flex-1 max-md:flex max-md:items-center max-md:justify-center max-md:gap-1.5
                ${viewMode === 'top'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-550 hover:text-gray-700'
                }
              `}
            >
              <span className="max-md:hidden">🔥 Bán chạy</span>
              <span className="hidden max-md:flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-lime-600" /> Bán chạy
              </span>
            </button>
            <button
              onClick={() => setViewMode('low')}
              className={`
                px-4 py-2 rounded-lg text-sm font-bold transition-all max-md:flex-1 max-md:flex max-md:items-center max-md:justify-center max-md:gap-1.5
                ${viewMode === 'low'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-550 hover:text-gray-700'
                }
              `}
            >
              <span className="max-md:hidden">⚠️ Cần cải thiện</span>
              <span className="hidden max-md:flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Cần cải thiện
              </span>
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
            className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
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
