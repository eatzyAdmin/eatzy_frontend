"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { TransactionCardShimmer } from "@repo/ui";
import { useInfiniteScroll } from "@repo/hooks";
import WalletOverview from "@/features/wallet/components/WalletOverview";
import TransactionCard from "@/features/wallet/components/TransactionCard";
import WalletManageView from "@/features/wallet/components/WalletManageView";
import TransactionDetailDrawer from "@/features/wallet/components/TransactionDetailDrawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, Inbox, ChevronUp, CheckCircle2, Wallet, Bike, X, ArrowLeft, History, ArrowUpRight, ArrowDownLeft, LayoutGrid } from "@repo/ui/icons";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { useWalletTransactions } from "@/features/wallet/hooks/useWalletTransactions";
import { DriverWalletTransaction } from "@repo/types";
import { useRouter } from "next/navigation";
import { PullToRefresh } from "@repo/ui";

import { useBottomNav } from "../context/BottomNavContext";

export default function WalletPage() {
  const router = useRouter();
  const { setIsVisible } = useBottomNav();
  const [isManageViewOpen, setIsManageViewOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<DriverWalletTransaction | null>(null);
  const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  const { wallet, isLoading: isWalletLoading, refresh: refreshWallet } = useWallet();
  const {
    transactions,
    isLoading: isTransactionsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refresh: refreshTransactions
  } = useWalletTransactions({
    type: filterType
  });

  const isLoading = isWalletLoading || isTransactionsLoading;

  const handleRefresh = () => {
    // Explicitly return Promise<void> for TypeScript compatibility
    return Promise.all([refreshWallet(), refreshTransactions()]).then(() => {});
  };

  // Toggle bottom nav when entering manage view
  useEffect(() => {
    if (isManageViewOpen) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [isManageViewOpen, setIsVisible]);

  // Auto-load more
  const { sentinelRef } = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
    isLoading: isLoading,
    onLoadMore: fetchNextPage,
    rootMargin: '300px',
  });

  const handleFilterChange = (type: 'ALL' | 'IN' | 'OUT') => {
    if (type === filterType) return;
    setFilterType(type);
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || isManageViewOpen) return;

    const currentScrollY = container.scrollTop;
    const diff = currentScrollY - lastScrollY.current;
    lastScrollY.current = currentScrollY;

    if (Math.abs(diff) < 3) return;

    // 1. Bottom Nav visibility
    if (diff > 5 && currentScrollY > 20) {
      setIsVisible(false);
    } else if (diff < -5) {
      setIsVisible(true);
    }

    // 2. Scroll to top button visibility (threshold 400px)
    if (diff > 0 || currentScrollY < 400) {
      setShowScrollToTop(false);
    } else if (diff < -20) {
      setShowScrollToTop(true);
    }
  };

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTransactionClick = (tx: DriverWalletTransaction) => {
    setSelectedTransaction(tx);
    setIsTransactionDrawerOpen(true);
  };

  // Fluid transition properties (Original feel)
  const pageTransition = {
    type: "spring",
    damping: 25,
    stiffness: 180,
    mass: 0.8
  };

  return (
    <div className="flex flex-col h-screen bg-[#F7F7F7] relative overflow-hidden">
      <AnimatePresence initial={false}>
        {!isManageViewOpen ? (
          <motion.div
            key="wallet-main"
            initial={{ x: '-30%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={pageTransition}
            className="flex-1 flex flex-col relative h-full w-full"
          >
            <PullToRefresh 
              onRefresh={handleRefresh} 
              className="flex-1"
              pullText="Kéo để cập nhật ví"
              releaseText="Thả tay để cập nhật"
              refreshingText="Đang cập nhật..."
            >
              <div
                className="flex flex-col h-full overflow-y-auto no-scrollbar scroll-smooth"
                ref={containerRef}
                onScroll={handleScroll}
              >
                <div className="max-w-2xl mx-auto px-3 w-full relative">

                {/* Title and Header Area - Replicating History Pattern */}
                <div className="flex items-center gap-4 py-3 pb-0 pt-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0"
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
                      WALLET & PAYMENTS
                    </h1>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">
                      Manage your earnings and balance
                    </p>
                  </div>
                </div>

                {/* Wallet Balance Card Area */}
                <div className="pt-5 pb-3">
                  <WalletOverview
                    balance={wallet?.balance || 0}
                    onManage={() => setIsManageViewOpen(true)}
                    isLoading={isLoading && !wallet}
                  />
                </div>

                {/* 
                   Sticky Toolbar (Header + Filters) 
                   Standard sticky behavior without custom momentum logic
                */}
                <div className="sticky top-0 z-40 bg-[#F7F7F7]/95 backdrop-blur-md -mx-3 px-3 py-4 mb-0 [mask-image:linear-gradient(to_bottom,black_90%,transparent)]">
                  <div className="flex flex-col gap-3">

                    {/* Activity Title */}
                    <div className="px-2">
                      <h3 className="text-[17px] font-bold text-[#1A1A1A] flex items-center gap-2">
                        <div className="bg-gray-200/50 p-2 rounded-xl">
                          <History className="w-4 h-4 text-gray-700" />
                        </div>
                        Activity History
                      </h3>
                    </div>

                    {/* Filter Chips - Translated and Stylized */}
                    <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar pb-1">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleFilterChange('ALL')}
                        className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all flex items-center gap-2 whitespace-nowrap ${filterType === 'ALL'
                          ? "bg-[#1A1A1A] text-white shadow-md shadow-black/10"
                          : "bg-gray-100 text-gray-500 hover:text-[var(--primary)]"
                          }`}
                      >
                        <LayoutGrid className={`w-3.5 h-3.5 ${filterType === 'ALL' ? "text-white" : "text-gray-500"}`} strokeWidth={2.4} />
                        All
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleFilterChange('IN')}
                        className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all flex items-center gap-2 whitespace-nowrap ${filterType === 'IN'
                          ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
                          : "bg-gray-100 text-gray-500 hover:text-[var(--primary)]"
                          }`}
                      >
                        <ArrowDownLeft className={`w-3.5 h-3.5 ${filterType === 'IN' ? "text-white" : "text-gray-500"}`} strokeWidth={2.4} />
                        Income
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleFilterChange('OUT')}
                        className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all flex items-center gap-2 whitespace-nowrap ${filterType === 'OUT'
                          ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                          : "bg-gray-100 text-gray-500 hover:text-red-500"
                          }`}
                      >
                        <ArrowUpRight className={`w-3.5 h-3.5 ${filterType === 'OUT' ? "text-white" : "text-gray-500"}`} strokeWidth={2.4} />
                        Outcome
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Transactions List */}
                <div className="pb-32 pt-0">
                  <div className="space-y-1.5">
                    {isLoading && transactions.length === 0 ? (
                      <TransactionCardShimmer cardCount={6} />
                    ) : (
                      <>
                        {transactions.map((tx: DriverWalletTransaction) => (
                          <div key={tx.id}>
                            <TransactionCard transaction={tx} onClick={() => handleTransactionClick(tx)} />
                          </div>
                        ))}

                        {transactions.length === 0 ? (
                          <EmptyState
                            icon={Inbox}
                            title="Chưa có giao dịch nào"
                            description={
                              filterType === 'ALL'
                                ? "Bạn chưa thực hiện giao dịch nào trong khoảng thời gian này."
                                : "Không tìm thấy giao dịch nào trong phân loại này."
                            }
                            className="py-12"
                          />
                        ) : (
                          <>
                            {/* Sentinel for infinite scroll - Zero height to avoid breaking the list rhythm */}
                            <div ref={sentinelRef} className="h-0" />

                            {/* Loading shimmer appended directly to the list container for seamless flow */}
                            {isFetchingNextPage && (
                              <TransactionCardShimmer cardCount={2} />
                            )}

                            {!hasNextPage && !isFetchingNextPage && (
                              <div className="pb-12 pt-6 flex items-center justify-center gap-4 opacity-40">
                                <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span className="text-[12px] font-bold uppercase tracking-widest font-anton">End of list</span>
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
                </div>
              </div>
            </PullToRefresh>
          </motion.div>
        ) : (
          <WalletManageView
            key="wallet-manage"
            balance={wallet?.balance || 0}
            onBack={() => setIsManageViewOpen(false)}
            onRefresh={handleRefresh}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScrollToTop && !isManageViewOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-28 right-5 p-3.5 bg-[var(--primary)] text-white rounded-full shadow-xl shadow-[var(--primary)]/30 z-50"
          >
            <ChevronUp className="w-6 h-6" strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>

      <TransactionDetailDrawer
        open={isTransactionDrawerOpen}
        transaction={selectedTransaction}
        onClose={() => setIsTransactionDrawerOpen(false)}
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
