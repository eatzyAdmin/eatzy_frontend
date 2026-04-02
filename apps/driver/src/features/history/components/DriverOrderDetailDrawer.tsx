"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, MapPin, Package, Ticket } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import { DriverHistoryOrder } from "@repo/types";
import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";

interface DriverOrderDetailDrawerProps {
  order: DriverHistoryOrder | null;
  open: boolean;
  onClose: () => void;
}

export default function DriverOrderDetailDrawer({
  order,
  open,
  onClose,
}: DriverOrderDetailDrawerProps) {
  useMobileBackHandler(open, onClose);

  if (!order) return null;

  return (
    <AnimatePresence>
      {open && (
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
            transition={{ type: "spring", damping: 18, stiffness: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[40px] overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold font-anton text-[#1A1A1A]">ORDER DETAILS</h2>
                <div className="text-gray-500 text-xs font-semibold mt-0.5 flex items-center gap-2">
                  <span>Order ID: {order.code}</span>
                  <span className="opacity-30">•</span>
                  <span>{new Date(order.createdAt || "").toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-4 px-3 space-y-4 no-scrollbar">
              {/* Stats Row */}
              <div className="flex items-center justify-between bg-gray-900 p-5 rounded-[28px] shadow-xl shadow-black/5">
                <div className="text-center flex-1 border-r border-white/10 px-2">
                  <div className="text-[9px] text-white/40 font-semibold uppercase tracking-[0.2em] mb-1">Income</div>
                  <div className="text-lg font-bold text-[var(--primary)] font-anton leading-none">
                    {formatVnd(order.earnings)}
                  </div>
                </div>
                <div className="text-center flex-1 border-r border-white/10 px-2">
                  <div className="text-[9px] text-white/40 font-semibold uppercase tracking-[0.2em] mb-1">Distance</div>
                  <div className="text-lg font-bold text-white font-anton leading-none">
                    {order.distance}km
                  </div>
                </div>
                <div className="text-center flex-1 px-2">
                  <div className="text-[9px] text-white/40 font-semibold uppercase tracking-[0.2em] mb-1">Order Type</div>
                  <div className="text-sm font-bold text-white font-anton leading-none uppercase">
                    Food
                  </div>
                </div>
              </div>

              {/* Route Details */}
              <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black font-anton text-[#1A1A1A]">DELIVERY ROUTE</h3>
                </div>

                <div className="flex gap-4 mt-6">
                  {/* Visual Route Indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center shadow-sm flex-shrink-0 z-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
                    </div>
                    <div className="w-0.5 flex-grow border-l-2 border-dotted border-gray-300 my-1" />
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shadow-sm flex-shrink-0 z-10">
                      <MapPin className="w-4 h-4 text-red-500" />
                    </div>
                  </div>

                  {/* Route Addresses */}
                  <div className="flex-1 flex flex-col justify-between py-0.5 min-h-[110px]">
                    {/* Pickup */}
                    <div>
                      <div className="text-xs font-bold text-[var(--primary)] uppercase tracking-wide mb-1 flex items-center justify-between">
                        <span>Nhà hàng</span>
                      </div>
                      <div className="font-bold text-[#1A1A1A] text-sm mb-0.5 line-clamp-1">
                        {order.restaurantLocation?.name || "Đang cập nhật"}
                      </div>
                      <div className="text-xs text-gray-500 font-medium line-clamp-1">
                        {order.restaurantLocation?.address || "Đang cập nhật địa chỉ"}
                      </div>
                    </div>

                    {/* Dropoff */}
                    <div className="mt-4">
                      <div className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1 flex items-center justify-between">
                        <span>Điểm giao</span>
                      </div>
                      <div className="font-bold text-[#1A1A1A] text-sm mb-0.5 line-clamp-2">
                        {order.deliveryLocation?.address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                      <Package className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black font-anton text-[#1A1A1A]">ORDER INVENTORY</h3>
                  </div>
                  <span className="text-xs font-bold bg-[#1A1A1A] text-white px-3 py-1 rounded-lg">
                    {order.items.length} món
                  </span>
                </div>

                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="group flex items-center justify-between py-3.5 rounded-[20px] transition-colors duration-200 hover:bg-gray-50/50">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-[14px] bg-gray-100 text-[#1A1A1A] font-anton font-bold text-lg flex items-center justify-center shadow-sm flex-shrink-0 transition-transform group-hover:scale-105">
                          {item.quantity}x
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[#1A1A1A] text-sm transition-colors line-clamp-1 leading-tight">{item.name}</div>
                          {item.orderItemOptions && item.orderItemOptions.length > 0 && (
                            <div className="mt-0.5 text-[10px] md:text-[11px] text-gray-400 font-medium line-clamp-2 leading-relaxed italic">
                              {Array.from(new Set(item.orderItemOptions
                                .map((opt) => opt.menuOption?.name)))
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-[#1A1A1A] text-sm tabular-nums ml-2 whitespace-nowrap">{formatVnd(item.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-100 my-4" />

                <div className="space-y-3.5 px-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Tạm tính</span>
                    <span className="font-bold text-gray-900">{formatVnd(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Phí giao hàng</span>
                    <span className="font-bold text-gray-900">{formatVnd(order.fee)}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-sm font-bold text-red-500">
                        <div className="flex items-center gap-1.5">
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Khuyến mãi</span>
                        </div>
                        <span>-{formatVnd(order.discount)}</span>
                      </div>
                      {order.voucherCode && (
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-red-50 text-red-500 border border-red-100 rounded-md">
                            {order.voucherCode}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="h-px bg-gray-200/50 my-4" />

                <div className="flex justify-between items-center pt-2 px-1">
                  <span className="font-bold text-[#1A1A1A] text-base">Tổng thanh toán</span>
                  <div className="flex flex-col items-end">
                    <span className="font-anton text-[26px] text-[var(--primary)] leading-none whitespace-nowrap drop-shadow-sm">
                      {formatVnd(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="bg-[#1A1A1A] rounded-[32px] p-5 shadow-2xl shadow-black/20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] font-anton opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />

                <h3 className="text-xs font-black font-anton text-white/30 mb-6 uppercase tracking-[0.3em]">PAYMENT AUDIT</h3>
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Gross Earnings</span>
                    <span className="text-sm font-bold text-white/80">{formatVnd(order.earnings + (order.platformFee || 0))}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-400">
                    <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      System Commission
                      <span className="bg-red-400/20 px-1.5 py-0.5 rounded text-[8px] border border-red-400/20">
                        {Math.round(((order.platformFee || 0) / (order.earnings + (order.platformFee || 0) || 1)) * 100)}%
                      </span>
                    </span>
                    <span className="text-sm font-bold">-{formatVnd(order.platformFee || 0)}</span>
                  </div>

                  <div className="h-px bg-white/5 my-4" />

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="block text-[9px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-1">Your Net Income</span>
                      <span className="text-3xl font-bold font-anton text-white leading-none">
                        {formatVnd(order.earnings)}
                      </span>
                    </div>

                    <div className="bg-[var(--primary)] text-black px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20">
                      Success
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Info */}
              <div className="text-center pt-2 opacity-30">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">End of report</p>
              </div>
            </div>
          </motion.div>
          <style jsx>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
