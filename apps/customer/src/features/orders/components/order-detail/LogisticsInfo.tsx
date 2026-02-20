import { Navigation, MapPin } from "@repo/ui/icons";
import type { OrderResponse } from "@repo/types";

export function LogisticsInfo({ order }: { order: OrderResponse }) {
  const restaurant = order.restaurant;
  if (!restaurant) return null;

  return (
    <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100/50 shrink-0">
      <div className="px-6 pt-6 pb-2 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-2.5">
          <Navigation className="w-5 h-5 text-gray-400" />
          <h4 className="font-bold text-[#1A1A1A]">Lộ trình giao hàng</h4>
        </div>
        {(order.distance ?? 0) > 0 && (
          <span className="text-[11px] font-black text-lime-600 bg-lime-50 px-2.5 py-1 rounded-xl border border-lime-100">
            {order.distance?.toFixed(1)} km
          </span>
        )}
      </div>

      <div className="p-6 md:p-8">
        <div className="relative flex flex-col gap-1">
          <div className="flex items-start gap-5 pb-10 relative">
            <div className="absolute left-[15px] top-[32px] w-[2px] h-[calc(100%-12px)] border-l-2 border-dashed border-gray-200" />
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-lime-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-lime-500 pulsing-dot" />
              </div>
            </div>
            <div className="flex-1 min-w-0 -mt-1">
              <div className="text-[10px] font-black text-lime-600 uppercase tracking-widest leading-none mb-1.5 flex items-center gap-2">
                <span>Lấy hàng tại</span>
                {order.preparingAt && <span className="opacity-40 ml-auto border-l border-gray-200 pl-2 normal-case lowercase">{new Date(order.preparingAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span>}
              </div>
              <div className="font-bold text-[#1A1A1A] text-sm truncate leading-tight uppercase tracking-tight">{restaurant.name}</div>
              <div className="text-[11px] text-gray-400 font-medium line-clamp-2 mt-1 leading-relaxed">{restaurant.address}</div>
            </div>
          </div>

          <div className="flex items-start gap-5 relative z-10 pt-2">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-red-500/20 text-red-500">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 -mt-1">
              <div className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none mb-1.5 flex items-center gap-2">
                <span>Giao hàng đến</span>
                {order.deliveredAt && <span className="opacity-40 ml-auto border-l border-gray-200 pl-2 normal-case lowercase">{new Date(order.deliveredAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span>}
              </div>
              <div className="font-bold text-[#1A1A1A] text-sm leading-tight uppercase tracking-tight">Vị trí của bạn</div>
              <div className="text-[11px] text-gray-400 font-medium line-clamp-3 mt-1 leading-relaxed">{order.deliveryAddress}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
