"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Search, Inbox, ChevronUp, CheckCircle2, Wallet, Bike, X, ArrowLeft } from "@repo/ui/icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { HistoryCardShimmer } from "@repo/ui";
import { useInfiniteScroll } from "@repo/hooks";
import { useQueryClient } from "@tanstack/react-query";
import type { DriverHistoryOrder } from "@repo/types";
import HistoryFilter from "@/features/history/components/HistoryFilter";
import DriverHistoryCard from "@/features/history/components/DriverHistoryCard";
import DriverOrderDetailDrawer from "@/features/history/components/DriverOrderDetailDrawer";

import { useBottomNav } from "../context/BottomNavContext";
import { useDriverOrderHistory } from "@/features/history/hooks/useDriverOrderHistory";
import { PullToRefresh } from "@repo/ui";

export default function HistoryPage() {
  const router = useRouter();
  const { setIsVisible } = useBottomNav();
  const [filter, setFilter] = useState<"ALL" | "DELIVERED" | "CANCELLED">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<DriverHistoryOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [actualSearchQuery, setActualSearchQuery] = useState("");

  const {
    orders,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    refresh
  } = useDriverOrderHistory({
    status: filter,
    search: actualSearchQuery
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // ... rest of effects same ...
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const diff = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (Math.abs(diff) < 3) return;

      if (diff > 5 && currentScrollY > 20) {
        setIsVisible(false);
      } else if (diff < -5) {
        setIsVisible(true);
      }

      if (diff > 0 || currentScrollY < 400) {
        setShowScrollToTop(false);
      } else if (diff < -20) {
        setShowScrollToTop(true);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [setIsVisible]);

  // ...rest same
  const { sentinelRef } = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
    isLoading: isLoading,
    onLoadMore: fetchNextPage,
    rootMargin: '300px',
  });

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
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActualSearchQuery(searchInputValue);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] overflow-hidden">
      <PullToRefresh 
        ref={scrollContainerRef}
        onRefresh={refresh}
        className="flex-1 no-scrollbar overflow-y-auto"
        pullText="Kéo để cập nhật đơn hàng"
        releaseText="Thả tay để cập nhật"
        refreshingText="Đang cập nhật..."
      >
        <div className="max-w-2xl mx-auto px-3 relative">
            <div className="flex items-center gap-4 py-3 pb-0 pt-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 transition-all flex items-center justify-center group flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </motion.button>
              <div>
                <h1
                  className="text-[32px] font-bold leading-tight text-[#1A1A1A]"
                  style={{
                    fontStretch: "condensed",
                    letterSpacing: "-0.01em",
                    fontFamily: "var(--font-anton), var(--font-sans)",
                  }}
                >
                  ORDERS HISTORY
                </h1>
                <p className="text-sm font-medium text-gray-500 mt-0.5">
                  Manage and track your past orders
                </p>
              </div>
            </div>

          {/* 
             Sticky Toolbar (Search & Filters)
             Standard sticky behavior without custom momentum logic
          */}
          <div className="sticky top-0 z-40 bg-[#F7F7F7]/95 backdrop-blur-md -mx-3 px-3 py-4 mb-2 [mask-image:linear-gradient(to_bottom,black_90%,transparent)]">
            <div className="flex flex-col gap-4">

              {/* Search Bar - Preserved your original style classes */}
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by ID or Restaurant..."
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full bg-slate-50 border-2 border-white focus:border-[var(--primary)]/20 rounded-3xl py-4 pl-14 pr-12 text-lg font-bold font-anton text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.09)]"
                />
                {searchInputValue && (
                  <button
                    onClick={() => {
                      setSearchInputValue("");
                      setActualSearchQuery("");
                      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gray-200/50 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* History Filter */}
              <HistoryFilter current={filter} onChange={handleFilterChange} />
            </div>
          </div>

          {/* Orders List Area */}
          <div className="space-y-2 pb-32">
            {isLoading && orders.length === 0 ? (
              <HistoryCardShimmer cardCount={3} />
            ) : (
              <>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <DriverHistoryCard
                      key={order.id}
                      order={order}
                      onClick={() => handleOrderClick(order)}
                    />
                  ))
                ) : (actualSearchQuery || filter !== "ALL") ? (
                  <EmptyState
                    icon={Inbox}
                    title="Không tìm thấy chuyến đi"
                    description={
                      actualSearchQuery
                        ? "Không có chuyến xe nào phù hợp với tìm kiếm của bạn"
                        : "Không có chuyến xe nào trong phân loại này"
                    }
                    className="py-24"
                  />
                ) : (
                  <EmptyState
                    icon={Bike}
                    title="Bạn chưa có chuyến xe nào"
                    description="Hãy bắt đầu nhận đơn để tích lũy lịch sử hoạt động của bạn nhé!"
                    buttonText="Trang chủ"
                    onButtonClick={() => router.push('/home')}
                    className="py-12"
                  />
                )}

                {orders.length > 0 && (
                  <>
                    {/* Sentinel for infinite scroll */}
                    <div ref={sentinelRef} className="h-4" />

                    {/* Loading shimmer when fetching more */}
                    {isFetchingNextPage && (
                      <HistoryCardShimmer cardCount={1} />
                    )}

                    {/* End of list indicator */}
                    {!hasNextPage && !isFetchingNextPage && (
                      <div className="pb-12 pt-6 flex items-center justify-center gap-4 opacity-40">
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-gray-400" />
                          <span className="text-[14px] font-bold text-gray-400 uppercase font-anton tracking-wider">End of list</span>
                        </div>
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </PullToRefresh>

      {/* Floating Scroll To Top Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-28 right-5 p-3 bg-[var(--primary)] text-white rounded-full shadow-lg shadow-[var(--primary)]/30 z-50 transition-colors"
          >
            <ChevronUp className="w-6 h-6" strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Detail Drawer */}
      <DriverOrderDetailDrawer
        order={selectedOrder}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
      />

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
