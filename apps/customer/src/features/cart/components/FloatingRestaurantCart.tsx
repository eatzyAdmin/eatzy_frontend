"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { formatVnd } from "@repo/lib";
import { AnimatePresence, motion } from "@repo/ui/motion";
import { ShoppingBag, Minus, Plus, Trash, X, ChevronRight, Loader2 } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";
import { useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useRestaurantCart } from "../hooks/useCart";

interface FloatingRestaurantCartProps {
  restaurantId: string | number;
  restaurantName?: string;
}

export default function FloatingRestaurantCart({ restaurantId, restaurantName }: FloatingRestaurantCartProps) {
  // Convert to number for API
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

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { show } = useLoading();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    show("Đang chuyển đến Checkout...");
    setIsOpen(false);
    setTimeout(() => {
      router.push(`/checkout?restaurantId=${restaurantId}`);
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

  // Show loading indicator while fetching
  if (isLoading) {
    return null;
  }

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
                  className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
                    <div>
                      <h3 className="text-xl font-bold text-[#1A1A1A]">Giỏ hàng của bạn</h3>
                      {restaurantName && <p className="text-sm text-gray-500 line-clamp-1">{restaurantName}</p>}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                      className="p-4 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="overflow-y-auto p-6 flex-1 bg-white divide-y divide-gray-200 relative">
                    {cartItems.map(item => (
                      <div
                        key={item.id}
                        className="flex gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-gray-100 flex-shrink-0 border-4 border-gray-200">
                          <ImageWithFallback src={item.dish.image || ""} alt={item.dish.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-[#1A1A1A] line-clamp-1 text-sm">{item.dish.name}</h4>
                            <span className="font-bold text-[#1A1A1A] ml-2 text-sm">{formatVnd(item.dish.price)}</span>
                          </div>
                          {item.cartItemOptions && item.cartItemOptions.length > 0 && (
                            <div className="text-xs text-gray-500 mb-2 line-clamp-1">
                              {item.cartItemOptions.map(opt => opt.menuOption.name).join(', ')}
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleDecrement(item.id, item.quantity)}
                              disabled={isUpdating}
                              className="w-7 h-7 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {item.quantity === 1 ? <Trash className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                            </button>
                            <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleIncrement(item.id, item.quantity)}
                              disabled={isUpdating}
                              className="w-7 h-7 rounded-xl bg-[var(--primary)] text-[#1A1A1A] flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                            >
                              <Plus className="w-3.5 h-3.5 font-bold" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                    <div className="flex justify-between mb-4 items-end">
                      <span className="text-gray-500 font-medium">Tổng tạm tính</span>
                      <span className="text-2xl font-bold text-[#1A1A1A]">{formatVnd(totalPrice)}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      disabled={cartItems.length === 0 || isUpdating}
                      className="w-full py-4 bg-[var(--primary)] text-[#1A1A1A] rounded-2xl font-bold shadow-lg shadow-[var(--primary)]/20 flex items-center justify-center gap-2 text-lg disabled:opacity-70"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Đang cập nhật...</span>
                        </>
                      ) : (
                        <>
                          <span>Xem đơn hàng</span>
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
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
