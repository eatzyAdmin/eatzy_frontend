import { useRouter } from "next/navigation";
import { motion } from "@repo/ui/motion";
import { ImageWithFallback, useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import { Store, MapPin, ChefHat, Bike, BadgeCheck, ClipboardList, X, Clock } from "@repo/ui/icons";
import type { OrderResponse } from "@repo/types";
import { formatVnd } from "@repo/lib";

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string; border: string; iconBg: string }> = {
  PENDING: { label: "Pending", icon: Clock, color: "text-amber-700", bg: "bg-amber-50/95", border: "border-amber-100/50", iconBg: "bg-amber-200/50" },
  PLACED: { label: "Placed", icon: ClipboardList, color: "text-amber-700", bg: "bg-amber-50/95", border: "border-amber-100/50", iconBg: "bg-amber-200/50" },
  PREPARING: { label: "Preparing", icon: ChefHat, color: "text-amber-700", bg: "bg-amber-50/95", border: "border-amber-100/50", iconBg: "bg-amber-200/50" },
  READY: { label: "Ready", icon: ChefHat, color: "text-amber-700", bg: "bg-amber-50/95", border: "border-amber-100/50", iconBg: "bg-amber-200/50" },
  PICKED_UP: { label: "Picked Up", icon: Bike, color: "text-amber-700", bg: "bg-amber-50/95", border: "border-amber-100/50", iconBg: "bg-amber-200/50" },
  ARRIVED: { label: "Arrived", icon: Bike, color: "text-amber-700", bg: "bg-amber-50/95", border: "border-amber-100/50", iconBg: "bg-amber-200/50" },
  DELIVERED: { label: "Completed", icon: BadgeCheck, color: "text-lime-700", bg: "bg-lime-50/95", border: "border-lime-100/50", iconBg: "bg-lime-200/50" },
  CANCELLED: { label: "Cancelled", icon: X, color: "text-red-700", bg: "bg-red-50/95", border: "border-red-100/50", iconBg: "bg-red-200/50" },
  REJECTED: { label: "Rejected", icon: X, color: "text-red-700", bg: "bg-red-50/95", border: "border-red-100/50", iconBg: "bg-red-200/50" },
};

export default function OrderHistoryCard({ order, onClick }: { order: OrderResponse; onClick: () => void }) {
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

  return (
    <motion.div
      ref={containerRef}
      whileHover={{ y: -10, scale: 1.02 }}
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
      className="group relative w-full h-[160px] md:h-auto flex flex-row md:block md:aspect-[7/8] overflow-hidden rounded-[34px] md:rounded-[2.5rem] shadow-[0_4px_25px_rgba(0,0,0,0.08)] md:shadow-[0_0_25px_rgba(0,0,0,0.10)] cursor-pointer bg-white md:bg-black/5"
    >
      <HoverHighlightOverlay rect={rect} style={highlightStyle} />

      {/* Image Section */}
      <div className="relative w-40 md:w-full h-full md:absolute md:inset-0 md:z-0 flex-shrink-0 overflow-hidden">
        <ImageWithFallback
          src={order.restaurant.imageUrl || ""}
          alt={order.restaurant.name}
          fill
          placeholderMode="vertical"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Gradients - Desktop Only Overlay Protection */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />

        {/* Mobile Subtle Overlay */}
        <div className="md:hidden absolute inset-0 bg-black/15" />

        {/* Mobile Badges on Image */}
        <div className="md:hidden absolute top-3 left-3 z-20">
          <div className={`flex items-center gap-1.5 bg-white/95 backdrop-blur-sm pl-1 pr-2.5 py-1 rounded-full shadow-lg border ${config.border}`}>
            <div className={`w-5 h-5 rounded-full ${config.iconBg} flex items-center justify-center`}>
              <StatusIcon className={`w-2.5 h-2.5 ${config.color}`} strokeWidth={3} />
            </div>
            <span className={`text-[10px] font-black font-anton uppercase ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Mobile Date on Image */}
        <div className="md:hidden absolute bottom-3 right-3 z-20">
          <div className="flex items-center gap-1 text-white/80 text-[10px] font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-xl border border-white/5">
            <Clock className="w-3 h-3" strokeWidth={2.2} />
            <span>{timeStr}</span>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="relative flex-1 md:absolute md:inset-0 md:z-10 h-full p-4 md:p-6 flex flex-col justify-between min-w-0">
        {/* Top Badges */}
        <div className="flex justify-between items-start">
          {/* Status Badge (Desktop Only) */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`hidden md:flex items-center gap-1.5 bg-white backdrop-blur-md pl-1.5 pr-3 py-1.5 rounded-[18px] shadow-sm border ${config.border}`}
          >
            <div className={`w-6 h-6 rounded-[12px] ${config.iconBg} flex items-center justify-center`}>
              <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} strokeWidth={3} />
            </div>
            <span className={`text-[15px] font-black font-anton uppercase ${config.color}`}>
              {config.label}
            </span>
          </motion.div>

          {/* Items Count Badge - Absolute on Mobile, part of flow on Desktop */}
          <div className="absolute top-3 right-3 flex items-center justify-center md:relative md:top-0 md:right-0 bg-gray-100 md:bg-black/40 backdrop-blur-md px-2 py-1 md:px-3 md:py-2.5 rounded-xl md:rounded-2xl border border-white/10 z-30">
            <span className="text-[10px] md:text-xs md:font-anton font-bold text-gray-400 md:text-white/95 tabular-nums md:uppercase">{totalItems} món</span>
          </div>
        </div>

        {/* Info & Metrics */}
        <div className="flex-1 flex flex-col justify-between md:flex-none md:block md:space-y-2 md:drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          {/* Top Block: Price & Name */}
          <div className="space-y-1">
            <div className="md:hidden text-gray-400 text-[9px] uppercase font-bold tracking-widest leading-none">Total Amount</div>
            <h2 className="text-xl md:text-3xl font-anton font-semibold text-[#1A1A1A] md:text-white flex items-baseline gap-1.5 leading-tight md:leading-normal">
              <span className="hidden md:inline text-white/60 text-lg tracking-wide">Total:</span>
              {formatVnd(order.totalAmount)}
            </h2>
          </div>
          <div className="space-y-2 md:space-y-1">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 w-fit">
                <span className="text-[14px] md:text-base font-semibold md:font-bold text-gray-800 md:text-white/90 leading-none">
                  {order.restaurant.name}
                </span>
              </div>

              {/* Dish List - Mobile Only */}
              <p className="md:hidden text-[11px] text-gray-500 font-medium line-clamp-2 italic tracking-tight">
                {dishNamesStr}
              </p>

              <p className="text-[9px] md:text-xs text-gray-400 md:text-white/50 font-medium flex items-start gap-1">
                <MapPin className="w-2.5 h-2.5 mt-0.5 md:w-3 md:h-3 flex-shrink-0" />
                <span className="line-clamp-2">{order.deliveryAddress}</span>
              </p>
            </div>
          </div>

          {/* Bottom Block: Metrics & Date (Refactored) */}
          <div className="space-y-3 md:space-y-5">
            {/* Desktop Metrics Row (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-8 pt-2">
              <div className="space-y-2">
                <div className="text-white text-xl font-anton leading-none">{totalItems} món</div>
                <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-none">Quantity</div>
              </div>
              <div className="w-px h-10 bg-white/15" />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="text-white text-sm font-medium italic line-clamp-2 leading-tight tracking-tight opacity-90">
                  {dishNamesStr}
                </div>
                <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-none">Items Overview</div>
              </div>
            </div>

            {/* Footer separator (Desktop Only) */}
            <div className="hidden md:block h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent w-full" />

            {/* Footer Info (Desktop Only) */}
            <div className="hidden md:flex items-center justify-between pt-1">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/restaurants/${order.restaurant.slug || order.restaurant.id}`);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:shadow-glow group/link cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-white/60 group-hover/link:text-white transition-colors" />
                <span className="text-xs font-bold text-white/70 group-hover/link:text-white transition-colors uppercase tracking-wider">
                  {order.restaurant.name}
                </span>
              </motion.div>

              <div className="flex items-center gap-1.5 text-white/40 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                {timeStr}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glossy Overlay (Desktop Only) */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}
