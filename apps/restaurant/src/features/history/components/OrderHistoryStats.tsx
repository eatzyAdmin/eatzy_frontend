import { motion } from '@repo/ui/motion';
import { ShoppingBag, TrendingUp, XCircle } from '@repo/ui/icons';
import { mockOrderHistory } from '../data/mockHistory';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function OrderHistoryStats({ children }: { children?: React.ReactNode }) {
  const totalOrders = mockOrderHistory.length;
  const completedOrders = mockOrderHistory.filter(o => o.status === 'completed').length;
  const cancelledOrders = mockOrderHistory.filter(o => o.status === 'cancelled').length;
  const totalRevenue = mockOrderHistory
    .filter(o => o.status === 'completed')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="flex gap-6 pb-6 snap-x scrollbar-hide">
      {/* Total Orders Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="min-w-[300px] snap-start bg-gradient-to-br from-[#1A1A1A] to-gray-800 text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden group flex flex-col gap-6 justify-center"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
          <ShoppingBag className="w-32 h-32" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Total Orders</span>
          </div>
          <div className="text-4xl font-anton tracking-wide mb-1">
            {totalOrders}
          </div>
          <div className="text-xs text-white/60 font-medium">All time history</div>
        </div>
      </motion.div>

      {/* Revenue Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="min-w-[300px] snap-start bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col gap-4 justify-center hover:shadow-md transition-shadow group relative overflow-hidden"
      >
        <div className="absolute -right-4 -bottom-4 bg-lime-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />

        <div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
          </div>
          <div className="text-3xl font-anton text-[#1A1A1A] relative z-10">
            {formatCurrency(totalRevenue)}
          </div>
        </div>

        <div className="text-sm text-gray-500 font-medium relative z-10">
          From {completedOrders} completed orders
        </div>
      </motion.div>

      {/* Cancelled Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="min-w-[280px] snap-start bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col gap-4 justify-center hover:shadow-md transition-shadow group relative overflow-hidden"
      >
        <div className="absolute -right-4 -bottom-4 bg-red-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />

        <div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <XCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cancelled</span>
          </div>
          <div className="text-3xl font-anton text-[#1A1A1A] relative z-10">
            {cancelledOrders}
          </div>
        </div>

        <div className="text-sm text-gray-500 font-medium relative z-10">
          {(cancelledOrders / totalOrders * 100).toFixed(1)}% cancellation rate
        </div>
      </motion.div>

      {children}
    </div>
  );
}
