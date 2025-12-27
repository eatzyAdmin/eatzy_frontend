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
  Activity,
  TrendingDown,
  Star,
  Clock,
  AlertCircle,
} from "@repo/ui/icons";
import { StatusBadge } from "@repo/ui";
import { motion } from "@repo/ui/motion";
import { 
  MOCK_ORDERS, 
  MOCK_RESTAURANTS, 
  MOCK_DRIVERS, 
  MOCK_CUSTOMERS,
  MOCK_REVENUE_BREAKDOWN,
  MOCK_TOP_DRIVERS,
  MOCK_ACTIVITY_LOG,
  MOCK_ORDER_DELIVERY,
  MOCK_PAYMENT_METHODS,
} from "@/data/mock-data";

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
            <span className="text-sm text-gray-500">so với tháng trước</span>
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
  const [orders] = useState(MOCK_ORDERS);
  const [restaurants] = useState(MOCK_RESTAURANTS);
  const [drivers] = useState(MOCK_DRIVERS);
  const [customers] = useState(MOCK_CUSTOMERS);

  // Calculate stats từ dữ liệu
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status === "completed") return sum + order.amount;
    return sum;
  }, 0);

  const activeOrders = orders.filter((o) => !["completed", "cancelled"].includes(o.status)).length;
  const totalRestaurants = restaurants.length;
  const activeRestaurants = restaurants.filter((r) => r.status === "active").length;
  const totalDrivers = drivers.length;
  const onlineDrivers = drivers.filter((d) => d.status === "online").length;
  const totalCustomers = customers.length;

  // Mock data
  const stats = [
    {
      title: "Doanh thu",
      value: `₫${(totalRevenue / 1000000).toFixed(1)}M`,
      change: "+12.5%",
      icon: <DollarSign className="w-6 h-6" />,
      trend: "up" as const,
    },
    {
      title: "Đơn hàng hoạt động",
      value: activeOrders,
      change: "+8.2%",
      icon: <ShoppingBag className="w-6 h-6" />,
      trend: "up" as const,
    },
    {
      title: "Tổng khách hàng",
      value: totalCustomers,
      change: "+5.3%",
      icon: <Users className="w-6 h-6" />,
      trend: "up" as const,
    },
    {
      title: "Tài xế online",
      value: onlineDrivers,
      change: "-2.1%",
      icon: <Truck className="w-6 h-6" />,
      trend: "down" as const,
    },
    {
      title: "Nhà hàng hoạt động",
      value: activeRestaurants,
      change: "+15.8%",
      icon: <Store className="w-6 h-6" />,
      trend: "up" as const,
    },
    {
      title: "Giá trị đơn TB",
      value: `₫${orders.length > 0 ? Math.round(totalRevenue / orders.length / 1000) : 0}K`,
      change: "+3.7%",
      icon: <Activity className="w-6 h-6" />,
      trend: "up" as const,
    },
  ];

  const recentOrders: RecentOrder[] = orders.slice(0, 5).map((order) => ({
    id: order.orderId,
    customer: order.customerName,
    restaurant: order.restaurantName,
    amount: order.amount,
    status: order.status,
    time: "5 mins ago",
  }));

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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-semibold text-gray-600 mb-4">Tình trạng đơn hàng</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Hoàn thành</span>
                <span className="font-bold text-green-600">{orders.filter((o) => o.status === "completed").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Đang giao</span>
                <span className="font-bold text-orange-600">{orders.filter((o) => o.status === "delivering").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Chờ xác nhận</span>
                <span className="font-bold text-yellow-600">{orders.filter((o) => o.status === "pending").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Hủy</span>
                <span className="font-bold text-red-600">{orders.filter((o) => (o.status as any) === "cancelled").length}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-semibold text-gray-600 mb-4">Tổng quan nhà hàng</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Hoạt động</span>
                <span className="font-bold text-green-600">{activeRestaurants}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Chờ duyệt</span>
                <span className="font-bold text-yellow-600">{restaurants.filter((r) => r.status === "pending").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Bị khóa</span>
                <span className="font-bold text-red-600">{restaurants.filter((r) => (r.status as any) === "suspended").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Tổng cộng</span>
                <span className="font-bold text-gray-900">{totalRestaurants}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-semibold text-gray-600 mb-4">Tổng quan tài xế</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Online</span>
                <span className="font-bold text-green-600">{onlineDrivers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Offline</span>
                <span className="font-bold text-gray-600">{drivers.filter((d) => d.status === "offline").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Đang giao</span>
                <span className="font-bold text-orange-600">{drivers.filter((d) => d.status === "delivering").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Tổng cộng</span>
                <span className="font-bold text-gray-900">{totalDrivers}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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

        {/* Top Restaurants by Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Nhà hàng có doanh thu cao nhất</h2>
            <p className="text-sm text-gray-500 mt-1">Top 5 nhà hàng theo doanh thu</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhà hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trung bình
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {MOCK_REVENUE_BREAKDOWN.map((item, index) => (
                  <motion.tr
                    key={item.restaurantId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{item.restaurantName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-green-600">₫{(item.totalRevenue / 1000000).toFixed(1)}M</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{item.orderCount} đơn</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">₫{(item.avgOrderValue / 1000).toFixed(0)}K</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Drivers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Tài xế xuất sắc</h2>
            <p className="text-sm text-gray-500 mt-1">Top 5 tài xế theo đơn hàng hoàn thành</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-6">
            {MOCK_TOP_DRIVERS.map((driver, index) => (
              <motion.div
                key={driver.driverId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{driver.driverName}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{driver.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Đơn hoàn</span>
                    <span className="font-bold text-gray-900">{driver.completedOrders}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Doanh thu</span>
                    <span className="font-bold text-green-600">₫{(driver.totalRevenue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Trạng thái</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      driver.status === "online" ? "bg-green-100 text-green-700" :
                      driver.status === "delivering" ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {driver.status === "online" ? "Online" : driver.status === "delivering" ? "Đang giao" : "Offline"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Nhật ký hoạt động gần đây</h2>
            <p className="text-sm text-gray-500 mt-1">Các thay đổi gần đây trong hệ thống</p>
          </div>

          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {MOCK_ACTIVITY_LOG.slice(0, 8).map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Bởi: {activity.userName} • {new Date(activity.timestamp).toLocaleString('vi-VN')}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                  activity.action === "create" ? "bg-green-100 text-green-700" :
                  activity.action === "update" ? "bg-blue-100 text-blue-700" :
                  activity.action === "delete" ? "bg-red-100 text-red-700" :
                  activity.action === "approve" ? "bg-purple-100 text-purple-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {activity.action === "create" ? "Tạo" : 
                   activity.action === "update" ? "Cập nhật" :
                   activity.action === "delete" ? "Xóa" :
                   activity.action === "approve" ? "Duyệt" : "Khác"}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-center">
            <button className="text-sm font-medium text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
              Xem tất cả nhật ký →
            </button>
          </div>
        </motion.div>

        {/* Payment Methods Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Phương thức thanh toán</h2>
            <p className="text-sm text-gray-500 mt-1">Phân bố các phương thức thanh toán được sử dụng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-6">
            {MOCK_PAYMENT_METHODS.map((method, index) => {
              const totalTransactions = MOCK_PAYMENT_METHODS.reduce((sum, m) => sum + m.transactionCount, 0);
              const percentage = Math.round((method.transactionCount / totalTransactions) * 100);
              
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{method.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{method.transactionCount} giao dịch</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)] bg-opacity-10 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.05, duration: 0.6 }}
                      className="h-full rounded-full bg-[var(--primary)]"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{percentage}% của tổng</p>
                </motion.div>
              );
            })}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600">Tổng giao dịch</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {MOCK_PAYMENT_METHODS.reduce((sum, m) => sum + m.transactionCount, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Tổng tiền xử lý</p>
                <p className="text-xl font-bold text-green-600 mt-1">
                  ₫{(MOCK_PAYMENT_METHODS.reduce((sum, m) => sum + m.totalAmount, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Phương thức hàng đầu</p>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  {MOCK_PAYMENT_METHODS.reduce((prev, current) => 
                    prev.transactionCount > current.transactionCount ? prev : current
                  ).name}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Delivery Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Tình trạng giao hàng</h2>
            <p className="text-sm text-gray-500 mt-1">Phân tích chi tiết các đơn hàng đang giao</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {MOCK_ORDER_DELIVERY.map((delivery, index) => (
              <motion.div
                key={delivery.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl p-4 border ${
                  delivery.status === "delivered" ? "bg-green-50 border-green-200" :
                  delivery.status === "in_progress" ? "bg-blue-50 border-blue-200" :
                  delivery.status === "pending" ? "bg-yellow-50 border-yellow-200" :
                  "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-600">Đơn {delivery.orderId}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{delivery.driverName}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    delivery.status === "delivered" ? "bg-green-500" :
                    delivery.status === "in_progress" ? "bg-blue-500" :
                    delivery.status === "pending" ? "bg-yellow-500" :
                    "bg-red-500"
                  }`}>
                    {delivery.status === "delivered" ? "✓" : 
                     delivery.status === "in_progress" ? "→" :
                     delivery.status === "pending" ? "!" : "✗"}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">
                      {delivery.estimatedDeliveryTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <DollarSign className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">₫{(delivery.deliveryFee / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="pt-2 mt-3 border-t border-gray-200">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      delivery.status === "delivered" ? "bg-green-100 text-green-700" :
                      delivery.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                      delivery.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {delivery.status === "delivered" ? "Đã giao" :
                       delivery.status === "in_progress" ? "Đang giao" :
                       delivery.status === "pending" ? "Chờ giao" :
                       "Xác nhận"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600">Tổng đơn giao</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {MOCK_ORDER_DELIVERY.filter(d => d.status === "delivered").length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Đang giao</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {MOCK_ORDER_DELIVERY.filter(d => d.status === "in_progress").length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Chờ giao</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {MOCK_ORDER_DELIVERY.filter(d => d.status === "pending").length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Tỉ lệ thành công</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {Math.round((MOCK_ORDER_DELIVERY.filter(d => d.status === "delivered").length / MOCK_ORDER_DELIVERY.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
