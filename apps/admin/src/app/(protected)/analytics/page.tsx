"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Calendar,
  Download,
  Filter,
} from "@repo/ui/icons";
import { motion } from "@repo/ui/motion";
import { StatusBadge } from "@repo/ui";
import { 
  MOCK_ORDERS, 
  MOCK_RESTAURANTS,
  MOCK_REVENUE_BREAKDOWN,
  MOCK_TOP_DRIVERS,
  MOCK_REVIEWS,
  MOCK_MENU_ITEMS,
} from "@/data/mock-data";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");

  // Calculate analytics metrics
  const totalRevenue = MOCK_ORDERS.reduce((sum, o) => sum + o.amount, 0);
  const avgOrderValue = totalRevenue / MOCK_ORDERS.length;
  const totalOrders = MOCK_ORDERS.length;
  const avgRating = (MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);

  // Revenue trend data (simulated)
  const revenueTrend = [
    { day: "T2", value: 2400 },
    { day: "T3", value: 2210 },
    { day: "T4", value: 2290 },
    { day: "T5", value: 2000 },
    { day: "T6", value: 2181 },
    { day: "T7", value: 2500 },
    { day: "CN", value: 2100 },
  ];

  // Top menu items by sales
  const topMenuItems = MOCK_MENU_ITEMS.slice(0, 5).map((item, index) => ({
    ...item,
    sales: Math.floor(Math.random() * 150) + 50,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Phân tích & Báo cáo</h1>
          <p className="text-gray-600">Xem chi tiết về hiệu suất kinh doanh của bạn</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 flex items-center justify-between"
        >
          <div className="flex gap-4">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm nay</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Bộ lọc
            </button>
          </div>
          <button className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
            <Download className="w-4 h-4" />
            Tải xuống báo cáo
          </button>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Tổng doanh thu</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">₫{(totalRevenue / 1000000).toFixed(1)}M</h3>
            <p className="text-sm text-green-600 font-medium">↑ 12.5% so với tháng trước</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Trung bình mỗi đơn</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">₫{(avgOrderValue / 1000).toFixed(0)}K</h3>
            <p className="text-sm text-blue-600 font-medium">↑ 5.2% so với tuần trước</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Tổng đơn hàng</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{totalOrders}</h3>
            <p className="text-sm text-green-600 font-medium">↑ 8.3% tăng trưởng</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Đánh giá trung bình</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{avgRating} ⭐</h3>
            <p className="text-sm text-purple-600 font-medium">Từ {MOCK_REVIEWS.length} đánh giá</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Xu hướng doanh thu</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-end justify-between gap-2 h-64">
              {revenueTrend.map((item, index) => (
                <motion.div
                  key={item.day}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.value / 3000) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="flex-1 bg-gradient-to-t from-[var(--primary)] to-[var(--primary)] rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer group relative"
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      ₫{(item.value / 1000).toFixed(0)}K
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
              {revenueTrend.map(item => (
                <div key={item.day} className="text-center">
                  <p className="text-xs text-gray-600">{item.day}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Tình trạng đơn hàng</h2>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {[
                { label: "Hoàn thành", count: 45, color: "bg-green-500", percentage: 56 },
                { label: "Đang giao", count: 18, color: "bg-blue-500", percentage: 22 },
                { label: "Chờ xác nhận", count: 12, color: "bg-yellow-500", percentage: 15 },
                { label: "Huỷ bỏ", count: 5, color: "bg-red-500", percentage: 7 },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl p-6 border border-gray-100"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6">Món ăn bán chạy nhất</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tên món</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Lượt bán</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topMenuItems.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{item.categoryId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">₫{(item.price / 1000).toFixed(0)}K</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[var(--primary)]">{item.sales}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-green-600">₫{((item.price * item.sales) / 1000000).toFixed(1)}M</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Restaurant Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 bg-white rounded-2xl p-6 border border-gray-100"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6">Hiệu suất nhà hàng</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {MOCK_REVENUE_BREAKDOWN.map((restaurant, index) => (
              <motion.div
                key={restaurant.restaurantId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200"
              >
                <p className="text-sm font-bold text-gray-900 mb-3 truncate">{restaurant.restaurantName}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Doanh thu</span>
                    <span className="font-bold text-green-600">₫{(restaurant.totalRevenue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Đơn hàng</span>
                    <span className="font-bold text-blue-600">{restaurant.orderCount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Trung bình</span>
                    <span className="font-bold text-purple-600">₫{(restaurant.avgOrderValue / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
