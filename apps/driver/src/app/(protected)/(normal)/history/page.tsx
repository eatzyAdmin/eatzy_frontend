"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "@repo/ui/motion";
import { Search, Inbox } from "@repo/ui/icons";
import { useLoading } from "@repo/ui";
import { getDriverHistory, DriverHistoryOrder } from "@/features/history/data/mockDriverHistory";
import HistoryStats from "@/features/history/components/HistoryStats";
import HistoryFilter from "@/features/history/components/HistoryFilter";
import DriverHistoryCard from "@/features/history/components/DriverHistoryCard";
import DriverOrderDetailDrawer from "@/features/history/components/DriverOrderDetailDrawer";

export default function HistoryPage() {
  const { hide } = useLoading();
  const [orders, setOrders] = useState<DriverHistoryOrder[]>([]);
  const [filter, setFilter] = useState<"ALL" | "DELIVERED" | "CANCELLED">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<DriverHistoryOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll animation state
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const previous = scrollY.getPrevious() ?? 0;
      if (latest > previous && latest > 50) {
        setIsHeaderVisible(false); // Scrolling down & past threshold -> Hide
      } else if (latest < previous) {
        setIsHeaderVisible(true); // Scrolling up -> Show
      }
    });
  }, [scrollY]);

  // Simulated data fetch & loading
  useEffect(() => {
    // Initial load
    const t = setTimeout(() => hide(), 1500);
    setOrders(getDriverHistory());
    return () => clearTimeout(t);
  }, [hide]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter = filter === "ALL" || order.status === filter;
      const matchesSearch = !searchQuery ||
        order.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.restaurantLocation?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, searchQuery]);

  const handleOrderClick = (order: DriverHistoryOrder) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7]">
      {/* Sticky Header - Z-index high to stay above content */}
      <div className="flex-none sticky top-0 z-40 bg-[#F7F7F7]/95 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
        <motion.div
          initial={false}
          animate={{
            height: isHeaderVisible ? "auto" : 0,
            opacity: isHeaderVisible ? 1 : 0,
            marginBottom: isHeaderVisible ? 16 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden px-5"
        >
          <div className="pt-8">
            <h1
              className="text-4xl font-bold font-anton text-[#1A1A1A] leading-tight mb-1"
              style={{ fontFamily: 'var(--font-anton), sans-serif', letterSpacing: '0.01em' }}
            >
              HISTORY
            </h1>
            <p className="text-gray-500 text-sm font-medium">Lịch sử hoạt động của bạn</p>

            {/* Stats */}
            <div className="mt-4">
              <HistoryStats orders={orders} />
            </div>
          </div>
        </motion.div>

        {/* Search & Filter Container - Always Visible but connects smoothly */}
        <motion.div
          className="px-5 pb-2"
          animate={{ paddingTop: isHeaderVisible ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo ID hoặc Nhà hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-[#1A1A1A] placeholder:text-gray-400 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
            />
          </div>
          <HistoryFilter current={filter} onChange={setFilter} />
        </motion.div>
      </div>

      {/* Scrollable Content Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-5 pb-32 pt-2 scroll-smooth"
      >
        {/* Orders List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DriverHistoryCard
                    order={order}
                    onClick={() => handleOrderClick(order)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <Inbox className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A]">Không tìm thấy đơn hàng</h3>
                <p className="text-gray-500 text-sm max-w-[200px]">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Drawer - Always Rendered, Controlled by 'open' prop */}
      <DriverOrderDetailDrawer
        order={selectedOrder}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
