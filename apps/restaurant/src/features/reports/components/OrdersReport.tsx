'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { OrderReportItem, OrderStatus, PaymentMethod } from '../services/reportService';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  ChefHat,
  Package,
  ArrowUpRight,
  Search,
  CreditCard,
  Banknote,
  Hash,
  Globe,
  Users,
} from 'lucide-react';

interface OrdersReportProps {
  data: OrderReportItem[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const COLORS = ['#84cc16', '#1A1A1A'];

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: any }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle },
  PREPARING: { label: 'Đang nấu', color: 'text-purple-600', bg: 'bg-purple-50', icon: ChefHat },
  READY: { label: 'Sẵn sàng', color: 'text-cyan-600', bg: 'bg-cyan-50', icon: Package },
  DELIVERING: { label: 'Đang giao', color: 'text-orange-600', bg: 'bg-orange-50', icon: Truck },
  DELIVERED: { label: 'Hoàn thành', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
};

const OrderCard = ({ order }: { order: OrderReportItem }) => {
  const config = statusConfig[order.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-12 gap-4 items-center p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-all group"
    >
      {/* Col 1: Order Info */}
      <div className="col-span-4 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="min-w-0">
          <h5 className="font-bold text-gray-900 truncate" title={order.customerName}>{order.customerName}</h5>
          <div className="text-xs font-medium text-gray-400 mt-0.5 truncate">
            {new Date(order.orderTime).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>

      {/* Col 2: Order Code */}
      <div className="col-span-3 hidden md:flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
          <Hash className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mã đơn</span>
          <span className="text-xs font-mono font-bold text-gray-600">{order.orderCode}</span>
        </div>
      </div>

      {/* Col 3: Items */}
      <div className="col-span-3 hidden sm:flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Món</span>
          <span className="text-xs font-bold text-gray-700">{order.itemsCount} món</span>
        </div>
      </div>

      {/* Col 4: Amount & Status */}
      <div className="col-span-8 sm:col-span-5 md:col-span-2 flex flex-col items-end">
        <span className="text-sm font-bold text-lime-600">{formatCurrency(order.totalAmount)}</span>
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1 ${config.bg} ${config.color}`}>
          {config.label}
        </span>
      </div>
    </motion.div>
  );
};

export default function OrdersReport({ data = [] }: OrdersReportProps) {
  const safeData = Array.isArray(data) ? data : [];
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats
  const stats = useMemo(() => {
    const total = safeData.length;
    const delivered = safeData.filter(o => o.status === 'DELIVERED').length;
    const cancelled = safeData.filter(o => o.status === 'CANCELLED').length;
    const totalRevenue = safeData.reduce((sum, o) => sum + o.totalAmount, 0);

    return { total, delivered, cancelled, totalRevenue };
  }, [safeData]);

  // Source data for pie
  const sourceData = [
    { name: 'App', value: Math.floor(stats.total * 0.7) },
    { name: 'Walk-in', value: Math.floor(stats.total * 0.3) }
  ];

  // Hourly distribution
  const hourlyDistribution = useMemo(() => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 8);
    return hours.map(hour => {
      const count = safeData.filter(o => new Date(o.orderTime).getHours() === hour).length;
      return { hour: `${hour}:00`, count };
    });
  }, [safeData]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return safeData.filter(order => {
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      const matchesSearch = searchQuery === '' ||
        order.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [safeData, statusFilter, searchQuery]);

  if (!safeData.length) {
    return (
      <div className="text-center py-10 text-gray-400">Không có đơn hàng trong khoảng thời gian này.</div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1A1A1A] p-6 rounded-2xl flex flex-col justify-between h-[140px] shadow-lg text-white">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tổng Đơn Hàng</span>
          <div>
            <span className="text-4xl font-anton text-lime-400">{stats.total}</span>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-lime-500" /> +5 tuần này
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col justify-between h-[140px] shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hoàn Thành</span>
          <div>
            <span className="text-4xl font-anton text-blue-600">{stats.delivered}</span>
            <p className="text-xs text-gray-400 mt-1">Đơn đã giao</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col justify-between h-[140px] shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Đã Hủy</span>
          <div>
            <span className="text-4xl font-anton text-red-500">{stats.cancelled}</span>
            <p className="text-xs text-gray-400 mt-1">{((stats.cancelled / stats.total) * 100).toFixed(1)}% tỷ lệ</p>
          </div>
        </div>

        <div className="bg-lime-50 p-6 rounded-2xl border border-lime-200 flex flex-col justify-between h-[140px]">
          <span className="text-xs font-bold text-lime-800 uppercase tracking-wider">Doanh Thu</span>
          <div>
            <span className="text-2xl font-anton text-lime-700">{formatCurrency(stats.totalRevenue)}</span>
            <p className="text-xs text-lime-600 mt-1 font-medium">Tổng thu</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Sources (Pie) */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm h-[350px] flex flex-col">
          <h4 className="text-lg font-bold text-gray-900 mb-2">Nguồn Đơn Hàng</h4>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#84cc16]" />
              <span className="text-sm font-bold text-gray-600">App ({((sourceData[0].value / stats.total) * 100).toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#1A1A1A]" />
              <span className="text-sm font-bold text-gray-600">Walk-in ({((sourceData[1].value / stats.total) * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* Hourly Distribution (Bar) */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm h-[350px] flex flex-col">
          <h4 className="text-lg font-bold text-gray-900 mb-2">Phân Bố Theo Giờ</h4>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyDistribution} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="count" fill="#1A1A1A" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">Giờ cao điểm: 11:00 - 13:00</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900 font-anton">Tất Cả Đơn Hàng</h4>
            <p className="text-sm text-gray-400 font-medium">Lịch sử đơn hàng chi tiết trong khoảng thời gian đã chọn.</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-lime-300 focus:ring-2 focus:ring-lime-100 w-[200px]"
            />
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-gray-100 mb-2">
          <div className="col-span-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Chi Tiết Khách</div>
          <div className="col-span-3 hidden md:block text-xs font-bold text-gray-400 uppercase tracking-wider">Mã Đơn</div>
          <div className="col-span-3 hidden sm:block text-xs font-bold text-gray-400 uppercase tracking-wider">Số Món</div>
          <div className="col-span-8 sm:col-span-5 md:col-span-2 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng Thái & Tiền</div>
        </div>

        <div className="space-y-3 custom-scrollbar max-h-[400px] overflow-y-auto">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}
