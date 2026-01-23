"use client";
import { ImageWithFallback } from "@repo/ui";
import { formatVnd } from "@repo/lib";
import { useCartStore } from "@repo/store";
import { Package } from "@repo/ui/icons";

export default function OrderSummaryList() {
  const activeRestaurantId = useCartStore((s) => s.activeRestaurantId);
  const items = useCartStore((s) => s.items.filter(i => !activeRestaurantId || i.restaurantId === activeRestaurantId));

  return (
    <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-400" />
          <h4 className="font-bold text-[#1A1A1A]">Order Items</h4>
        </div>
        <span className="text-xs font-bold bg-[#1A1A1A] text-white px-2.5 py-1 rounded-lg">
          {items.reduce((acc, item) => acc + item.quantity, 0)} items
        </span>
      </div>

      <div className="p-2">
        {items.length === 0 ? (
          <div className="p-6 text-center text-gray-400 font-medium">Your cart is empty</div>
        ) : (
          <div className="grid grid-cols-1 gap-1">
            {items.map((it) => (
              <div key={it.id} className="group flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-[20px] transition-colors duration-200">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-[14px] bg-gray-100 text-[#1A1A1A] font-anton text-lg flex items-center justify-center shadow-sm group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                    {it.quantity}x
                  </div>

                  <div className="hidden md:block relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                    <ImageWithFallback src={it.imageUrl ?? ""} alt={it.name} fill className="object-cover" />
                  </div>

                  <div className="min-w-0">
                    <div className="font-bold text-[#1A1A1A] text-sm group-hover:text-[var(--primary)] transition-colors line-clamp-1">{it.name}</div>

                    {/* Simplified options display */}
                    <div className="flex flex-col gap-0.5">
                      {Array.isArray(it.options?.groups) && it.options!.groups.length > 0 ? (
                        [...it.options!.groups]
                          .sort((a, b) => {
                            const ap = String(a.title || "").toLowerCase().startsWith("variant") ? 0 : 1;
                            const bp = String(b.title || "").toLowerCase().startsWith("variant") ? 0 : 1;
                            return ap - bp;
                          })
                          .slice(0, 2) // Show only first 2 lines to keep it clean
                          .map((g) => (
                            <div key={g.id} className="text-xs text-gray-400 font-medium line-clamp-1">
                              {g.options.map((o) => o.name).join(", ")}
                            </div>
                          ))
                      ) : (
                        <div className="text-xs text-gray-400 font-medium">Standard option</div>
                      )}
                    </div>
                  </div>
                </div>
                <span className="font-bold text-[#1A1A1A] text-sm whitespace-nowrap ml-2">{formatVnd(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
