"use client";

import { motion } from "@repo/ui/motion";
import { Clock, MapPin, Store, ArrowRight, CheckCircle2, XCircle } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import { DriverHistoryOrder } from "../data/mockDriverHistory";

export default function DriverHistoryCard({ order, onClick }: { order: DriverHistoryOrder; onClick: () => void }) {
  const isDelivered = order.status === "DELIVERED";

  // Format date
  const date = new Date(order.createdAt || 0);
  const dateStr = date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' });
  const timeStr = date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-[28px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col relative overflow-hidden group hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-2xl bg-[#F4F5F4] flex items-center justify-center shadow-sm border border-gray-100 text-[#1A1A1A]">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#1A1A1A] text-base line-clamp-1 max-w-[180px]">{order.restaurantLocation?.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg uppercase tracking-wider border border-gray-100">
                #{order.code || 'ORD'}
              </span>
              <div className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="text-xs font-medium text-gray-400">Food Delivery</span>
            </div>
          </div>
        </div>
        <div className={`text-xl font-bold font-anton ${isDelivered ? 'text-[var(--primary)]' : 'text-gray-400'} tracking-wide whitespace-nowrap shrink-0 bg-gray-50 px-3 py-1 rounded-xl`}>
          {isDelivered ? `+${formatVnd(order.earnings)}` : "0đ"}
        </div>
      </div>

      {/* Route Visual */}
      <div className="relative pl-2 mb-5">
        {/* Connecting Line */}
        <div className="absolute left-[12px] top-4 bottom-0 w-[2px] border-l-2 border-dashed border-gray-200" />

        {/* Pickup Point */}
        <div className="flex gap-4 relative mb-1 group/item">
          <div className="w-2.5 h-2.5 rounded-full bg-lime-500 ring-4 ring-lime-50 z-10 shrink-0 mt-1.5 transition-all group-hover/item:ring-[var(--primary)]/20 group-hover/item:bg-[var(--primary)]" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-600 line-clamp-1">{order.restaurantLocation?.name}</p>
          </div>
        </div>

        {/* Dropoff Point */}
        <div className="flex gap-4 relative group/item">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-50 z-10 shrink-0 mt-1.5 transition-all group-hover/item:ring-red-100" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-600 line-clamp-1">{order.deliveryLocation?.address}</p>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeStr}, {dateStr}</span>
        </div>

        {/* Status Badge */}
        {isDelivered ? (
          <div className="px-3 py-2 rounded-xl bg-lime-300 text-gray-500 text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-lime-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wide">COMPLETED</span>
          </div>
        ) : (
          <div className="px-3 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold flex items-center gap-1.5 border border-red-100">
            <XCircle className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wide">CANCELLED</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
