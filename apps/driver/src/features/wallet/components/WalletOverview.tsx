"use client";

import { motion } from "@repo/ui/motion";
import { Plus, Eye, EyeOff } from "@repo/ui/icons";
import { useState } from "react";

export default function WalletOverview({
  balance,
  onManage,
  isLoading = false,
}: {
  balance: number;
  onManage: () => void;
  isLoading?: boolean;
}) {
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="w-full bg-[#1A1A1A] rounded-[32px] p-6 text-white relative overflow-hidden shadow-sm">
      {/* Background decoration */}
      <div className="absolute top-0 right-0">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onManage}
          disabled={isLoading}
          className={`px-5 py-2.5 bg-[var(--primary)] font-extrabold text-gray-800 text-[12px] rounded-tr-[32px] rounded-bl-[32px] shadow-lg shadow-[var(--primary)]/20 transition-all flex items-center gap-1.5 uppercase tracking-tight ${isLoading ? 'opacity-50' : ''}`}
        >
          <Plus size={14} strokeWidth={4} />
          Top Up / Withdraw
        </motion.button>
      </div>

      <div className="relative z-10">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2.5 block opacity-60">Available Balance</span>
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-4xl md:text-5xl font-anton tracking-tight">
            {isLoading ? (
              <span className="opacity-10 min-w-[120px] inline-block">••••••</span>
            ) : showBalance ? (
              Math.floor(balance).toLocaleString('vi-VN')
            ) : (
              '••••••'
            )}
          </h2>
          <span className="text-lg font-anton text-[var(--primary)]">VNĐ</span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            disabled={isLoading}
            className="ml-2 p-2 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/5 backdrop-blur-md disabled:opacity-50"
          >
            {showBalance ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
          </button>
        </div>
      </div>
    </div>
  );
}
