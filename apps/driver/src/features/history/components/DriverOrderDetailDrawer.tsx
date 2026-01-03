"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { DriverOrderDetailDrawerShimmer } from "@repo/ui";
import { X } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import { DriverHistoryOrder } from "../data/mockDriverHistory";

export default function DriverOrderDetailDrawer({
  order,
  open,
  onClose,
}: {
  order: DriverHistoryOrder | null;
  open: boolean;
  onClose: () => void;

}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      const t = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!order && !open) return null;

  return (
    <AnimatePresence>
      {open && order && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[32px] overflow-hidden max-h-[90vh] flex flex-col"
          >
            {isLoading ? (
              <DriverOrderDetailDrawerShimmer />
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold font-anton text-[#1A1A1A]">ORDER DETAILS</h2>
                    <p className="text-gray-500 text-sm">{order.code} • {new Date(order.createdAt || "").toLocaleDateString("vi-VN")}</p>
                  </div>
                  <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 space-y-8 pb-32">
                  {/* Stats Row */}
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                    <div className="text-center flex-1 border-r border-gray-200 last:border-0">
                      <div className="text-xs text-gray-500 mb-1">Thu nhập</div>
                      <div className="text-lg font-bold text-[var(--primary)] font-anton">{formatVnd(order.earnings)}</div>
                    </div>
                    <div className="text-center flex-1 border-r border-gray-200 last:border-0">
                      <div className="text-xs text-gray-500 mb-1">Khoảng cách</div>
                      <div className="text-lg font-bold text-[#1A1A1A] font-anton">{order.distance}km</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-500 mb-1">Loại đơn</div>
                      <div className="text-lg font-bold text-[#1A1A1A] font-anton">Food</div>
                    </div>
                  </div>



                  {/* Route - USING NEW DESIGN */}
                  <div className="bg-white rounded-[24px] p-5 shadow-sm border-2 border-gray-200">
                    <h3 className="text-lg font-bold font-anton text-[#1A1A1A] mb-4">DELIVERY ROUTE</h3>
                    <div className="relative pl-3 space-y-6">

                      {/* Pickup */}
                      <div className="relative flex gap-4">
                        <div className="relative z-10 w-3 h-3 rounded-full bg-white border-[3px] border-[var(--primary)] mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Lấy tại</div>
                          <div className="font-bold text-[#1A1A1A] text-sm truncate">{order.restaurantLocation?.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5 truncate">123 Đường ABC, Quận 1, TP.HCM</div>
                        </div>
                      </div>

                      {/* Dropoff */}
                      <div className="relative flex gap-4">
                        <div className="relative z-10 w-3 h-3 rounded-full bg-red-500 mt-1 shrink-0 shadow-sm ring-2 ring-white" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Giao đến</div>
                          <div className="font-bold text-[#1A1A1A] text-sm truncate">{order.customerName}</div>
                          <div className="text-xs text-gray-500 mt-0.5 truncate">{order.deliveryLocation?.address}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items - REVERTED TO SOPHISTICATED DESIGN */}
                  <div className="space-y-4 p-5 border-2 border-gray-200 rounded-[24px]">
                    <h3 className="text-lg font-bold font-anton text-[#1A1A1A]">ORDER ITEMS</h3>
                    <div className="bg-gray-50 p-4 space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex item-start justify-between">
                          <div className="flex gap-3">
                            <span className="font-bold text-[var(--primary)] font-anton">{item.quantity}x</span>
                            <span className="text-sm font-medium text-gray-800">{item.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{formatVnd(item.price)}</span>
                        </div>
                      ))}
                      <div className="h-px bg-gray-200 my-2" />

                      <div className="space-y-2 mb-2 pt-1">
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Tạm tính</span>
                          <span>{formatVnd(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Phí giao hàng</span>
                          <span>{formatVnd(order.fee)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Mã giảm giá {order.voucherCode ? `(${order.voucherCode})` : ''}</span>
                            <span>-{formatVnd(order.discount)}</span>
                          </div>
                        )}
                      </div>

                      <div className="h-px bg-gray-200 my-2" />

                      <div className="flex justify-between items-center pt-1">
                        <span className="text-sm font-bold text-[#1A1A1A]">Tổng tiền</span>
                        <span className="text-lg font-bold font-anton text-[var(--primary)]">{formatVnd(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="bg-white rounded-[24px] p-5 shadow-sm border-2 border-gray-200">
                    <h3 className="text-lg font-bold font-anton text-[#1A1A1A] mb-4">PAYMENT DETAILS</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="text-sm font-medium">Gross Earnings</span>
                        <span className="text-sm font-bold">{formatVnd(order.earnings + (order.platformFee || 0))}</span>
                      </div>
                      <div className="flex justify-between items-center text-red-500">
                        <span className="text-sm font-medium">
                          Platform Fee
                          <span className="ml-1 text-xs opacity-75">
                            ({Math.round(((order.platformFee || 0) / (order.earnings + (order.platformFee || 0) || 1)) * 100)}%)
                          </span>
                        </span>
                        <span className="text-sm font-bold">-{formatVnd(order.platformFee || 0)}</span>
                      </div>
                      <div className="h-px bg-gray-100 my-2" />
                      <div className="flex justify-between items-center text-[var(--primary)]">
                        <span className="text-base font-bold">Net Income</span>
                        <span className="text-xl font-bold font-anton">{formatVnd(order.earnings)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
