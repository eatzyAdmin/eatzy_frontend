"use client";

import { useState } from "react";
import { 
  Users, 
  Store, 
  Truck, 
  ShoppingBag, 
  TrendingUp,
  Calendar,
  DollarSign,
  Activity
} from "@repo/ui/icons";
import { ModernHeader, StatusBadge } from "@repo/ui";
import { motion } from "@repo/ui/motion";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          <div className="flex items-center gap-1">
            <TrendingUp 
              className={`w-4 h-4 ${trend === "up" ? "text-green-500" : "text-red-500 rotate-180"}`} 
            />
            <span className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {change}
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

interface RecentOrder {
  id: string;
  customer: string;
  restaurant: string;
  amount: number;
  status: "pending" | "confirmed" | "preparing" | "delivering" | "completed" | "cancelled";
  time: string;
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today");

  // Mock data
  const stats = [
    {
      title: "Total Revenue",
      value: "₫45.2M",
      change: "+12.5%",
      icon: <DollarSign className="w-6 h-6" />,
      trend: "up" as const,
    },
    {
      title: "Active Orders",
      value: "142",
      change: "+8.2%",
      icon: <ShoppingBag className="w-6 h-6" />,
      trend: "up" as const,
    },
    {
      title: "Total Customers",
      value: "8,234",
      change: "+5.3%",
      icon: <Users className="w-6 h-6" />,
      trend: "up" as const,
    },
    {
      title: "Active Drivers",
      value: "56",
      change: "-2.1%",
      icon: <Truck className="w-6 h-6" />,
      trend: "down" as const,
    },
    {
      title: "Partner Restaurants",
      value: "342",
      change: "+15.8%",
      icon: <Store className="w-6 h-6" />,
      trend: "up" as const,
    },
    {
      title: "Avg. Order Value",
      value: "₫318K",
      change: "+3.7%",
      icon: <Activity className="w-6 h-6" />,
      trend: "up" as const,
    },
  ];

  const recentOrders: RecentOrder[] = [
    {
      id: "ORD-2024-001",
      customer: "Nguyễn Văn A",
      restaurant: "Phở Hà Nội",
      amount: 285000,
      status: "delivering",
      time: "5 mins ago",
    },
    {
      id: "ORD-2024-002",
      customer: "Trần Thị B",
      restaurant: "Bún Chả Hương Liên",
      amount: 195000,
      status: "preparing",
      time: "12 mins ago",
    },
    {
      id: "ORD-2024-003",
      customer: "Lê Văn C",
      restaurant: "Cơm Tấm Sài Gòn",
      amount: 150000,
      status: "completed",
      time: "25 mins ago",
    },
    {
      id: "ORD-2024-004",
      customer: "Phạm Thị D",
      restaurant: "Lẩu Thái Tomyum",
      amount: 520000,
      status: "confirmed",
      time: "32 mins ago",
    },
    {
      id: "ORD-2024-005",
      customer: "Hoàng Văn E",
      restaurant: "Pizza Hut",
      amount: 340000,
      status: "pending",
      time: "45 mins ago",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-full">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống Eatzy</p>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Time Range Selector */}
        <div className="mb-8 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-600" />
          <div className="flex gap-2">
            {(["today", "week", "month"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {range === "today" ? "Hôm nay" : range === "week" ? "Tuần này" : "Tháng này"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h2>
            <p className="text-sm text-gray-500 mt-1">Theo dõi đơn hàng realtime</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhà hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{order.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{order.customer}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{order.restaurant}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status === "completed" ? "active" : order.status === "cancelled" ? "disabled" : "inTerm"} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.time}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-center">
            <button className="text-sm font-medium text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
              Xem tất cả đơn hàng →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
