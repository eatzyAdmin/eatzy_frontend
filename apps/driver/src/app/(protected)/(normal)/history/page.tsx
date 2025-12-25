"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "@repo/ui/motion";
import { Search, Inbox } from "@repo/ui/icons";
import { useLoading, TextShimmer, HistoryCardShimmer } from "@repo/ui";
import { getDriverHistory, DriverHistoryOrder } from "@/features/history/data/mockDriverHistory";
import HistoryStats from "@/features/history/components/HistoryStats";
import HistoryFilter from "@/features/history/components/HistoryFilter";
import DriverHistoryCard from "@/features/history/components/DriverHistoryCard";
import DriverOrderDetailDrawer from "@/features/history/components/DriverOrderDetailDrawer";
import { useNormalLoading } from "../context/NormalLoadingContext";
import { Wallet, Bike } from "@repo/ui/icons";

export default function HistoryPage() {
  const { hide } = useLoading();
  const { stopLoading } = useNormalLoading();
  const [orders, setOrders] = useState<DriverHistoryOrder[]>([]);
  const [filter, setFilter] = useState<"ALL" | "DELIVERED" | "CANCELLED">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<DriverHistoryOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [actualSearchQuery, setActualSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
    const timer = setTimeout(() => {
      hide();
      setIsLoading(false);
    }, 1800);
    setOrders(getDriverHistory());
    stopLoading();
    return () => clearTimeout(timer);
  }, [hide, stopLoading]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter = filter === "ALL" || order.status === filter;
      const matchesSearch = !actualSearchQuery ||
        order.code?.toLowerCase().includes(actualSearchQuery.toLowerCase()) ||
        order.restaurantLocation?.name?.toLowerCase().includes(actualSearchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, actualSearchQuery]);

  const handleOrderClick = (order: DriverHistoryOrder) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleFilterChange = (newFilter: "ALL" | "DELIVERED" | "CANCELLED") => {
    if (newFilter === filter) return;
    setFilter(newFilter);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActualSearchQuery(searchInputValue);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1200);
    }
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
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {/* Income shimmer */}
                  <div className="bg-[var(--primary)] rounded-[24px] p-4 text-white shadow-lg shadow-[var(--primary)]/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20 rotate-12">
                      <Wallet className="w-16 h-16" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-white/80 text-xs font-semibold mb-1 uppercase tracking-wider">Tổng thu nhập</p>
                      <TextShimmer width={120} height={32} rounded="md" color="rgba(255,255,255,0.3)" />
                    </div>
                  </div>

                  {/* Trips shimmer */}
                  <div className="bg-white rounded-[24px] p-4 text-[#1A1A1A] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-[0.08] rotate-12 text-[#1A1A1A]">
                      <Bike className="w-16 h-16" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wider">Số chuyến xe</p>
                      <TextShimmer width={60} height={36} rounded="md" />
                    </div>
                  </div>
                </div>
              ) : (
                <HistoryStats orders={orders} />
              )}
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
              placeholder="Tìm theo ID hoặc Nhà hàng... (Nhấn Enter)"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-white rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-[#1A1A1A] placeholder:text-gray-400 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
            />
          </div>
          <HistoryFilter current={filter} onChange={handleFilterChange} />
        </motion.div>
      </div>

      {/* Scrollable Content Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-5 pb-32 pt-2 scroll-smooth"
      >
        {/* Orders List */}
        <div className="space-y-4">
          {isLoading ? (
            <HistoryCardShimmer cardCount={2} />
          ) : (
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
          )}
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
