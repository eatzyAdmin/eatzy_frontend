"use client";

import { motion } from "@repo/ui/motion";
import { formatVnd } from "@repo/lib";
import { WalletStats } from "../data/mockWalletData";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "@repo/ui/icons";

export default function WalletOverview({
  stats,
  onTopUp,
  onWithdraw
}: {
  stats: WalletStats,
  onTopUp: () => void,
  onWithdraw: () => void
}) {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-[#1A1A1A] text-white p-6 shadow-xl shadow-black/10">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Wallet className="w-32 h-32 text-white" />
      </div>

      <div className="relative z-10">
        <p className="text-white/60 text-sm font-medium mb-1">Số dư khả dụng</p>
        <h2 className="text-4xl font-bold font-anton tracking-wide mb-6">
          {formatVnd(stats.availableBalance)}
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md">
            <p className="text-white/60 text-xs mb-1">Thu nhập hôm nay</p>
            <p className="text-lg font-bold font-anton">{formatVnd(stats.todayEarnings)}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md">
            <p className="text-white/60 text-xs mb-1">Đang xử lý</p>
            <p className="text-lg font-bold font-anton text-yellow-400">{formatVnd(stats.pendingBalance)}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onTopUp}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors backdrop-blur-md"
          >
            <div className="bg-green-500/20 p-1 rounded-full">
              <ArrowDownLeft className="w-4 h-4 text-green-400" />
            </div>
            Nạp tiền
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onWithdraw}
            className="flex-1 bg-[var(--primary)] hover:brightness-110 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary)]/30 transition-all"
          >
            <div className="bg-white/20 p-1 rounded-full">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
            Rút tiền
          </motion.button>
        </div>
      </div>
    </div>
  );
}
