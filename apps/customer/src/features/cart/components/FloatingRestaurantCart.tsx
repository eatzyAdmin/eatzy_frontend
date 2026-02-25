"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { formatVnd } from "@repo/lib";
import { AnimatePresence, motion } from "@repo/ui/motion";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash,
  Loader2,
  ChevronLeft,
  Lock,
  Zap,
  ChevronRight,
  Store,
  X
} from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";
import { useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useRestaurantCart } from "../hooks/useCart";
import { useCartStore } from "@repo/store";

interface FloatingRestaurantCartProps {
  restaurantId: string | number;
  restaurantName?: string;
}

export default function FloatingRestaurantCart({ restaurantId, restaurantName }: FloatingRestaurantCartProps) {
  const numericRestaurantId = typeof restaurantId === 'string' ? Number(restaurantId) : restaurantId;

  const {
    cartItems,
    totalItems,
    totalPrice,
    updateItemQuantity,
    removeItem,
    isUpdating,
    isLoading,
  } = useRestaurantCart(numericRestaurantId);

  const setActiveRestaurant = useCartStore((s) => s.setActiveRestaurant);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { show } = useLoading();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    show("Đang chuẩn bị đơn hàng...");
    setIsOpen(false);
    setActiveRestaurant(String(restaurantId));
    setTimeout(() => {
      router.push('/checkout');
    }, 500);
  };

  const handleIncrement = async (itemId: number, currentQty: number) => {
    await updateItemQuantity(itemId, currentQty + 1);
  };

  const handleDecrement = async (itemId: number, currentQty: number) => {
    if (currentQty <= 1) {
      await removeItem(itemId);
    } else {
      await updateItemQuantity(itemId, currentQty - 1);
    }
  };

  if (!mounted) return null;

  const layoutId = `cart-container-${restaurantId}`;

  if (isLoading) return null;

  return (
    <>
      <AnimatePresence>
        {!isOpen && cartItems.length > 0 && (
          <motion.button
            layoutId={layoutId}
            id="local-cart-fab"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 bg-[var(--primary)] text-[#1A1A1A] rounded-full shadow-2xl p-2 pr-4 md:p-4 md:pr-6 flex items-center gap-2 md:gap-3 cursor-pointer hover:brightness-110 active:scale-95"
          >
            <div className="relative">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-black/10 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 md:w-6 md:h-6" />
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white text-[#1A1A1A] font-bold text-[10px] md:text-xs flex items-center justify-center border-2 border-[var(--primary)] shadow-sm">
                {totalItems}
              </span>
            </div>
            <div className="flex flex-col items-start mr-1 md:mr-2">
              <span className="hidden md:block text-xs font-semibold opacity-80 uppercase tracking-wide">Giỏ hàng</span>
              <span className="font-bold text-sm md:text-lg leading-none">{formatVnd(totalPrice)}</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {!isOpen && cartItems.length === 0 && (
        <div id="local-cart-fab" className="fixed bottom-8 right-8 w-12 h-12 pointer-events-none opacity-0" />
      )}

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                key="cart-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              />
              <motion.div
                key="cart-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed inset-0 z-[101] flex items-center justify-center p-4 ${!isOpen ? 'pointer-events-none' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <motion.div
                  layoutId={layoutId}
                  onClick={(e) => e.stopPropagation()}
                  transition={{ type: "spring", stiffness: 120, damping: 19 }}
                  className="w-[calc(100vw-32px)] sm:w-full sm:max-w-[460px] bg-white rounded-[40px] shadow-[0_-40px_80px_rgba(0,0,0,0.25),0_32px_80px_rgba(0,0,0,0.3)] flex flex-col max-h-[85vh] sm:max-h-[95vh] relative overflow-visible pointer-events-auto"
                >
                  {/* CART OVERLAY STYLE HEADER - RESPONSIVE */}
                  <div className="flex items-center justify-between px-5 py-5 sm:px-7 sm:py-7 sm:pb-5 text-[#1A1A1A] bg-[#E4F8D5] flex-shrink-0 rounded-[40px] rounded-b-[40px] sm:rounded-b-[50px] shadow-sm">
                    <div className="flex flex-col gap-1 sm:gap-1.5">
                      <div className="text-2xl sm:text-3xl font-anton font-bold uppercase tracking-tight text-[#154D1B] leading-none">
                        {restaurantName || "MY CART"}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="px-2 py-0.5 bg-[#154D1B] rounded-xl shadow-sm">
                          <span className="text-[9px] sm:text-[10px] font-black font-anton text-white uppercase tabular-nums">
                            {cartItems.length} ITEMS
                          </span>
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-[#154D1B]/50 font-bold uppercase tracking-widest leading-none mt-0.5">• CHECKOUT NOW</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#154D1B] hover:shadow-md transition-all duration-300 shadow-sm"
                      >
                        <X size={20} className="sm:w-[22px] sm:h-[22px]" strokeWidth={3} />
                      </motion.button>
                    </div>
                  </div>

                  {/* RESPONSIVE CART ITEMS LIST */}
                  <div className="flex-1 overflow-y-auto px-3 sm:px-7 py-4 sm:py-6 no-scrollbar scroll-smooth bg-white divide-y divide-gray-100">
                    {cartItems.map(item => (
                      <div
                        key={item.id}
                        className="flex gap-5 py-5 first:pt-0 last:pb-0"
                      >
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] sm:rounded-[32px] overflow-hidden bg-gray-50 flex-shrink-0 border-[3px] sm:border-4 border-gray-100 shadow-sm">
                          <ImageWithFallback src={item.dish.image || ""} alt={item.dish.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1 sm:mb-1.5">
                            <h4 className="font-bold text-[#1A1A1A] text-[16px] sm:text-[18px] leading-tight tracking-tight truncate">{item.dish.name}</h4>
                            <span className="font-black text-[#154D1B] ml-2 text-sm sm:text-md leading-none tracking-tight whitespace-nowrap pt-0.5">{formatVnd(item.dish.price)}</span>
                          </div>

                          {item.cartItemOptions && item.cartItemOptions.length > 0 && (
                            <div className="text-[11px] sm:text-[12px] text-gray-400 font-semibold tracking-tight mb-2 sm:mb-3 line-clamp-2 border-l-2 border-gray-100 pl-2">
                              {Array.from(new Set(item.cartItemOptions.map(opt => opt.menuOption.name))).join(', ')}
                            </div>
                          )}

                          <div className="flex items-center gap-2.5 sm:gap-3">
                            <button
                              onClick={() => handleDecrement(item.id, item.quantity)}
                              disabled={isUpdating}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90 disabled:opacity-50"
                            >
                              {item.quantity === 1 ? <Trash className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} /> : <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3} />}
                            </button>
                            <span className="font-anton font-semibold text-sm sm:text-md min-w-[20px] sm:min-w-[24px] text-center pt-0.5">{item.quantity}</span>
                            <button
                              onClick={() => handleIncrement(item.id, item.quantity)}
                              disabled={isUpdating}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[var(--primary)] text-[#154D1B] flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-90 disabled:opacity-50"
                            >
                              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* BOTTOM FOOTER SECTION - RESPONSIVE */}
                  <div className="p-1">
                    <div className="bg-[#E4F8D5] rounded-[30px] sm:rounded-[35px] p-1">
                      <div className="flex items-center justify-between px-4 py-1.5 sm:py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-[18px] font-bold text-[#154D1B] tracking-tight">Subtotal</span>
                        </div>
                        <div className="flex items-baseline gap-0.5">
                          <span className="font-anton text-[28px] sm:text-[40px] leading-none tracking-tighter text-[#154D1B]">
                            {Math.floor(totalPrice / 1000)}<span className="text-[14px] sm:text-[20px] opacity-30">.000</span>
                          </span>
                          <span className="font-anton text-[12px] sm:text-[16px] text-[#154D1B] ml-1 opacity-60">VNĐ</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={cartItems.length > 0 && !isUpdating ? { y: -2 } : {}}
                        whileTap={cartItems.length > 0 && !isUpdating ? { scale: 0.98 } : {}}
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0 || isUpdating}
                        className="group/btn relative w-full h-[56px] sm:h-[68px] bg-[var(--primary)] text-[#154D1B] rounded-full flex items-center justify-center px-6 sm:px-8 shadow-[0_12px_30px_rgba(0,0,0,0.15)] disabled:opacity-60 transition-all duration-300 overflow-hidden"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 relative z-10 transition-all">
                          {isUpdating && <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />}
                          <span className="text-lg sm:text-2xl font-anton font-black tracking-tight uppercase">
                            {isUpdating ? "Updating..." : "Checkout"}
                          </span>
                          {!isUpdating && (
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-1.5 transition-transform duration-300" strokeWidth={3} />
                          )}
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
