"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Trash, Check, Store, Loader2, ChevronRight, ChefHat } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";
import { formatVnd } from "@repo/lib";
import type { Cart } from "@repo/types";
import { sileo } from "@/components/DynamicIslandToast";

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

  const isClosed = !!cart.restaurant.status && cart.restaurant.status !== 'OPEN';

  const handleCardClick = () => {
    if (isEditMode) {
      onToggleSelection(cart.id);
      return;
    }

    if (isClosed) {
      sileo.error({
        actionType: "store_closed",
        description: cart.restaurant.name
      });
      return;
    }
    onCardClick(cart.restaurant.id, cart.id);
  };

  return (
    <motion.div
      layout
      whileTap={{ scale: 0.98 }}
      exit={{
        opacity: 0,
        scale: 0.95,
        x: 40,
        filter: "blur(4px)",
        transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] }
      }}
      onClick={handleCardClick}
      className={`group relative w-full h-[140px] ${isClosed && !isEditMode ? 'cursor-default transition-opacity opacity-95' : 'cursor-pointer transition-all duration-500'}`}
    >
      {/* Background & Shadow Container with Clipping */}
      <div className={`absolute inset-0 flex flex-row overflow-hidden rounded-[40px] transition-all duration-500 ${isSelected
        ? "bg-lime-50/50 shadow-[0_0_20px_rgba(0,0,0,0.06),0_0_15px_rgba(132,204,22,0.08)]"
        : "bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)] md:shadow-[0_0_25px_rgba(0,0,0,0.10)]"
        } ${!isClosed && !isSelected ? "md:hover:bg-gray-50/50 md:hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]" : ""}`}
      >
        {/* Visual Identity Section (Left) */}
        <div className="relative w-36 md:w-32 h-full flex-shrink-0 overflow-hidden">
          <ImageWithFallback
            src={previewImage}
            alt={cart.restaurant.name}
            fill
            placeholderMode="horizontal"
            className={`object-cover transition-transform duration-700 ease-out ${isClosed ? 'grayscale brightness-75' : 'md:group-hover:scale-110'}`}
            sizes="144px"
          />
          <div className={`absolute inset-0 transition-all duration-700 ease-out ${isClosed ? 'bg-primary/10 mix-blend-color' : 'bg-black/5 md:group-hover:bg-black/0'}`} />

          {/* Counter Badge - Hide if Closed */}
          {!isClosed && (
            <div className="absolute top-3 left-3 z-10">
              <div className={`flex items-center gap-1.5 bg-white/95 backdrop-blur-sm pl-1 pr-2.5 py-1 rounded-3xl shadow-lg border border-[var(--primary)]/10`}>
                <div className={`w-5 h-5 rounded-full bg-[var(--primary)]/10 flex items-center justify-center`}>
                  <ChefHat className={`w-3 h-3 text-[var(--primary)]`} strokeWidth={3} />
                </div>
                <span className={`text-[10px] font-black font-anton uppercase text-[var(--primary)] tracking-wide tabular-nums`}>
                  {itemCount} ITEMS
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Info Section (Right) */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0 pr-12 relative">
          <div className="space-y-0.5">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1 text-gray-400">
                <Store className={`w-3 h-3 text-[var(--primary)] ${isClosed ? 'grayscale' : ''}`} />
                <span className="text-[8px] font-black uppercase tracking-widest leading-none">Store</span>
              </div>
              <h4 className={`font-bold text-gray-700 text-base md:text-lg truncate leading-tight tracking-tight ${isClosed ? 'opacity-60' : ''}`}>
                {cart.restaurant.name}
              </h4>
            </div>

            <p className="text-[10px] text-gray-400 font-medium line-clamp-1 italic opacity-60">
              {itemNames}
            </p>
          </div>

          <div className="flex flex-col border-t border-gray-50 pt-2.5">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.15em] leading-none mb-1 opacity-50">Subtotal</span>
            <div className={`text-xl md:text-xl font-anton font-semibold text-gray-700 leading-none tracking-tight ${isClosed ? 'opacity-60' : ''}`}>
              {formatVnd(subtotal)}
            </div>
          </div>
        </div>
      </div>

      {/* Closed Ribbon for Cart - Now outside overflow-hidden for true overflow */}
      {isClosed && (
        <motion.div
          initial={{ x: -25, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute top-6 left-[-8px] md:left-[-8px] z-20 pointer-events-none"
        >
          <div className="flex items-center gap-2 bg-red-600 text-white pl-4 pr-5 py-2 rounded-r-2xl shadow-xl border-y border-r border-white/20">
            <Store size={14} strokeWidth={3} />
            <span className="text-[12px] font-black font-anton uppercase tracking-widest pt-0.5">CLOSED</span>
          </div>
          {/* Fold shadow effect - Responsive alignment with responsive left-overflow */}
          <div className="absolute left-[1px] md:left-[1px] -bottom-2 w-0 h-0 border-t-[8px] border-t-red-900 border-l-[8px] border-l-transparent" />
        </motion.div>
      )}

      {/* Selection Border Overlay - Outside clipping for sharpness */}
      <div
        className={`absolute inset-0 z-10 rounded-[40px] border-2 pointer-events-none transition-all duration-500 ${isEditMode
          ? isSelected ? "border-lime-100" : "border-transparent"
          : "border-transparent"
          }`}
      />

      {/* Floating Action Buttons & Selection Checkmark */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-10"
          >
            <div
              className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 cursor-pointer ${isSelected
                ? "bg-lime-500 text-white scale-100 shadow-sm"
                : "bg-gray-100 text-transparent scale-90"
                }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelection(cart.id);
              }}
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

      {!isEditMode && (
        <>
          {/* Delete Button */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#FEF2F2", color: "#EF4444" }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSingle(cart.id, e);
            }}
            disabled={isDeleting}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-10 w-9 h-9 rounded-2xl bg-gray-100/80 flex items-center justify-center text-gray-400 shadow-sm transition-colors"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin text-red-400" /> : <Trash className="w-4 h-4" />}
          </motion.button>

          {/* Checkout Link */}
          <div className={`absolute bottom-3 right-3 z-10 flex items-center gap-2 overflow-hidden ${isClosed ? 'opacity-0' : 'pointer-events-none md:group-hover:pointer-events-auto'}`}>
            <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest translate-x-10 opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-500 ease-out">
              Checkout
            </span>
            <div className="w-9 h-9 rounded-full flex items-center justify-center md:group-hover:bg-[var(--primary)] md:group-hover:text-white transition-all duration-300">
              <ChevronRight className="w-4 h-4 transition-transform" strokeWidth={3} />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
