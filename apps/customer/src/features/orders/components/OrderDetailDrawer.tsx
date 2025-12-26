"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ImageWithFallback, STORAGE_KEYS } from "@repo/ui";
import {
  X,
  MapPin,
  Store,
  User,
  Package,
  Calendar,
  Clock,
  CreditCard,
  Tag,
  Star,
  Award,
  ShieldCheck,
} from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import type { Order } from "@repo/types";

const OrderReviewTab = dynamic(() => import("@/features/orders/components/OrderReviewTab"), { ssr: false });

// Helper to get restaurant from localStorage
function getRestaurantById(id: string) {
  try {
    const restaurantsStr = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
    if (!restaurantsStr) return null;
    const restaurants = JSON.parse(restaurantsStr);
    return restaurants.find((r: any) => r.id === id) || null;
  } catch {
    return null;
  }
}

// Helper to get driver from localStorage
function getDriverById(id: string | undefined) {
  if (!id) return null;
  try {
    const driversStr = localStorage.getItem(STORAGE_KEYS.DRIVERS);
    if (!driversStr) return null;
    const drivers = JSON.parse(driversStr);
    return drivers.find((d: any) => d.id === id) || null;
  } catch {
    return null;
  }
}

export default function OrderDetailDrawer({
  open,
  onClose,
  order,
}: {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}) {
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const restaurant = useMemo(() => (order ? getRestaurantById(order.restaurantId) : null), [order]);
  const driver = useMemo(() => (order ? getDriverById(order.driverId) : null), [order]);

  useEffect(() => {
    if (open) {
      setActiveTab("details");
    }
  }, [open]);

  if (!order) return null;

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
            className="fixed z-[70] left-0 right-0 bottom-0 h-[92vh] rounded-t-[40px] bg-[#F7F7F7] border-t border-gray-200 overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex-none sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
              <div className="flex items-center justify-between p-6">
                <div>
                  <div className="text-2xl font-anton font-bold text-[#1A1A1A]">
                    ORDER DETAIL
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Order code: <span className="font-semibold text-[var(--primary)]">{order.code}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Tab Switcher */}
                  <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl">
                    <button
                      onClick={() => setActiveTab("details")}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "details"
                        ? "bg-white text-[#1A1A1A] shadow-sm"
                        : "text-gray-600 hover:text-[#1A1A1A]"
                        }`}
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "reviews"
                        ? "bg-white text-[#1A1A1A] shadow-sm"
                        : "text-gray-600 hover:text-[#1A1A1A]"
                        }`}
                    >
                      Đánh giá
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === "details" ? (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-full items-start overflow-hidden pt-8"
                  >
                    {/* Left Column - Restaurant & Order Items */}
                    <div
                      className="w-[65%] flex-shrink-0 space-y-6 h-full overflow-y-auto p-2 px-4 pl-16"
                      style={{ scrollbarWidth: 'none' }}
                    >
                      {/* Restaurant & Order Items Combined Section */}
                      <div className="flex gap-6 items-start">
                        {/* Left Side: Restaurant Card + Safety */}
                        <div className="flex flex-col gap-4 w-[240px] flex-shrink-0">
                          {/* Restaurant Card */}
                          <div className="bg-white rounded-[32px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                            {/* Avatar */}
                            <div className="relative w-20 h-20 mb-3">
                              <div className="w-full h-full rounded-full overflow-hidden relative z-10 bg-gray-50 border border-gray-100">
                                {restaurant?.imageUrl ? (
                                  <ImageWithFallback
                                    src={restaurant.imageUrl}
                                    alt={restaurant.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Store className="w-8 h-8 text-gray-300" />
                                  </div>
                                )}
                              </div>
                              <div className="absolute bottom-0 right-0 z-20 bg-[#E31C5F] text-white p-1 rounded-full shadow-md border-2 border-white">
                                <ShieldCheck className="w-3 h-3 fill-white" />
                              </div>
                            </div>

                            <h2 className="text-lg font-bold text-[#1A1A1A] mb-1 line-clamp-2 leading-tight">
                              {restaurant?.name}
                            </h2>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 mb-4">
                              <Award className="w-3 h-3" />
                              <span>Nhà hàng - Quán ăn</span>
                            </div>

                            {/* Stats */}
                            <div className="w-full border-t border-gray-100 pt-3">
                              <div className="grid grid-cols-2 gap-2 text-left">
                                <div>
                                  <div className="text-lg font-bold text-[#1A1A1A] leading-none mb-1">1.8k</div>
                                  <div className="text-[8px] uppercase font-bold text-gray-500 tracking-wide">Đánh giá</div>
                                </div>
                                <div className="pl-2 border-l border-gray-100">
                                  <div className="flex items-center gap-0.5 text-lg font-bold text-[#1A1A1A] leading-none mb-1">
                                    {restaurant?.rating} <Star className="w-3 h-3 text-[#1A1A1A] fill-[#1A1A1A]" />
                                  </div>
                                  <div className="text-[8px] uppercase font-bold text-gray-500 tracking-wide">Xếp hạng</div>
                                </div>
                                <div className="col-span-2 pt-3 mt-3 border-t border-gray-100">
                                  <div className="text-lg font-bold text-[#1A1A1A] leading-none mb-1">5</div>
                                  <div className="text-[8px] uppercase font-bold text-gray-500 tracking-wide">Năm hoạt động</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Safety Disclaimer */}
                          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <ShieldCheck className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] text-gray-500 leading-tight">
                              Luôn đặt món qua Eatzy để được bảo vệ quyền lợi và đảm bảo an toàn giao dịch.
                            </p>
                          </div>
                        </div>

                        {/* Right Side: Order Items */}
                        <div className="flex-1 rounded-[24px] p-8 border-2 border-gray-200">
                          <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-[var(--primary)]" />
                            <h3 className="text-lg font-bold text-[#1A1A1A]">Món ăn</h3>
                            <span className="ml-auto text-sm text-gray-600">
                              {order.items.length} món
                            </span>
                          </div>

                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 last:pb-0">
                                <div className="w-8 h-8 rounded-full font-anton bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center font-bold text-lg flex-shrink-0">
                                  {item.quantity}x
                                </div>

                                {item.imageUrl && (
                                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center">
                                    <ImageWithFallback
                                      src={item.imageUrl}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="text-[#1A1A1A] font-medium line-clamp-1">{item.name}</div>
                                    <div className="text-[#1A1A1A] font-anton text-lg font-semibold whitespace-nowrap">
                                      {formatVnd(item.price)}
                                    </div>
                                  </div>
                                  {item.options && (
                                    <div className="space-y-0.5 mt-0.5">
                                      {item.options.variant && (
                                        <div className="text-[#555] text-xs">
                                          Phân loại: {item.options.variant.name}
                                        </div>
                                      )}
                                      {item.options.addons && item.options.addons.length > 0 && (
                                        <div className="text-[#555] text-xs">
                                          Topping: {item.options.addons.map(a => a.name).join(", ")}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Price Summary */}
                          <div className="mt-6 pt-4 border-t border-gray-200 space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Tạm tính</span>
                              <span className="font-semibold">{formatVnd(order.subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Phí vận chuyển</span>
                              <span className="font-semibold">{formatVnd(order.fee)}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Giảm giá</span>
                                <span className="font-semibold text-green-600">
                                  - {formatVnd(order.discount)}
                                </span>
                              </div>
                            )}
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
                            <div className="flex items-center justify-between text-lg">
                              <span className="font-bold text-[#1A1A1A]">Tổng cộng</span>
                              <span className="font-bold text-[var(--primary)] text-2xl font-anton">
                                {formatVnd(order.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sophisticated Vertical Divider */}
                    <div className="w-[1px] h-[90%] my-auto bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2 opacity-60" />

                    {/* Right Column - Status & Info */}
                    <div
                      className="flex-1 space-y-6 h-full overflow-y-auto p-2 pl-4 pr-20"
                      style={{ scrollbarWidth: 'none' }}
                    >
                      {/* Driver Info - Compact */}
                      {driver ? (
                        <div className="bg-white rounded-[32px] p-5 pr-6 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-between gap-4">
                          {/* Left Side: Avatar + Name */}
                          <div className="flex-1 flex flex-col items-center justify-center text-center">
                            {/* Avatar */}
                            <div className="relative w-20 h-20 mb-2">
                              <div className="w-full h-full rounded-full overflow-hidden relative z-10 border-[3px] border-white shadow-sm">
                                <ImageWithFallback
                                  src={driver.profilePhoto || "https://i.pravatar.cc/150?img=12"}
                                  alt={driver.fullName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="absolute bottom-0 right-0 z-20 bg-[var(--primary)] text-white w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-md">
                                <Star className="w-3 h-3 fill-white" />
                              </div>
                            </div>

                            {/* Name & Role */}
                            <div className="space-y-0.5">
                              <h2 className="text-lg font-bold text-[#1A1A1A] leading-tight tracking-tight">
                                {driver.fullName}
                              </h2>
                              <div className="flex items-center justify-center gap-1 text-xs text-[#5E5E5E] font-medium">
                                <Award className="w-3 h-3 text-[#5E5E5E]" />
                                <span>{driver.licensePlate}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Side: Stats List */}
                          <div className="flex flex-col gap-3 py-1 min-w-[100px]">
                            {/* Stat 1: Rating */}
                            <div className="text-left">
                              <div className="flex items-center gap-1 text-xl font-bold text-[#1A1A1A] leading-none mb-0.5">
                                {driver.rating} <Star className="w-3.5 h-3.5 fill-[#1A1A1A]" />
                              </div>
                              <div className="text-[10px] text-[#222222] font-medium leading-tight">Đánh giá</div>
                            </div>

                            <div className="w-full h-[1px] bg-gray-100" />

                            {/* Stat 2: Total Trips */}
                            <div className="text-left">
                              <div className="text-xl font-bold text-[#1A1A1A] leading-none mb-0.5">{driver.totalTrips}</div>
                              <div className="text-[10px] text-[#222222] font-medium leading-tight">Chuyến đi</div>
                            </div>

                            <div className="w-full h-[1px] bg-gray-100" />

                            {/* Stat 3: Vehicle Type */}
                            <div className="text-left">
                              <div className="text-lg font-bold text-[#1A1A1A] leading-none mb-0.5 truncate">{driver.vehicleType}</div>
                              <div className="text-[10px] text-[#222222] font-medium leading-tight">Phương tiện</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-[32px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 text-center">
                          <div className="text-gray-500 text-sm">Chưa có tài xế</div>
                        </div>
                      )}

                      {/* Delivery Route */}
                      <div className="rounded-[24px] p-8 border-2 border-gray-200">
                        <div className="space-y-3">
                          {/* Pickup - Restaurant */}
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-md">
                                <div className="w-3 h-3 rounded-full bg-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide mb-1">
                                Điểm lấy hàng
                              </div>
                              <div className="font-bold text-[#1A1A1A] text-lg mb-0.5 font-anton truncate">
                                {restaurant?.name}
                              </div>
                              <div className="text-sm text-[#777] line-clamp-2">
                                {restaurant?.address}
                              </div>
                            </div>
                          </div>

                          {/* Connection Line */}
                          <div className="ml-4 h-6 w-0.5 bg-gradient-to-b from-[var(--primary)] to-red-500" />

                          {/* Dropoff - Customer */}
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-md">
                                <MapPin className="w-4 h-4 text-white fill-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">
                                Điểm giao hàng
                              </div>
                              <div className="font-bold text-[#1A1A1A] text-lg mb-0.5 font-anton">
                                Địa điểm nhận
                              </div>
                              <div className="text-sm text-[#777] leading-tight">
                                {order.deliveryLocation.address ?? "Chưa có địa chỉ"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="rounded-[24px] p-8 border-2 border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                          <Calendar className="w-5 h-5 text-[var(--primary)]" />
                          <h3 className="text-lg font-bold text-[#1A1A1A]">Thông tin đơn hàng</h3>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Thời gian đặt</span>
                            <span className="font-semibold">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleString("vi-VN")
                                : "N/A"}
                            </span>
                          </div>
                          {order.updatedAt && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Cập nhật lần cuối</span>
                              <span className="font-semibold">
                                {new Date(order.updatedAt).toLocaleString("vi-VN")}
                              </span>
                            </div>
                          )}
                          <div className="h-px bg-gray-100" />
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Phương thức thanh toán</span>
                            <div className="flex items-center gap-1.5">
                              <CreditCard className="w-4 h-4 text-gray-600" />
                              <span className="font-semibold">Tiền mặt</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <OrderReviewTab
                      order={order}
                      driver={driver}
                      restaurant={restaurant ?? null}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
