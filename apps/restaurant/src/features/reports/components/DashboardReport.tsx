'use client';

import { useMemo } from 'react';
import { motion } from '@repo/ui/motion';
import { FullReportDTO } from '@repo/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Star,
  ArrowUpRight,
  Crown,
  CheckCircle,
  XCircle,
  Percent,
  ThumbsUp,
} from 'lucide-react';

interface DashboardReportProps {
  data: FullReportDTO;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const formatCompact = (value: number) => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl">
        <p className="text-sm font-bold text-gray-500 mb-2">
          {new Date(label).toLocaleDateString('vi-VN')}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600 font-medium">{entry.name}:</span>
            <span className="font-bold text-gray-900">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const KPICard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  colorClass = "text-lime-600",
  bgClass = "bg-white",
  isHero = false,
}: any) => {
  const isVnd = typeof value === 'string' && (value.includes('₫') || value.includes('đ') || value.includes('VND'));
  const displayValue = isVnd ? value.replace(/[₫đVND]/g, '').trim() : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`
        relative overflow-hidden transition-all group
        md:p-6 md:rounded-2xl md:border md:border-gray-100 md:shadow-sm md:hover:shadow-lg md:h-[160px] md:flex md:flex-col md:justify-between ${bgClass}
        max-md:bg-gray-200/60 max-md:rounded-[32px] max-md:p-5 max-md:h-auto max-md:space-y-1.5 max-md:border-none max-md:shadow-none
      `}
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass} max-md:hidden`}>
        <Icon className="w-16 h-16" />
      </div>

      <span className="
        text-xs font-bold text-gray-400 uppercase tracking-wider z-10 block
        max-md:text-[10px] max-md:font-bold max-md:text-gray-500 max-md:uppercase max-md:tracking-widest max-md:mb-0.5
      ">
        {title}
      </span>

      <div className="z-10 flex flex-col justify-end max-md:space-y-1">
        <div className="flex items-baseline gap-0.5">
          <span className={`
            font-anton block
            md:text-3xl md:mb-1 ${isHero ? 'text-lime-400' : 'text-[#1A1A1A] md:text-gray-900'}
            max-md:text-2xl max-md:font-black max-md:tracking-tighter
          `}>
            {displayValue}
          </span>
          {isVnd && (
            <span className="
              hidden max-md:inline text-xs font-bold text-[#1A1A1A]
            ">
              đ
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {trend && (
            <span className="bg-lime-50 text-lime-600 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-2.5 h-2.5" /> {trend}
            </span>
          )}
          <span className="
            text-xs font-medium text-gray-500
            max-md:text-xs max-md:text-gray-400 max-md:font-medium max-md:tracking-tight
          ">
            {subtext}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default function DashboardReport({ data }: DashboardReportProps) {
  if (!data) return null;

  const revenueChart = Array.isArray(data?.revenueChart) ? data.revenueChart : [];

  const formattedChartData = useMemo(() =>
    revenueChart.map(item => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    })), [revenueChart]
  );

  const totalChartRevenue = useMemo(() =>
    revenueChart.reduce((sum, item) => sum + (item.netRevenue || 0), 0),
    [revenueChart]
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Executive Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Tổng Doanh Thu"
          value={formatCurrency(data.totalRevenue || 0)}
          subtext="Doanh thu gộp"
          icon={DollarSign}
          bgClass="bg-white hover:shadow-lg transition-shadow"
          colorClass="text-lime-600"
          trend="+12%"
        />
        <KPICard
          title="Doanh Thu Thực"
          value={formatCurrency(data?.netRevenue || 0)}
          subtext="Sau hoa hồng"
          icon={TrendingUp}
          bgClass="bg-white hover:shadow-lg transition-shadow"
          colorClass="text-blue-600"
          trend="+8%"
        />
        <KPICard
          title="Tổng Đơn Hàng"
          value={(data?.totalOrders || 0).toLocaleString()}
          subtext={`${data?.completedOrders || 0} hoàn thành`}
          icon={ShoppingBag}
          bgClass="bg-white hover:shadow-lg transition-shadow"
          colorClass="text-purple-600"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            relative overflow-hidden text-white border-none
            md:p-6 md:rounded-2xl md:bg-gradient-to-br md:from-[#1A1A1A] md:to-[#2A2A2A] md:shadow-xl md:h-[160px] md:flex md:flex-col md:justify-between
            max-md:bg-[#1A1A1A] max-md:rounded-[32px] max-md:p-5 max-md:h-auto max-md:space-y-1.5 max-md:shadow-none
          `}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 max-md:hidden">
            <Star className="w-16 h-16 text-lime-400" />
          </div>
          <span className="
            text-xs font-bold text-gray-400 uppercase tracking-wider block
            max-md:text-[10px] max-md:font-bold text-gray-400 max-md:uppercase max-md:tracking-widest max-md:mb-0.5
          ">
            Đánh Giá TB
          </span>
          <div className="flex flex-col justify-end max-md:space-y-1">
            <span className="
              font-anton text-lime-400 block
              md:text-3xl
              max-md:text-2xl max-md:font-black max-md:tracking-tighter
            ">
              {(data?.averageRating || 0).toFixed(1)}
            </span>
            <p className="
              text-xs text-gray-400 mt-1
              max-md:mt-0 max-md:text-xs max-md:text-gray-400 max-md:font-medium max-md:tracking-tight
            ">
              {data?.totalReviews || 0} đánh giá
            </p>
          </div>
        </motion.div>
      </div>

      {/* Top Performer Highlight */}
      <div className="
        relative overflow-hidden flex flex-col sm:flex-row items-center gap-4 md:gap-6
        md:bg-lime-50 md:rounded-[32px] md:border md:border-lime-200 md:p-8
        max-md:bg-lime-500/10 max-md:rounded-[32px] max-md:p-5 max-md:border max-md:border-lime-500/20 max-md:shadow-none
      ">
        <div className="absolute top-0 right-0 p-8 opacity-5 max-md:hidden">
          <Crown className="w-64 h-64 text-lime-900" />
        </div>
        <div className="
          w-16 h-16 rounded-2xl bg-lime-100 flex items-center justify-center text-lime-600 shrink-0 z-10
          max-md:w-8 max-md:h-8 max-md:rounded-xl max-md:bg-lime-500 max-md:text-white max-md:shadow-sm
        ">
          <Crown className="w-8 h-8 max-md:w-4 max-md:h-4" />
        </div>
        <div className="z-10 text-center sm:text-left max-md:text-left max-md:w-full">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 max-md:justify-start">
            <span className="
              px-2 py-0.5 rounded-full bg-lime-200 text-lime-800 text-[10px] font-bold uppercase tracking-wide
              max-md:bg-transparent max-md:text-lime-700 max-md:text-[10px] max-md:font-bold max-md:uppercase max-md:tracking-widest max-md:px-0 max-md:py-0
            ">
              Best Seller
            </span>
          </div>
          <h3 className="
            text-2xl font-bold text-gray-900 mb-1
            max-md:text-lg max-md:font-bold max-md:text-[#1A1A1A] max-md:tracking-tight max-md:mt-1
          ">
            {data.topPerformingDish}
          </h3>
          <p className="
            text-sm text-gray-600 font-medium max-w-xl
            max-md:text-[14px] max-md:font-medium max-md:text-gray-500 max-md:leading-relaxed max-md:tracking-tight max-md:mt-1
          ">
            Món ăn bán chạy nhất trong tháng này, chiếm tỷ lệ cao nhất trong tổng doanh thu của nhà hàng.
          </p>
        </div>
      </div>

      {/* Chart + Order Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="
          lg:col-span-2 bg-white shadow-sm h-[280px] sm:h-[400px]
          md:p-6 md:rounded-[32px] md:border md:border-gray-100
          max-md:rounded-[32px] max-md:p-5 max-md:shadow-[0_4px_25px_rgba(0,0,0,0.03)] max-md:border max-md:border-gray-100/50
        ">
          <h4 className="
            text-lg font-bold text-gray-900 mb-6
            max-md:text-[16px] max-md:font-bold max-md:text-gray-500 max-md:tracking-tight
          ">
            Xu Hướng Doanh Thu
          </h4>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={formattedChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val: number) => `${formatCompact(val)}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="netRevenue" name="Doanh thu thực" stroke="#84cc16" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="foodRevenue" name="Doanh thu món" stroke="#1A1A1A" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Card */}
        <div className="
          bg-white shadow-sm
          md:p-6 md:rounded-[32px] md:border md:border-gray-100
          max-md:rounded-[32px] max-md:p-5 max-md:shadow-[0_4px_25px_rgba(0,0,0,0.03)] max-md:border max-md:border-gray-100/50
        ">
          <h4 className="
            text-lg font-bold text-gray-900 mb-6
            max-md:text-[16px] max-md:font-bold max-md:text-gray-500 max-md:tracking-tight
          ">
            Tình Trạng Đơn Hàng
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="
                  w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center
                  max-md:bg-slate-50 max-md:border max-md:border-gray-100
                ">
                  <CheckCircle className="w-5 h-5 text-green-600 max-md:w-4.5 max-md:h-4.5" />
                </div>
                <div>
                  <p className="
                    text-sm font-bold text-gray-900
                    max-md:text-sm max-md:font-bold max-md:text-[#1A1A1A] max-md:tracking-tight
                  ">
                    Hoàn thành
                  </p>
                  <p className="
                    text-xs text-gray-500
                    max-md:text-xs max-md:text-gray-400 max-md:font-medium max-md:tracking-tight
                  ">
                    {data?.completedOrders || 0} đơn
                  </p>
                </div>
              </div>
              <span className="
                text-lg font-anton text-green-600
                max-md:text-lg max-md:font-black max-md:text-green-650 max-md:tracking-tighter
              ">
                {(100 - (data?.cancelRate || 0)).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="
                  w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center
                  max-md:bg-slate-50 max-md:border max-md:border-gray-100
                ">
                  <XCircle className="w-5 h-5 text-red-600 max-md:w-4.5 max-md:h-4.5" />
                </div>
                <div>
                  <p className="
                    text-sm font-bold text-gray-900
                    max-md:text-sm max-md:font-bold max-md:text-[#1A1A1A] max-md:tracking-tight
                  ">
                    Đã hủy
                  </p>
                  <p className="
                    text-xs text-gray-500
                    max-md:text-xs max-md:text-gray-400 max-md:font-medium max-md:tracking-tight
                  ">
                    {data?.cancelledOrders || 0} đơn
                  </p>
                </div>
              </div>
              <span className="
                text-lg font-anton text-red-600
                max-md:text-lg max-md:font-black max-md:text-red-650 max-md:tracking-tighter
              ">
                {(data?.cancelRate || 0).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden flex">
              <div
                className="h-full bg-lime-500 rounded-full transition-all duration-500"
                style={{ width: `${100 - (data?.cancelRate || 0)}%` }}
              />
              <div
                className="h-full bg-red-400"
                style={{ width: `${data?.cancelRate || 0}%` }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="
            mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4
            max-md:mt-4 max-md:pt-4 max-md:border-t max-md:border-gray-150
          ">
            <div className="text-center">
              <p className="
                text-xs font-bold text-gray-400 uppercase tracking-wider mb-1
                max-md:text-[10px] max-md:font-bold max-md:text-gray-400 max-md:uppercase max-md:tracking-widest max-md:mb-0.5
              ">
                Giá trị TB
              </p>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="
                  text-lg font-anton text-gray-900
                  max-md:text-xl max-md:font-black max-md:text-[#1A1A1A] max-md:tracking-tighter
                ">
                  {formatCompact(data.averageOrderValue).replace("đ", "").replace("₫", "").trim()}
                </span>
                {formatCompact(data.averageOrderValue).includes('đ') && (
                  <span className="
                    hidden max-md:inline text-xs font-bold text-[#1A1A1A]
                  ">
                    đ
                  </span>
                )}
              </div>
            </div>
            <div className="text-center">
              <p className="
                text-xs font-bold text-gray-400 uppercase tracking-wider mb-1
                max-md:text-[10px] max-md:font-bold max-md:text-gray-400 max-md:uppercase max-md:tracking-widest max-md:mb-0.5
              ">
                Đánh giá
              </p>
              <p className="
                text-lg font-anton text-gray-900
                max-md:text-xl max-md:font-black max-md:text-[#1A1A1A] max-md:tracking-tighter
              ">
                {data.totalReviews}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
