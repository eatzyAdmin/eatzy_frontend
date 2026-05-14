import { motion } from '@repo/ui/motion';
import { Store, ChevronRight } from '@repo/ui/icons';
import { ImageWithFallback } from '@repo/ui';
import { formatVnd } from '@repo/lib';

const statusConfig: Record<string, { label: string; color: string; bg: string; iconBg: string }> = {
  PENDING: { label: "Pending", color: "text-gray-700", bg: "bg-gray-200/30", iconBg: "bg-gray-200/40" },
  PLACED: { label: "Placed", color: "text-amber-700", bg: "bg-amber-200/30", iconBg: "bg-amber-200/40" },
  PREPARING: { label: "Preparing", color: "text-amber-700", bg: "bg-amber-200/30", iconBg: "bg-amber-200/40" },
  READY: { label: "Ready", color: "text-amber-700", bg: "bg-amber-200/30", iconBg: "bg-amber-200/40" },
  PICKED_UP: { label: "Picked Up", color: "text-amber-700", bg: "bg-amber-200/30", iconBg: "bg-amber-200/40" },
  ARRIVED: { label: "Arrived", color: "text-lime-700", bg: "bg-lime-200/30", iconBg: "bg-lime-200/40" },
  DELIVERED: { label: "Completed", color: "text-lime-700", bg: "bg-lime-200/30", iconBg: "bg-lime-200/40" },
  CANCELLED: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50/95", iconBg: "bg-red-200/40" },
};

export const StickyOrderHeaderCard = ({ order, compact = false }: { order: any, compact?: boolean }) => {
  const config = statusConfig[order.status] || statusConfig.PENDING;

  if (compact) {
    return (
      <div className="relative w-full flex flex-row overflow-hidden rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] h-[56px] group bg-white/50 backdrop-blur-md border border-white/40">
        <div className="relative w-14 h-full flex-shrink-0 overflow-hidden z-10 opacity-90">
          <ImageWithFallback
            src={order.restaurantImage || ""}
            alt={order.restaurantName}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="flex-1 px-3 flex flex-row items-center justify-between min-w-0 relative z-10">
          <div className="min-w-0 flex-1 mr-2">
            <h4 className="font-bold text-gray-700 text-[13px] truncate leading-tight tracking-tight">
              {order.restaurantName}
            </h4>
            <div className="text-[13px] font-anton font-bold text-gray-500 leading-none mt-1.5">
              {formatVnd(order.total)}
            </div>
          </div>
          <div className={`shrink-0 px-2 py-1 rounded-lg ${config.bg} flex items-center justify-center`}>
            <span className={`text-[9px] font-bold uppercase ${config.color} tracking-tight leading-none`}>
              {config.label}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 pt-1">
      <div className="relative w-full flex flex-row overflow-hidden rounded-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] h-[90px] group">
        {/* Layer 1: Background Blur Layer (Sharp text fix) */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-md opacity-80 z-0 border border-white/40" />

        {/* Layer 2: Visual Identity (Left) */}
        <div className="relative w-24 h-full flex-shrink-0 overflow-hidden z-10 opacity-90">
          <ImageWithFallback
            src={order.restaurantImage || ""}
            alt={order.restaurantName}
            fill
            className="object-cover"
            sizes="96px"
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>


        {/* Layer 3: Info & Content (Right) */}
        <div className="flex-1 p-3 flex flex-col justify-center min-w-0 relative z-10">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-gray-700 text-[15px] truncate leading-tight tracking-tight">
                {order.restaurantName}
              </h4>
              <p className="text-[10px] text-gray-400 font-medium line-clamp-1 italic mt-0.5">
                {order.dishNames}
              </p>
            </div>

            {/* Status Badge - 100% Identity to History Item Count Mobile Style with Status Colors */}
            <div className="shrink-0 bg-gray-100/90 px-2 py-1 rounded-xl border border-white/10 shadow-sm flex items-center justify-center">
              <span className={`text-[10px] font-bold uppercase ${config.color} tracking-tight leading-none`}>
                {config.label}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="text-[17px] font-anton font-semibold text-gray-700 leading-none tracking-tight">
              {formatVnd(order.total)}
            </div>

            <div className="w-7 h-7 rounded-full bg-white/50 border border-white/40 flex items-center justify-center text-gray-500 shadow-sm transition-all active:scale-95">
              <ChevronRight size={12} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
