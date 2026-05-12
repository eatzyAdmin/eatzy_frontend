import { Navigation, MapPin } from "@repo/ui/icons";
import type { OrderResponse } from "@repo/types";

export function LogisticsInfo({ order }: { order: OrderResponse }) {
  const restaurant = order.restaurant;
  // Fallback to order delivery info if restaurant is missing, but usually it should be there
  if (!restaurant && !order.deliveryAddress) return null;

  return (
    <div className="bg-white rounded-[28px] md:rounded-[40px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 shrink-0">
      <div className="px-6 py-4 pt-4 md:pt-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-400" />
          <h4 className="font-bold text-[#1A1A1A]">Delivery Route</h4>
        </div>
        {(order.distance ?? 0) > 0 && (
          <span className="text-[11px] font-black text-lime-600 bg-lime-50 px-2.5 py-1 rounded-xl border border-lime-100">
            {order.distance?.toFixed(1)} km
          </span>
        )}
      </div>

      <div className="p-5 flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center shadow-sm flex-shrink-0 z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
          </div>
          <div className="w-0.5 flex-grow border-l-2 border-dotted border-gray-300 my-1" />
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shadow-sm flex-shrink-0 z-10">
            <MapPin className="w-4 h-4 text-red-500" />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between py-0.5 min-h-[100px]">
          <div>
            <div className="text-xs font-bold text-[var(--primary)] uppercase tracking-wide mb-1 flex items-center justify-between">
              <span>Restaurant</span>
              {order.preparingAt && (
                <span className="text-[10px] text-gray-400 font-bold lowercase opacity-70">
                  {new Date(order.preparingAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <div className="font-bold text-[#1A1A1A] text-sm mb-0.5 line-clamp-1">
              {restaurant?.name || "Updating..."}
            </div>
            <div className="text-xs text-gray-500 font-medium line-clamp-1">
              {restaurant?.address || "Address updating..."}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1 flex items-center justify-between">
              <span>Delivery point</span>
              {order.deliveredAt && (
                <span className="text-[10px] text-gray-400 font-bold lowercase opacity-70">
                  {new Date(order.deliveredAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <div className="font-bold text-[#1A1A1A] text-sm mb-0.5 line-clamp-2">
              {order.deliveryAddress}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
