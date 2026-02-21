"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Trash, Check, Store, Loader2, ChevronRight, ChefHat } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";
import { formatVnd } from "@repo/lib";
import type { Cart } from "@repo/types";

interface CartItemCardProps {
  cart: Cart;
  isEditMode: boolean;
  isSelected: boolean;
  onToggleSelection: (cartId: number) => void;
  onCardClick: (restaurantId: number, cartId: number) => void;
  onDeleteSingle: (cartId: number, e: React.MouseEvent) => void;
  isDeleting: boolean;
}

export default function CartItemCard({
  cart,
  isEditMode,
  isSelected,
  onToggleSelection,
  onCardClick,
  onDeleteSingle,
  isDeleting,
}: CartItemCardProps) {
  const itemCount = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemNames = cart.cartItems.map(item => item.dish.name).join(", ");
  const previewImage = cart.cartItems[0]?.dish?.image || "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => onCardClick(cart.restaurant.id, cart.id)}
      className={`group relative w-full h-[140px] flex flex-row overflow-hidden rounded-[40px] cursor-pointer transition-all duration-500 ${isSelected
        ? "bg-lime-50/50 shadow-[0_0_20px_rgba(0,0,0,0.06),0_0_15px_rgba(132,204,22,0.08)]"
        : "bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)] md:shadow-[0_0_25px_rgba(0,0,0,0.10)] hover:bg-gray-50/50 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
        }`}
    >
      {/* Selection Border Overlay - Fixed positioning to prevent layout jump */}
      <div
        className={`absolute inset-0 z-40 rounded-[40px] border-2 pointer-events-none transition-all duration-500 ${isEditMode
          ? isSelected ? "border-lime-100" : "border-transparent"
          : "border-transparent"
          }`}
      />
      {/* Selection Checkmark - Top Right (Edit Mode) */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-30"
          >
            <div
              className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 cursor-pointer ${isSelected
                ? "bg-lime-500 text-white scale-100 shadow-sm"
                : "bg-gray-100 text-transparent scale-90"
                }`}
            >
              <Check
                size={16}
                strokeWidth={4}
                className={`transition-all duration-500 ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Identity Section (Left) */}
      <div className="relative w-36 md:w-32 h-full flex-shrink-0">
        <ImageWithFallback
          src={previewImage}
          alt={cart.restaurant.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 transition-all duration-700 ease-out group-hover:bg-black/0" />

        {/* Counter Badge - OrderHistory Style */}
        <div className="absolute top-3 left-3 z-10">
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm pl-1 pr-2.5 py-1 rounded-full shadow-lg border border-[var(--primary)]/10">
            <div className={`w-5 h-5 rounded-full bg-[var(--primary)]/10 flex items-center justify-center`}>
              <ChefHat className={`w-3 h-3 text-[var(--primary)]`} strokeWidth={3} />
            </div>
            <span className={`text-[10px] font-black font-anton uppercase text-[var(--primary)] tracking-wide tabular-nums`}>
              {itemCount} MÓN
            </span>
          </div>
        </div>
      </div>

      {/* Info Section (Right) */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0 pr-12">
        <div className="space-y-0.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1 text-gray-400">
              <Store className="w-3 h-3 text-[var(--primary)]" />
              <span className="text-[8px] font-black uppercase tracking-widest leading-none">Cửa hàng</span>
            </div>
            <h4 className="font-bold text-gray-700 text-base md:text-lg truncate leading-tight tracking-tight">
              {cart.restaurant.name}
            </h4>
          </div>

          <p className="text-[10px] text-gray-400 font-medium line-clamp-1 italic opacity-60">
            {itemNames}
          </p>
        </div>

        <div className="flex flex-col border-t border-gray-50 pt-2.5">
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.15em] leading-none mb-1 opacity-50">Tạm tính</span>
          <div className="text-xl md:text-xl font-anton font-semibold text-gray-700 leading-none tracking-tight">
            {formatVnd(subtotal)}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons (Absolute Positioning) */}
      {!isEditMode && (
        <>
          {/* Delete Button - Top Right */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#FEF2F2", color: "#EF4444" }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => onDeleteSingle(cart.id, e)}
            disabled={isDeleting}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-20 w-9 h-9 rounded-2xl bg-gray-100/80 flex items-center justify-center text-gray-400 shadow-sm transition-colors"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin text-red-400" /> : <Trash className="w-4 h-4" />}
          </motion.button>

          {/* Checkout Link - Bottom Right */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 overflow-hidden pointer-events-none group-hover:pointer-events-auto">
            <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out">
              Checkout
            </span>
            <div className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300">
              <ChevronRight className="w-4 h-4 transition-transform" strokeWidth={3} />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
