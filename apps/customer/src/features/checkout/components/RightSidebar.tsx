"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "@repo/ui/motion";
import { useSwipeConfirmation, useNotification, useLoading } from "@repo/ui";
import CheckoutMapSection from "@/features/checkout/components/CheckoutMapSection";
import { formatVnd } from "@repo/lib";

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
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();
  const { show: showLoading } = useLoading();

  useEffect(() => {
    const el = rightColRef.current;
    if (!el) return;
  }, []);

  const handleCompleteOrder = () => {
    confirm({
      title: "Xác nhận đặt hàng",
      description: `Bạn có chắc chắn muốn đặt đơn hàng với tổng tiền ${formatVnd(totalPayable)}?`,
      confirmText: "Đặt hàng",
      type: "success",
      processingDuration: 1500,
      onConfirm: async () => {
        showLoading("Đang xử lý đơn hàng...");

        // Navigate to home first
        router.push('/home');

        // Show notification after navigation
        setTimeout(() => {
          showNotification({
            type: "success",
            message: "Đặt hàng thành công",
            format: `Đơn hàng của bạn đã được đặt thành công. Đang tìm tài xế...`,
          });
        }, 800);
      }
    });
  };

  return (
    <div ref={rightColRef} className="relative h-auto md:h-full md:overflow-y-auto no-scrollbar md:pl-2 pb-24 md:pb-0">
      <div className="hidden md:block mb-6">
        <div className="text-[28px] font-bold uppercase tracking-wide" style={{
          fontStretch: "condensed",
          letterSpacing: "-0.01em",
          fontFamily: "var(--font-anton), var(--font-sans)",
        }}>Last Step - Checkout</div>
        {restaurantName && (
          <div className="text-[14px] text-[#555] mt-1">{restaurantName}</div>
        )}
      </div>

      <div className="hidden md:block">
        <CheckoutMapSection onAddressChange={onAddressChange}>
          {children}
        </CheckoutMapSection>
      </div>



      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] md:sticky md:bottom-0 md:bg-[#F7F7F7] md:border-none md:z-auto md:pb-4">
        <div className="p-4 md:pt-2 md:p-6 md:border-t-2 md:border-gray-300">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-600">Tổng số tiền</div>
            <div className="text-xl font-semibold text-[var(--primary)]">{formatVnd(totalPayable)}</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleCompleteOrder}
            className="mt-3 w-full h-16 rounded-2xl bg-[var(--primary)] text-white text-2xl uppercase font-anton font-semibold shadow-sm"
          >
            Complete Order
          </motion.button>
        </div>
      </div>
    </div>
  );
}


