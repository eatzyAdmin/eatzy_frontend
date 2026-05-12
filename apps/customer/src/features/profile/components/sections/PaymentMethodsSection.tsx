"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import {
  Wallet, ArrowUpRight, ArrowDownLeft, ShieldCheck,
  History as TransactionsIcon, CreditCard, Plus, ArrowRight,
  Check, Loader2, RefreshCw, Smartphone, TrendingUp, TrendingDown,
  ArrowUp, ArrowDown, HandCoins, Receipt, Ban, Clock, Eye, EyeOff, CheckCircle2
} from "@repo/ui/icons";
import { useInfiniteScroll } from "@repo/hooks";
import { WalletTransactionsShimmer, TransactionRowShimmer, TextShimmer } from "@repo/ui";
import { useCustomerWalletTransactions } from "../../hooks/useCustomerWalletTransactions";
import { useOrderDetail } from "@/features/orders/hooks/useOrderDetail";
import TransactionOrderDetailModal from "../modals/TransactionOrderDetailModal";
import TransactionDetailDrawer from "../modals/TransactionDetailDrawer";
import { WalletTransactionType, WalletTransactionStatus, WALLET_CREDIT_TYPES, WalletTransactionResponse } from "@repo/types";

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
};

interface PaymentMethodsSectionProps {
  onOpenManage?: (type: 'TOPUP' | 'WITHDRAW') => void;
}

export default function PaymentMethodsSection({ onOpenManage }: PaymentMethodsSectionProps) {
  const {
    wallet,
    transactions,
    isLoading,
    isFetchingTransactions,
    hasNextPage,
    refresh,
    fetchMoreTransactions
  } = useCustomerWalletTransactions();
  const { order, isLoading: isOrderLoading, fetchOrder, clearOrder } = useOrderDetail();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransactionResponse | null>(null);
  const [showBalance, setShowBalance] = useState(false);

  const { sentinelRef } = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoadingMore: isFetchingTransactions,
    isLoading: isLoading,
    onLoadMore: fetchMoreTransactions,
    rootMargin: '200px',
  });

  // On mobile, we handle loading within the component to keep the card design
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isLoading && !isMobile) {
    return <WalletTransactionsShimmer />;
  }

  const handleTransactionClick = (tx: WalletTransactionResponse) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSelectedTransaction(tx);
      setIsDrawerOpen(true);
    } else if (tx.order?.id) {
      fetchOrder(tx.order.id);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(clearOrder, 300); // Clear after exit animation
  };

  const getTransactionIcon = (type: string, status: string) => {
    if (status === WalletTransactionStatus.FAILED) return Ban;
    if (status === WalletTransactionStatus.PENDING) return Clock;

    switch (type) {
      case WalletTransactionType.DEPOSIT:
      case WalletTransactionType.DEPOSIT_VNPAY:
        return ArrowDownLeft;
      case WalletTransactionType.WITHDRAWAL:
        return ArrowUpRight;
      case WalletTransactionType.PAYMENT:
        return Receipt;
      case WalletTransactionType.REFUND:
        return HandCoins;
      default:
        return RefreshCw;
    }
  };

  const handleOpenManage = (type: 'TOPUP' | 'WITHDRAW') => {
    onOpenManage?.(type);
  };

  return (
    <div className="space-y-4 md:space-y-12">
      {/* Integrated Header & Balance */}
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-8 md:pb-8 border-b border-gray-100">
          <div className="hidden md:flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                <Wallet size={12} />
                Finance Management
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-x-6 gap-y-2">
              <div className="flex items-baseline gap-4">
                <h2 className="text-4xl md:text-[56px] font-bold leading-none text-[#1A1A1A] uppercase tracking-tight" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
                  {isLoading ? (
                    <div className="h-10 md:h-[56px] w-40 md:w-64 bg-gray-100 rounded-2xl animate-pulse" />
                  ) : wallet ? (
                    showBalance ? Math.floor(wallet.balance).toLocaleString('vi-VN') : '••••••'
                  ) : '0'}
                </h2>
                {!isLoading && <span className="text-2xl font-anton uppercase mb-1">VNĐ</span>}

                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="mb-2 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                  title={showBalance ? "Hide balance" : "Show balance"}
                >
                  {showBalance ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Wallet Summary Card for Mobile */}
          <div className="md:hidden w-full bg-[#1A1A1A] rounded-[32px] p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

            {/* Top Right Action Button */}
            <div className="absolute top-0 right-0">
              <button
                onClick={() => handleOpenManage('TOPUP')}
                className="px-4 py-2 bg-lime-400 font-bold text-black text-[12px] rounded-tr-[32px] rounded-bl-[32px] shadow-lg active:scale-90 transition-all flex items-center gap-1.5"
              >
                <Plus size={14} strokeWidth={3} />
                Top-up
              </button>
            </div>

            <div className="relative z-10">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Current Balance</span>
              <div className="flex items-baseline gap-3">
                {isLoading ? (
                  <TextShimmer width={150} height={40} rounded="xl" backgroundColor="bg-white/10" className="shrink-0" />
                ) : (
                  <>
                    <h2 className="text-4xl font-anton">{wallet ? (showBalance ? Math.floor(wallet.balance).toLocaleString('vi-VN') : '••••••') : '0'}</h2>
                    <span className="text-lg font-anton text-lime-500">VNĐ</span>
                    <button onClick={() => setShowBalance(!showBalance)} className="ml-2 p-2 bg-white/10 rounded-xl">
                      {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center md:justify-start gap-2">
            <button
              onClick={() => handleOpenManage('TOPUP')}
              className="px-6 py-3.5 bg-[#1A1A1A] text-white font-anton text-xs uppercase tracking-wider rounded-2xl hover:bg-lime-500 hover:text-black transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <Plus size={16} />
              Top-up
            </button>
            <button
              onClick={refresh}
              className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-300 hover:text-lime-500 hover:border-lime-100 transition-all active:rotate-180 duration-500 flex items-center justify-center"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-0 md:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[#1A1A1A]">
              <TransactionsIcon size={20} />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-[#1A1A1A]">Transaction History</h3>
          </div>
        </div>

        <div className="flex flex-col">
          {isLoading ? (
            <div className="flex flex-col">
              {[1, 2, 3, 4].map((i, idx) => (
                <div key={i}>
                  <TransactionRowShimmer index={idx} />
                  {i < 4 && <div className="h-px bg-slate-100 mx-4 md:mx-10" />}
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-20 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center text-gray-400 bg-slate-50/30">
              <Receipt size={32} className="opacity-20 mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">No transactions yet</p>
              <p className="text-xs">All spending and top-ups will appear here</p>
            </div>
          ) : (
            transactions.map((tx, idx) => {
              const Icon = getTransactionIcon(tx.transactionType, tx.status);
              const isCredit = WALLET_CREDIT_TYPES.includes(tx.transactionType as any);
              const statusColor = tx.status === WalletTransactionStatus.SUCCESS ? "text-lime-500" : tx.status === WalletTransactionStatus.FAILED ? "text-red-500" : "text-amber-500";
              const statusText = tx.status === WalletTransactionStatus.SUCCESS ? "Success" : tx.status === WalletTransactionStatus.FAILED ? "Failed" : "Processing";

              return (
                <div key={tx.id}>
                  <div className="md:px-2">
                    <div
                      className={`flex items-center gap-3 md:gap-4 py-4 md:py-5 px-1 md:px-4 transition-all duration-300 rounded-[32px] cursor-pointer hover:bg-slate-100/70 hover:shadow-md active:scale-[0.98]`}
                      onClick={() => handleTransactionClick(tx)}
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl md:rounded-2xl border border-slate-100 flex items-center justify-center bg-white shadow-sm ring-4 ring-slate-50/30">
                          <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isCredit ? "text-primary" : "text-slate-600"}`} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col">
                        <h4 className="text-[15px] md:text-[16px] font-bold text-slate-900 truncate tracking-tight">
                          {tx.description || "Eatzy Transaction"}
                        </h4>
                        <p className="text-[11px] md:text-[12px] text-slate-400 font-medium mt-0.5">
                          {formatDate(tx.transactionDate)}
                        </p>
                        <div className="flex md:hidden items-center mt-1 opacity-60">
                          <span className="text-[11px] text-slate-500 font-medium">
                            Số dư: <span className="font-bold text-slate-600">
                              {showBalance ? `${Math.floor(tx.balanceAfter).toLocaleString('vi-VN')}đ` : '••••••'}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="hidden lg:flex shrink-0 w-[220px] justify-end pt-8 whitespace-nowrap ml-4">
                        <div className="flex items-center gap-1.5 opacity-70">
                          <Wallet size={12} className="text-slate-400" />
                          <span className="text-[12px] text-slate-400 font-medium">
                            Balance After: <span className="font-bold text-slate-500">
                              {showBalance ? `${Math.floor(tx.balanceAfter).toLocaleString('vi-VN')}đ` : '••••••'}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col justify-end shrink-0 min-w-fit md:min-w-[120px] md:ml-12">
                        <div className="text-[17px] font-bold text-slate-900 tracking-tight">
                          {isCredit ? '+' : ''}{Math.floor(tx.amount).toLocaleString('vi-VN')}đ
                        </div>
                        <p className={`text-[12px] font-bold mt-0.5 ${statusColor}`}>
                          {statusText}
                        </p>
                        <div className="flex md:hidden items-center justify-end gap-1.5 mt-1 opacity-60">
                          <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center">
                            <Wallet size={10} className="text-lime-500" />
                          </div>
                          <span className="text-[11px] text-slate-500 font-semibold tracking-tight">
                            {tx.transactionType.includes('VNPAY') ? 'VNPay' : 'Eatzy Wallet'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {idx < transactions.length - 1 && (
                    <div className="h-px bg-slate-100 mx-10" />
                  )}
                </div>
              );
            })
          )}

          {!isLoading && transactions.length > 0 && (
            <div className="w-full">
              <div ref={sentinelRef} className="h-4" />
              {isFetchingTransactions && (
                <div className="flex flex-col">
                  {[1, 2].map((i, idx) => (
                    <div key={`more-${i}`}>
                      <TransactionRowShimmer index={idx} />
                      {i < 2 && <div className="h-px bg-slate-100 mx-4 md:mx-10" />}
                    </div>
                  ))}
                </div>
              )}
              {!hasNextPage && !isFetchingTransactions && (
                <div className="py-2 md:pb-12 md:pt-4 flex items-center justify-center gap-4 opacity-60">
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <span className="text-[14px] font-bold text-gray-400 uppercase font-anton tracking-wider">End of list</span>
                  </div>
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <TransactionOrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={order}
        isLoading={isOrderLoading}
      />

      <TransactionDetailDrawer
        transaction={selectedTransaction}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
