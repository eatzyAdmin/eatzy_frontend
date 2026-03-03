"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, ClipboardList, Package } from "@repo/ui/icons";
import { OrderResponse } from "@repo/types";
import { OrderDetailDrawerShimmer } from "@repo/ui";
import {
  CancellationAlert,
  RestaurantCard,
  DriverCard,
  OrderItemsList,
  LogisticsInfo,
  PaymentSummary,
  SafetyDisclaimer,
  OrderNotes,
} from "@/features/orders/components/order-detail";
import { MobileCarousel } from "@/features/orders/components/MobileCarousel";

interface TransactionOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponse | null;
  isLoading: boolean;
}

export default function TransactionOrderDetailModal({
  isOpen,
  onClose,
  order,
  isLoading,
}: TransactionOrderDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isCancelled = order?.orderStatus === "CANCELLED";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="fixed z-[110] left-0 right-0 bottom-0 h-[92vh] md:h-[90vh] rounded-t-[40px] md:rounded-t-[48px] bg-[#F8F9FA] border-t border-gray-100 overflow-hidden shadow-2xl flex flex-col isolate shadow-black/10"
          >
            {/* Header - Always Visible like in OrderDetailDrawer.tsx */}
            <div className="bg-white px-6 py-5 md:px-8 md:py-6 md:border-b md:border-gray-100 flex items-center justify-between md:shadow-sm shrink-0 z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lime-50 border border-lime-100 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-anton font-bold text-[#1A1A1A] leading-tight uppercase">ORDER DETAILS</h3>
                  <div className="text-sm font-medium text-gray-500 mt-0.5 flex items-center gap-2">
                    <span className="opacity-60 uppercase tracking-widest text-[10px] font-black">Order ID:</span>
                    <span className="font-bold text-lime-600 min-w-[60px]">
                      {order ? `#${order.id}` : <div className="h-4 w-16 bg-gray-100 animate-pulse rounded-md" />}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area - Only this part Shimmers */}
            <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
              {isLoading ? (
                <OrderDetailDrawerShimmer />
              ) : order ? (
                <div className="flex-1 overflow-hidden min-h-0 flex flex-col transition-opacity duration-300">
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-[62%_38%] h-full overflow-hidden">
                    {/* Left Side */}
                    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 p-5 md:py-6 md:pl-16 md:pr-5 min-h-0">
                      {isCancelled && <CancellationAlert reason={order.cancellationReason} />}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
                        <RestaurantCard restaurant={order.restaurant} />
                        <DriverCard driver={order.driver} />
                      </div>

                      <OrderItemsList order={order} />
                      <SafetyDisclaimer />
                    </div>

                    {/* Right Side */}
                    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 p-5 md:py-6 md:pl-6 md:pr-16 bg-[#F8F9FA] min-h-0">
                      <LogisticsInfo order={order} />
                      <PaymentSummary order={order} />
                      {order.specialInstructions && <OrderNotes notes={order.specialInstructions} />}
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 p-3">
                    {isCancelled && <CancellationAlert reason={order.cancellationReason} />}

                    <MobileCarousel singleFocus>
                      <RestaurantCard restaurant={order.restaurant} />
                      <DriverCard driver={order.driver} />
                    </MobileCarousel>

                    <OrderItemsList order={order} />
                    <LogisticsInfo order={order} />
                    <PaymentSummary order={order} />

                    <div className="flex flex-col gap-6 mb-10">
                      {order.specialInstructions && <OrderNotes notes={order.specialInstructions} />}
                      <SafetyDisclaimer />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <Package size={48} className="opacity-20 mb-4" />
                  <p className="font-bold uppercase tracking-widest">Không tìm thấy đơn hàng</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
