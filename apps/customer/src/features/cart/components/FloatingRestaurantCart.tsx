"use client";
import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCartStore } from "@repo/store";
import { formatVnd } from "@repo/lib";
import { AnimatePresence, motion } from "@repo/ui/motion";
import { ShoppingBag, Minus, Plus, Trash, X, ChevronRight } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";
import { useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";

export default function FloatingRestaurantCart({ restaurantId, restaurantName }: { restaurantId: string, restaurantName?: string }) {
  const { items, setActiveRestaurant, removeItem, addItem } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { show } = useLoading();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItems = useMemo(() => items.filter(i => i.restaurantId === restaurantId), [items, restaurantId]);
  const cartTotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), [cartItems]);
  const itemCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

  const handleCheckout = () => {
    show("Đang chuyển đến Checkout...");
    setActiveRestaurant(restaurantId);
    setIsOpen(false);
    setTimeout(() => {
      router.push("/checkout");
    }, 500);
  };

  if (!mounted) return null;

  const layoutId = `cart-container-${restaurantId}`;

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
            className="fixed bottom-8 right-8 z-50 bg-[var(--primary)] text-[#1A1A1A] rounded-full shadow-2xl p-4 pr-6 flex items-center gap-3 cursor-pointer hover:brightness-110 active:scale-95"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-[#1A1A1A] font-bold text-xs flex items-center justify-center border-2 border-[var(--primary)] shadow-sm">
                {itemCount}
              </span>
            </div>
            <div className="flex flex-col items-start mr-2">
              <span className="text-xs font-semibold opacity-80 uppercase tracking-wide">Giỏ hàng</span>
              <span className="font-bold text-lg leading-none">{formatVnd(cartTotal)}</span>
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              />
              <div
                className="fixed inset-0 z-[101] flex items-center justify-center p-4"
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
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="overflow-y-auto p-6 flex-1 bg-white divide-y divide-gray-200">
                    {cartItems.map(item => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-gray-100 flex-shrink-0 border-4 border-gray-200">
                          <ImageWithFallback src={item.imageUrl || ""} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-[#1A1A1A] line-clamp-1 text-sm">{item.name}</h4>
                            <span className="font-bold text-[#1A1A1A] ml-2 text-sm">{formatVnd(item.price)}</span>
                          </div>
                          <div className="text-xs text-gray-500 mb-2 line-clamp-1">
                            {item.options?.variant?.name && <span className="mr-1">{item.options.variant.name}</span>}
                            {item.options?.addons?.map(a => a.name).join(', ')}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-7 h-7 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              {item.quantity === 1 ? <Trash className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                            </button>
                            <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => addItem({ ...item, quantity: 1 })}
                              className="w-7 h-7 rounded-xl bg-[var(--primary)] text-[#1A1A1A] flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5 font-bold" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                    <div className="flex justify-between mb-4 items-end">
                      <span className="text-gray-500 font-medium">Tổng tạm tính</span>
                      <span className="text-2xl font-bold text-[#1A1A1A]">{formatVnd(cartTotal)}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      className="w-full py-4 bg-[var(--primary)] text-[#1A1A1A] rounded-2xl font-bold shadow-lg shadow-[var(--primary)]/20 flex items-center justify-center gap-2 text-lg"
                    >
                      <span>Xem đơn hàng</span>
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
