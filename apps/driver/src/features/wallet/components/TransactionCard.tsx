"use client";

import { motion } from "@repo/ui/motion";
import { formatVnd } from "@repo/lib";
import { WalletTransaction } from "../data/mockWalletData";
import { CheckCircle2, ArrowUpRight, ArrowDownLeft, Bike, DollarSign } from "@repo/ui/icons";

const getIcon = (type: WalletTransaction["type"]) => {
  switch (type) {
    case "EARNING":
      return <Bike className="w-5 h-5 text-[var(--primary)]" />;
    case "WITHDRAWAL":
      return <ArrowUpRight className="w-5 h-5 text-red-500" />;
    case "TOP_UP":
      return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
    case "COD_REMITTANCE":
      return <DollarSign className="w-5 h-5 text-orange-500" />;
    default:
      return <CheckCircle2 className="w-5 h-5 text-gray-500" />;
  }
};

const getBgColor = (type: WalletTransaction["type"]) => {
  switch (type) {
    case "EARNING": return "bg-[var(--primary)]/10";
    case "WITHDRAWAL": return "bg-red-50";
    case "TOP_UP": return "bg-green-50";
    case "COD_REMITTANCE": return "bg-orange-50";
    default: return "bg-gray-50";
  }
};

const getStatusColor = (status: WalletTransaction["status"]) => {
  switch (status) {
    case "COMPLETED": return "text-green-600 bg-green-50";
    case "PENDING": return "text-yellow-600 bg-yellow-50";
    case "FAILED": return "text-red-600 bg-red-50";
    default: return "text-gray-600 bg-gray-50";
  }
};

export default function TransactionCard({ transaction, onClick }: { transaction: WalletTransaction; onClick?: () => void }) {
  const isPositive = transaction.type === "EARNING" || transaction.type === "TOP_UP";
  const date = new Date(transaction.timestamp);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBgColor(transaction.type)}`}>
          {getIcon(transaction.type)}
        </div>
        <div>
          <p className="text-sm font-bold text-[#1A1A1A]">{transaction.description}</p>
          <p className="text-xs text-gray-400 font-medium">
            {date.toLocaleDateString('vi-VN')} • {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className={`font-bold font-anton text-base ${isPositive ? 'text-[var(--primary)]' : 'text-[#1A1A1A]'}`}>
          {isPositive ? '+' : ''}{formatVnd(transaction.amount)}
        </p>
        {transaction.status !== 'COMPLETED' && (
          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mt-0.5 ${getStatusColor(transaction.status)}`}>
            {transaction.status}
          </span>
        )}
      </div>
    </motion.div>
  );
}
