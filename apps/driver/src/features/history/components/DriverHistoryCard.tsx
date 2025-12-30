"use client";

import { motion } from "@repo/ui/motion";
import { Calendar, Navigation, Clock, CheckCircle2, XCircle, MapPin } from "@repo/ui/icons";
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
      className="bg-white rounded-[24px] p-0 shadow-sm border-2 border-gray-200 flex flex-col relative overflow-hidden group hover:shadow-md transition-all duration-300"
    >
      {/* Header section with light background */}
      <div className="p-4 pb-2 border-b-2 border-gray-200 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm text-[var(--primary)]">
            {/* Show ChefHat icon for restaurant context */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" /><line x1="6" y1="17" x2="18" y2="17" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-[#1A1A1A] text-sm line-clamp-1">{order.restaurantLocation?.name}</h3>
            <span className="text-xs text-gray-400 font-medium tracking-wide">#{order.code || 'ORD'}</span>
          </div>
        </div>
        <div className={`text-base font-bold font-anton ${isDelivered ? 'text-[var(--primary)]' : 'text-gray-400'} tracking-wide`}>
          {isDelivered ? `+${formatVnd(order.earnings)}` : "0đ"}
        </div>
      </div>

      {/* Body Section */}
      <div className="p-4 pt-0 pb-4">
        {/* Visual Route */}
        <div className="relative pt-6 pb-2 pl-1">
          {/* Connecting Line */}
          <div className="absolute left-[8.5px] top-8 bottom-8 w-[2px] border-l-2 border-dashed border-gray-200" />

          {/* Pickup Point */}
          <div className="flex gap-3 relative mb-5">
            <div className="w-3 h-3 rounded-full border-[3px] border-[var(--primary)] bg-white z-10 shrink-0 mt-1 shadow-sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Nhận đơn</p>
              <p className="text-sm font-semibold text-[#1A1A1A] line-clamp-1">{order.restaurantLocation?.name}</p>
            </div>
          </div>

          {/* Dropoff Point */}
          <div className="flex gap-3 relative">
            <div className="w-3 h-3 rounded-full border-[3px] border-red-500 bg-white z-10 shrink-0 mt-1 shadow-sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Giao hàng</p>
              <p className="text-sm font-semibold text-[#1A1A1A] line-clamp-1">{order.deliveryLocation?.address}</p>
            </div>
          </div>
        </div>

        {/* Footer Details */}
        <div className="flex items-center gap-3 pt-4 mt-2 border-t border-gray-200">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeStr}, {dateStr}</span>
          </div>

          {/* Distance Pill */}
          {order.distance > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <Navigation className="w-3.5 h-3.5" />
              <span>{order.distance} km</span>
            </div>
          )}

          {/* Status Badge */}
          {isDelivered ? (
            <div className="ml-auto px-2.5 py-1.5 rounded-lg bg-emerald-50 text-[var(--primary)] text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="uppercase text-[10px]">Hoàn tất</span>
            </div>
          ) : (
            <div className="ml-auto px-2.5 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span className="uppercase text-[10px]">Đã hủy</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
