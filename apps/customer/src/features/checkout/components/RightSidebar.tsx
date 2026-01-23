"use client";
import { useRouter } from "next/navigation";
import { motion } from "@repo/ui/motion";
import { useSwipeConfirmation, useNotification, useLoading } from "@repo/ui";
import CheckoutMapSection from "@/features/checkout/components/CheckoutMapSection";
import { formatVnd } from "@repo/lib";
import { ShoppingBag } from "@repo/ui/icons";

export default function RightSidebar({
  restaurantName,
  totalPayable,
  onAddressChange,
  children,
}: {
  restaurantName?: string;
  totalPayable: number;
  onAddressChange?: (addr: string) => void;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();
  const { show: showLoading } = useLoading();

  const handleCompleteOrder = () => {
    confirm({
      title: "Confirm Order",
      description: `Đặt đơn hàng với tổng tiền ${formatVnd(totalPayable)}?`,
      confirmText: "Place Order",
      type: "success",
      processingDuration: 1500,
      onConfirm: async () => {
        showLoading("Đang xử lý đơn hàng...");
        router.push('/home');
        setTimeout(() => {
          showNotification({
            type: "success",
            message: "Order Placed Successfully",
            format: `We are finding a driver for you...`,
          });
        }, 800);
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
        <div className="text-3xl font-anton font-semibold text-[#1A1A1A] leading-tight">FINAL STEP</div>
        {restaurantName && (
          <div className="text-gray-500 font-medium mt-1">{restaurantName}</div>
        )}
      </div>

      <div className="hidden md:block">
        <CheckoutMapSection onAddressChange={onAddressChange}>
          {children}
        </CheckoutMapSection>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[60] md:sticky md:bottom-0 md:bg-[#F7F7F7] md:border-none md:shadow-none md:z-auto md:pb-4 md:mt-auto">
        <div className="p-4 md:pt-4 md:px-0">
          <div className="flex items-center justify-between mb-3 md:hidden">
            <div className="text-sm font-semibold text-gray-600">Total Payment</div>
            <div className="text-xl font-bold text-[var(--primary)]">{formatVnd(totalPayable)}</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCompleteOrder}
            className="w-full h-14 md:h-16 rounded-[20px] bg-[var(--primary)] text-white text-xl font-semibold md:text-2xl uppercase font-anton shadow-lg shadow-lime-500/30 hover:shadow-lime-500/50 transition-all flex items-center justify-center gap-2"
          >
            <span>Complete Order</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-sm font-sans font-bold ml-2">
              {formatVnd(totalPayable)}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}


