"use client";
import { motion } from "@repo/ui/motion";
import { MapPin, Package, Bike, User, ShieldCheck, XCircle, Loader2 } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import type { OrderResponse, OrderItemResponse } from "@repo/types";
import OrderStatusSteps from "@/features/orders/components/OrderStatusSteps";
import dynamic from "next/dynamic";

const OrderMapView = dynamic(() => import("@/features/orders/components/OrderMapView"), { ssr: false });

interface OrderDetailsContentProps {
  order: OrderResponse;
  showCancelReasons: boolean;
  setShowCancelReasons: (show: boolean) => void;
  onCancel: () => void;
  onConfirmCancel: (reason: string) => void;
  cancellationReasons: string[];
  isMobileDetail?: boolean;
  isMapVisible?: boolean;
  hideHeader?: boolean;
}

export default function OrderDetailsContent({
  order,
  showCancelReasons,
  setShowCancelReasons,
  onCancel,
  onConfirmCancel,
  cancellationReasons,
  isMobileDetail,
  isMapVisible = true,
  hideHeader = false,
}: OrderDetailsContentProps) {
  return (
    <>
      {/* Status Steps Card - Premium Dark Style */}
      {!hideHeader && (
        <div className="bg-gray-300 rounded-[40px] md:rounded-[46px] p-3 md:p-4 border-4 border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
          <OrderStatusSteps status={order.orderStatus} createdAt={order.createdAt} />
        </div>
      )}

      {isMobileDetail && !hideHeader && (
        <div className="relative h-[220px] rounded-[40px] overflow-hidden border border-gray-100 bg-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          {isMapVisible ? (
            <OrderMapView
              fullWidth
              restaurantLocation={order.restaurant?.latitude && order.restaurant?.longitude ? { lat: Number(order.restaurant.latitude), lng: Number(order.restaurant.longitude) } : undefined}
              deliveryLocation={order.deliveryLatitude && order.deliveryLongitude ? { lat: Number(order.deliveryLatitude), lng: Number(order.deliveryLongitude) } : undefined}
              driverLocation={order.driver?.latitude && order.driver?.longitude ? { lat: Number(order.driver.latitude), lng: Number(order.driver.longitude) } : undefined}
              orderStatus={order.orderStatus}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-400 space-y-2 bg-gray-50/50 backdrop-blur-[2px]">
              <Loader2 className="w-6 h-6 animate-spin opacity-50" />
              <div className="text-xs font-medium">Đang tải bản đồ...</div>
            </div>
          )}
        </div>
      )}

      {/* Driver Info Card */}
      <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
        {order.orderStatus === 'PENDING' || order.orderStatus === 'PLACED' ? (
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
        ) : order.driver ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
              <User className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tài xế</h4>
              <div className="font-bold text-[#1A1A1A] text-base truncate">{order.driver.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                {order.driver.vehicleType && <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{order.driver.vehicleType}</span>}
                {order.driver.vehicleLicensePlate && <span className="text-xs font-bold text-[#1A1A1A]">{order.driver.vehicleLicensePlate}</span>}
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
              <div className="font-bold text-[#1A1A1A] text-sm mb-0.5 line-clamp-1">{order.restaurant?.name}</div>
              <div className="text-xs text-gray-500 font-medium line-clamp-1">{order.restaurant?.address ?? "Đang cập nhật"}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1">Điểm giao</div>
              <div className="font-bold text-[#1A1A1A] text-sm mb-0.5 line-clamp-2">{order.deliveryAddress}</div>
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
          <span className="text-xs font-bold bg-[#1A1A1A] text-white px-2.5 py-1 rounded-lg">{order.orderItems?.length ?? 0} món</span>
        </div>

        <div className="p-2">
          {order.orderItems?.map((item: OrderItemResponse, idx: number) => (
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
            <span className="font-bold text-gray-900">{formatVnd(order.subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Phí giao hàng</span>
            <span className="font-bold text-gray-900">{formatVnd(order.deliveryFee)}</span>
          </div>
          {(order.discountAmount ?? 0) > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Giảm giá</span>
              <span className="font-bold text-[var(--primary)]">-{formatVnd(order.discountAmount ?? 0)}</span>
            </div>
          )}
          <div className="h-px bg-gray-200 my-3" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#1A1A1A] text-base">Tổng cộng</span>
            <span className="font-anton text-2xl text-[var(--primary)]">{formatVnd(order.totalAmount)}</span>
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
      {(order.orderStatus === "PENDING" || order.orderStatus === "PLACED") && (
        <div className="mt-4 pb-4">
          {!showCancelReasons ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
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
                {cancellationReasons.map((reason: string) => (
                  <button
                    key={reason}
                    onClick={() => onConfirmCancel(reason)}
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
  );
}
