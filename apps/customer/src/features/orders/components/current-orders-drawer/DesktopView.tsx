"use client";
import { motion } from "@repo/ui/motion";
import { X, ClipboardList, Loader2, Compass, FileText, ChevronRight } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRouter } from "next/navigation";
import type { OrderResponse } from "@repo/types";
import dynamic from "next/dynamic";
import { getStatusIcon, statusLabel } from "./status-helpers";
import OrderDetailsContent from "./OrderDetailsContent";

const OrderMapView = dynamic(() => import("@/features/orders/components/OrderMapView"), { ssr: false });

interface DesktopViewProps {
  orders: OrderResponse[];
  activeOrder: OrderResponse | null;
  activeOrderId: number | null;
  setActiveOrderId: (id: number) => void;
  isMapVisible: boolean;
  onClose: () => void;
  showCancelReasons: boolean;
  setShowCancelReasons: (show: boolean) => void;
  handleCancelOrder: () => void;
  handleConfirmCancel: (reason: string) => void;
  cancellationReasons: string[];
  detailsContainerRef: React.RefObject<HTMLDivElement>;
}

export default function DesktopView({
  orders,
  activeOrder,
  activeOrderId,
  setActiveOrderId,
  isMapVisible,
  onClose,
  showCancelReasons,
  setShowCancelReasons,
  handleCancelOrder,
  handleConfirmCancel,
  cancellationReasons,
  detailsContainerRef
}: DesktopViewProps) {
  const router = useRouter();
  const handleExplore = () => {
    onClose();
    setTimeout(() => {
      router.push('/home?recommend=true');
    }, 300);
  };

  return (
    <div className="hidden md:flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Desktop Header */}
      <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between shadow-sm/50 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-lime-50 border border-lime-100 flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-lime-600" />
          </div>
          <div>
            <h3 className="text-2xl font-anton font-bold text-[#1A1A1A]">CURRENT ORDERS</h3>
            <div className="text-sm font-medium text-gray-500 mt-0.5">
              {orders.length} active orders
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all shadow-sm/30"
        >
          <X size={24} />
        </motion.button>
      </div>

      {orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-[#F8F9FA]">
          <EmptyState
            icon={FileText}
            title="Không có đơn hàng"
            description="Hiện tại bạn không có đơn hàng nào đang trong quá trình xử lý."
            buttonText="Khám phá ngay"
            buttonIcon={Compass}
            onButtonClick={handleExplore}
            className="px-0"
          />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden grid grid-cols-[25%_40%_35%] bg-[#F8F9FA] min-h-0">
          {/* 1. Desktop Order List Column (Vertical) */}
          <div className="flex flex-col border-r border-gray-100 bg-[#F8F9FA] h-full overflow-hidden min-h-0">
            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-3">
              {orders.map((o) => {
                const active = o.id === activeOrderId;
                return (
                  <motion.div
                    key={o.id}
                    onClick={() => setActiveOrderId(o.id)}
                    className={`
                      relative p-4 rounded-[24px] cursor-pointer border transition-all duration-200 group
                      ${active
                        ? 'bg-white border-lime-500 shadow-md shadow-lime-500/10 ring-1 ring-lime-500/20'
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold font-anton text-sm ${active ? "bg-lime-100 text-lime-700" : "bg-gray-100 text-gray-500"}`}>
                          #{o.id}
                        </div>
                        <div>
                          <div className={`text-sm font-bold line-clamp-1 ${active ? "text-[#1A1A1A]" : "text-gray-600"}`}>{o.restaurant?.name}</div>
                          <div className="text-xs text-gray-400 font-medium">{formatVnd(o.totalAmount)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide
                      ${active ? 'bg-lime-50 text-lime-700' : 'bg-gray-50 text-gray-500'}
                    `}>
                      {getStatusIcon(o.orderStatus)}
                      {statusLabel(o.orderStatus)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 2. Map View Column */}
          <div className="relative h-full w-full bg-[#F8F9FA] border-r border-gray-100 z-0 min-h-0 p-5">
            <div className="h-full w-full rounded-[40px] overflow-hidden border border-gray-100 shadow-md bg-white">
              {isMapVisible && activeOrder ? (() => {
                const isValidCoordinate = (lat: any, lng: any): boolean => {
                  if (lat == null || lng == null) return false;
                  const nLat = Number(lat), nLng = Number(lng);
                  if (isNaN(nLat) || isNaN(nLng)) return false;
                  if (nLat === 0 && nLng === 0) return false;
                  return nLat >= -90 && nLat <= 90 && nLng >= -180 && nLng <= 180;
                };

                return (
                  <OrderMapView
                    fullWidth
                    restaurantLocation={
                      isValidCoordinate(activeOrder.restaurant?.latitude, activeOrder.restaurant?.longitude)
                        ? { lat: Number(activeOrder.restaurant.latitude), lng: Number(activeOrder.restaurant.longitude) }
                        : undefined
                    }
                    deliveryLocation={
                      isValidCoordinate(activeOrder.deliveryLatitude, activeOrder.deliveryLongitude)
                        ? { lat: Number(activeOrder.deliveryLatitude), lng: Number(activeOrder.deliveryLongitude) }
                        : undefined
                    }
                    driverLocation={
                      isValidCoordinate(activeOrder.driver?.latitude, activeOrder.driver?.longitude)
                        ? { lat: Number(activeOrder.driver?.latitude), lng: Number(activeOrder.driver?.longitude) }
                        : undefined
                    }
                    orderStatus={activeOrder.orderStatus}
                  />
                );
              })() : (
                <div className="h-full w-full flex flex-col items-center justify-center text-center text-gray-400 space-y-2 bg-gray-50/50 backdrop-blur-[2px]">
                  <Loader2 className="w-6 h-6 animate-spin opacity-50" />
                  <div className="text-xs font-medium">Đang tải bản đồ...</div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Details Column */}
          <div
            ref={detailsContainerRef}
            className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-5 custom-scrollbar bg-[#F8F9FA] h-full pb-4 md:pb-6 relative min-h-0"
          >
            {activeOrder && (
              <OrderDetailsContent
                order={activeOrder}
                showCancelReasons={showCancelReasons}
                setShowCancelReasons={setShowCancelReasons}
                onCancel={handleCancelOrder}
                onConfirmCancel={handleConfirmCancel}
                cancellationReasons={cancellationReasons}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
