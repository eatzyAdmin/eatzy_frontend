"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import type { DriverActiveOrder } from "@repo/types";
import { Phone, Compass, DollarSign, MapPin, Package, ChevronDown, ChevronLeft, X, Star, MessageCircle, Check } from "@repo/ui/icons";
import { DotsLoader, SwipeToConfirm } from "@repo/ui";
import { orderApi } from "@repo/api";
import { useQueryClient } from "@tanstack/react-query";
import { orderOffersKeys } from "../hooks/useOrderOffers";
import { useBottomNav } from "@/app/(protected)/(normal)/context/BottomNavContext";
import OrderDetailsView from "./OrderDetailsView";
import { ArrowLeft, User, List, Receipt } from "@repo/ui/icons";

export default function CurrentOrderPanel({ order, onExpandedChange }: { order: DriverActiveOrder, onExpandedChange?: (expanded: boolean) => void }) {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'main' | 'detail'>('main');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { setIsVisible, setIsHeaderVisible } = useBottomNav();

  useEffect(() => {
    setIsVisible(false);
    setIsHeaderVisible(!isExpanded);
    return () => {
      setIsVisible(true);
      setIsHeaderVisible(true);
    };
  }, [isExpanded, setIsVisible, setIsHeaderVisible]);

  useEffect(() => {
    if (!isExpanded && view === 'detail') {
      setView('main');
    }
  }, [isExpanded, view]);

  useEffect(() => {
    if (onExpandedChange) {
      onExpandedChange(isExpanded);
    }
  }, [isExpanded, onExpandedChange]);

  const stageConfig = {
    'DRIVER_ASSIGNED': {
      title: 'Đang đến cửa hàng',
      buttonText: 'Đã nhận hàng',
      action: async () => {
        await orderApi.markOrderAsPickedUp(parseInt(order.id));
      }
    },
    'READY': {
      title: 'Đơn hàng đã sẵn sàng',
      buttonText: 'Đã nhận hàng',
      action: async () => {
        await orderApi.markOrderAsPickedUp(parseInt(order.id));
      }
    },
    'PICKED_UP': {
      title: 'Đang giao hàng',
      buttonText: 'Đã đến điểm giao',
      action: async () => {
        await orderApi.markOrderAsArrived(parseInt(order.id));
      }
    },
    'ARRIVED': {
      title: 'Đã đến điểm giao',
      buttonText: 'Giao hàng thành công',
      action: async () => {
        await orderApi.markOrderAsDelivered(parseInt(order.id));
      }
    },
  };

  const currentStage = (order.orderStatus as keyof typeof stageConfig) || 'DRIVER_ASSIGNED';
  const { title, buttonText, action } = stageConfig[currentStage] || stageConfig['DRIVER_ASSIGNED'];

  const paymentMethodLabel = {
    'EATZYPAY': 'Ví Eatzy',
    'VNPAY': 'VNPay',
    'CASH': 'Tiền mặt'
  }[order.paymentMethod] || order.paymentMethod;

  const handleButtonClick = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await action();
      queryClient.invalidateQueries({ queryKey: orderOffersKeys.all });
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNavigation = () => {
    const destination = (currentStage === 'DRIVER_ASSIGNED') ? order.pickup : order.dropoff;
    if (!destination) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const formatVnd = (val: number | null | undefined) => {
    if (val === null || val === undefined) return "---";
    return Intl.NumberFormat('vi-VN').format(val);
  };

  const totalItems = order.earnings?.orderItemsCount || 0;

  // Stepper Logic
  const steps = [
    { key: 'accepted', label: 'Order Accepted', isActive: ['DRIVER_ASSIGNED', 'READY', 'PICKED_UP', 'ARRIVED', 'DELIVERED'].includes(currentStage) },
    { key: 'taken', label: 'Taken', isActive: ['PICKED_UP', 'ARRIVED', 'DELIVERED'].includes(currentStage) },
    { key: 'done', label: 'Done', isActive: ['ARRIVED', 'DELIVERED'].includes(currentStage) },
  ];

  return (
    <div className="w-full relative">
      {/* Customer Floating Card (Layered Backdrop) - Redesigned to match Panel Style */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            key="customer-floating-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: -80, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 140 }}
            className="absolute left-0 right-0 h-[120px] bg-slate-400/50 backdrop-blur-md rounded-t-[40px] px-8 pt-5 flex items-start justify-between z-0 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white overflow-hidden ring-2 ring-gray-300/30 flex-shrink-0 shadow-sm">
                <div className="w-full h-full flex items-center justify-center text-[#1A1A1A] font-black text-lg bg-gray-100">
                  {order.customer?.name?.charAt(0) || "C"}
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-[#1A1A1A] font-bold text-base leading-tight truncate">
                  {order.customer?.name || "Khách hàng Eatzy"}
                </h4>
                <div className="flex items-center gap-1.5 mt-0 text-[#1A1A1A]/50">
                  <span className="text-[12px] font-bold tracking-tight">{order.customer?.phoneNumber || "Đang cập nhật SĐT"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-[#1A1A1A] shadow-sm border border-gray-100 active:scale-90 transition-transform">
                <MessageCircle size={20} strokeWidth={2.5} />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-[#1A1A1A] shadow-sm border border-gray-100 active:scale-90 transition-transform">
                <Phone size={20} strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Drawer Content */}
      <motion.div
        layout
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 18, stiffness: 100 }}
        className="relative z-10 bg-white/60 backdrop-blur-md rounded-t-[44px] overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
      >
        <div
          className="w-full flex justify-center pt-3 pb-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {view === 'main' ? (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {/* Header */}
              <div className="px-6 pb-4 pt-1 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1 h-8 flex items-center text-xl font-bold text-[#1A1A1A] tracking-tight" style={{ fontStretch: "condensed" }}>
                    {title}
                  </div>
                  {isExpanded && (
                    <div className="px-3 py-1.5 rounded-full bg-gray-200/50 text-[#555] text-sm font-bold">
                      {paymentMethodLabel}
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsed Compact View */}
              {!isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-6 py-5 pt-4 space-y-6"
                  onClick={() => setIsExpanded(true)}
                >
                  {/* High-Fidelity Stepper - Matching Image */}
                  <div className="w-full max-w-[340px] mx-auto">
                    <div className="flex items-center justify-between relative px-8">
                      {/* Connecting Dotted Line */}
                      <div className="absolute top-[12px] left-[15%] right-[15%] h-0 border-t-2 border-dotted border-gray-300 z-0" />

                      {steps.map((step, idx) => (
                        <div key={step.key} className="relative z-10 flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${step.isActive
                            ? 'bg-[#A3E635] text-[#1A1A1A]'
                            : 'bg-white border-2 border-gray-300 text-gray-300'
                            }`}>
                            <Check size={14} strokeWidth={idx === 0 ? 3.5 : 2.5} />
                          </div>
                          {/* Label positioned absolutely below icon for perfect vertical alignment */}
                          <span className={`absolute top-full mt-2 text-[13px] font-bold transition-colors duration-300 whitespace-nowrap ${step.isActive ? 'text-[#1A1A1A]' : 'text-gray-400'
                            }`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Padding for labels */}
                    <div className="h-6 mt-2" />
                  </div>

                  {/* Order Brief Info - Merged Row */}
                  <div className="space-y-1 px-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="text-md font-bold text-[#1A1A1A] tracking-tighter truncate leading-tight shrink-0">
                        {currentStage === 'DRIVER_ASSIGNED' ? order.pickup?.name : "Giao cho khách"}
                      </h3>
                      <div className="flex items-center gap-2 text-[13px] font-medium text-gray-400 min-w-0 overflow-hidden">
                        <span className="opacity-30 flex-shrink-0">•</span>
                        <div className="flex items-center gap-1.5 truncate">

                          <span>{totalItems} items</span>
                          <span className="opacity-30">•</span>
                          <span>{paymentMethodLabel}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[13px] text-gray-400 line-clamp-1 opacity-60">
                      {currentStage === 'DRIVER_ASSIGNED' ? order.pickup?.address : order.dropoff?.address}
                    </p>
                  </div>
                </motion.div>
              )}

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 18, stiffness: 100 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-5 pt-6 space-y-6">
                      {/* Locations */}
                      <div className="flex flex-col">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-md flex-shrink-0 z-10">
                              <div className="w-3 h-3 rounded-full bg-white" />
                            </div>
                            <div className="w-1 flex-grow mt-1.5 opacity-60" style={{ backgroundImage: `radial-gradient(circle, #cbd5e1 2px, transparent 2px)`, backgroundSize: '100% 9px', backgroundRepeat: 'repeat-y', backgroundPosition: 'center' }} />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5 pb-3">
                            <div className="font-bold text-[#1A1A1A] text-base leading-tight tracking-tight">{order.pickup?.name}</div>
                            <div className="font-medium text-sm text-gray-400 mt-0.5 leading-snug tracking-tight">{order.pickup?.address}</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-1 h-2.5 mb-1.5 opacity-60" style={{ backgroundImage: `radial-gradient(circle, #cbd5e1 2px, transparent 2px)`, backgroundSize: '100% 9px', backgroundRepeat: 'repeat-y', backgroundPosition: 'center' }} />
                            <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md flex-shrink-0 z-10">
                              <MapPin size={14} className="text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="font-bold text-[#1A1A1A] text-base leading-tight tracking-tight">Điểm giao</div>
                            <div className="font-medium text-sm text-gray-400 mt-0.5 leading-snug tracking-tight">{order.dropoff?.address}</div>
                          </div>
                        </div>
                      </div>

                      {/* Order Details Card */}
                      <div className="bg-gray-200/60 rounded-[32px] p-5 space-y-1.5">
                        <div className="flex justify-between items-center text-[15px]">
                          <span className="text-gray-400 font-medium tracking-tight">Loại đơn hàng:</span>
                          <span className="text-[#1A1A1A] font-bold tracking-tight">Giao đồ ăn</span>
                        </div>
                        <div className="flex justify-between items-center text-[15px]">
                          <span className="text-gray-400 font-medium tracking-tight">Giá trị đơn:</span>
                          <span className="text-[#1A1A1A] font-bold tracking-tight">{formatVnd(order.earnings?.orderSubtotal)}đ</span>
                        </div>
                        <div className="flex justify-between items-center text-[15px]">
                          <span className="text-gray-400 font-medium tracking-tight">Thanh toán:</span>
                          <span className="text-[#1A1A1A] font-bold tracking-tight">{paymentMethodLabel}</span>
                        </div>
                        <div className="h-px bg-gray-300/30 my-1" />
                        <div className="flex justify-between items-end pt-1">
                          <div className="flex flex-col">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Thu nhập ròng của bạn</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-[#1A1A1A] tracking-tighter">
                                {formatVnd(order.earnings?.driverNetEarning)}
                              </span>
                              <span className="text-sm font-bold text-[var(--primary)]">đ</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter mb-1">Khoảng cách</span>
                            <span className="text-sm font-extrabold text-[#555]">{order.distanceKm || '---'} km</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <button onClick={() => setView('detail')} className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-2xl bg-gray-200/70 flex items-center justify-center text-gray-400 shadow border-2 border-gray-200">
                            <Package size={20} />
                          </div>
                          <span className="text-[14px] text-gray-600 font-bold tracking-tight">Chi tiết</span>
                        </button>
                        <button className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-2xl bg-gray-200/70 flex items-center justify-center text-gray-400 shadow border-2 border-gray-200">
                            <Phone size={20} />
                          </div>
                          <span className="text-[14px] text-gray-600 font-bold tracking-tight">Gọi khách</span>
                        </button>
                        <button onClick={handleNavigation} className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-2xl bg-gray-200/70 flex items-center justify-center text-gray-400 shadow border-2 border-gray-200">
                            <Compass size={20} />
                          </div>
                          <span className="text-[14px] text-gray-600 font-bold tracking-tight">Chỉ đường</span>
                        </button>
                      </div>

                      {/* Swipe action */}
                      <div className="pb-0">
                        <SwipeToConfirm
                          text={currentStage === 'DRIVER_ASSIGNED' ? "Chờ nhà hàng chuẩn bị" : buttonText}
                          onComplete={handleButtonClick}
                          disabled={isProcessing || currentStage === 'DRIVER_ASSIGNED'}
                          isLoading={isProcessing}
                          type={currentStage === 'DRIVER_ASSIGNED' ? "warning" : "primary"}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {/* Premium Header - Matching Wallet Design */}
              <div className="flex items-center justify-between px-6 pb-4 pt-1 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setView('main')}
                    className="p-2 bg-gray-200/80 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold font-anton text-[#1A1A1A] leading-tight uppercase">ORDER CONTENT</h2>
                    <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-0.5 flex items-center gap-2">
                      <span>Order ID: #{order.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 18, stiffness: 100 }}
                    className="overflow-hidden"
                  >
                    <OrderDetailsView
                      orderId={order.id}
                      customer={order.customer}
                      earnings={order.earnings}
                      paymentMethodLabel={paymentMethodLabel}
                      onBack={() => setView('main')}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
