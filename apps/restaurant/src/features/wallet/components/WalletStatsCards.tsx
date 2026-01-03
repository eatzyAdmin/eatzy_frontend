import { motion } from '@repo/ui/motion';
import { CreditCard, TrendingUp, DollarSign, ArrowUpRight } from '@repo/ui/icons';
import { mockWallet } from '../data/mockWallet';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function WalletStatsCards({ onWithdraw, isLoading = false, children }: { onWithdraw?: () => void, isLoading?: boolean, children?: React.ReactNode }) {
  const { balance } = mockWallet;

  return (
    <div className="flex gap-6 pb-6 snap-x scrollbar-hide">
      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="min-w-[340px] md:min-w-[400px] snap-start bg-gradient-to-br from-[#1A1A1A] to-gray-800 text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden group flex flex-col gap-6 justify-center"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
          <DollarSign className="w-32 h-32" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <CreditCard className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Available Balance</span>
          </div>
          <div className="text-4xl font-anton tracking-wide mb-1">
            {isLoading ? (
              <div className="h-10 w-48 bg-white/20 animate-pulse rounded-lg" />
            ) : (
              formatCurrency(balance.available)
            )}
          </div>
          <div className="text-xs text-white/60 font-medium">Updated just now</div>
        </div>

        <button
          onClick={onWithdraw}
          className="w-fit flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg active:scale-95 duration-200"
        >
          <span>Withdraw Funds</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Today's Earnings */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="min-w-[300px] snap-start bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col gap-4 justify-center hover:shadow-md transition-shadow group relative overflow-hidden"
      >
        <div className="absolute -right-4 -bottom-4 bg-green-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />

        <div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Today&apos;s Earnings</span>
          </div>
          <div className="text-3xl font-anton text-[#1A1A1A] relative z-10">
            {isLoading ? (
              <div className="h-9 w-40 bg-gray-200 animate-pulse rounded-lg" />
            ) : (
              formatCurrency(balance.total_earnings_today)
            )}
          </div>
        </div>

        <div className="text-sm text-gray-500 font-medium relative z-10">
          {isLoading ? (
            <div className="h-4 w-24 bg-gray-100 animate-pulse rounded mt-1" />
          ) : (
            <span className="text-green-600 font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +12.5%
              <span className="text-gray-500 font-medium ml-1">vs yesterday</span>
            </span>
          )}
        </div>
      </motion.div>

      {/* Injected Children (Bank Info, Helpers, etc.) */}
      {children}
    </div>
  );
}
