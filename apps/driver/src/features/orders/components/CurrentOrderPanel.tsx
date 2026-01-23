"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import type { DriverActiveOrder } from "@repo/types";
import { Phone, Compass, DollarSign, MapPin, Utensils, ChevronDown } from "@repo/ui/icons";
import { DotsLoader } from "@repo/ui";
import { orderApi } from "@repo/api";
import { useQueryClient } from "@tanstack/react-query";
import { orderOffersKeys } from "../hooks/useOrderOffers";

type OrderStage = 'AT_STORE' | 'PICKED_UP' | 'DELIVERED';

export default function CurrentOrderPanel({ order }: { order: DriverActiveOrder }) {
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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
    // Determine destination based on stage
    const destination = (currentStage === 'DRIVER_ASSIGNED')
      ? order.pickup
      : order.dropoff;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative">
      {/* Toggle Button - Centered at top */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 w-12 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          <ChevronDown size={16} className="text-gray-600" />
        </motion.div>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-[28px] overflow-hidden border border-gray-200 shadow-sm"
      >
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 h-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center text-xl font-bold text-[#1A1A1A] tracking-tight"
                  style={{ fontStretch: "condensed" }}
                >
                  {title}
                </motion.div>
              </AnimatePresence>
            </div>
                <div className="px-3 py-1.5 rounded-full bg-gray-100 text-[#555] text-sm font-semibold">
                  {order.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Thẻ/Ví'}
                </div>
              </div>
            </div>

            {/* Collapsible Content */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-5 space-y-4">
                    {/* Locations */}
                    <div className="space-y-3">
                      {/* Pickup */}
                      <motion.div
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <motion.div
                          className="flex-shrink-0 mt-1 w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-md"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <div className="w-3 h-3 rounded-full bg-white" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#1A1A1A] text-base">{order.pickup.name}</div>
                          <div className="text-sm text-[#777] mt-0.5">{order.pickup.address}</div>
                        </div>
                      </motion.div>

                      {/* Connection Line */}
                      <div className="ml-3.5 h-4 w-0.5 bg-gradient-to-b from-[var(--primary)] to-red-500" />

                      {/* Dropoff */}
                      <motion.div
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div
                          className="flex-shrink-0 mt-1 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                        >
                          <MapPin size={14} className="text-white" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#1A1A1A] text-base">Điểm giao</div>
                          <div className="text-sm text-[#777] mt-0.5">{order.dropoff.address}</div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                    {/* Earnings info */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-[#777]">
                        <DollarSign size={16} className="text-[var(--primary)]" />
                        <span>Thu nhập:</span>
                        <span className="font-bold text-[var(--primary)] text-base">{Intl.NumberFormat('vi-VN').format(order.earnings.driverNetEarning)}đ</span>
                      </div>
                      <div className="h-4 w-px bg-gray-300" />
                      <div className="flex items-center gap-2 text-[#777]">
                        <span>Giá trị:</span>
                        <span className="font-semibold text-[#1A1A1A]">{Intl.NumberFormat('vi-VN').format(order.earnings.orderSubtotal)}đ</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                    {/* Action buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        className="h-11 text-[#555] flex flex-col items-center justify-center gap-2 font-semibold hover:text-[var(--primary)] transition-colors"
                      >
                        <Utensils size={16} />
                        <span className="text-xs">Chi tiết</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        className="h-11 text-[#555] flex flex-col items-center justify-center gap-2 font-semibold hover:text-[var(--primary)] transition-colors"
                      >
                        <Phone size={16} />
                        <span className="text-xs">Gọi quán</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNavigation}
                        className="h-11 text-[#555] flex flex-col items-center justify-center gap-2 font-semibold hover:text-[var(--primary)] transition-colors"
                      >
                        <Compass size={16} />
                        <span className="text-xs">Chỉ đường</span>
                      </motion.button>
                    </div>

                    {/* Arrived button */}
                    <motion.button
                      onClick={handleButtonClick}
                      whileHover={isProcessing ? {} : { scale: 1.02 }}
                      whileTap={isProcessing ? {} : { scale: 0.98 }}
                      disabled={isProcessing}
                      className={`relative w-full h-14 rounded-xl font-semibold text-xl tracking-tight shadow-md overflow-hidden ${isProcessing ? 'bg-white border-2 border-[var(--primary)] text-[var(--primary)] cursor-wait' : 'bg-[var(--primary)] text-white'
                        }`}
                      style={{ fontStretch: "condensed" }}
                    >
                      {isProcessing ? (
                        <DotsLoader color="var(--primary)" size={10} />
                      ) : (
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={currentStage}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            {buttonText}
                          </motion.span>
                        </AnimatePresence>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
      </div>
  );
}
