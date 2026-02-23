"use client";
import { motion } from "@repo/ui/motion";
import { useLoading, useSwipeConfirmation } from "@repo/ui";
import CheckoutMapSection from "@/features/checkout/components/CheckoutMapSection";
import { formatVnd } from "@repo/lib";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@repo/ui";
import { ShoppingBag, Loader2, ChevronLeft, Store } from "@repo/ui/icons";

interface RightSidebarProps {
  restaurantName?: string;
  restaurantId?: number | null;
  restaurantSlug?: string | null;
  restaurantAvatar?: string | null;
  totalPayable: number;
  onAddressChange?: (addr: string) => void;
  onPlaceOrder?: () => Promise<void>;
  isCreating?: boolean;
  children?: React.ReactNode;
}

export default function RightSidebar({
  restaurantName,
  restaurantId,
  restaurantSlug,
  restaurantAvatar,
  totalPayable,
  onAddressChange,
  onPlaceOrder,
  isCreating = false,
  children,
}: RightSidebarProps) {
  const router = useRouter();
  const { confirm } = useSwipeConfirmation();

  const handleCompleteOrder = () => {
    if (isCreating || !onPlaceOrder) return;

    confirm({
      title: "Confirm Order",
      description: `Đặt đơn hàng với tổng tiền ${formatVnd(totalPayable)}?`,
      confirmText: "Place Order",
      type: "success",
      processingDuration: 1500,
      onConfirm: async () => {
        await onPlaceOrder();
      }
    });
  };

  return (
    <div className="relative h-auto md:h-full md:overflow-y-auto no-scrollbar md:pl-2 pb-24 md:pb-0 flex flex-col">
      <div className="hidden md:block mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <ShoppingBag size={12} />
            Checkout Process
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-anton font-semibold text-[#1A1A1A] leading-tight">FINAL STEP</div>
          {restaurantName && (
            <button
              onClick={() => {
                router.push(`/restaurants/${restaurantSlug || restaurantId}`);
              }}
              className="group relative flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-[var(--primary)] text-white shadow-lg hover:bg-lime-600 active:scale-95 transition-all w-fit max-w-[240px] mt-0.5 overflow-hidden"
            >
              {/* Glossy Overlay like DishCustomizeDrawer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />

              {/* Icon Box from DishCustomizeDrawer style */}
              <div className="w-8 h-8 rounded-xl bg-white/25 flex items-center justify-center shrink-0 relative z-10 transition-colors group-hover:bg-white/40">
                <Store size={16} strokeWidth={2.5} className="text-white" />
              </div>

              <p className="text-[14px] font-bold tracking-tight text-white truncate relative z-10">{restaurantName}</p>

              <ChevronLeft size={14} strokeWidth={3} className="text-white/60 group-hover:text-white transition-colors rotate-180 relative z-10" />
            </button>
          )}
        </div>
      </div>

      <div className="hidden md:block">
        <CheckoutMapSection onAddressChange={onAddressChange}>
          {children}
        </CheckoutMapSection>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[60] md:sticky md:bottom-0 md:bg-[#F7F7F7] md:border-none md:shadow-none md:z-auto md:pb-0 md:mt-auto">
        <div className="p-4 md:pt-4 md:px-0">
          <motion.button
            whileHover={{ scale: isCreating ? 1 : 1.02 }}
            whileTap={{ scale: isCreating ? 1 : 0.98 }}
            onClick={handleCompleteOrder}
            disabled={isCreating}
            className={`w-full h-14 md:h-16 rounded-[20px] text-white text-xl font-semibold md:text-2xl uppercase font-anton shadow-lg transition-all flex items-center justify-center gap-2 ${isCreating
              ? 'bg-gray-400 cursor-not-allowed shadow-gray-300/30'
              : 'bg-[var(--primary)] shadow-lime-500/30 hover:shadow-lime-500/50'
              }`}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Complete Order</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-lg text-sm font-sans font-bold ml-2">
                  {formatVnd(totalPayable)}
                </span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
