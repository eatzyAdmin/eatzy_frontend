import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useDragControls } from "@repo/ui/motion";
import { X, ClipboardList, ArrowLeft, Loader2, ShoppingBag, Compass, FileText, ChevronRight } from "@repo/ui/icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRouter } from "next/navigation";
import type { OrderResponse } from "@repo/types";
import { CurrentOrderCardShimmer } from "@repo/ui";
import { statusLabel } from "./status-helpers";
import CurrentOrderCard from "../CurrentOrderCard";
import OrderDetailsContent from "./OrderDetailsContent";
import OrderStatusSteps from "../OrderStatusSteps";
import dynamic from "next/dynamic";
import { PullToRefresh } from "@repo/ui";

const OrderMapView = dynamic(() => import("@/features/orders/components/OrderMapView"), { ssr: false });

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
  onRefresh: () => Promise<void>;
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
  cancellationReasons,
  onRefresh,
}: MobileViewProps) {
  const [isDetailMapVisible, setIsDetailMapVisible] = useState(false);
  const draggbleRef = useRef<HTMLDivElement>(null);
  const dragY = useMotionValue(0);
  const [drawerY, setDrawerY] = useState<number | string>("100%");
  const dragControls = useDragControls();
  const contentRef = useRef<HTMLDivElement>(null);
  const downEvent = useRef<React.PointerEvent | null>(null);
  const startY = useRef(0);
  const dragStarted = useRef(false);
  const router = useRouter();

  const handleExplore = () => {
    onClose();
    setTimeout(() => {
      router.push("/home?recommend=true");
    }, 300);
  };

  // Bottom drawer minimized height is roughly 200px
  // dragY = 0 is MAXIMIZED (takes up 92vh)
  // dragY = 540 is MINIMIZED (pushed down, showing ~200px)
  const topY = useTransform(dragY, [0, 270, 540], ["-110%", "-50%", "0%"]);

  useEffect(() => {
    if (mobileView === "DETAIL") {
      const timer = setTimeout(() => setIsDetailMapVisible(true), 600);
      setDrawerY(540); // Start minimized
      return () => clearTimeout(timer);
    } else {
      setIsDetailMapVisible(false);
      setDrawerY("100%");
      dragY.set(0);
    }
  }, [mobileView, dragY]);

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
            className="flex-1 overflow-hidden bg-[#F7F7F7]"
          >
            <PullToRefresh
              onRefresh={onRefresh}
              pullText="Kéo để cập nhật"
              releaseText="Thả để cập nhật"
              refreshingText="Đang cập nhật..."
              disabled={isLoadingOrders}
              className="h-full overflow-y-auto custom-scrollbar px-3 md:px-0"
            >
              {/* Mobile Header List - Sticky with Mask */}
              <div className="bg-[#F7F7F7] backdrop-blur-md py-3 mb-1 sticky top-0 z-20 px-1 max-md:[mask-image:linear-gradient(to_bottom,black_90%,transparent)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={onClose}
                      className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 group flex-shrink-0"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
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
                  </div>
                </div>
              </div>

              {/* Order List Content */}
              <div className="pt-2 pb-6">
                {isLoadingOrders ? (
                  <div className="space-y-2">
                    <CurrentOrderCardShimmer cardCount={1} />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orders.length === 0 ? (
                      <EmptyState
                        icon={FileText}
                        title="Chưa có đơn hàng nào"
                        description="Hãy khám phá các nhà hàng xung quanh bạn nhé!"
                        buttonText="Đặt món ngay"
                        buttonIcon={Compass}
                        onButtonClick={handleExplore}
                        className="py-12"
                      />
                    ) : (
                      orders.map(o => (
                        <CurrentOrderCard
                          key={o.id}
                          order={o}
                          onClick={() => handleOrderClick(o.id)}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </PullToRefresh>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="flex-1 relative overflow-hidden bg-black h-full"
          >
            {/* Background Map View */}
            <div className="absolute inset-0 z-0 bg-gray-100">
              {isDetailMapVisible && activeOrder ? (
                <OrderMapView
                  fullWidth
                  restaurantLocation={activeOrder.restaurant?.latitude && activeOrder.restaurant?.longitude ? { lat: Number(activeOrder.restaurant.latitude), lng: Number(activeOrder.restaurant.longitude) } : undefined}
                  deliveryLocation={activeOrder.deliveryLatitude && activeOrder.deliveryLongitude ? { lat: Number(activeOrder.deliveryLatitude), lng: Number(activeOrder.deliveryLongitude) } : undefined}
                  driverLocation={activeOrder.driver?.latitude && activeOrder.driver?.longitude ? { lat: Number(activeOrder.driver.latitude), lng: Number(activeOrder.driver.longitude) } : undefined}
                  orderStatus={activeOrder.orderStatus}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-400 space-y-2 bg-gray-50/50 backdrop-blur-[2px]">
                  <Loader2 className="w-8 h-8 animate-spin opacity-50" />
                  <div className="text-sm font-medium">Đang tải bản đồ...</div>
                </div>
              )}
            </div>

            {/* Top Fixed Area (Hidden on drag) */}
            <motion.div
              style={{ y: topY }}
              className="absolute top-0 inset-x-0 z-20 bg-[#F7F7F7] backdrop-blur-md rounded-b-[40px] shadow-xl pb-1.5"
            >
              <div className="px-3 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMobileView("LIST")}
                    className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 font-bold"
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

              {activeOrder && (
                <div className="px-1">
                  <div className="bg-gray-300 rounded-[40px] md:rounded-[46px] p-3 md:p-4 border-4 border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                    <OrderStatusSteps status={activeOrder.orderStatus} createdAt={activeOrder.createdAt} />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Draggable Bottom Drawer */}
            <motion.div
              style={{ y: dragY }}
              drag="y"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 540 }}
              dragElastic={0.1}
              onDragEnd={(e, info) => {
                if (info.offset.y < -50 || info.velocity.y < -300) {
                  setDrawerY(0); // Maximize
                } else if (info.offset.y > 50 || info.velocity.y > 300) {
                  setDrawerY(540); // Minimize
                }
              }}
              className="absolute bottom-0 inset-x-0 z-30 bg-[#F7F7F7] rounded-t-[46px] shadow-[0_-20px_80px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden h-[92vh]"
              initial={{ y: "100%" }}
              animate={{ y: drawerY }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Handle - Always draggable */}
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="w-full h-8 flex items-center justify-center flex-shrink-0 pt-2 cursor-grab active:cursor-grabbing"
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </div>

              {/* Scrollable Content inside Drawer */}
              <div
                ref={contentRef}
                onPointerDown={(e) => {
                  downEvent.current = e;
                  startY.current = e.clientY;
                  dragStarted.current = false;

                  // If not maximized, any touch starts the drawer movement
                  if (drawerY !== 0) {
                    dragControls.start(e);
                    dragStarted.current = true;
                  }
                }}
                onPointerMove={(e) => {
                  // If maximized, we only start drawer drag if we are pulling DOWN at the top
                  if (drawerY === 0 && !dragStarted.current && contentRef.current) {
                    const isAtTop = contentRef.current.scrollTop <= 0;
                    const deltaY = e.clientY - startY.current;

                    if (isAtTop && deltaY > 5) {
                      dragStarted.current = true;
                      if (downEvent.current) {
                        dragControls.start(downEvent.current);
                      }
                    }
                  }
                }}
                className={`flex-1 ${drawerY === 0 ? "overflow-y-auto" : "overflow-y-hidden"} no-scrollbar p-3 pt-0 space-y-3`}
                style={{
                  touchAction: drawerY === 0 ? "pan-y" : "none",
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {activeOrder && (
                  <OrderDetailsContent
                    order={activeOrder}
                    showCancelReasons={showCancelReasons}
                    setShowCancelReasons={setShowCancelReasons}
                    onCancel={handleCancelOrder}
                    onConfirmCancel={handleConfirmCancel}
                    cancellationReasons={cancellationReasons}
                    isMobileDetail={true}
                    isMapVisible={false}
                    hideHeader={true}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
