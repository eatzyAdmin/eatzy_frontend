import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, ClipboardList, ArrowLeft } from "@repo/ui/icons";
import type { OrderResponse } from "@repo/types";
import { OrderHistoryCardShimmer } from "@repo/ui";
import { statusLabel } from "./status-helpers";
import OrderHistoryCard from "../OrderHistoryCard";
import OrderDetailsContent from "./OrderDetailsContent";

interface MobileViewProps {
  orders: OrderResponse[];
  activeOrder: OrderResponse | null;
  mobileView: "LIST" | "DETAIL";
  setMobileView: (view: "LIST" | "DETAIL") => void;
  handleOrderClick: (id: number) => void;
  isLoadingOrders: boolean;
  onClose: () => void;
  showCancelReasons: boolean;
  setShowCancelReasons: (show: boolean) => void;
  handleCancelOrder: () => void;
  handleConfirmCancel: (reason: string) => void;
  cancellationReasons: string[];
}

export default function MobileView({
  orders,
  activeOrder,
  mobileView,
  setMobileView,
  handleOrderClick,
  isLoadingOrders,
  onClose,
  showCancelReasons,
  setShowCancelReasons,
  handleCancelOrder,
  handleConfirmCancel,
  cancellationReasons
}: MobileViewProps) {
  const [isDetailMapVisible, setIsDetailMapVisible] = useState(false);

  useEffect(() => {
    if (mobileView === "DETAIL") {
      const timer = setTimeout(() => setIsDetailMapVisible(true), 600);
      return () => clearTimeout(timer);
    } else {
      setIsDetailMapVisible(false);
    }
  }, [mobileView]);

  return (
    <div className="md:hidden flex-1 relative flex flex-col overflow-hidden h-full">
      <AnimatePresence mode="popLayout" initial={false}>
        {mobileView === "LIST" ? (
          <motion.div
            key="list"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="flex-1 overflow-y-auto custom-scrollbar bg-[#F8F9FA]"
          >
            {/* Mobile Header List - Sticky with Mask exactly like Profile */}
            <div
              className="bg-[#F8F9FA]/95 backdrop-blur-md py-3 mb-1 sticky top-0 z-20 px-4 max-md:[mask-image:linear-gradient(to_bottom,black_90%,transparent)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3
                    className="text-[32px] font-bold leading-tight text-[#1A1A1A] uppercase"
                    style={{
                      fontStretch: "condensed",
                      letterSpacing: "-0.01em",
                      fontFamily: "var(--font-anton), var(--font-sans)",
                    }}
                  >
                    Current Orders
                  </h3>
                  <div className="text-sm font-medium text-gray-500 mt-1">{orders.length} đơn hàng đang xử lý</div>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-3 pb-20">
              {isLoadingOrders ? (
                <div className="pt-4 space-y-2.5">
                  <OrderHistoryCardShimmer cardCount={3} />
                </div>
              ) : (
                <div className="pt-4 space-y-2.5">
                  {orders.length === 0 ? (
                    <div className="text-center py-20">
                      <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="font-bold text-gray-600">Không có đơn hàng nào</h4>
                    </div>
                  ) : (
                    orders.map(o => (
                      <OrderHistoryCard
                        key={o.id}
                        order={o}
                        onClick={() => handleOrderClick(o.id)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="flex-1 overflow-y-auto custom-scrollbar bg-[#F8F9FA]"
          >
            {/* Mobile Header Detail - Sticky with Mask exactly like Profile */}
            <div
              className="bg-[#F8F9FA]/95 backdrop-blur-md py-4 mb-1 sticky top-0 z-20 px-4 max-md:[mask-image:linear-gradient(to_bottom,black_90%,transparent)]"
            >
              <div className="flex items-center justify-between text-left">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMobileView("LIST")}
                    className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 group flex-shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] uppercase leading-none tracking-tight">Order #{activeOrder?.id}</h3>
                    <div className="text-xs font-medium text-gray-500 mt-0.5">
                      {statusLabel(activeOrder?.orderStatus || "")}
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-3 pt-1 space-y-3 pb-20">
              {activeOrder && (
                <OrderDetailsContent
                  order={activeOrder}
                  showCancelReasons={showCancelReasons}
                  setShowCancelReasons={setShowCancelReasons}
                  onCancel={handleCancelOrder}
                  onConfirmCancel={handleConfirmCancel}
                  cancellationReasons={cancellationReasons}
                  isMobileDetail={true}
                  isMapVisible={isDetailMapVisible}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
