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
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
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
    <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-400" />
          <h4 className="font-bold text-[#1A1A1A]">Order Items</h4>
        </div>
        <span className="text-xs font-bold bg-[#1A1A1A] text-white px-2.5 py-1 rounded-lg">
          {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
        </span>
      </div>

      <div className="p-2">
        {cartItems.length === 0 ? (
          <div className="p-6 text-center text-gray-400 font-medium">Your cart is empty</div>
        ) : (
          <div className="grid grid-cols-1 gap-1">
            {cartItems.map((item) => (
              <div key={item.id} className="group flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-[20px] transition-colors duration-200">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-[14px] bg-gray-100 text-[#1A1A1A] font-anton text-lg flex items-center justify-center shadow-sm group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                    {item.quantity}x
                  </div>

                  <div className="hidden md:block relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                    <ImageWithFallback src={item.dish?.image ?? ""} alt={item.dish?.name ?? ""} fill className="object-cover" />
                  </div>

                  <div className="min-w-0">
                    <div className="font-bold text-[#1A1A1A] text-sm group-hover:text-[var(--primary)] transition-colors line-clamp-1">{item.dish?.name}</div>

                    {/* Options display */}
                    <div className="flex flex-col gap-0.5">
                      {item.cartItemOptions && item.cartItemOptions.length > 0 ? (
                        item.cartItemOptions.slice(0, 2).map((opt) => (
                          <div key={opt.id} className="text-xs text-gray-400 font-medium line-clamp-1">
                            {opt.menuOption?.name}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-400 font-medium">Standard option</div>
                      )}
                    </div>
                  </div>
                </div>
                <span className="font-bold text-[#1A1A1A] text-sm whitespace-nowrap ml-2">{formatVnd(item.totalPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

