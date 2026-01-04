"use client";

import { useEffect, useState, useRef } from "react";
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
import { History, Wallet, ArrowUpRight, ArrowDownLeft } from "@repo/ui/icons";

import { useNormalLoading } from "../context/NormalLoadingContext";

export default function WalletPage() {
  const { hide } = useLoading();
  const { stopLoading } = useNormalLoading();
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const previous = scrollY.getPrevious() ?? 0;

      const diff = latest - previous;
      const isScrollingDown = diff > 0;
      const isScrollingUp = diff < 0;

      // Check if near bottom to prevent bouncing/jank
      let isNearBottom = false;
      if (containerRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = containerRef.current;
        // Tolerance of 100px from bottom
        if (scrollHeight - scrollTop - clientHeight < 100) {
          isNearBottom = true;
        }
      }

      if (isScrollingUp) {
        setIsHeaderVisible(true);
      } else if (isScrollingDown && latest > 50 && !isNearBottom) {
        setIsHeaderVisible(false);
      }
    });
  }, [scrollY]);

  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
      setIsLoading(false);
    }, 1800);
    setTransactions(mockTransactions);
    return () => clearTimeout(timer);
  }, [hide]);

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7]">
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
          <div className={`${isHeaderVisible ? "pt-8" : "pt-0"}`}>
            <h1
              className="text-4xl font-bold font-anton text-[#1A1A1A] leading-tight ml-2 mb-2"
              style={{ fontFamily: 'var(--font-anton), sans-serif', letterSpacing: '0.01em' }}
            >
              WALLET
            </h1>

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
        className="flex-1 overflow-y-auto px-5 pb-32 pt-2 scroll-smooth"
      >
        <div className="space-y-3">
          {isLoading ? (
            <TransactionCardShimmer cardCount={3} />
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

              {/* Spacer to Ensure Scrolling Logic works smoothly at bottom - Large enough to allow scrolling with few items */}
              <div className="h-[60vh]" />

              {filteredTransactions.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">Chưa có giao dịch nào</div>
              )}
            </>
          )}
        </div>
      </div>

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
