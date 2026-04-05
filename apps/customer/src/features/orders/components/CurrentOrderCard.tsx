import { useRouter } from "next/navigation";
import { motion } from "@repo/ui/motion";
import { ImageWithFallback, useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import { Store, MapPin, ChefHat, Bike, BadgeCheck, ClipboardList, X, Clock, ChevronRight } from "@repo/ui/icons";
import type { OrderResponse } from "@repo/types";
import { formatVnd } from "@repo/lib";

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string; border: string; iconBg: string }> = {
  PENDING: { label: "Pending", icon: Clock, color: "text-gray-700", bg: "bg-gray-200/30", border: "border-gray-100/50", iconBg: "bg-gray-200/40" },
  PLACED: { label: "Placed", icon: ClipboardList, color: "text-amber-700", bg: "bg-amber-200/30", border: "border-amber-100/50", iconBg: "bg-amber-200/40" },
  PREPARING: { label: "Preparing", icon: ChefHat, color: "text-amber-700", bg: "bg-amber-200/30", border: "border-amber-100/50", iconBg: "bg-amber-200/40" },
  READY: { label: "Ready", icon: ChefHat, color: "text-amber-700", bg: "bg-amber-200/30", border: "border-amber-100/50", iconBg: "bg-amber-200/40" },
  PICKED_UP: { label: "Picked Up", icon: Bike, color: "text-amber-700", bg: "bg-amber-200/30", border: "border-amber-100/50", iconBg: "bg-amber-200/40" },
  ARRIVED: { label: "Arrived", icon: Bike, color: "text-lime-700", bg: "bg-lime-200/30", border: "border-lime-100/50", iconBg: "bg-lime-200/40" },
  DELIVERED: { label: "Completed", icon: BadgeCheck, color: "text-lime-700", bg: "bg-lime-200/30", border: "border-lime-100/50", iconBg: "bg-lime-200/40" },
  CANCELLED: { label: "Cancelled", icon: X, color: "text-red-700", bg: "bg-red-50/95", border: "border-red-100/50", iconBg: "bg-red-200/40" },
  REJECTED: { label: "Rejected", icon: X, color: "text-red-700", bg: "bg-red-50/95", border: "border-red-100/50", iconBg: "bg-red-200/40" },
};

export default function CurrentOrderCard({ order, onClick }: { order: OrderResponse; onClick: () => void }) {
  const router = useRouter();
  const config = statusConfig[order.orderStatus] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  const {
    containerRef,
    rect,
    style: highlightStyle,
    moveHighlight,
    clearHover,
  } = useHoverHighlight<HTMLDivElement>();

  // Calculate items sum
  const totalItems = order.orderItems.reduce((acc, item) => acc + item.quantity, 0);
  const dishNamesStr = order.orderItems.map(item => item.dish.name).join(", ");

  // Format time ago or date
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const timeStr = orderDate.toLocaleDateString("vi-VN", { day: 'numeric', month: 'short' });

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "PENDING": return "Đang chờ xác nhận";
      case "PLACED": return "Đã đặt hàng thành công";
      case "PREPARING": return "Nhà hàng đang chuẩn bị";
      case "READY": return "Đang chờ tài xế lấy hàng";
      case "DRIVER_ASSIGNED": return "Tài xế đang đến lấy";
      case "PICKED_UP": return "Đang giao hàng đến bạn";
      case "ARRIVED": return "Tài xế đã đến điểm giao";
      case "DELIVERED": return "Giao hàng thành công";
      case "CANCELLED": return "Đơn hàng đã hủy";
      case "REJECTED": return "Hệ thống đã từ chối";
      default: return "Đang cập nhật...";
    }
  };

  return (
    <div className="relative w-full group/card mb-4">
      {/* Background Shell - Peeking out below the card */}
      <div className={`absolute inset-0 z-0 ${config.bg} rounded-[40px] rounded-b-[32px] transition-colors duration-500 shadow-sm`} />

      {/* Main Card */}
      <motion.div
        ref={containerRef}
        whileHover={{ y: -8 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 1
        }}
        onClick={onClick}
        onMouseEnter={(e) =>
          moveHighlight(e, {
            borderRadius: 40,
            backgroundColor: "rgba(255,255,255,0.05)",
            opacity: 1,
            scaleEnabled: false,
          })
        }
        onMouseMove={(e) =>
          moveHighlight(e, {
            borderRadius: 40,
            backgroundColor: "rgba(255,255,255,0.05)",
            opacity: 1,
            scaleEnabled: false,
          })
        }
        onMouseLeave={clearHover}
        className="relative z-10 w-full h-[140px] flex flex-row overflow-hidden rounded-[40px] shadow-[0_4px_25px_rgba(0,0,0,0.08)] cursor-pointer bg-white"
      >
        <HoverHighlightOverlay rect={rect} style={highlightStyle} />

        {/* Visual Identity Section (Left) */}
        <div className="relative w-36 h-full flex-shrink-0 overflow-hidden">
          <ImageWithFallback
            src={order.restaurant.imageUrl || ""}
            alt={order.restaurant.name}
            fill
            placeholderMode="horizontal"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="144px"
          />
          <div className="absolute inset-0 bg-black/15" />

          {/* Counter Badge - CartItem style */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-3xl shadow-lg border border-lime-500/10">
              <span className={`text-[10px] font-black font-anton uppercase text-lime-600 tracking-wide tabular-nums`}>
                {totalItems} MÓN
              </span>
            </div>
          </div>

          {/* Date on Image */}
          <div className="absolute bottom-3 right-3 z-20">
            <div className="flex items-center gap-1 text-white/80 text-[10px] font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-xl border border-white/5">
              <Clock className="w-3 h-3" strokeWidth={2.2} />
              <span>{timeStr}</span>
            </div>
          </div>
        </div>

        {/* Info Section (Right) */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div className="space-y-0.5">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1 text-gray-400">
                <Store className="w-3 h-3 text-[var(--primary)]" />
                <span className="text-[8px] font-black uppercase tracking-widest leading-none">Cửa hàng</span>
              </div>
              <h4 className="font-bold text-gray-700 text-base md:text-lg truncate leading-tight tracking-tight">
                {order.restaurant.name}
              </h4>
            </div>

            <p className="text-[10px] text-gray-500 font-medium line-clamp-1 italic opacity-60">
              {dishNamesStr}
            </p>
          </div>

          <div className="flex flex-col border-t border-gray-50 pt-2.5">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.15em] leading-none mb-1 opacity-50">Tổng thanh toán</span>
            <div className="text-xl md:text-xl font-anton font-semibold text-gray-700 leading-none tracking-tight">
              {formatVnd(order.totalAmount)}
            </div>
          </div>

          {/* Action Indicator - Bottom Right */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 pointer-events-none">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300">
              <ChevronRight className="w-4 h-4" strokeWidth={3} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Status Panel - Peeking out below */}
      <div className="relative z-10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${config.iconBg} flex items-center justify-center shadow-sm`}>
            <StatusIcon size={14} className={config.color} strokeWidth={3} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-0.5">
              <span className={`text-[12px] font-extrabold uppercase ${config.color} leading-none`}>
                {config.label}
              </span>
              <div className="w-1 h-1 rounded-full bg-gray-300 mx-1" />
              <span className="text-[11px] font-bold text-gray-500 tracking-tight leading-none italic opacity-80 flex items-center gap-0.5 shrink-0 whitespace-nowrap">
                {getStatusDisplay(order.orderStatus)}
              </span>
              {!["DELIVERED", "CANCELLED", "REJECTED"].includes(order.orderStatus?.toUpperCase().trim()) && (
                <span key={`dots-v3-${order.id}`} className="inline-flex items-center gap-0.5 not-italic font-black text-gray-500 translate-y-[-0px] ml-0.5 shrink-0 select-none overflow-visible">
                  <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: [0, 1, 0] }} viewport={{ once: false }} transition={{ repeat: Infinity, duration: 1.4, delay: 0 }} className="inline-block text-[14px]">.</motion.span>
                  <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: [0, 1, 0] }} viewport={{ once: false }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="inline-block text-[14px]">.</motion.span>
                  <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: [0, 1, 0] }} viewport={{ once: false }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="inline-block text-[14px]">.</motion.span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-300 shadow-sm border border-gray-100">
          <ChevronRight size={14} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
