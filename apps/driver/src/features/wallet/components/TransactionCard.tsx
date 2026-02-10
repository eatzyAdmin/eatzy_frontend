"use client";

import { motion } from "@repo/ui/motion";
import { formatVnd } from "@repo/lib";
import {
  DriverWalletTransaction,
  WalletTransactionType,
  WalletDisplayStatus,
  isWalletCreditType,
  isWalletDebitType,
  isWalletEarningType,
} from "@repo/types";
import { ArrowUpRight, ArrowDownLeft, Bike, DollarSign, RefreshCw } from "@repo/ui/icons";

const getIcon = (type: WalletTransactionType | string) => {
  // Earning types - show bike
  if (isWalletEarningType(type)) {
    return <Bike className="w-5 h-5 text-[var(--primary)]" />;
  }
  // Debit types - show arrow up (money out)
  if (isWalletDebitType(type)) {
    return <ArrowUpRight className="w-5 h-5 text-red-500" />;
  }
  // Refund - show refresh icon
  if (type === WalletTransactionType.REFUND) {
    return <RefreshCw className="w-5 h-5 text-blue-500" />;
  }
  // Credit types - show arrow down (money in)
  if (isWalletCreditType(type)) {
    return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
  }
  // Default
  return <DollarSign className="w-5 h-5 text-gray-500" />;
};

const getBgColor = (type: WalletTransactionType | string) => {
  if (isWalletEarningType(type)) {
    return "bg-[var(--primary)]/10";
  }
  if (isWalletDebitType(type)) {
    return "bg-red-50";
  }
  if (type === WalletTransactionType.REFUND) {
    return "bg-blue-50";
  }
  if (isWalletCreditType(type)) {
    return "bg-green-50";
  }
  return "bg-gray-50";
};

const getStatusColor = (status: WalletDisplayStatus) => {
  switch (status) {
    case WalletDisplayStatus.COMPLETED: return "text-green-600 bg-green-50";
    case WalletDisplayStatus.PENDING: return "text-yellow-600 bg-yellow-50";
    case WalletDisplayStatus.FAILED: return "text-red-600 bg-red-50";
    default: return "text-gray-600 bg-gray-50";
  }
};

export default function TransactionCard({ transaction, onClick }: { transaction: DriverWalletTransaction; onClick?: () => void }) {
  const isPositive = isWalletCreditType(transaction.type);
  const date = new Date(transaction.timestamp);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white p-4 rounded-3xl flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${getBgColor(transaction.type)}`}>
          {getIcon(transaction.type)}
        </div>
        <div>
          <p className="text-sm font-bold text-[#1A1A1A] line-clamp-1">{transaction.description}</p>
          <p className="text-xs text-gray-400 font-medium">
            {date.toLocaleDateString('vi-VN')} • {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className={`font-bold font-anton text-base ${isPositive ? 'text-[var(--primary)]' : 'text-[#1A1A1A]'} whitespace-nowrap shrink-0`}>
          {isPositive ? '+' : ''}{formatVnd(transaction.amount)}
        </p>
        {transaction.status !== WalletDisplayStatus.COMPLETED && (
          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mt-0.5 ${getStatusColor(transaction.status)}`}>
            {transaction.status}
          </span>
        )}
      </div>
    </motion.div>
  );
}
