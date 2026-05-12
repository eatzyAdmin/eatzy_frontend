"use client";

import { motion } from "@repo/ui/motion";
import {
  X, CheckCircle2, AlertCircle, Clock, ArrowRight
} from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import {
  DriverWalletTransaction,
  WalletTransactionType,
  WalletDisplayStatus,
  isWalletCreditType,
  getWalletTransactionTypeLabel
} from "@repo/types";

import { useMemo } from "react";
import { useNotification, PullToRefresh } from "@repo/ui";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { useWalletTransactions } from "@/features/wallet/hooks/useWalletTransactions";

interface TransactionInfoViewProps {
  transaction: DriverWalletTransaction;
  onClose: () => void;
  onViewOrder: (orderId: number) => void;
}

export default function TransactionInfoView({
  transaction,
  onClose,
  onViewOrder,
}: TransactionInfoViewProps) {
  const { showNotification } = useNotification();
  const isPositive = useMemo(() => isWalletCreditType(transaction.type), [transaction.type]);

  const { refresh: refreshWallet } = useWallet();
  const { refresh: refreshTransactions } = useWalletTransactions();

  const handleRefresh = async () => {
    await Promise.all([
      refreshWallet(),
      refreshTransactions(),
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.id);
    showNotification({
      message: "Copied successfully",
      type: "success",
      format: "Transaction ID copied to clipboard"
    });
  };

  const details = useMemo(() => {
    const tx = transaction;
    switch (tx.type) {
      case WalletTransactionType.DELIVERY_EARNING:
        return {
          title: "DELIVERY EARNING",
          items: [
            { label: "Order ID", value: tx.referenceId ? `#${tx.referenceId}` : "N/A" },
            { label: "Type", value: "Delivery Fee" },
            { label: "Amount", value: formatVnd(tx.amount) },
            { label: "Balance After", value: formatVnd(tx.balanceAfter) },
          ]
        };
      case WalletTransactionType.WITHDRAWAL:
        return {
          title: "WITHDRAWAL DETAILS",
          items: [
            { label: "Type", value: "Bank Transfer" },
            { label: "Amount", value: formatVnd(Math.abs(tx.amount)) },
            { label: "Balance After", value: formatVnd(tx.balanceAfter) },
          ]
        };
      case WalletTransactionType.DEPOSIT:
      case WalletTransactionType.DEPOSIT_VNPAY:
        return {
          title: "DEPOSIT DETAILS",
          items: [
            { label: "Method", value: tx.type === WalletTransactionType.DEPOSIT_VNPAY ? "VNPay" : "Bank Transfer" },
            { label: "Amount", value: formatVnd(tx.amount) },
            { label: "Balance After", value: formatVnd(tx.balanceAfter) },
          ]
        };
      case WalletTransactionType.PAYMENT:
        return {
          title: "PAYMENT DETAILS",
          items: [
            { label: "Order ID", value: tx.referenceId ? `#${tx.referenceId}` : "N/A" },
            { label: "Type", value: "Order Payment" },
            { label: "Amount", value: formatVnd(Math.abs(tx.amount)) },
            { label: "Balance After", value: formatVnd(tx.balanceAfter) },
          ]
        };
      case WalletTransactionType.REFUND:
        return {
          title: "REFUND DETAILS",
          items: [
            { label: "Order ID", value: tx.referenceId ? `#${tx.referenceId}` : "N/A" },
            { label: "Type", value: "Order Refund" },
            { label: "Amount", value: formatVnd(tx.amount) },
            { label: "Balance After", value: formatVnd(tx.balanceAfter) },
          ]
        };
      case WalletTransactionType.COMMISSION_PAID:
        return {
          title: "COMMISSION DETAILS",
          items: [
            { label: "Order ID", value: tx.referenceId ? `#${tx.referenceId}` : "N/A" },
            { label: "Type", value: "Platform Commission" },
            { label: "Amount", value: formatVnd(Math.abs(tx.amount)) },
            { label: "Balance After", value: formatVnd(tx.balanceAfter) },
          ]
        };
      case WalletTransactionType.COD_RECEIVED:
        return {
          title: "COD RECEIVED",
          items: [
            { label: "Order ID", value: tx.referenceId ? `#${tx.referenceId}` : "N/A" },
            { label: "Type", value: "Cash on Delivery" },
            { label: "Amount", value: formatVnd(tx.amount) },
            { label: "Balance After", value: formatVnd(tx.balanceAfter) },
          ]
        };
      default:
        return {
          title: "TRANSACTION DETAILS",
          items: [
            { label: "Transaction ID", value: `#${tx.id}` },
            { label: "Type", value: getWalletTransactionTypeLabel(tx.type) },
            { label: "Amount", value: formatVnd(Math.abs(tx.amount)) },
            { label: "Balance After", value: formatVnd(tx.balanceAfter) },
          ]
        };
    }
  }, [transaction]);

  const { orderId, hasLinkedOrder } = useMemo(() => {
    const id = transaction.referenceId ? parseInt(transaction.referenceId) : null;
    return {
      orderId: id,
      hasLinkedOrder: !isNaN(id || NaN) && id !== null
    };
  }, [transaction.referenceId]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 relative z-20 bg-white">
        <div>
          <h2 className="text-2xl font-bold font-anton text-[#1A1A1A] uppercase leading-none">{details.title}</h2>
          <p className="text-gray-500 text-xs font-semibold mt-1">
            #{transaction.id.includes('-') ? transaction.id.split('-')[1] : transaction.id} • {new Date(transaction.timestamp).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <PullToRefresh
        onRefresh={async () => onClose()}
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar"
        pullText="Pull down to close"
        releaseText="Release to close now"
        refreshingText="Closing..."
        usePortal={false}
      >
        <div className="p-6 px-4 space-y-6">
          {/* Stats Row */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-3xl">
            <div className="text-center flex-1 border-r border-gray-200 last:border-0 px-2">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Time</div>
              <div className="text-base font-bold text-[#1A1A1A] font-anton">
                {new Date(transaction.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="text-center flex-1 border-r border-gray-200 last:border-0 px-2">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Date</div>
              <div className="text-base font-bold text-[#1A1A1A] font-anton">
                {new Date(transaction.timestamp).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
              </div>
            </div>
            <div className="text-center flex-1 px-2 min-w-0">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Type</div>
              <div className="text-[11px] font-bold text-[#1A1A1A] font-anton uppercase truncate">
                {getWalletTransactionTypeLabel(transaction.type)}
              </div>
            </div>
          </div>

          {/* Amount Section */}
          <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200 text-center relative overflow-hidden">
            <div className="py-2">
              <p className={`text-4xl font-bold font-anton ${isPositive ? 'text-[var(--primary)]' : 'text-[#1A1A1A]'}`}>
                {isPositive ? '+' : '-'}{formatVnd(Math.abs(transaction.amount))}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                {transaction.status === WalletDisplayStatus.COMPLETED && <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                {transaction.status === WalletDisplayStatus.PENDING && <Clock className="w-3.5 h-3.5 text-orange-600" />}
                {transaction.status === WalletDisplayStatus.FAILED && <AlertCircle className="w-3.5 h-3.5 text-red-600" />}
                <span className="uppercase">{transaction.status}</span>
              </div>
            </div>
          </div>

          {/* Action Button for Linked Order */}
          {hasLinkedOrder && (
            <button
              onClick={() => onViewOrder(orderId!)}
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

          {/* Info Details */}
          {details.items.length > 0 && (
            <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200">
              <h3 className="text-lg font-bold font-anton text-[#1A1A1A] mb-4">DETAILS</h3>
              <div className="space-y-1">
                {details.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm p-1">
                    <span className="font-bold text-gray-500">{item.label}</span>
                    <span className="font-bold text-[#1A1A1A] text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description Box */}
          <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200">
            <h3 className="text-lg font-bold font-anton text-[#1A1A1A] mb-4">DESCRIPTION</h3>
            <p className="text-sm pl-2 font-medium text-gray-600 leading-relaxed">
              {transaction.description}.
              {transaction.status === WalletDisplayStatus.PENDING && " This transaction is currently being processed by the system."}
              {transaction.status === WalletDisplayStatus.COMPLETED && " The transaction has been successfully completed."}
            </p>
          </div>

          {/* Footer Info */}
          <div className="text-center cursor-pointer pb-4" onClick={handleCopyId}>
            <p className="text-xs text-gray-400">Transaction ID: <span className="text-gray-600">#{transaction.id}</span></p>
          </div>
        </div>
      </PullToRefresh>
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
