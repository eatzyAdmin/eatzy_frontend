"use client";

import { useEffect, useState, useRef, TouchEvent, WheelEvent } from "react";
import { motion, useScroll, AnimatePresence } from "@repo/ui/motion";
import { useLoading, TextShimmer, TransactionCardShimmer } from "@repo/ui";
import { mockWalletStats, mockTransactions, WalletTransaction } from "@/features/wallet/data/mockWalletData";
import WalletOverview from "@/features/wallet/components/WalletOverview";
import TransactionCard from "@/features/wallet/components/TransactionCard";
import TopUpDrawer from "@/features/wallet/components/TopUpDrawer";
import WithdrawDrawer from "@/features/wallet/components/WithdrawDrawer";
import TransactionDetailDrawer from "@/features/wallet/components/TransactionDetailDrawer";
import DriverOrderDetailDrawer from "@/features/history/components/DriverOrderDetailDrawer";
import { mockDriverHistory, DriverHistoryOrder } from "@/features/history/data/mockDriverHistory";
import { History, Wallet, ArrowUpRight, ArrowDownLeft, ChevronUp, CheckCircle2 } from "@repo/ui/icons";

import { useNormalLoading } from "../context/NormalLoadingContext";
import { useBottomNav } from "../context/BottomNavContext";

export default function WalletPage() {
  const { hide } = useLoading();
  const { stopLoading } = useNormalLoading();
  const { setIsVisible } = useBottomNav();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DriverHistoryOrder | null>(null);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);
  const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'ALL') return true;
    const isPositive = tx.type === 'EARNING' || tx.type === 'TOP_UP';
    return filterType === 'IN' ? isPositive : !isPositive;
  });

  const handleFilterChange = (type: 'ALL' | 'IN' | 'OUT') => {
    if (type === filterType) return;
    setFilterType(type);
    setIsLoading(true);
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleTransactionClick = (tx: WalletTransaction) => {
    if (tx.type === "EARNING" && tx.referenceId) {
      const order = mockDriverHistory.find(o => o.id === tx.referenceId || o.code === tx.referenceId);
      if (order) {
        setSelectedOrder(order);
        setIsOrderDrawerOpen(true);
      }
    } else {
      // Handle other transaction types (Withdrawal, TopUp, COD)
      setSelectedTransaction(tx);
      setIsTransactionDrawerOpen(true);
    }
  };

  useEffect(() => {
    stopLoading();
  }, [stopLoading]);

  // Scroll animation state
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });

  // Gesture checking state
  const gestureState = useRef({ startY: 0, startScrollTop: 0 });
  const lastWheelTime = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent) => {
    if (!containerRef.current) return;
    gestureState.current = {
      startY: e.touches[0].clientY,
      startScrollTop: containerRef.current.scrollTop
    };
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!containerRef.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - gestureState.current.startY;
    const { startScrollTop } = gestureState.current;

    // Scroll Down Gesture (diff < 0)
    if (diff < -10 && isHeaderVisible) {
      setIsHeaderVisible(false);
    }

    // Scroll Up Gesture (diff > 0)
    else if (diff > 10 && !isHeaderVisible) {
      // Only trigger if we started at the top of the list (with slight buffer)
      if (startScrollTop < 2) {
        setIsHeaderVisible(true);
      }
    }
  };

  const handleWheel = (e: WheelEvent) => {
    if (!containerRef.current) return;
    const isAtTop = containerRef.current.scrollTop <= 0;
    const now = Date.now();
    const timeDiff = now - lastWheelTime.current;
    lastWheelTime.current = now;

    // DeltaY > 0 is Down
    if (e.deltaY > 0 && isHeaderVisible) {
      setIsHeaderVisible(false);
    }
    // DeltaY < 0 is Up
    else if (e.deltaY < 0 && !isHeaderVisible) {
      if (isAtTop) {
        // Only reveal if this is a fresh gesture (gap > 200ms from last event)
        // This filters out momentum/inertia arriving at the top
        if (timeDiff > 200) {
          setIsHeaderVisible(true);
        }
      }
    }
  };

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const velocity = scrollY.getVelocity();

      // --- Scroll To Top Button Logic ---
      // Hide button when near top
      if (latest < 100) {
        if (showScrollToTop) setShowScrollToTop(false);
        setIsVisible(true); // Always show nav at top
      } else {
        // Show when scrolling UP, Hide when scrolling DOWN
        if (velocity < -20) {
          if (!showScrollToTop) setShowScrollToTop(true);
          setIsVisible(true);
        } else if (velocity > 20) {
          if (showScrollToTop) setShowScrollToTop(false);
          setIsVisible(false);
        }
      }
    });
  }, [scrollY, showScrollToTop, setIsVisible]);

  const scrollToTop = () => {
    setIsHeaderVisible(true);
    // Use timeout to ensure state update processes before scrolling (if needed) 
    // or just scroll immediately. With overflow-hidden logic, hidden -> visible unlocks/locks?
    // If we set Visible -> List becomes Locked (Overflow Hidden).
    // So scrollToTop might fail if it's locked?
    // Actually, if it's locked, scrollTo will work programmatically, but user can't scroll.
    // However, header appearing pushes list down.
    // We should scroll 0.
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
      setIsLoading(false);
    }, 1800);
    setTransactions(mockTransactions);
    return () => clearTimeout(timer);
  }, [hide]);

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] relative">
      {/* Sticky Header */}
      <div className="flex-none sticky top-0 z-40 bg-[#F7F7F7]/95 backdrop-blur-xl transition-all duration-300 border-none shadow-none ring-0">
        <motion.div
          initial={false}
          animate={{
            height: isHeaderVisible ? "auto" : 0,
            opacity: isHeaderVisible ? 1 : 0,
            marginBottom: isHeaderVisible ? 24 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden px-5"
        >
          {/* Add padding top only if visible to avoid jumpiness when animating height */}
          <div className={`${isHeaderVisible ? "pt-5" : "pt-0"}`}>
            {/* <h1
              className="text-4xl font-bold font-anton text-[#1A1A1A] leading-tight ml-2 mb-2"
              style={{ fontFamily: 'var(--font-anton), sans-serif', letterSpacing: '0.01em' }}
            >
              WALLET
            </h1> */}

            {isLoading ? (
              <div className="relative overflow-hidden rounded-[32px] bg-[#1A1A1A] text-white p-6 shadow-xl shadow-black/10">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Wallet className="w-32 h-32 text-white" />
                </div>

                <div className="relative z-10">
                  <p className="text-white/60 text-sm font-medium mb-1">Số dư khả dụng</p>
                  <TextShimmer width={180} height={40} rounded="md" color="rgba(255,255,255,0.2)" className="mb-6" />

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md">
                      <p className="text-white/60 text-xs mb-1">Thu nhập hôm nay</p>
                      <TextShimmer width={100} height={28} rounded="md" color="rgba(255,255,255,0.2)" />
                    </div>
                    <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md">
                      <p className="text-white/60 text-xs mb-1">Đang xử lý</p>
                      <TextShimmer width={100} height={28} rounded="md" color="rgba(255,255,255,0.2)" />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 backdrop-blur-md">
                      <div className="bg-green-500/20 p-1 rounded-full">
                        <ArrowDownLeft className="w-4 h-4 text-green-400" />
                      </div>
                      Nạp tiền
                    </div>
                    <div className="flex-1 bg-[var(--primary)] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary)]/30">
                      <div className="bg-white/20 p-1 rounded-full">
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      </div>
                      Rút tiền
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <WalletOverview
                stats={mockWalletStats}
                onTopUp={() => setIsTopUpOpen(true)}
                onWithdraw={() => setIsWithdrawOpen(true)}
              />
            )}
          </div>
        </motion.div>

        {/* Section Title - Always visible to anchor list */}
        <motion.div
          className="px-5 pb-3 flex items-center justify-between bg-inherit"
          animate={{ paddingTop: isHeaderVisible ? 0 : 20 }}
        >
          <h3 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
            <div className="bg-gray-200 p-1.5 rounded-lg">
              <History className="w-4 h-4 text-gray-600" />
            </div>
            Lịch sử giao dịch
          </h3>
        </motion.div>

        {/* Filter Chips */}
        <div className="px-5 pb-4 flex gap-2 overflow-x-auto no-scrollbar bg-inherit">
          <button
            onClick={() => handleFilterChange('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${filterType === 'ALL' ? 'bg-[#1A1A1A] text-white shadow-lg shadow-black/10' : 'bg-gray-100 text-gray-500'}`}
          >
            <History className="w-3.5 h-3.5" />
            Tất cả
          </button>
          <button
            onClick={() => handleFilterChange('IN')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${filterType === 'IN' ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30' : 'bg-gray-100 text-gray-500'}`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Tiền vào
          </button>
          <button
            onClick={() => handleFilterChange('OUT')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${filterType === 'OUT' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-gray-100 text-gray-500'}`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Tiền ra
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div
        ref={containerRef}
        className={`flex-1 px-5 pb-32 pt-2 scroll-smooth ${isHeaderVisible ? 'overflow-hidden' : 'overflow-y-auto'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onWheel={handleWheel}
      >
        <div className="space-y-3">
          {isLoading ? (
            // Increased card count to prevent scroll jumping when filtering
            <TransactionCardShimmer cardCount={8} />
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {filteredTransactions.map((tx, index) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TransactionCard transaction={tx} onClick={() => handleTransactionClick(tx)} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredTransactions.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">Chưa có giao dịch nào</div>
              ) : (
                <div className="py-12 flex items-center justify-center gap-4 opacity-60">
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <span className="text-[14px] font-bold text-gray-400 uppercase font-anton">End of list</span>
                  </div>
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Scroll To Top Floating Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="absolute bottom-24 right-5 p-3 bg-[var(--primary)] text-white rounded-full shadow-lg shadow-[var(--primary)]/30 z-50 transition-colors"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <TopUpDrawer open={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
      <WithdrawDrawer
        open={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        balance={mockWalletStats.availableBalance}
      />

      <DriverOrderDetailDrawer
        open={isOrderDrawerOpen}
        order={selectedOrder}
        onClose={() => setIsOrderDrawerOpen(false)}
      />

      <TransactionDetailDrawer
        open={isTransactionDrawerOpen}
        transaction={selectedTransaction}
        onClose={() => setIsTransactionDrawerOpen(false)}
      />
    </div>
  );
}
