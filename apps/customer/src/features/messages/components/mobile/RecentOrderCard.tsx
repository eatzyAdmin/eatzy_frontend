"use client";

import { motion } from "@repo/ui/motion";
import { ImageWithFallback } from "@repo/ui";
import { User, MessageSquareText } from "@repo/ui/icons";
import type { OrderResponse } from "@repo/types";
import { formatVnd } from "@repo/lib";
import { useOrderChatCount } from "../../hooks/useOrderChatCount";

interface RecentOrderCardProps {
  order: OrderResponse;
  onClick: () => void;
}

/**
 * RecentOrderCard Component
 * High-fidelity redesign using the FavoriteRestaurantCard overlay pattern
 * combined with the CurrentOrderCard typography.
 */
export default function RecentOrderCard({ order, onClick }: RecentOrderCardProps) {
  const driverName = order.driver?.name || "Finding driver...";
  const dishNamesStr = order.orderItems?.map(item => item.dish?.name).join(", ") || "Order items...";
  const { msgCount } = useOrderChatCount(order.id, !!order.driver);

  return (
    <div className="relative w-[130px] flex-shrink-0 group cursor-pointer" onClick={onClick}>
      {/* Background Shell - Peeking out at the bottom */}
      <div className="absolute inset-0 bg-[#F9FAFB] rounded-[32px] rounded-b-[24px] shadow-[0_0_12px_rgba(0,0,0,0.12)]" />

      {/* Main Card - Favorite style overlay */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="relative z-10 w-full aspect-[4/5] bg-white rounded-[32px] shadow-md overflow-hidden flex flex-col"
      >
        <ImageWithFallback
          src={order.restaurant?.imageUrl || ""}
          alt={order.restaurant?.name || "Restaurant"}
          fill
          placeholderMode="vertical"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="130px"
        />

        {/* Gradients like Favorites */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-[2]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent z-[2]" />

        {/* Message Icon - Indicates chat intent */}
        <div className="absolute top-3 right-3 z-[10]">
          <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center relative">
            <MessageSquareText className="w-4 h-4 text-white" />
            {msgCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] rounded-full bg-[var(--primary)] text-black text-[9px] font-black flex items-center justify-center px-0.5 border border-white shadow-sm">
                {msgCount}
              </span>
            )}
          </div>
        </div>

        {/* Info Overlay (Bottom) */}
        <div className="absolute bottom-3 left-3 right-3 z-[10] space-y-1">
          <h3 className="text-[14px] font-semibold text-white line-clamp-2 leading-tight tracking-tight shadow-sm">
            {order.restaurant?.name}
          </h3>
          <p className="text-[10px] text-white/70 font-medium line-clamp-1 italic opacity-90">
            {dishNamesStr}
          </p>
          <div className="pt-1.5">
            <p className="text-[15px] font-anton text-white leading-none pl-1 pb-1">
              {formatVnd(order.totalAmount)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Peeking Section (Driver Info) */}
      <div className="relative z-0 pt-2 pb-1.5 px-3 flex items-center gap-1.5 overflow-hidden">
        <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
          <User className="w-2.5 h-2.5 text-gray-400" />
        </div>
        <span className="text-[9px] font-bold text-gray-500 truncate uppercase tracking-tighter">
          {driverName}
        </span>
      </div>
    </div>
  );
}
