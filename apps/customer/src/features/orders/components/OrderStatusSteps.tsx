"use client";
import { motion } from "@repo/ui/motion";
import { ClipboardList, ChefHat, Bike, BadgeCheck } from "@repo/ui/icons";
import type { OrderStatus } from "@repo/types";
import type { ComponentType } from "react";

type IconType = ComponentType<{ className?: string }>;
const steps: ReadonlyArray<{ key: OrderStatus; label: string; icon: IconType }> = [
  { key: "PLACED", label: "Đã đặt", icon: ClipboardList as IconType },
  { key: "PREPARED", label: "Nhà hàng xong", icon: ChefHat as IconType },
  { key: "PICKED", label: "Tài xế đã lấy", icon: Bike as IconType },
  { key: "DELIVERED", label: "Giao thành công", icon: BadgeCheck as IconType },
];

export default function OrderStatusSteps({ status }: { status: OrderStatus }) {
  const activeIndex = steps.findIndex((s) => s.key === status);
  const progressPercent = ((activeIndex + 1) / steps.length) * 100;
  const segWidthPct = 100 / steps.length;
  const segStartPct = Math.max(0, activeIndex) * segWidthPct;
  const segEndPct = segStartPct + segWidthPct;
  const highlightWidthPct = Math.max(6, segWidthPct * 0.4);
  return (
    <div className="relative px-2 pt-4 pb-6">
      <div className="relative h-2 bg-gray-200 rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 h-2 bg-[var(--primary)] rounded-full"
        />
        {activeIndex >= 0 && activeIndex < steps.length - 1 && (
          <motion.div
            initial={{ left: `${segStartPct}%` }}
            animate={{ left: [`${segStartPct}%`, `${segEndPct}%`] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: `${highlightWidthPct}%` }}
            className="absolute top-0 h-2 rounded-full bg-[var(--primary)]/50 shadow-[0_0_10px_rgba(16,185,129,0.6)]"
          />
        )}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const active = i <= activeIndex;
          return (
            <div key={s.key} className="flex flex-col items-center gap-1">
              <div className="relative">
                {i === activeIndex && (
                  <motion.span
                    className="absolute -inset-1 rounded-full border-2 border-[var(--primary)]/40"
                    animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${active ? "bg-[var(--primary)] border-[var(--primary)] text-white" : "bg-white border-gray-300 text-gray-500"}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-xs font-medium ${active ? "text-[#1A1A1A]" : "text-[#777]"}`}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
