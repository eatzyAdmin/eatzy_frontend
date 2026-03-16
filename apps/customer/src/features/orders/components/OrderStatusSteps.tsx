"use client";
import { motion } from "@repo/ui/motion";
import {
  Store,
  Package,
  Bike,
  Home
} from "@repo/ui/icons";
import type { ComponentType } from "react";

import { useState, useEffect } from "react";

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;

interface Step {
  key: string;
  label: string;
  icon: IconType;
}

const steps: Step[] = [
  { key: "PREPARING", label: "Confirmed", icon: Store as IconType },
  { key: "READY", label: "Prepared", icon: Package as IconType },
  { key: "PICKED_UP", label: "Delivering", icon: Bike as IconType },
  { key: "DELIVERED", label: "Delivered", icon: Home as IconType },
];

export default function OrderStatusSteps({ status }: { status: string; createdAt?: string }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check
    setIsMobile(window.innerWidth < 768);

    // Add listener for window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mapping backend status to 4 UI stages (0-3)
  const getActiveIndex = (status: string) => {
    switch (status) {
      case "PENDING":
      case "PLACED":
      case "PREPARING":
        return 0;
      case "READY":
      case "DRIVER_ASSIGNED":
        return 1;
      case "PICKED_UP":
      case "ARRIVED":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = getActiveIndex(status);

  // Status text based on current status
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "PENDING": return "Đang chờ xác nhận...";
      case "PLACED": return "Đã đặt hàng thành công";
      case "PREPARING": return "Nhà hàng đang chuẩn bị";
      case "READY": return "Món ăn đã sẵn sàng";
      case "DRIVER_ASSIGNED": return "Tài xế đang đến lấy";
      case "PICKED_UP": return "Đang giao hàng đến bạn";
      case "ARRIVED": return "Tài xế đã đến điểm giao";
      case "DELIVERED": return "Giao hàng thành công";
      default: return "Đang cập nhật...";
    }
  };

  const offset = isMobile ? 16 : 24;

  return (
    <div className="flex flex-col gap-3 md:gap-6 w-full">
      {/* Header Info */}
      <div className="flex flex-col pl-3">
        <h3 className="text-white text-lg md:text-2xl font-bold font-anton tracking-tight">
          {getStatusDisplay(status)}
        </h3>
      </div>

      {/* Progress Bar Container - Extra space for labels */}
      <div className="relative pt-2 pb-10">
        <div className="relative h-[12px] md:h-[18px] flex items-center">
          {/* Track Background (White) - Full width with rounded caps */}
          <div className="absolute inset-x-0 h-full bg-white rounded-full" />

          {/* Active Track (Primary Green) - Starts from left edge to current icon center */}
          <motion.div
            initial={{ width: `${offset}px` }}
            animate={{
              width: activeIndex === 3
                ? "100%"
                : `calc(${offset}px + ${(activeIndex / 3)} * (100% - ${offset * 2}px))`
            }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="absolute left-0 h-full bg-[var(--primary)] rounded-full z-10 shadow-[0_0_12px_rgba(132,204,22,0.4)]"
          />

          {/* Circles/Icons Wrapped in a spread container with side padding */}
          <div className="absolute inset-0 flex justify-between items-center z-10 px-4 md:px-6">
            {steps.map((step, index) => {
              const isActive = index <= activeIndex;
              const isCurrent = index === activeIndex;
              const Icon = step.icon;

              return (
                <div key={index} className="relative flex flex-col items-center group">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isActive ? "var(--primary)" : "#FFFFFF",
                      borderColor: isActive ? "var(--primary)" : "#FFFFFF",
                    }}
                    className={`
                      w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center shadow-lg border-2 md:border-[3px] relative z-30 transition-all duration-300
                      ${isActive ? 'text-black' : 'text-gray-400'}
                    `}
                  >
                    <Icon className="w-3.5 h-3.5 md:w-5 h-5" strokeWidth={2.5} />

                    {/* Active Pulse for CURRENT status */}
                    {isCurrent && status !== 'DELIVERED' && (
                      <motion.div
                        className="absolute inset-[-4px] md:inset-[-6px] rounded-full border-2 border-[var(--primary)]"
                        initial={{ opacity: 0.8, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.5 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                      />
                    )}
                  </motion.div>

                  {/* Status Label below step - Centered using translate */}
                  <div className={`
                    absolute top-10 md:top-14 left-1/2 -translate-x-1/2 text-[9px] md:text-xs font-bold whitespace-nowrap transition-all duration-300
                    ${isActive ? 'text-[var(--primary)] scale-105 md:scale-110' : 'text-gray-500'}
                  `}>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
