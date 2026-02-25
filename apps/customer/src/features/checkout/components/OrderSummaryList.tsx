"use client";
import { ImageWithFallback } from "@repo/ui";
import { formatVnd } from "@repo/lib";
import { useCartStore } from "@repo/store";
import { Package } from "@repo/ui/icons";
import { useRestaurantCart } from "@/features/cart/hooks/useCart";

export default function OrderSummaryList() {
  // Get activeRestaurantId from cart store
  const activeRestaurantId = useCartStore((s) => s.activeRestaurantId);
  const restaurantId = activeRestaurantId ? Number(activeRestaurantId) : null;

  // Fetch cart items from API
  const { cartItems, isLoading } = useRestaurantCart(restaurantId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
        <div className="px-4 md:px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-400" />
            <h4 className="font-bold text-[#1A1A1A]">Order Items</h4>
          </div>
        </div>
        <div className="p-6 text-center text-gray-400">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] md:rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
      <div className="px-4 md:px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-400" />
          <h4 className="font-bold text-[#1A1A1A]">Order Items</h4>
        </div>
        <span className="text-xs font-bold bg-[#1A1A1A] text-white px-2.5 py-1 rounded-lg">
          {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
        </span>
      </div>

      <div className="p-2 pt-0 md:pt-2">
        {cartItems.length === 0 ? (
          <div className="p-6 text-center text-gray-400 font-medium">Your cart is empty</div>
        ) : (
          <div className="grid grid-cols-1 gap-1">
            {cartItems.map((item) => (
              <div key={item.id} className="group flex items-center justify-between p-3 md:p-4 rounded-[20px] transition-colors duration-200">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-[14px] bg-gray-100 text-[#1A1A1A] font-anton font-bold text-lg flex items-center justify-center shadow-sm transition-all duration-300 flex-shrink-0">
                    {item.quantity}x
                  </div>

                  <div className="hidden md:block relative w-14 h-14 rounded-2xl overflow-hidden bg-white border border-gray-100 flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 duration-500">
                    <ImageWithFallback src={item.dish?.image ?? ""} alt={item.dish?.name ?? ""} fill className="object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[#1A1A1A] text-[15px] transition-colors line-clamp-1 leading-tight">{item.dish?.name}</div>

                    {/* Options display - Synchronized with OrderDetailDrawer */}
                    <div className="mt-0.5">
                      {item.cartItemOptions && item.cartItemOptions.length > 0 ? (
                        <div className="text-[11px] text-gray-400 font-medium line-clamp-2 leading-relaxed italic">
                          {Array.from(new Map(item.cartItemOptions.map(opt => [opt.menuOption?.id || opt.id, opt])).values())
                            .map((opt: any) => opt.menuOption?.name)
                            .join(", ")}
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-400 font-medium">Standard option</div>
                      )}
                    </div>
                  </div>
                </div>
                <span className="font-bold text-[#1A1A1A] text-sm whitespace-nowrap ml-2">{formatVnd(item.dish?.price ?? 0)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
