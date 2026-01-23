"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "@repo/ui/motion";
import {
  X, MapPin, ClipboardList, ChefHat, Bike, BadgeCheck,
  Clock, XCircle, ShieldCheck, Package, User
} from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import type { OrderResponse, OrderItemResponse } from "@repo/types";
import { useCurrentOrders } from "@/features/orders/hooks/useCurrentOrders";
import { useSwipeConfirmation, useNotification, useLoading, CurrentOrdersDrawerShimmer } from "@repo/ui";
import { orderApi } from "@repo/api";

const OrderMapView = dynamic(() => import("@/features/orders/components/OrderMapView"), { ssr: false });
import OrderStatusSteps from "@/features/orders/components/OrderStatusSteps";

export default function CurrentOrdersDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Fetch orders from API with polling enabled when drawer is open
  // When drawer is open: polls every 5s to simulate real-time updates
  const { orders, isLoading: isLoadingOrders, refetch } = useCurrentOrders({ isDrawerOpen: open });

  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const activeOrder = orders.find((o) => o.id === activeOrderId) ?? orders[0] ?? null;
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();
  const { hide: hideLoading } = useLoading();

  // Set first order as active when orders load
  useEffect(() => {
    if (orders.length > 0 && !activeOrderId) {
      setActiveOrderId(orders[0].id);
    }
  }, [orders, activeOrderId]);

  // Sync active order if list changes
  useEffect(() => {
    if (orders.length > 0 && activeOrderId && !orders.find(o => o.id === activeOrderId)) {
      setActiveOrderId(orders[0].id);
    }
  }, [orders, activeOrderId]);

  // Refetch when drawer opens
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const [showCancelReasons, setShowCancelReasons] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");

  const cancellationReasons = [
    "Đổi ý, không muốn mua nữa",
    "Đặt nhầm món/số lượng",
    "Thời gian giao hàng quá lâu",
    "Giá cao hơn dự kiến",
    "Lý do khác",
  ];

  const detailsContainerRef = useRef<HTMLDivElement>(null);

  const handleCancelOrder = () => {
    if (!activeOrder) return;
    setShowCancelReasons(true);
    // Scroll to bottom after state update to show reasons
    setTimeout(() => {
      detailsContainerRef.current?.scrollTo({
        top: detailsContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }, 100);
  };

  const handleConfirmCancel = (reason: string) => {
    confirm({
      title: "Xác nhận hủy đơn",
      description: `Lý do: ${reason}. Vuốt để xác nhận hủy đơn hàng #${activeOrder?.id}`,
      confirmText: "Xác nhận hủy",
      type: "danger",
      processingDuration: 1500,
      onConfirm: async () => {
        if (!activeOrder) return;
        try {
          await orderApi.cancelOrder(activeOrder.id, reason);
          hideLoading();
          showNotification({
            type: "success",
            message: "Đã hủy đơn hàng",
            format: `Đơn hàng #${activeOrder.id} đã được hủy thành công`
          });
          setShowCancelReasons(false);
          refetch();
          if (orders.length <= 1) {
            setTimeout(() => onClose(), 500);
          }
        } catch (error) {
          showNotification({ type: "error", message: "Không thể hủy đơn hàng" });
        }
      }
    });
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="orders-backdrop"
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
            key="orders-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="fixed z-[70] inset-0 md:inset-x-0 md:bottom-0 md:top-auto md:max-h-[88vh] md:rounded-t-[40px] bg-[#F8F9FA] overflow-hidden shadow-2xl flex flex-col border border-white/20"
          >
            {/* Header */}
            <div className="bg-white px-6 py-5 md:px-8 md:py-6 border-b border-gray-100 flex items-center justify-between shadow-sm/50 shrink-0 z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lime-50 border border-lime-100 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-lime-600" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-anton font-bold text-[#1A1A1A]">CURRENT ORDERS</h3>
                  <div className="text-sm font-medium text-gray-500 mt-0.5">
                    {orders.length} active orders
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {isLoadingOrders ? (
              <CurrentOrdersDrawerShimmer />
            ) : orders.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-bold text-gray-600 mb-2">Không có đơn hàng nào</h4>
                  <p className="text-sm text-gray-400">Bạn chưa có đơn hàng đang xử lý</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-[25%_40%_35%] bg-[#F8F9FA]">

                {/* 1. Mobile Order List (Horizontal) */}
                <div className="flex md:hidden overflow-x-auto custom-scrollbar p-4 space-x-3 bg-white border-b border-gray-100 shrink-0">
                  {orders.map((o) => {
                    const active = o.id === activeOrderId;
                    return (
                      <motion.div
                        key={o.id}
                        onClick={() => setActiveOrderId(o.id)}
                        className={`
                          relative p-3 rounded-[20px] cursor-pointer border transition-all duration-200 min-w-[260px] flex items-center gap-3
                          ${active
                            ? 'bg-lime-50 border-lime-500 shadow-sm ring-1 ring-lime-500/20'
                            : 'bg-white border-gray-100'
                          }
                        `}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold font-anton text-sm ${active ? "bg-white text-lime-700 shadow-sm" : "bg-gray-100 text-gray-500"}`}>
                          #{o.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-bold line-clamp-1 ${active ? "text-[#1A1A1A]" : "text-gray-600"}`}>{o.restaurant?.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-medium text-gray-400">{formatVnd(o.totalAmount)}</span>
                            <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${active ? 'bg-white text-lime-700' : 'bg-gray-100 text-gray-500'}`}>
                              {statusLabel(o.orderStatus)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* 2. Desktop Order List Column (Vertical) */}
                <div className="hidden md:flex flex-col border-r border-gray-100 bg-[#F8F9FA] h-full overflow-hidden">
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

                {/* 3. Map View Column */}
                <div className="relative h-[250px] md:h-full w-full bg-gray-200 border-r border-gray-100 z-0">
                  {activeOrder && (() => {
                    // Helper function to validate coordinates
                    const isValidCoordinate = (lat: number | undefined | null, lng: number | undefined | null): boolean => {
                      if (lat == null || lng == null) return false;
                      if (typeof lat !== 'number' || typeof lng !== 'number') return false;
                      if (isNaN(lat) || isNaN(lng)) return false;
                      // Mapbox valid ranges: lat -90 to 90, lng -180 to 180
                      // Also check for 0,0 coordinates which are likely invalid
                      if (lat === 0 && lng === 0) return false;
                      return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
                    };

                    const restaurantLat = activeOrder.restaurant?.latitude;
                    const restaurantLng = activeOrder.restaurant?.longitude;
                    const deliveryLat = activeOrder.deliveryLatitude;
                    const deliveryLng = activeOrder.deliveryLongitude;
                    const driverLat = activeOrder.driver?.latitude;
                    const driverLng = activeOrder.driver?.longitude;

                    return (
                      <OrderMapView
                        restaurantLocation={
                          isValidCoordinate(restaurantLat, restaurantLng)
                            ? { lat: Number(restaurantLat), lng: Number(restaurantLng) }
                            : undefined
                        }
                        deliveryLocation={
                          isValidCoordinate(deliveryLat, deliveryLng)
                            ? { lat: Number(deliveryLat), lng: Number(deliveryLng) }
                            : undefined
                        }
                        driverLocation={
                          isValidCoordinate(driverLat, driverLng)
                            ? { lat: Number(driverLat), lng: Number(driverLng) }
                            : undefined
                        }
                        orderStatus={activeOrder.orderStatus}
                      />
                    );
                  })()}
                </div>

                {/* 4. Details Column */}
                <div ref={detailsContainerRef} className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 custom-scrollbar bg-[#F8F9FA] h-full pb-24 md:pb-6 relative">


                  {activeOrder && (
                    <>
                      {/* Status Steps Card */}
                      <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                        <OrderStatusSteps status={activeOrder.orderStatus} />
                      </div>

                      {/* Driver Info Card */}
                      {/* ... (existing driver info) */}
                      <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                        {activeOrder.orderStatus === 'PENDING' || activeOrder.orderStatus === 'PLACED' ? (
                          <div className="flex flex-col items-center text-center py-2">
                            <div className="relative w-12 h-12 mb-3">
                              <div className="absolute inset-0 bg-lime-100 rounded-full animate-ping opacity-20" />
                              <div className="relative bg-lime-50 w-full h-full rounded-full flex items-center justify-center">
                                <Bike className="w-6 h-6 text-lime-600" />
                              </div>
                            </div>
                            <h4 className="font-bold text-[#1A1A1A] text-sm">Đang tìm tài xế...</h4>
                            <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Chúng tôi đang kết nối với tài xế gần nhất</p>
                          </div>
                        ) : activeOrder.driver ? (
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                              <User className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tài xế</h4>
                              <div className="font-bold text-[#1A1A1A] text-base truncate">{activeOrder.driver.name}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                {activeOrder.driver.vehicleType && <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{activeOrder.driver.vehicleType}</span>}
                                {activeOrder.driver.vehicleLicensePlate && <span className="text-xs font-bold text-[#1A1A1A]">{activeOrder.driver.vehicleLicensePlate}</span>}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                              <User className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tài xế</h4>
                              <div className="font-bold text-gray-500 text-sm">Đang chờ phân công...</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Delivery Route */}
                      <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <h4 className="font-bold text-[#1A1A1A]">Lộ trình giao hàng</h4>
                        </div>
                        <div className="p-5 flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center shadow-sm flex-shrink-0 z-10">
                              <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
                            </div>
                            <div className="w-0.5 flex-grow border-l-2 border-dotted border-gray-300 my-1" />
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shadow-sm flex-shrink-0 z-10">
                              <MapPin className="w-4 h-4 text-red-500" />
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-0.5 min-h-[100px]">
                            <div className="pb-4">
                              <div className="text-xs font-bold text-[var(--primary)] uppercase tracking-wide mb-1">Nhà hàng</div>
                              <div className="font-bold text-[#1A1A1A] text-sm mb-0.5 line-clamp-1">{activeOrder.restaurant?.name}</div>
                              <div className="text-xs text-gray-500 font-medium line-clamp-1">{activeOrder.restaurant?.address ?? "Đang cập nhật"}</div>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1">Điểm giao</div>
                              <div className="font-bold text-[#1A1A1A] text-sm mb-0.5 line-clamp-2">{activeOrder.deliveryAddress}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items & Bill */}
                      <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                          <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-400" />
                            <h4 className="font-bold text-[#1A1A1A]">Chi tiết đơn hàng</h4>
                          </div>
                          <span className="text-xs font-bold bg-[#1A1A1A] text-white px-2.5 py-1 rounded-lg">{activeOrder.orderItems?.length ?? 0} món</span>
                        </div>

                        <div className="p-2">
                          {activeOrder.orderItems?.map((item: OrderItemResponse, idx: number) => (
                            <div key={idx} className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-[20px] transition-colors duration-200">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-[12px] bg-gray-100 text-[#1A1A1A] font-anton text-base flex items-center justify-center shadow-sm group-hover:bg-white group-hover:scale-105 transition-all">
                                  {item.quantity}x
                                </div>
                                <div>
                                  <div className="font-bold text-[#1A1A1A] text-sm group-hover:text-[var(--primary)] transition-colors line-clamp-1">{item.dish?.name}</div>
                                </div>
                              </div>
                              <span className="font-bold text-[#1A1A1A] text-sm tabular-nums">{formatVnd(item.priceAtPurchase)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Bill Summary */}
                        <div className="bg-gray-50/50 p-6 space-y-3 border-t border-gray-100">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Tạm tính</span>
                            <span className="font-bold text-gray-900">{formatVnd(activeOrder.subtotal)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Phí giao hàng</span>
                            <span className="font-bold text-gray-900">{formatVnd(activeOrder.deliveryFee)}</span>
                          </div>
                          {(activeOrder.discountAmount ?? 0) > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500 font-medium">Giảm giá</span>
                              <span className="font-bold text-[var(--primary)]">-{formatVnd(activeOrder.discountAmount ?? 0)}</span>
                            </div>
                          )}
                          <div className="h-px bg-gray-200 my-3" />
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#1A1A1A] text-base">Tổng cộng</span>
                            <span className="font-anton text-2xl text-[var(--primary)]">{formatVnd(activeOrder.totalAmount)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Safety Banner */}
                      <div className="bg-gradient-to-r from-lime-50 to-white border border-lime-100/50 p-4 rounded-[24px] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
                          <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                        </div>
                        <p className="text-xs text-[var(--primary)] leading-relaxed font-medium">
                          Đơn hàng được bảo vệ bởi Eatzy Guarantee. <span className="font-bold cursor-pointer hover:underline">Tìm hiểu thêm</span>
                        </p>
                      </div>

                      {/* Cancel Flow */}
                      {(activeOrder.orderStatus === "PENDING" || activeOrder.orderStatus === "PLACED") && (
                        <div className="mt-4">
                          {!showCancelReasons ? (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleCancelOrder}
                              className="w-full h-12 rounded-[20px] bg-white border border-red-100 text-red-500 font-bold text-sm shadow-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                            >
                              <XCircle className="w-5 h-5" />
                              Hủy đơn hàng này
                            </motion.button>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-white rounded-[28px] p-5 border border-red-100 shadow-md space-y-4"
                            >
                              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                                <h3 className="text-lg font-semibold text-[#1A1A1A] uppercase">Tại sao bạn muốn hủy?</h3>
                                <button
                                  onClick={() => setShowCancelReasons(false)}
                                  className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider"
                                >
                                  Quay lại
                                </button>
                              </div>
                              <div className="space-y-2">
                                {cancellationReasons.map((reason) => (
                                  <button
                                    key={reason}
                                    onClick={() => handleConfirmCancel(reason)}
                                    className="w-full text-left p-4 rounded-xl hover:bg-red-50 text-gray-700 font-bold text-sm transition-colors border border-transparent hover:border-red-100 flex justify-between items-center group"
                                  >
                                    {reason}
                                    <div className="w-4 h-4 rounded-full border border-gray-200 group-hover:border-red-500 transition-colors" />
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={() => setShowCancelReasons(false)}
                                className="w-full py-3 rounded-xl bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-all"
                              >
                                Giữ lại đơn hàng
                              </button>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function getStatusIcon(status: string) {
  switch (status) {
    case "PENDING": return <Clock className="w-3.5 h-3.5" />;
    case "PLACED": return <ClipboardList className="w-3.5 h-3.5" />;
    case "PREPARING": return <ChefHat className="w-3.5 h-3.5" />;
    case "DRIVER_ASSIGNED": return <Bike className="w-3.5 h-3.5" />;
    case "READY": return <Bike className="w-3.5 h-3.5" />;
    case "PICKED_UP": return <Bike className="w-3.5 h-3.5" />;
    case "ARRIVED": return <Bike className="w-3.5 h-3.5" />;
    case "DELIVERED": return <BadgeCheck className="w-3.5 h-3.5" />;
    case "CANCELLED": return <XCircle className="w-3.5 h-3.5" />;
    default: return <Clock className="w-3.5 h-3.5" />;
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case "PENDING": return "Chờ xác nhận";
    case "PLACED": return "Đã đặt";
    case "PREPARING": return "Đang chuẩn bị";
    case "DRIVER_ASSIGNED": return "Có tài xế";
    case "READY": return "Có tài xế";
    case "PICKED_UP": return "Đang giao";
    case "ARRIVED": return "Đã đến";
    case "DELIVERED": return "Thành công";
    case "CANCELLED": return "Đã hủy";
    default: return status;
  }
}
