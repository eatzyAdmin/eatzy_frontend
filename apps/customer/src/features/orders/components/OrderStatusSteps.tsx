"use client";
import { motion } from "@repo/ui/motion";
import { Clock, ClipboardList, ChefHat, Bike, BadgeCheck } from "@repo/ui/icons";
import type { ComponentType } from "react";

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;

// Backend order statuses: PENDING, PLACED, PREPARING, READY, PICKED_UP, ARRIVED, DELIVERED, CANCELLED
const steps: ReadonlyArray<{ key: string; label: string; icon: IconType }> = [
  { key: "PENDING", label: "Chờ xác nhận", icon: Clock as IconType },
  { key: "PLACED", label: "Đã đặt", icon: ClipboardList as IconType },
  { key: "PREPARING", label: "Đang nấu", icon: ChefHat as IconType },
  { key: "READY", label: "Sẵn sàng", icon: ChefHat as IconType },
  { key: "PICKED_UP", label: "Đang giao", icon: Bike as IconType },
  { key: "DELIVERED", label: "Thành công", icon: BadgeCheck as IconType },
];

export default function OrderStatusSteps({ status }: { status: string }) {
  // Find index based on backend status
  let activeIndex = steps.findIndex((s) => s.key === status);
  // Handle special statuses
  if (status === "ARRIVED") activeIndex = steps.findIndex((s) => s.key === "PICKED_UP"); // ARRIVED is part of delivery
  if (activeIndex === -1 && status === 'CANCELLED') activeIndex = 0;
  if (activeIndex === -1) activeIndex = 0;

  return (
    <div className="w-full py-4 pb-8 relative">
      <div className="relative flex justify-between items-start z-10 mx-2 md:mx-4">
        {/* Background Track - Centered at top-6 (24px) */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 -z-10 rounded-full" />

        {/* Active Track */}
        <motion.div
          className="absolute top-6 left-0 h-1 bg-[var(--primary)] -translate-y-1/2 -z-10 origin-left rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((s, i) => {
          const isActive = i === activeIndex;
          const isCompleted = i < activeIndex;
          const DisplayIcon = s.icon;

          return (
            <div key={s.key} className="flex flex-col items-center gap-3 relative group w-20">
              {/* Icon Container - Fixed Height (h-12 = 48px) for alignment */}
              <div className="h-12 w-full flex items-center justify-center relative">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive || isCompleted ? "var(--primary)" : "#F3F4F6",
                    borderColor: isActive ? "#ffffff" : isCompleted ? "var(--primary)" : "#F3F4F6",
                    color: isActive || isCompleted ? "#ffffff" : "#9CA3AF",
                  }}
                  className={`
                      relative flex items-center justify-center rounded-full border-[3px] z-10 transition-all duration-300 bg-clip-padding
                      ${isActive ? 'w-10 h-10 shadow-[0_4px_12px_rgba(132,204,22,0.4)]' : 'w-8 h-8'}
                    `}
                >
                  <DisplayIcon className={`${isActive ? 'w-5 h-5' : 'w-4 h-4'}`} strokeWidth={isActive ? 2.5 : 2} />

                  {/* Ripple effect for active - positioned relative to this circle */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[var(--primary)]"
                      initial={{ opacity: 0.8, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.8 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    />
                  )}
                </motion.div>
              </div>

              {/* Label - Absolute positioning to prevent layout shift if content width varies slightly, but here fixed width helps */}
              <div className={`
                text-[10px] md:text-xs font-bold text-center leading-tight transition-colors duration-300 w-24 absolute top-14 left-1/2 -translate-x-1/2
                ${isActive ? 'text-[#1A1A1A] scale-105' : isCompleted ? 'text-[var(--primary)]' : 'text-gray-400'}
              `}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
