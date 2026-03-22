"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { OrderDetailDrawerShimmer } from "@repo/ui";
import { X, ClipboardList, Star, ChevronRight, Check } from "@repo/ui/icons";
import type { OrderResponse } from "@repo/types";
import {
  CancellationAlert,
  RestaurantCard,
  DriverCard,
  OrderItemsList,
  LogisticsInfo,
  PaymentSummary,
  SafetyDisclaimer,
  OrderNotes,
} from "./order-detail";
import { MobileCarousel } from "./MobileCarousel";

import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";
import { useReview } from "@/features/orders/hooks/useReview";

export default function OrderDetailDrawer({
  open,
  onClose,
  order,
}: {
  open: boolean;
  onClose: () => void;
  order: OrderResponse | null;
}) {
  useMobileBackHandler(open, onClose);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [canStartShimmer, setCanStartShimmer] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setShowReviewPrompt(false);
      setCanStartShimmer(false); // Reset shimmer animation state
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Delay 0.9s after loading is done to show review prompt
        const promptTimer = setTimeout(() => setShowReviewPrompt(true), 500);
        return () => clearTimeout(promptTimer);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const restaurant = order?.restaurant;
  const driver = order?.driver;
  const isCancelled = order?.orderStatus === 'CANCELLED';

  const { isRestaurantReviewed, isDriverReviewed, isLoading: isReviewLoading } = useReview(
    order?.id ?? 0,
    restaurant?.imageUrl,
    driver?.avatarUrl
  );

  const reviewedBoth = isRestaurantReviewed && isDriverReviewed;
  const missingOne = (isRestaurantReviewed && !isDriverReviewed) || (!isRestaurantReviewed && isDriverReviewed);

  if (!order) return null;

  const getReviewText = () => {
    if (!isRestaurantReviewed && !isDriverReviewed) return "Trải nghiệm của bạn thế nào?";
    if (!isRestaurantReviewed) return "Bạn thấy cửa hàng thế nào?";
    if (!isDriverReviewed) return "Bạn thấy tài xế thế nào?";
    return "";
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            key="detail-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="fixed z-[70] left-0 right-0 bottom-0 h-[96vh] md:h-[90vh] rounded-t-[40px] md:rounded-t-[48px] bg-[#F8F9FA] border-t border-gray-100 overflow-hidden shadow-2xl flex flex-col isolate shadow-black/10"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              maskImage: 'linear-gradient(white, white)'
            }}
            onAnimationComplete={() => setCanStartShimmer(true)}
          >
            {/* Header */}
            <div className="bg-[#F8F9FA] md:bg-white px-6 py-5 md:px-8 md:py-6 border-b border-gray-100 flex items-center justify-between md:shadow-sm shrink-0 z-20">
              <div className="flex items-center gap-4">
                <div className="hidden md:flex w-12 h-12 rounded-2xl bg-lime-50 border border-lime-100 items-center justify-center shrink-0">
                  <ClipboardList className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-2xl font-anton font-bold text-[#1A1A1A] leading-tight uppercase">ORDER DETAILS</h3>
                  <div className="text-gray-500 text-xs font-semibold mt-0.5 flex items-center gap-2">
                    <span>Order ID: #{order.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-8">
                {!isReviewLoading && order.orderStatus === "DELIVERED" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      router.push(`/orders/${order.id}/review`);
                    }}
                    className={`hidden lg:flex group relative items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-3xl text-white shadow-md active:scale-95 transition-all w-fit overflow-hidden ${reviewedBoth ? "bg-lime-600/90 shadow-lime-600/10" : "bg-lime-500 shadow-lime-500/20"
                      }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                    <div className="w-8 h-8 rounded-xl bg-white/25 flex items-center justify-center shrink-0 relative z-10 transition-colors group-hover:bg-white/40">
                      {reviewedBoth ? (
                        <Check size={16} strokeWidth={3} className="text-white" />
                      ) : (
                        <Star size={16} strokeWidth={2.5} className="text-white fill-white" />
                      )}
                    </div>
                    <p className="text-[14px] font-bold tracking-tight text-white relative z-10">
                      {reviewedBoth ? "Xem lại đánh giá" : getReviewText()}
                    </p>
                    <ChevronRight size={14} strokeWidth={3} className="text-white/60 group-hover:text-white transition-colors relative z-10" />
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shadow md:shadow-none hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Mobile Review Prompt (Top) - Simplified for performance */}
            {!isLoading && (
              <AnimatePresence>
                {(order.orderStatus === "DELIVERED" && showReviewPrompt && !isReviewLoading && !reviewedBoth) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                    className="md:hidden overflow-hidden shrink-0"
                  >
                    <div className="px-4 pt-4 pb-2">
                      <motion.button
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                          router.push(`/orders/${order.id}/review`);
                        }}
                        className="w-full flex flex-col items-center justify-center pb-2 gap-0.5"
                      >
                        <span className="text-[17px] font-bold text-[#1A1A1A] tracking-tight">{getReviewText()}</span>
                        <div className="flex items-center gap-1 text-lime-600">
                          <span className="text-[13px] font-bold border-b-2 border-dotted border-lime-500/40 pb-0.5">Chia sẻ trải nghiệm ngay</span>
                          <ChevronRight className="w-4 h-4" strokeWidth={3} />
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden min-h-0 flex flex-col md:pt-0">
              {isLoading ? (
                <OrderDetailDrawerShimmer shouldAnimate={canStartShimmer} />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 min-h-0 flex flex-col overflow-hidden"
                >
                  {/* Desktop Layout - Strictly Preserved */}
                  <div className="hidden md:grid md:grid-cols-[62%_38%] h-full overflow-hidden">
                    {/* Left Column (Independent scrolling) */}
                    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 p-5 md:py-6 md:pl-16 md:pr-5 min-h-0">
                      {isCancelled && <CancellationAlert reason={order.cancellationReason} />}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
                        <RestaurantCard restaurant={restaurant} />
                        <DriverCard driver={driver} />
                      </div>

                      <OrderItemsList order={order} />
                      <SafetyDisclaimer />
                    </div>

                    {/* Right Column (Independent scrolling) */}
                    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 p-5 md:py-6 md:pl-6 md:pr-16 bg-[#F8F9FA] min-h-0">
                      <LogisticsInfo order={order} />
                      <PaymentSummary order={order} />
                      {order.specialInstructions && <OrderNotes notes={order.specialInstructions} />}
                    </div>
                  </div>

                  {/* Mobile Layout - Unified Scroll */}
                  <div className="md:hidden flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 md:gap-4 p-3">
                    {isCancelled && <CancellationAlert reason={order.cancellationReason} />}

                    {/* 1. Swipeable Carousel for Restaurant & Driver */}
                    <MobileCarousel singleFocus>
                      <RestaurantCard restaurant={restaurant} />
                      <DriverCard driver={driver} />
                    </MobileCarousel>

                    {/* 2. Order Items List */}
                    <OrderItemsList order={order} />

                    {/* 3. Logistics info Route */}
                    <LogisticsInfo order={order} />

                    {/* 4. Payment Information */}
                    <PaymentSummary order={order} />

                    {/* 5. Notes & Safety Section - Unified on Mobile */}
                    <div className="flex flex-col gap-6 mb-10">
                      {order.specialInstructions && <OrderNotes notes={order.specialInstructions} />}

                      {reviewedBoth && showReviewPrompt && !isReviewLoading && (
                        <motion.button
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          whileTap={{ scale: 0.92 }}
                          transition={{ duration: 0.4 }}
                          onClick={() => router.push(`/orders/${order.id}/review`)}
                          className="flex flex-col items-center justify-center gap-0.5"
                        >
                          <span className="text-[17px] font-bold text-[#1A1A1A] tracking-tight">Cảm ơn bạn đã đánh giá!</span>
                          <div className="flex items-center gap-1 text-lime-600">
                            <span className="text-[13px] font-bold border-b-2 border-dashed border-lime-500/40 pb-0.5">Xem lại đánh giá của bạn</span>
                            <ChevronRight className="w-4 h-4" strokeWidth={3} />
                          </div>
                        </motion.button>
                      )}

                      <SafetyDisclaimer />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Micro-animations styles */}
            <style jsx>{`
              @keyframes pulseDot {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.6); opacity: 0.6; }
                100% { transform: scale(1); opacity: 1; }
              }
              .pulsing-dot {
                animation: pulseDot 2s infinite ease-in-out;
              }
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
