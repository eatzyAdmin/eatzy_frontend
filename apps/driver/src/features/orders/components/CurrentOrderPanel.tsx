"use client";
import { motion } from "@repo/ui/motion";
import type { DriverActiveOrder } from "@repo/types";
import { Phone, Compass, FileText, DollarSign, MapPin, Utensils } from "@repo/ui/icons";

export default function CurrentOrderPanel({ order, onArrived }: { order: DriverActiveOrder; onArrived?: () => void }) {
  const statusText = order.phase === 'PICKUP' ? 'Đang lấy đơn hàng' : 'Đang giao đơn hàng';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-[28px] overflow-hidden border border-gray-200 shadow-sm"
    >
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-anton font-bold text-[#1A1A1A] tracking-tight" style={{ fontStretch: "condensed" }}>
            {statusText}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-gray-100 text-[#555] text-sm font-semibold">
            {order.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Thẻ/Ví'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5 space-y-4">
        {/* Locations */}
        <div className="space-y-3">
          {/* Pickup */}
          <motion.div
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className="flex-shrink-0 mt-1 w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-md"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="w-3 h-3 rounded-full bg-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[#1A1A1A] text-base">{order.pickup.name}</div>
              <div className="text-sm text-[#777] mt-0.5">{order.pickup.address}</div>
            </div>
          </motion.div>

          {/* Connection Line */}
          <div className="ml-3.5 h-4 w-0.5 bg-gradient-to-b from-[var(--primary)] to-red-500" />

          {/* Dropoff */}
          <motion.div
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="flex-shrink-0 mt-1 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            >
              <MapPin size={14} className="text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[#1A1A1A] text-base">Điểm giao</div>
              <div className="text-sm text-[#777] mt-0.5">{order.dropoff.address}</div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Earnings info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-[#777]">
            <DollarSign size={16} className="text-[var(--primary)]" />
            <span>Thu nhập:</span>
            <span className="font-bold text-[var(--primary)] text-base">{Intl.NumberFormat('vi-VN').format(order.earnings.driverNetEarning)}đ</span>
          </div>
          <div className="h-4 w-px bg-gray-300" />
          <div className="flex items-center gap-2 text-[#777]">
            <span>Giá trị:</span>
            <span className="font-semibold text-[#1A1A1A]">{Intl.NumberFormat('vi-VN').format(order.earnings.orderSubtotal)}đ</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="h-11 text-[#555] flex flex-col items-center justify-center gap-2 font-semibold hover:border-gray-300 transition-colors"
          >
            <Utensils size={16} />
            <span className="text-xs">Chi tiết</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="h-11 text-[#555] flex flex-col items-center justify-center gap-2 font-semibold hover:border-gray-300 transition-colors"
          >
            <Phone size={16} />
            <span className="text-xs">Gọi quán</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="h-11 text-[#555] flex flex-col items-center justify-center gap-2 font-semibold hover:border-gray-300 transition-colors"
          >
            <Compass size={16} />
            <span className="text-xs">Chỉ đường</span>
          </motion.button>
        </div>

        {/* Arrived button */}
        <motion.button
          onClick={onArrived}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-14 rounded-xl bg-[var(--primary)] text-white font-anton font-semibold text-xl tracking-tight shadow-md"
          style={{ fontStretch: "condensed" }}
        >
          Đã đến
        </motion.button>
      </div>
    </motion.div>
  );
}
