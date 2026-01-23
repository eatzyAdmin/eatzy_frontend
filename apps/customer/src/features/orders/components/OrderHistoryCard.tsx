import { motion } from "@repo/ui/motion";
import { ImageWithFallback, useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import { Store, MapPin, Calendar, ChefHat, Bike, BadgeCheck, ClipboardList, X, Clock } from "@repo/ui/icons";
import type { OrderResponse } from "@repo/types";
import { formatVnd } from "@repo/lib";

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
  PENDING: { label: "Chờ xác nhận", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  PLACED: { label: "Đã đặt", icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  PREPARING: { label: "Đang chuẩn bị", icon: ChefHat, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  READY: { label: "Sẵn sàng", icon: ChefHat, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  PICKED_UP: { label: "Đang giao", icon: Bike, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  ARRIVED: { label: "Đã đến nơi", icon: Bike, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  DELIVERED: { label: "Hoàn thành", icon: BadgeCheck, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  CANCELLED: { label: "Đã hủy", icon: X, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  REJECTED: { label: "Bị từ chối", icon: X, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
};

export default function OrderHistoryCard({ order, onClick }: { order: OrderResponse; onClick: () => void }) {
  const config = statusConfig[order.orderStatus] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  const {
    containerRef,
    rect,
    style: highlightStyle,
    moveHighlight,
    clearHover,
  } = useHoverHighlight<HTMLDivElement>();

  return (
    <motion.div
      ref={containerRef}
      whileHover={{ y: -4 }}
      onClick={onClick}
      onMouseEnter={(e) =>
        moveHighlight(e, {
          borderRadius: 24,
          backgroundColor: "rgba(0,0,0,0.04)",
          opacity: 1,
          scaleEnabled: true,
          scale: 1.05,
        })
      }
      onMouseMove={(e) =>
        moveHighlight(e, {
          borderRadius: 24,
          backgroundColor: "rgba(0,0,0,0.04)",
          opacity: 1,
          scaleEnabled: true,
          scale: 1.05,
        })
      }
      onMouseLeave={clearHover}
      className="relative bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-row h-[140px] md:flex-col md:h-auto"
    >
      <HoverHighlightOverlay rect={rect} style={highlightStyle} />

      {/* Restaurant Image */}
      <div className="relative w-32 flex-shrink-0 md:w-full md:aspect-[16/9] overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(order.restaurant.name)}&background=random&color=fff&size=512`}
          alt={order.restaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Order ID instead of Code */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-full shadow-lg">
          <span className="text-[10px] md:text-xs font-bold text-[#1A1A1A]">#{order.id}</span>
        </div>

        {/* Status Badge */}
        <div className={`absolute bottom-2 left-2 md:top-3 md:right-3 md:bottom-auto md:left-auto ${config.bg} ${config.border} border backdrop-blur-sm px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-full shadow-lg flex items-center gap-1 md:gap-1.5 max-w-[calc(100%-16px)] md:max-w-none`}>
          <StatusIcon className={`w-3 h-3 md:w-4 md:h-4 ${config.color}`} />
          <span className={`text-[10px] md:text-xs font-semibold ${config.color} truncate`}>{config.label}</span>
        </div>
      </div>

      {/* Order Details */}
      <div className="flex-1 p-3 flex flex-col justify-between md:p-5 md:block md:space-y-4 min-w-0">
        {/* Restaurant Info */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
            <Store className="w-4 h-4 md:w-5 md:h-5 text-[var(--primary)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-base font-bold text-[#1A1A1A] truncate">{order.restaurant.name}</h3>
            <p className="text-[10px] md:text-xs text-gray-600 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {order.deliveryAddress}
            </p>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="space-y-1 md:space-y-2">
          <div className="hidden md:block text-xs font-semibold text-gray-500 uppercase">Món ăn</div>
          <div className="space-y-1 md:space-y-1.5">
            {order.orderItems.slice(0, 2).map((item, index) => (
              <div key={item.id} className={`flex items-center justify-between text-sm ${index > 0 ? 'hidden md:flex' : 'flex'}`}>
                <div className="flex items-center gap-1 md:gap-2 flex-1 min-w-0">
                  <span className="font-bold text-[var(--primary)] text-xs md:text-lg font-anton">{item.quantity}x</span>
                  <span className="text-gray-700 truncate text-xs md:text-sm">{item.dish.name}</span>
                </div>
                <span className="hidden md:inline text-[#1A1A1A] font-semibold">{formatVnd(item.priceAtPurchase)}</span>
              </div>
            ))}
            {order.orderItems.length > 2 && (
              <div className="hidden md:block text-xs text-gray-500 italic">
                +{order.orderItems.length - 2} món khác...
              </div>
            )}
            {order.orderItems.length > 1 && (
              <div className="block md:hidden text-[10px] text-gray-500 italic">
                +{order.orderItems.length - 1} món khác...
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Total & Date */}
        <div className="flex items-end md:items-center justify-between mt-2 md:mt-0">
          <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-gray-600">
            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
            <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "N/A"}</span>
          </div>
          <div className="text-right">
            <div className="hidden md:block text-xs text-gray-600">Tổng tiền</div>
            <div className="text-base md:text-xl font-bold text-[var(--primary)] font-anton">
              {formatVnd(order.totalAmount)}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/0 via-transparent to-[var(--secondary)]/0 pointer-events-none opacity-0 hover:opacity-10 transition-opacity duration-300" />
    </motion.div>
  );
}

