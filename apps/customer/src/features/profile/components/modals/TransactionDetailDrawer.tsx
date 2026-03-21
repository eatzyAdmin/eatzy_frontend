"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { WalletTransactionResponse, WalletTransactionStatus, WALLET_CREDIT_TYPES } from "@repo/types";
import { useOrderDetail } from "@/features/orders/hooks/useOrderDetail";
import {
  X, CheckCircle2, AlertCircle, Clock, Wallet,
  ArrowRight, Receipt, HandCoins, Ban, RefreshCw,
  ChevronLeft, MapPin, Package, CreditCard
} from "@repo/ui/icons";
import {
  CancellationAlert,
  RestaurantCard,
  DriverCard,
  OrderItemsList,
  LogisticsInfo,
  PaymentSummary,
  SafetyDisclaimer,
  OrderNotes,
} from "@/features/orders/components/order-detail";
import { MobileCarousel } from "@/features/orders/components/MobileCarousel";
import { OrderDetailDrawerShimmer } from "@repo/ui";
import { formatVnd } from "@repo/lib";
import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";

interface TransactionDetailDrawerProps {
  transaction: WalletTransactionResponse | null;
  open: boolean;
  onClose: () => void;
}

export default function TransactionDetailDrawer({
  transaction,
  open,
  onClose,
}: TransactionDetailDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'info' | 'order'>('info');
  const { order, isLoading, fetchOrder, clearOrder } = useOrderDetail();

  // Mobile Back Handling with nested view support
  const handleBack = () => {
    if (view === 'order') {
      setView('info');
    } else {
      onClose();
    }
  };

  useMobileBackHandler(open, handleBack);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setView('info');
        clearOrder();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, clearOrder]);

  const handleViewOrder = (orderId: number) => {
    setView('order');
    fetchOrder(orderId);
  };

  const handleBackToInfo = () => {
    setView('info');
  };

  if (!mounted) return null;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const isCredit = WALLET_CREDIT_TYPES.includes(transaction?.transactionType as any);
  const statusColor = transaction?.status === WalletTransactionStatus.SUCCESS ? "text-green-600" : transaction?.status === WalletTransactionStatus.FAILED ? "text-red-600" : "text-orange-600";
  const StatusIcon = transaction?.status === WalletTransactionStatus.SUCCESS ? CheckCircle2 : transaction?.status === WalletTransactionStatus.FAILED ? AlertCircle : Clock;
  const statusLabel = transaction?.status === WalletTransactionStatus.SUCCESS ? "COMPLETED" : transaction?.status === WalletTransactionStatus.FAILED ? "FAILED" : "PENDING";

  return createPortal(
    <AnimatePresence>
      {open && transaction && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 18, stiffness: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[210] bg-white rounded-t-[40px] overflow-hidden h-[92vh] max-h-[92vh] flex flex-col shadow-2xl"
          >
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {view === 'info' ? (
                  <motion.div
                    key="info"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex flex-col bg-white"
                  >
                    {/* Header mirrored from Driver info view */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                      <div>
                        <h2 className="text-2xl font-bold font-anton text-[#1A1A1A] uppercase leading-none">TRANSACTION DETAILS</h2>
                        <p className="text-gray-500 text-xs font-semibold mt-1">
                          #{transaction.id.toString().includes('-') ? transaction.id.toString().split('-')[1] : transaction.id} • {formatDate(transaction.transactionDate)}
                        </p>
                      </div>
                      <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>

                    <div className="overflow-y-auto p-6 px-4 space-y-6 no-scrollbar">
                      {/* Stats Row mirrored from Driver */}
                      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-3xl">
                        <div className="text-center flex-1 border-r border-gray-200 last:border-0 px-2">
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Giờ</div>
                          <div className="text-base font-bold text-[#1A1A1A] font-anton">
                            {formatTime(transaction.transactionDate)}
                          </div>
                        </div>
                        <div className="text-center flex-1 border-r border-gray-200 last:border-0 px-2">
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Ngày</div>
                          <div className="text-base font-bold text-[#1A1A1A] font-anton">
                            {formatDate(transaction.transactionDate)}
                          </div>
                        </div>
                        <div className="text-center flex-1 px-2 min-w-0">
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Loại</div>
                          <div className="text-[11px] font-bold text-[#1A1A1A] font-anton uppercase truncate">
                            {transaction.transactionType}
                          </div>
                        </div>
                      </div>

                      {/* Amount Section mirrored from Driver - 4xl font size, p-5 padding */}
                      <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200 text-center relative overflow-hidden">
                        <div className="py-2">
                          <p className={`text-4xl font-bold font-anton ${isCredit ? 'text-[var(--primary)]' : 'text-[#1A1A1A]'}`}>
                            {isCredit ? '+' : '-'}{formatVnd(Math.abs(transaction.amount))}
                          </p>
                          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200 uppercase">
                            {StatusIcon && <StatusIcon size={14} className={statusColor} />}
                            <span>{statusLabel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Linked Order Action mirrored from Driver */}
                      {transaction.order?.id && (
                        <button
                          onClick={() => handleViewOrder(transaction.order!.id)}
                          className="w-full bg-[#1A1A1A] hover:bg-black text-white p-5 rounded-[28px] flex items-center justify-between group transition-all duration-300 shadow-xl shadow-black/10 active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                              <CheckCircle2 className="w-6 h-6 text-[var(--primary)]" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-0.5">Linked Order</span>
                              <span className="block text-base font-anton uppercase tracking-tight">View Order Details</span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                            <ArrowRight className="w-5 h-5 text-white" />
                          </div>
                        </button>
                      )}

                      {/* Info Details mirrored from Driver - p-5 padding, space-y-1 */}
                      <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200">
                        <h3 className="text-lg font-bold font-anton text-[#1A1A1A] mb-4 uppercase leading-none">DETAILS</h3>
                        <div className="space-y-1">
                          {transaction.order?.id && (
                            <div className="flex justify-between items-center text-sm p-1">
                              <span className="font-bold text-gray-500">Order ID</span>
                              <span className="font-bold text-[#1A1A1A] text-right">#{transaction.order.id}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-sm p-1">
                            <span className="font-bold text-gray-500">Type</span>
                            <span className="font-bold text-[#1A1A1A] text-right">{transaction.transactionType}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm p-1">
                            <span className="font-bold text-gray-500">Amount</span>
                            <span className="font-bold text-[#1A1A1A] text-right">{formatVnd(Math.abs(transaction.amount))}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm p-1">
                            <span className="font-bold text-gray-500">Balance After</span>
                            <span className="font-bold text-[#1A1A1A] text-right">{formatVnd(transaction.balanceAfter)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description Box mirrored from Driver - p-5 padding */}
                      <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200">
                        <h3 className="text-lg font-bold font-anton text-[#1A1A1A] mb-4 uppercase leading-none">DESCRIPTION</h3>
                        <p className="text-sm pl-2 font-medium text-gray-600 leading-relaxed">
                          {transaction.description}.
                          {transaction.status === WalletTransactionStatus.SUCCESS && " The transaction has been successfully completed."}
                          {transaction.status === WalletTransactionStatus.PENDING && " This transaction is currently being processed by the system."}
                        </p>
                      </div>

                      {/* Footer Info mirrored from Driver - exact styles */}
                      <div className="text-center cursor-pointer pb-2">
                        <p className="text-xs text-gray-400">Transaction ID: <span className="text-gray-600">#{transaction.id}</span></p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="order"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex flex-col bg-white"
                  >
                    {/* Header mirrored from Driver LinkedOrderView */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-20">
                      <button
                        onClick={handleBackToInfo}
                        className="flex items-center gap-1.5 p-2 pr-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-all group overflow-hidden"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-sm font-bold font-anton text-gray-700 uppercase leading-none">Back</span>
                      </button>

                      <div className="text-center flex-1 pr-12">
                        <h2 className="text-xl font-bold font-anton text-[#1A1A1A] uppercase leading-none">ORDER CONTENT</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1.5">#ID:{order?.id || '...'}</p>
                      </div>

                      <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors absolute right-6">
                        <X className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                      {isLoading ? (
                        <div className="">
                          <OrderDetailDrawerShimmer />
                        </div>
                      ) : order ? (
                        <div className="flex flex-col gap-3 md:gap-4 p-3 bg-[#F8F9FA]">
                          {order.orderStatus === "CANCELLED" && <CancellationAlert reason={order.cancellationReason} />}

                          <MobileCarousel singleFocus>
                            <RestaurantCard restaurant={order.restaurant} />
                            <DriverCard driver={order.driver} />
                          </MobileCarousel>

                          <OrderItemsList order={order} />
                          <LogisticsInfo order={order} />
                          <PaymentSummary order={order} />

                          <div className="flex flex-col gap-6 mb-10">
                            {order.specialInstructions && <OrderNotes notes={order.specialInstructions} />}
                            <SafetyDisclaimer />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-gray-400">
                          <Ban size={48} className="opacity-20 mb-4" />
                          <p className="font-bold uppercase tracking-widest">Không tìm thấy đơn hàng</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
