'use client';

import { useMemo } from 'react';
import { motion } from '@repo/ui/motion';
import { FullReportDto } from '../services/reportService';
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
  data: FullReportDto;
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
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className={`p-6 rounded-2xl border border-gray-100 ${bgClass} flex flex-col justify-between h-[160px] relative overflow-hidden group transition-all shadow-sm hover:shadow-lg`}
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
      <Icon className="w-16 h-16" />
    </div>

    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider z-10">{title}</span>

    <div className="z-10">
      <span className={`text-3xl font-anton block mb-1 ${isHero ? 'text-lime-400' : 'text-gray-900'}`}>
        {value}
      </span>
      <div className="flex items-center gap-1.5">
        {trend && (
          <span className="bg-lime-50 text-lime-600 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> {trend}
          </span>
        )}
        <span className="text-xs font-medium text-gray-500">{subtext}</span>
      </div>
    </div>
  </motion.div>
);

export default function DashboardReport({ data }: DashboardReportProps) {
  if (!data) return null;

  const formattedChartData = useMemo(() =>
    data.revenueChart.map(item => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    })), [data.revenueChart]
  );

  const totalChartRevenue = useMemo(() =>
    data.revenueChart.reduce((sum, item) => sum + item.netRevenue, 0),
    [data.revenueChart]
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Executive Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Tổng Doanh Thu"
          value={formatCurrency(data.totalRevenue)}
          subtext="Doanh thu gộp"
          icon={DollarSign}
          bgClass="bg-white hover:shadow-lg transition-shadow"
          colorClass="text-lime-600"
          trend="+12%"
        />
        <KPICard
          title="Doanh Thu Thực"
          value={formatCurrency(data.netRevenue)}
          subtext="Sau hoa hồng"
          icon={TrendingUp}
          bgClass="bg-white hover:shadow-lg transition-shadow"
          colorClass="text-blue-600"
          trend="+8%"
        />
        <KPICard
          title="Tổng Đơn Hàng"
          value={data.totalOrders.toLocaleString()}
          subtext={`${data.completedOrders} hoàn thành`}
          icon={ShoppingBag}
          bgClass="bg-white hover:shadow-lg transition-shadow"
          colorClass="text-purple-600"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white border-none shadow-xl flex flex-col justify-between h-[160px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star className="w-16 h-16 text-lime-400" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Đánh Giá TB</span>
          <div>
            <span className="text-3xl font-anton text-lime-400">{data.averageRating.toFixed(1)}</span>
            <p className="text-xs text-gray-400 mt-1">{data.totalReviews} đánh giá</p>
          </div>
        </motion.div>
      </div>

      {/* Top Performer Highlight */}
      <div className="bg-lime-50 rounded-[32px] border border-lime-200 p-8 flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Crown className="w-64 h-64 text-lime-900" />
        </div>
        <div className="w-16 h-16 rounded-2xl bg-lime-100 flex items-center justify-center text-lime-600 shrink-0 z-10">
          <Crown className="w-8 h-8" />
        </div>
        <div className="z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-lime-200 text-lime-800 text-[10px] font-bold uppercase tracking-wide">Best Seller</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.topPerformingDish}</h3>
          <p className="text-sm text-gray-600 font-medium max-w-xl">
            Món ăn bán chạy nhất trong tháng này, chiếm tỷ lệ cao nhất trong tổng doanh thu của nhà hàng.
          </p>
        </div>
      </div>

      {/* Chart + Order Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm h-[400px]">
          <h4 className="text-lg font-bold text-gray-900 mb-6">Xu Hướng Doanh Thu</h4>
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
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
          <h4 className="text-lg font-bold text-gray-900 mb-6">Tình Trạng Đơn Hàng</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Hoàn thành</p>
                  <p className="text-xs text-gray-500">{data.completedOrders} đơn</p>
                </div>
              </div>
              <span className="text-lg font-anton text-green-600">
                {(100 - data.cancelRate).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Đã hủy</p>
                  <p className="text-xs text-gray-500">{data.cancelledOrders} đơn</p>
                </div>
              </div>
              <span className="text-lg font-anton text-red-600">
                {data.cancelRate.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden flex">
              <div
                className="h-full bg-lime-500 rounded-full transition-all duration-500"
                style={{ width: `${100 - data.cancelRate}%` }}
              />
              <div
                className="h-full bg-red-400"
                style={{ width: `${data.cancelRate}%` }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Giá trị TB</p>
              <p className="text-lg font-anton text-gray-900">{formatCompact(data.averageOrderValue)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Đánh giá</p>
              <p className="text-lg font-anton text-gray-900">{data.totalReviews}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
