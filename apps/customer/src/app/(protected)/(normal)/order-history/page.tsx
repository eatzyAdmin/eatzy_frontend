"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ArrowLeft, Receipt, Filter, Search, X, LayoutGrid, CheckCircle2, XCircle } from "@repo/ui/icons";
import { useLoading, OrderHistoryCardShimmer } from "@repo/ui";
import type { OrderResponse } from "@repo/types";
import { useOrderHistory } from "@/features/orders/hooks/useOrderHistory";
import OrderHistoryCard from "@/features/orders/components/OrderHistoryCard";
import OrderDetailDrawer from "@/features/orders/components/OrderDetailDrawer";
import { useBottomNav } from "@/features/navigation/context/BottomNavContext";

const statusFilters = [
  { value: "ALL", label: "Tất cả", icon: LayoutGrid },
  { value: "DELIVERED", label: "Hoàn thành", icon: CheckCircle2 },
  { value: "CANCELLED", label: "Đã hủy", icon: XCircle },
];

export default function OrderHistoryPage() {
  const router = useRouter();
  const { hide } = useLoading();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [actualSearchQuery, setActualSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { orders, isLoading } = useOrderHistory({
    status: statusFilter,
    search: actualSearchQuery,
  });

  const { setIsVisible } = useBottomNav();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [isTopHeaderVisible, setIsTopHeaderVisible] = useState(true);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
      const isDesktop = window.innerWidth >= 768;

      if (direction === 'down' && currentScrollY > 20) {
        setIsVisible(false);
        if (isDesktop) {
          setIsTopHeaderVisible(false);
          window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: false } }));
        }
      } else {
        setIsVisible(true);
        if (isDesktop) {
          setIsTopHeaderVisible(true);
          window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: true } }));
        }
      }
      lastScrollY.current = currentScrollY;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      // Reset header visibility when leaving page
      window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: true } }));
    };
  }, [setIsVisible]);

  useEffect(() => {
    if (!isLoading) {
      hide();
    }
  }, [isLoading, hide]);

  const handleOrderClick = (order: OrderResponse) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const handleFilterChange = (newFilter: string) => {
    if (newFilter === statusFilter) return;
    setStatusFilter(newFilter);
  };

  // Simple scroll to top when filtering/searching
  useEffect(() => {
    if (isLoading) return;
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [statusFilter, actualSearchQuery, isLoading]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActualSearchQuery(searchInputValue);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] overflow-hidden">
      {/* Scrollable Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-3 md:px-8">
          {/* Page Title & Back Button (Scrollable) */}
          <div className="flex items-center gap-4 py-3 pb-0 md:pt-20">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center group flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
            </button>
            <div>
              <h1
                className="text-[32px] md:text-[56px] font-bold leading-tight text-[#1A1A1A]"
                style={{
                  fontStretch: "condensed",
                  letterSpacing: "-0.01em",
                  fontFamily: "var(--font-anton), var(--font-sans)",
                }}
              >
                ORDERS HISTORY
              </h1>
              <p className="text-sm font-medium md:text-base text-gray-500 mt-1">
                Manage and track your past orders
              </p>
            </div>
          </div>

          {/* Sticky Toolbar (Search & Filters) */}
          <div
            className={`sticky z-40 bg-[#F7F7F7]/95 backdrop-blur-md -mx-4 px-4 md:-mx-8 md:px-8 py-4 mb-2 md:mb-6 flex flex-col-reverse md:flex-row md:items-center justify-between gap-3 transition-all duration-300 ease-in-out ${isTopHeaderVisible ? 'top-0 md:top-[80px]' : 'top-0 border-b border-gray-200/50 shadow-sm'
              }`}
          >
            {/* Status Filters */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              <div className="hidden md:flex w-10 h-10 items-center justify-center flex-shrink-0">
                <Filter className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex items-center gap-2 min-w-max pr-4">
                {statusFilters.map((filter) => (
                  <motion.button
                    key={filter.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleFilterChange(filter.value)}
                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[11px] font-bold md:text-sm md:font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${statusFilter === filter.value
                      ? filter.value === "CANCELLED"
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                        : filter.value === "ALL"
                          ? "bg-[#1A1A1A] text-white shadow-lg shadow-black/10"
                          : "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                      : filter.value === "CANCELLED"
                        ? "bg-gray-100 text-gray-500 hover:text-red-500 md:bg-gray-200/40 md:text-gray-600"
                        : "bg-gray-100 text-gray-500 hover:text-[var(--primary)] md:bg-gray-200/40 md:text-gray-600"
                      }`}
                  >
                    <filter.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${statusFilter === filter.value ? "text-white" : "text-gray-500"}`} strokeWidth={2.4} />
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-96 flex-shrink-0 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders, restaurants or address..."
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
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gray-200/50 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Grid Content */}
          <div className="pb-24">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-4 relative">
                <OrderHistoryCardShimmer cardCount={6} />
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-4 relative">
                <AnimatePresence mode="popLayout">
                  {orders.map((order: OrderResponse, index: number) => (
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
                className="flex flex-col items-center justify-center py-24"
              >
                <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6 border border-gray-200 shadow-inner">
                  <Receipt className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                  Không tìm thấy đơn hàng
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  {actualSearchQuery
                    ? "Không có đơn hàng nào phù hợp với tìm kiếm của bạn"
                    : statusFilter !== "ALL"
                      ? "Không có đơn hàng nào trong phân loại này"
                      : "Bạn chưa có đơn hàng nào"}
                </p>
              </motion.div>
            )}
          </div>
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
