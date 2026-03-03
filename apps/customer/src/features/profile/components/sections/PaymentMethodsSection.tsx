"use client";

import { useState } from "react";
import { motion } from "@repo/ui/motion";
import {
  Wallet, ArrowUpRight, ArrowDownLeft, ShieldCheck,
  History as TransactionsIcon, CreditCard, Plus, ArrowRight,
  Check, Loader2, RefreshCw, Smartphone, TrendingUp, TrendingDown,
  ArrowUp, ArrowDown, HandCoins, Receipt, Ban, Clock, Eye, EyeOff
} from "@repo/ui/icons";
import { WalletTransactionsShimmer } from "@repo/ui";
import { useCustomerWalletTransactions } from "../../hooks/useCustomerWalletTransactions";
import { useOrderDetail } from "@/features/orders/hooks/useOrderDetail";
import { WalletTransactionType, WalletTransactionStatus, WALLET_CREDIT_TYPES } from "@repo/types";
import TransactionOrderDetailModal from "../modals/TransactionOrderDetailModal";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount).replace("₫", "VNĐ");
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
};

export default function PaymentMethodsSection() {
  const { wallet, transactions, isLoading, error, refresh } = useCustomerWalletTransactions();
  const { order, isLoading: isOrderLoading, fetchOrder, clearOrder } = useOrderDetail();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  if (isLoading) {
    return <WalletTransactionsShimmer />;
  }

  const handleTransactionClick = (orderId?: number) => {
    if (orderId) {
      fetchOrder(orderId);
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

  const getTransactionColor = (type: string, status: string) => {
    if (status === WalletTransactionStatus.FAILED) return "text-red-500 bg-red-50 border-red-100";
    if (status === WalletTransactionStatus.PENDING) return "text-amber-500 bg-amber-50 border-amber-100";

    const isCredit = WALLET_CREDIT_TYPES.includes(type as any);
    return isCredit
      ? "text-lime-600 bg-lime-50 border-lime-100"
      : "text-blue-600 bg-blue-50 border-blue-100";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Integrated Header & Balance */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-gray-100">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                <Wallet size={12} />
                Quản lý tài chính
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-x-6 gap-y-2">
              <div className="flex items-baseline gap-4">
                <h2 className="text-[56px] font-bold leading-none text-[#1A1A1A] uppercase tracking-tight" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
                  {wallet ? (showBalance ? wallet.balance.toLocaleString('vi-VN') : '••••••') : '0'}
                </h2>
                <span className="text-2xl font-anton uppercase mb-1">VNĐ</span>

                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="mb-2 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                  title={showBalance ? "Ẩn số dư" : "Hiện số dư"}
                >
                  {showBalance ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-6 py-3.5 bg-[#1A1A1A] text-white font-anton text-xs uppercase tracking-wider rounded-2xl hover:bg-lime-500 hover:text-black transition-all shadow-lg active:scale-95 flex items-center gap-2">
              <Plus size={16} />
              Nạp tiền
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[#1A1A1A]">
              <TransactionsIcon size={20} />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-[#1A1A1A]">Lịch sử giao dịch</h3>
          </div>
        </div>

        <div className="flex flex-col">
          {transactions.length === 0 ? (
            <div className="py-20 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center text-gray-400 bg-slate-50/30">
              <Receipt size={32} className="opacity-20 mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">Chưa có giao dịch nào</p>
              <p className="text-xs">Mọi chi tiêu và nạp tiền sẽ xuất hiện ở đây</p>
            </div>
          ) : (
            transactions.map((tx, idx) => {
              const Icon = getTransactionIcon(tx.transactionType, tx.status);
              const isCredit = WALLET_CREDIT_TYPES.includes(tx.transactionType as any);
              const statusColor = tx.status === WalletTransactionStatus.SUCCESS ? "text-lime-500" : tx.status === WalletTransactionStatus.FAILED ? "text-red-500" : "text-amber-500";
              const statusText = tx.status === WalletTransactionStatus.SUCCESS ? "Thành công" : tx.status === WalletTransactionStatus.FAILED ? "Thất bại" : "Đang xử lý";

              return (
                <div key={tx.id}>
                  <div className="px-2">
                    <div
                      className={`flex items-center gap-4 py-5 px-4 transition-all duration-300 rounded-[32px] ${tx.order?.id ? 'cursor-pointer hover:bg-slate-100/70 hover:shadow-md active:scale-[0.98]' : 'cursor-default'}`}
                      onClick={() => handleTransactionClick(tx.order?.id)}
                    >
                      {/* Column 1: Icon */}
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center bg-white shadow-sm ring-4 ring-slate-50/30">
                          <Icon size={22} className={isCredit ? "text-primary" : "text-slate-600"} />
                        </div>
                      </div>

                      {/* Column 2: Basic Info (Left) */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <h4 className="text-[16px] font-bold text-slate-900 truncate tracking-tight">
                          {tx.description || "Giao dịch Eatzy"}
                        </h4>
                        <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                          {formatDate(tx.transactionDate)}
                        </p>
                      </div>

                      {/* Column 3: Balance After (Targeted to align with the bottom row info) */}
                      <div className="hidden lg:flex flex-1 justify-end pt-8 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 opacity-70">
                          <Wallet size={12} className="text-slate-400" />
                          <span className="text-[12px] text-slate-400 font-medium">
                            Balance After: <span className="font-bold text-slate-500">
                              {showBalance ? `${tx.balanceAfter.toLocaleString('vi-VN')}đ` : '••••••'}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Column 4: Amount & Status (Right Aligned) */}
                      <div className="flex-1 text-right flex flex-col justify-center shrink-0">
                        <div className="text-[17px] font-bold text-slate-900 tracking-tight">
                          {isCredit ? '+' : ''}{tx.amount.toLocaleString('vi-VN')}đ
                        </div>
                        <p className={`text-[12px] font-bold mt-0.5 ${statusColor}`}>
                          {statusText}
                        </p>
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
        </div>
      </div>

      <TransactionOrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={order}
        isLoading={isOrderLoading}
      />
    </motion.div>
  );
}

function ChevronRight({ size, className }: { size: number, className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
