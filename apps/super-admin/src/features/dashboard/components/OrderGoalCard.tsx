import { motion } from "@repo/ui/motion";
import { MoreHorizontal } from "lucide-react";

interface OrderGoalCardProps {
  completedOrders: number;
  totalOrders: number;
  averageOrderValue: number;
}

export function OrderGoalCard({ completedOrders, totalOrders, averageOrderValue }: OrderGoalCardProps) {
  const percentage = totalOrders > 0 ? Math.min(Math.max((completedOrders / totalOrders) * 100, 0), 100) : 0;

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between h-48">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Tỉ lệ hoàn thành</h3>
          <div className="text-3xl font-bold text-gray-900">
            {percentage.toFixed(1)}% <span className="text-sm text-gray-400 font-normal">/ 100%</span>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{completedOrders} Thành công</span>
          <span>{totalOrders} Tổng đơn</span>
        </div>

        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, #fff 50%)', backgroundSize: '10px 100%' }}
          />

          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Mục tiêu: 95%</span>
          <span className="font-bold text-blue-600">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(averageOrderValue)} / đơn
          </span>
        </div>
      </div>
    </div>
  );
}
