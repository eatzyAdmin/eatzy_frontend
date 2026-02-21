"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, Trash, CheckCircle2, Store, Loader2, ShoppingBag, Pencil, Check } from "@repo/ui/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading, CartOverlayShimmer } from "@repo/ui";
import { useCart, cartKeys } from "../hooks/useCart";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@repo/store";
import CartItemCard from "./CartItemCard";

export default function CartOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    carts,
    isLoading: isCartsLoading,
    totalItems,
  } = useCart();

  const queryClient = useQueryClient();
  const router = useRouter();
  const { show } = useLoading();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRestIds, setSelectedRestIds] = useState<Set<number>>(new Set());
  const [isDeletingCarts, setIsDeletingCarts] = useState(false);
  const setActiveRestaurant = useCartStore((s) => s.setActiveRestaurant);

  const toggleSelection = (cartId: number) => {
    const next = new Set(selectedRestIds);
    if (next.has(cartId)) next.delete(cartId);
    else next.add(cartId);
    setSelectedRestIds(next);
  };

  const handleBulkDelete = async () => {
    setIsDeletingCarts(true);
    try {
      const { cartApi } = await import("@repo/api");
      const cartIds = Array.from(selectedRestIds);
      for (const cartId of cartIds) {
        await cartApi.deleteCart(cartId);
      }
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      setSelectedRestIds(new Set());
      setIsEditMode(false);
    } finally {
      setIsDeletingCarts(false);
    }
  };

  const handleDeleteSingleCart = async (cartId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeletingCarts(true);
    try {
      const { cartApi } = await import("@repo/api");
      await cartApi.deleteCart(cartId);
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
    } finally {
      setIsDeletingCarts(false);
    }
  };

  const handleCardClick = (restaurantId: number, cartId: number) => {
    if (isEditMode) {
      toggleSelection(cartId);
    } else {
      show("Đang chuyển đến Checkout...");
      onClose();
      setActiveRestaurant(String(restaurantId));
      setTimeout(() => {
        router.push('/checkout');
      }, 300);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-[#0A0A0A]/40 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            key="cart-panel"
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="fixed z-[70] inset-y-0 right-0 w-full md:w-[480px] bg-[#F8F9FA] border-l border-gray-100 overflow-hidden md:rounded-l-[46px] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 md:p-6 text-[#1A1A1A] bg-[#F8F9FA] flex-shrink-0">
              <div className="flex flex-col gap-1">
                <div className="text-3xl font-anton font-bold uppercase tracking-tight">MY CART</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="px-2 py-0.5 bg-[#1A1A1A] rounded-lg shadow-sm">
                    <span className="text-[10px] font-black font-anton text-white uppercase tabular-nums">
                      {carts.length} BASKETS
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">• {totalItems} items</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {carts.length > 0 && (
                  <motion.button
                    layout
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsEditMode(!isEditMode);
                      setSelectedRestIds(new Set());
                    }}
                    className={`h-10 md:h-12 px-5 md:px-7 rounded-full flex items-center justify-center transition-all duration-500 border-2 select-none ${isEditMode
                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-lg shadow-black/10"
                        : "bg-white border-gray-100 text-[#1A1A1A] hover:bg-gray-50 hover:border-gray-200 shadow-sm"
                      }`}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isEditMode ? 'done' : 'edit'}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                        className="flex items-center gap-2"
                      >
                        {isEditMode ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={3} /> : <Pencil className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={3} />}
                        <span className="text-[13px] md:text-[15px] font-anton font-semibold uppercase leading-none pt-0.5">
                          {isEditMode ? "Done" : "Edit"}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-3 md:p-4 space-y-6 relative bg-[#F8F9FA]">
              {isCartsLoading ? (
                <>
                  <CartOverlayShimmer />
                  <CartOverlayShimmer />
                  <CartOverlayShimmer />
                </>
              ) : carts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-300 space-y-5 px-10">
                  <div className="w-24 h-24 rounded-[32px] bg-gray-50 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[var(--primary)]/5 rounded-[32px] scale-110 blur-xl opacity-50" />
                    <ShoppingBag className="w-10 h-10 opacity-20 relative z-10" />
                  </div>
                  <p className="font-anton uppercase tracking-widest text-sm text-[#1A1A1A] opacity-30">Your basket is empty</p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-8 py-4 bg-[#1A1A1A] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-black/10 hover:y-[-2px] transition-all"
                  >
                    Start Ordering
                  </button>
                </div>
              ) : (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 md:space-y-3"
                >
                  {carts.map(cart => (
                    <CartItemCard
                      key={cart.id}
                      cart={cart}
                      isEditMode={isEditMode}
                      isSelected={selectedRestIds.has(cart.id)}
                      onToggleSelection={toggleSelection}
                      onCardClick={handleCardClick}
                      onDeleteSingle={handleDeleteSingleCart}
                      isDeleting={isDeletingCarts}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Bottom Actions - Clean Premium Delete Button */}
            <AnimatePresence>
              {isEditMode && selectedRestIds.size > 0 && (
                <motion.div
                  initial={{ y: 120, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 120, opacity: 0, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                    mass: 0.8
                  }}
                  className="absolute bottom-8 left-6 right-6 z-[80]"
                >
                  <button
                    onClick={handleBulkDelete}
                    disabled={isDeletingCarts}
                    className="group/btn relative w-full h-[72px] bg-red-500 text-white rounded-[32px] flex items-center justify-between px-8 shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all duration-300 active:scale-[0.97] disabled:opacity-70 overflow-hidden"
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center group-hover/btn:bg-white/30 transition-colors">
                        {isDeletingCarts ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash className="w-5 h-5 text-white" strokeWidth={2.5} />
                        )}
                      </div>
                      <span className="text-md md:text-lg font-bold tracking-tight">
                        {isDeletingCarts ? "Đang xử lý..." : `Xóa (${selectedRestIds.size}) quán đã chọn`}
                      </span>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <style jsx global>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
