"use client";

import { motion } from "@repo/ui/motion";
import { Store, CheckCircle2, XCircle, MapPin } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import { DriverHistoryOrder } from "@repo/types";

export default function DriverHistoryCard({ order, onClick }: { order: DriverHistoryOrder; onClick: () => void }) {
  const isDelivered = order.status === "DELIVERED";
  const isCancelled = order.status === "CANCELLED";

  const cleanAddress = (addr?: string) => {
    if (!addr) return "";
    return addr
      .replace(/,\s*\d{5}\s*(?=,|$)/g, "") // Remove zip code with preceding comma
      .replace(/\b\d{5}\b\s*,?\s*/g, "")    // Remove standalone zip code
      .replace(/,\s*,/g, ",")              // Fix double commas
      .trim()
      .replace(/^,|,$/g, "");              // Trim leading/trailing commas
  };

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const itemNames = order.items.map(item => item.name).join(", ");

  // Format date
  const date = new Date(order.createdAt || 0);
  const dateStr = date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: '2-digit' });
  const timeStr = date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative w-full cursor-pointer"
    >
      <div className={`relative flex flex-col p-4 overflow-hidden rounded-[36px] bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)] transition-all duration-500 md:hover:bg-gray-50/50 md:hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-50`}>

        {/* Header: Store Info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] transition-colors duration-300">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none block mb-1">Store</span>
              <h4 className="font-extrabold text-[#1A1A1A] text-sm md:text-base truncate leading-tight tracking-tight">
                {order.restaurantLocation?.name}
              </h4>
            </div>
          </div>

          <div className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter self-start mt-1">
            {timeStr} • {dateStr}
          </div>
        </div>

        {/* Middle: Delivery Point */}
        <div className="flex items-center gap-2 px-0 mb-3">
          <div className="w-6 h-6 rounded-full bg-lime-50 flex items-center justify-center shrink-0">
            <MapPin className="w-3 h-3 text-lime-500" />
          </div>
          <p className="text-[12px] font-bold text-gray-600 line-clamp-1 opacity-60">
            {cleanAddress(order.deliveryLocation?.address)}
          </p>
        </div>

        {/* Footer: Items Summary & Earnings */}
        <div className="flex items-end justify-between pt-1 border-t border-gray-100/60">
          <div className="min-w-0 max-w-[60%]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none opacity-50">Items</span>
              <span className="text-[8px] font-black bg-gray-400 text-white px-1.5 py-0.5 rounded-md tracking-tight">
                {itemCount} items
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium line-clamp-1 italic opacity-60">
              {itemNames}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none block mb-1 opacity-50">
              {isDelivered ? "EARNED" : isCancelled ? "CANCELLED" : "RESULT"}
            </span>
            <div className={`text-xl md:text-xl font-anton font-semibold ${isDelivered ? 'text-[var(--primary)]' : isCancelled ? 'text-red-400' : 'text-gray-700'} leading-none tracking-tight`}>
              {formatVnd(order.earnings)}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Status Ribbon */}
      {/* {isDelivered && (
        <div className="absolute top-10 right-[-9px] z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 bg-lime-500 text-white pl-3 pr-4 py-1.5 rounded-l-2xl shadow-lg border-y border-r border-white/20">
            <CheckCircle2 size={12} strokeWidth={3} />
            <span className="text-[10px] font-black font-anton uppercase tracking-widest pt-0.5">COMPLETED</span>
          </div>
          <div className="absolute right-[0px] -bottom-2 w-0 h-0 border-t-[8px] border-t-lime-700 opacity-60 border-r-[8px] border-r-transparent" />
        </div>
      )} */}

      {isCancelled && (
        <div className="absolute top-10 right-[-9px] z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 bg-red-600 text-white pl-3 pr-4 py-1.5 rounded-l-2xl shadow-lg border-y border-r border-white/20">
            <XCircle size={12} strokeWidth={3} />
            <span className="text-[10px] font-black font-anton uppercase tracking-widest pt-0.5">CANCELLED</span>
          </div>
          <div className="absolute right-[0px] -bottom-2 w-0 h-0 border-t-[8px] border-t-red-700 opacity-60 border-r-[8px] border-r-transparent" />
        </div>
      )}
    </motion.div>
  );
}
