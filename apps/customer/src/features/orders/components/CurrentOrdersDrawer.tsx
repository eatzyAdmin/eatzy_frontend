"use client";
import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, MapPin, Store, ClipboardList, ChefHat, Bike, BadgeCheck, Clock, XCircle } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import type { Order } from "@repo/types";
import { getOrders } from "@/features/orders/data/mockOrders";
import { getRestaurantById } from "@/features/search/data/mockSearchData";
import { useSwipeConfirmation, useNotification, useLoading, CurrentOrdersDrawerShimmer } from "@repo/ui";

const OrderMapView = dynamic(() => import("@/features/orders/components/OrderMapView"), { ssr: false });
import OrderStatusSteps from "@/features/orders/components/OrderStatusSteps";

export default function CurrentOrdersDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const orders = useMemo(() => getOrders().filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED"), []);
  const [activeOrderId, setActiveOrderId] = useState<string>(orders[0]?.id ?? "");
  const activeOrder = orders.find((o) => o.id === activeOrderId) ?? orders[0];
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();
  const { hide: hideLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleCancelOrder = () => {
    confirm({
      title: "Hủy đơn hàng",
      description: "Bạn có chắc chắn muốn hủy đơn hàng này?",
      confirmText: "Hủy đơn",
      type: "danger",
      processingDuration: 1500,
      onConfirm: async () => {
        hideLoading();

        showNotification({
          type: "success",
          message: "Đã hủy đơn hàng",
          format: `Đơn hàng ${activeOrder?.code} đã được hủy thành công`,
        });

        // Close drawer after cancellation
        setTimeout(() => onClose(), 500);
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
            className="fixed z-[70] inset-0 md:inset-x-0 md:bottom-0 md:top-auto md:max-h-[88vh] rounded-t-[40px] bg-[#F7F7F7] border-t border-gray-200 overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white flex-shrink-0">
              <div className="text-xl md:text-2xl font-anton font-bold text-[#1A1A1A]">CURRENT ORDERS</div>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-3 md:p-4 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            {isLoading ? (
              <CurrentOrdersDrawerShimmer />
            ) : (
              <div className="flex flex-col md:grid md:grid-cols-[20%_40%_40%] flex-1 overflow-hidden">
                {/* Order List: Horizontal on mobile, vertical on desktop */}
                <div className="order-1 md:order-none w-full md:w-auto overflow-x-auto md:overflow-y-auto flex md:block border-b md:border-b-0 md:border-r border-gray-100 flex-shrink-0 bg-white md:h-full no-scrollbar">
                  <ul className="flex md:block divide-x md:divide-x-0 md:divide-y divide-gray-200">
                    {orders.map((o) => {
                      const restaurant = getRestaurantById(o.restaurantId);
                      const active = o.id === activeOrderId;
                      const StatusIcon = (() => {
                        switch (o.status) {
                          case "PENDING": return Clock;
                          case "PLACED": return ClipboardList;
                          case "PREPARED": return ChefHat;
                          case "PICKED": return Bike;
                          case "DELIVERED": return BadgeCheck;
                          case "CANCELLED": return XCircle;
                        }
                      })();
                      return (
                        <motion.li
                          key={o.id}
                          className={`p-4 cursor-pointer min-w-[300px] md:min-w-0 md:border-l-4 ${active ? "md:border-[var(--primary)] bg-[var(--primary)]/5 md:bg-[var(--primary)]/8" : "md:border-transparent bg-white hover:bg-gray-50"} ${active ? "border-b-2 border-b-[var(--primary)] md:border-b-0" : ""}`}
                          onClick={() => setActiveOrderId(o.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${active ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-600"}`}>
                                <Store className="w-4 h-4" />
                              </div>
                              <div className={`text-sm font-semibold line-clamp-1 ${active ? "text-[#1A1A1A]" : "text-[#555]"}`}>{restaurant?.name ?? o.restaurantId}</div>
                            </div>
                            <div className={`text-xs rounded-full px-2 py-1 ${active ? "bg-[var(--primary)]/20 text-[var(--primary)]" : "bg-gray-100 text-gray-600"}`}>{o.code}</div>
                          </div>
                          <div className={`mt-1 flex items-center gap-2 text-xs ${active ? "text-[#1A1A1A]" : "text-[#777]"}`}>
                            <MapPin className="w-3 h-3" />
                            <span className="line-clamp-1">{o.deliveryLocation.address ?? "Vị trí nhận"}</span>
                          </div>
                          <div className={`mt-2 flex items-center gap-2 text-xs ${active ? "text-[#1A1A1A]" : "text-[#777]"}`}>
                            {StatusIcon && <StatusIcon className="w-3 h-3" />}
                            <span>{statusLabel(o.status)}</span>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>

                {/* Map View */}
                <div className="order-2 md:order-none relative h-[30vh] md:h-full w-full flex-shrink-0">
                  {activeOrder && <OrderMapView order={activeOrder} />}
                </div>

                {/* Details */}
                <div className="order-3 md:order-none relative flex-1 overflow-y-auto px-4 py-6 md:px-12 md:py-4 bg-white border-l border-gray-100 pb-20 md:pb-4">
                  {activeOrder && (
                    <>
                      <OrderStatusSteps status={activeOrder.status} />
                      <div className="mt-4 md:mt-2 border-2 border-gray-200 p-4 md:p-6 rounded-[24px]">
                        <div className="text-[14px] font-semibold text-[#1A1A1A] mb-3">Thông tin đơn hàng</div>
                        <ul className="divide-y divide-gray-200">
                          {activeOrder.items.map((it) => (
                            <li key={it.id} className="py-3">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full font-anton bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center font-bold text-lg md:text-2xl">
                                  {it.quantity}x
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="text-[#1A1A1A] font-medium line-clamp-2 md:line-clamp-1">{it.name}</div>
                                    <div className="text-[#1A1A1A] font-anton text-lg md:text-xl font-semibold whitespace-nowrap">{formatVnd(it.price)}</div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="my-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                        <div className="space-y-2 text-[14px]" style={{ fontFamily: "monospace" }}>
                          <div className="flex items-center justify-between">
                            <div>Tạm tính</div>
                            <div className="font-medium">{formatVnd(activeOrder.subtotal)}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>Phí áp dụng</div>
                            <div className="font-medium">{formatVnd(activeOrder.fee)}</div>
                          </div>
                          {activeOrder.discount > 0 && (
                            <div className="flex items-center justify-between">
                              <div>Giảm giá</div>
                              <div className="font-medium text-green-700">- {formatVnd(activeOrder.discount)}</div>
                            </div>
                          )}
                          <div className="my-2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                          <div className="flex items-center justify-between">
                            <div className="text-[#555]">Tổng số tiền</div>
                            <div className="text-xl md:text-2xl font-bold text-[var(--primary)]">{formatVnd(activeOrder.total)}</div>
                          </div>
                        </div>

                        {/* Cancel Button for PENDING orders */}
                        {activeOrder.status === "PENDING" && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCancelOrder}
                            className="mt-6 w-full h-12 rounded-xl bg-red-50 border-2 border-red-200 text-red-600 font-semibold text-base flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                          >
                            <XCircle className="w-5 h-5" />
                            Hủy đơn hàng
                          </motion.button>
                        )}
                      </div>
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

function statusLabel(s: Order["status"]) {
  switch (s) {
    case "PENDING":
      return "Đang tìm tài xế";
    case "PLACED":
      return "Đã đặt";
    case "PREPARED":
      return "Nhà hàng xong";
    case "PICKED":
      return "Tài xế đã lấy";
    case "DELIVERED":
      return "Giao thành công";
    case "CANCELLED":
      return "Đã hủy";
  }
}
