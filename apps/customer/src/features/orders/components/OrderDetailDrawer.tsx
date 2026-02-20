"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { OrderDetailDrawerShimmer } from "@repo/ui";
import { X, ClipboardList } from "@repo/ui/icons";
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

const OrderReviewTab = dynamic(() => import("@/features/orders/components/OrderReviewTab"), { ssr: false });

export default function OrderDetailDrawer({
  open,
  onClose,
  order,
}: {
  open: boolean;
  onClose: () => void;
  order: OrderResponse | null;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setActiveTab("details");
      const timer = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!order) return null;

  const restaurant = order.restaurant;
  const driver = order.driver;

  const tabs = [
    { id: "details", name: "Chi tiết" },
    { id: "reviews", name: "Đánh giá" },
  ];

  const isCancelled = order.orderStatus === 'CANCELLED';

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
            className="fixed z-[70] left-0 right-0 bottom-0 h-[92vh] md:h-[90vh] rounded-t-[46px] md:rounded-t-[48px] bg-[#F8F9FA] border-t border-gray-100 overflow-hidden shadow-2xl flex flex-col isolate shadow-black/10"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              maskImage: 'linear-gradient(white, white)'
            }}
          >
            {/* Header */}
            <div className="bg-white px-6 py-5 md:px-8 md:py-6 md:border-b md:border-gray-100 flex items-center justify-between md:shadow-sm shrink-0 z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lime-50 border border-lime-100 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-anton font-bold text-[#1A1A1A] leading-tight uppercase">ORDER DETAILS</h3>
                  <div className="text-sm font-medium text-gray-500 mt-0.5 flex items-center gap-2">
                    <span className="opacity-60 uppercase tracking-widest text-[10px] font-black">Order ID:</span>
                    <span className="font-bold text-lime-600">#{order.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-8">
                {order.orderStatus === "DELIVERED" && (
                  <div className="hidden lg:flex relative items-center p-1 bg-gray-100 rounded-[22px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-gray-200/20">
                    {tabs.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        className={`relative z-10 px-6 py-2 rounded-[18px] text-[16px] font-anton font-black uppercase transition-all duration-300 ${activeTab === t.id ? "bg-white text-[#1A1A1A] shadow-[0_4px_12px_rgba(0,0,0,0.08)] scale-[1.02]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"}`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Mobile Tabs Switcher - Updated to sync with Desktop Style */}
            {order.orderStatus === "DELIVERED" && (
              <div className="md:hidden px-6 pt-1 shrink-0">
                <div className="flex items-center p-1 bg-gray-100 rounded-[22px] w-full shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)] border border-gray-200/10">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`flex-1 py-2.5 rounded-[18px] text-[15px] font-anton font-black uppercase tracking-wider transition-all duration-300 ${activeTab === t.id ? "bg-white text-[#1A1A1A] shadow-[0_10px_20px_rgba(0,0,0,0.06)] scale-[1.02]" : "text-gray-400 active:scale-95"}`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
              {isLoading ? (
                <OrderDetailDrawerShimmer />
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === "details" ? (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
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

                      {/* Mobile Layout - Unified Scroll (Requested Order) */}
                      <div className="md:hidden flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 p-3">
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
                          <SafetyDisclaimer />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-5 md:py-6 md:px-16"
                    >
                      <OrderReviewTab
                        order={order}
                        driver={driver}
                        restaurant={restaurant}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
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
