"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ArrowLeft, Calendar, Receipt, Filter, Search, X } from "@repo/ui/icons";
import { useLoading } from "@repo/ui";
import type { Order, OrderStatus } from "@repo/types";
import { getOrders } from "@/features/orders/data/mockOrders";
import OrderHistoryCard from "@/features/orders/components/OrderHistoryCard";
import OrderDetailDrawer from "@/features/orders/components/OrderDetailDrawer";

const statusFilters: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "DELIVERED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export default function OrderHistoryPage() {
  const router = useRouter();
  const { hide } = useLoading();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);

  useEffect(() => {
    // Simulate fetching orders from API
    const fetchedOrders = getOrders();
    setOrders(fetchedOrders);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Only show completed or cancelled orders in history
      const isHistoryOrder = order.status === "DELIVERED" || order.status === "CANCELLED";
      if (!isHistoryOrder) return false;

      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        order.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.deliveryLocation.address?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] pt-20">
      {/* Header */}
      <div className="sticky top-20 z-40 bg-[#F7F7F7] border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 pt-2 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="w-11 h-11 rounded-full bg-white/60 shadow-md border border-white hover:bg-gray-200 transition-all flex items-center justify-center group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
              </button>
              <div>
                <h1
                  className="text-[48px] font-bold leading-tight text-[#1A1A1A]"
                  style={{
                    fontStretch: "condensed",
                    letterSpacing: "-0.01em",
                    fontFamily: "var(--font-anton), var(--font-sans)",
                  }}
                >
                  ORDERS HISTORY
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and track your orders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm mã đơn hoặc địa chỉ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 py-3 w-72 rounded-2xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all"
                  >
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-3 mt-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex items-center gap-2">
              {statusFilters.map((filter) => (
                <motion.button
                  key={filter.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${statusFilter === filter.value
                    ? "bg-[var(--primary)] text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[var(--primary)]"
                    }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
            <div className="ml-auto text-sm text-gray-600">
              {filteredOrders.length} đơn hàng
            </div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                  >
                    <OrderHistoryCard
                      order={order}
                      onClick={() => handleOrderClick(order)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
                <Receipt className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                Không tìm thấy đơn hàng
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                {searchQuery
                  ? "Không có đơn hàng nào phù hợp với tìm kiếm của bạn"
                  : statusFilter !== "ALL"
                    ? "Không có đơn hàng nào trong phân loại này"
                    : "Bạn chưa có đơn hàng nào"}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Order Detail Drawer */}
      <OrderDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}
