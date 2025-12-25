"use client";

import { motion } from "@repo/ui/motion";
import { Calendar, Navigation, Clock, CheckCircle2, XCircle, MapPin } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import { DriverHistoryOrder } from "../data/mockDriverHistory";

export default function DriverHistoryCard({ order, onClick }: { order: DriverHistoryOrder; onClick: () => void }) {
  const isDelivered = order.status === "DELIVERED";
  const statusColor = isDelivered ? "text-green-600" : "text-red-500";
  const statusBg = isDelivered ? "bg-green-50" : "bg-red-50";

  // Format date
  const date = new Date(order.createdAt || 0);
  const dateStr = date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' });
  const timeStr = date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4 relative overflow-hidden"
    >
      {/* Top Row: Date & Earnings */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h3 className="font-bold text-[#1A1A1A] text-lg leading-none">
            {order.restaurantLocation?.name}
          </h3>
          <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mt-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateStr} • {timeStr}</span>
          </div>
        </div>
        <div className={`font-anton font-semibold text-xl leading-none ${isDelivered ? 'text-[var(--primary)]' : 'text-gray-400'}`}>
          {isDelivered ? `+${formatVnd(order.earnings)}` : "Đã hủy"}
        </div>
      </div>

      <div className="h-px bg-gray-50 -mx-5" />

      {/* Simplified Route Info - Compact & Clean */}
      <div className="space-y-3">
        {/* Pickup */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
          <div className="text-sm text-gray-600 truncate flex-1">{order.restaurantLocation?.name}</div>
        </div>

        {/* Dropoff */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <div className="text-sm text-[#1A1A1A] font-medium truncate flex-1">{order.deliveryLocation?.address}</div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
            <Navigation className="w-3.5 h-3.5" />
            <span>{order.distance} km</span>
          </div>
          {order.duration > 0 && (
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5" />
              <span>{order.duration} phút</span>
            </div>
          )}
        </div>

        {/* Status Badge */}
        {!isDelivered && (
          <div className={`flex items-center gap-1 pl-2 text-xs font-bold ${statusColor}`}>
            <span>Đã hủy</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
