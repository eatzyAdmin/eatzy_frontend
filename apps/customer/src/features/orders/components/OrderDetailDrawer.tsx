"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ImageWithFallback } from "@repo/ui";
import {
  X,
  MapPin,
  Store,
  User,
  Phone,
  Package,
  Calendar,
  Clock,
  CreditCard,
  Tag,
  MessageCircle,
  Star,
} from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import type { Order } from "@repo/types";
import { getRestaurantById } from "@/features/search/data/mockSearchData";
import OrderStatusSteps from "@/features/orders/components/OrderStatusSteps";

const OrderMapView = dynamic(() => import("@/features/orders/components/OrderMapView"), { ssr: false });

// Mock driver data - in real app this would come from API
const mockDriverData = {
  name: "Nguyễn Văn A",
  phone: "0901234567",
  vehicleType: "Xe máy",
  licensePlate: "59A-12345",
  rating: 4.8,
  totalTrips: 1234,
  profilePhoto: "https://i.pravatar.cc/150?img=33",
};

export default function OrderDetailDrawer({
  open,
  onClose,
  order,
}: {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}) {
  const [activeTab, setActiveTab] = useState<"details" | "map">("details");
  const restaurant = useMemo(() => (order ? getRestaurantById(order.restaurantId) : null), [order]);

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
                      onClick={() => setActiveTab("map")}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "map"
                        ? "bg-white text-[#1A1A1A] shadow-sm"
                        : "text-gray-600 hover:text-[#1A1A1A]"
                        }`}
                    >
                      Bản đồ
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
                    className="grid grid-cols-[55%_45%] gap-6 p-6"
                  >
                    {/* Left Column - Order Items & Restaurant */}
                    <div className="space-y-6">
                      {/* Restaurant Info */}
                      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                            <Store className="w-6 h-6 text-[var(--primary)]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#1A1A1A]">{restaurant?.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                              <MapPin className="w-4 h-4" />
                              {restaurant?.address}
                            </p>
                          </div>
                        </div>

                        {restaurant?.imageUrl && (
                          <div className="relative aspect-[16/7] rounded-2xl overflow-hidden mt-4">
                            <ImageWithFallback
                              src={restaurant.imageUrl}
                              alt={restaurant.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Order Items */}
                      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                          <Package className="w-5 h-5 text-[var(--primary)]" />
                          <h3 className="text-lg font-bold text-[#1A1A1A]">Món ăn</h3>
                          <span className="ml-auto text-sm text-gray-600">
                            {order.items.length} món
                          </span>
                        </div>

                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                              {item.imageUrl && (
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
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
                                  <div className="flex-1">
                                    <div className="font-semibold text-[#1A1A1A]">{item.name}</div>
                                    {item.options && (
                                      <div className="mt-1 space-y-0.5">
                                        {item.options.variant && (
                                          <div className="text-xs text-gray-600">
                                            • {item.options.variant.name}
                                          </div>
                                        )}
                                        {item.options.addons && item.options.addons.length > 0 && (
                                          <div className="text-xs text-gray-600">
                                            • {item.options.addons.map(a => a.name).join(", ")}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <div className="text-sm font-bold text-[var(--primary)]">
                                      {formatVnd(item.price)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                                <span className="font-bold text-[var(--primary)] font-anton text-lg">
                                  {item.quantity}
                                </span>
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

                    {/* Right Column - Driver & Delivery Info */}
                    <div className="space-y-6">
                      {/* Driver Info */}
                      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                          <User className="w-5 h-5 text-[var(--primary)]" />
                          <h3 className="text-lg font-bold text-[#1A1A1A]">Tài xế</h3>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100">
                              <ImageWithFallback
                                src={mockDriverData.profilePhoto}
                                alt={mockDriverData.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <Star className="w-3 h-3 text-white fill-white" />
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="font-bold text-[#1A1A1A] text-lg">
                              {mockDriverData.name}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="font-semibold">{mockDriverData.rating}</span>
                              <span className="text-gray-400">•</span>
                              <span>{mockDriverData.totalTrips} chuyến</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {mockDriverData.vehicleType} • {mockDriverData.licensePlate}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--primary)] text-white rounded-xl shadow-sm font-medium"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Gọi</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Chat</span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="w-5 h-5 text-[var(--primary)]" />
                          <h3 className="text-lg font-bold text-[#1A1A1A]">Địa chỉ giao hàng</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {order.deliveryLocation.address ?? "Chưa có địa chỉ"}
                        </p>
                        <div className="mt-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Tọa độ:</span>
                            <span>
                              {order.deliveryLocation.lat.toFixed(6)}, {order.deliveryLocation.lng.toFixed(6)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
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
                    key="map"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <OrderMapView order={order} />
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
