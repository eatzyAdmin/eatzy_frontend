"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, MapPin, Store, ClipboardList, ChefHat, Bike, BadgeCheck } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import type { Order } from "@repo/types";
import { getOrders } from "@/features/orders/data/mockOrders";
import { getRestaurantById } from "@/features/search/data/mockSearchData";

const OrderMapView = dynamic(() => import("@/features/orders/components/OrderMapView"), { ssr: false });
import OrderStatusSteps from "@/features/orders/components/OrderStatusSteps";

export default function CurrentOrdersDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const orders = useMemo(() => getOrders(), []);
  const [activeOrderId, setActiveOrderId] = useState<string>(orders[0]?.id ?? "");
  const activeOrder = orders.find((o) => o.id === activeOrderId) ?? orders[0];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 520, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 520, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="fixed z-[70] left-0 right-0 bottom-0 max-h-[88vh] rounded-t-[40px] bg-[#F7F7F7] border-t border-gray-200 overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div className="text-2xl font-anton font-bold text-[#1A1A1A]">CURRENT ORDERS</div>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
              <div className="grid grid-cols-[20%_40%_40%] h-[calc(88vh-72px)]">
                <div className="overflow-y-auto no-scrollbar bg-white border-r border-gray-100">
                  <ul className="divide-y divide-gray-200">
                    {orders.map((o) => {
                      const restaurant = getRestaurantById(o.restaurantId);
                      const active = o.id === activeOrderId;
                      const StatusIcon = (() => {
                        switch (o.status) {
                          case "PLACED": return ClipboardList;
                          case "PREPARED": return ChefHat;
                          case "PICKED": return Bike;
                          case "DELIVERED": return BadgeCheck;
                        }
                      })();
                      return (
                        <motion.li
                          key={o.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`p-4 cursor-pointer border-l-4 ${active ? "border-[var(--primary)] bg-[var(--primary)]/8" : "border-transparent bg-white hover:bg-gray-50"}`}
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

              <div className="relative">
                {activeOrder && <OrderMapView order={activeOrder} />}
              </div>

              <div className="relative overflow-y-auto px-12 py-4 bg-white border-l border-gray-100">
                {activeOrder && (
                  <>
                    <OrderStatusSteps status={activeOrder.status} />
                    <div className="mt-2">
                      <div className="text-[14px] font-semibold text-[#1A1A1A] mb-3">Thông tin đơn hàng</div>
                      <ul className="divide-y divide-gray-200">
                        {activeOrder.items.map((it) => (
                          <li key={it.id} className="py-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full font-anton bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center font-bold text-2xl">
                                {it.quantity}x
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div className="text-[#1A1A1A] font-medium line-clamp-1">{it.name}</div>
                                  <div className="text-[#1A1A1A] font-anton text-xl font-semibold">{formatVnd(it.price)}</div>
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
                          <div className="text-2xl font-bold text-[var(--primary)]">{formatVnd(activeOrder.total)}</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function statusLabel(s: Order["status"]) {
  switch (s) {
    case "PLACED":
      return "Đã đặt";
    case "PREPARED":
      return "Nhà hàng xong";
    case "PICKED":
      return "Tài xế đã lấy";
    case "DELIVERED":
      return "Giao thành công";
  }
}
