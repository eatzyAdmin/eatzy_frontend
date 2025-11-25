"use client";
import { useEffect, useRef } from "react";
import { motion } from "@repo/ui/motion";
import { MapPin } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";

export default function RightSidebar({
  restaurantName,
  totalPayable,
  children,
}: {
  restaurantName?: string;
  totalPayable: number;
  children?: React.ReactNode;
}) {
  const rightColRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rightColRef.current;
    if (!el) return;
  }, []);

  return (
    <div ref={rightColRef} className="relative overflow-y-auto no-scrollbar pl-2">
      <div className="mb-6">
        <div className="text-[28px] font-bold uppercase tracking-wide" style={{
          fontStretch: "condensed",
          letterSpacing: "-0.01em",
          fontFamily: "var(--font-anton), var(--font-sans)",
        }}>Last Step - Checkout</div>
        {restaurantName && (
          <div className="text-[14px] text-[#555] mt-1">{restaurantName}</div>
        )}
      </div>

      <div className="relative mb-6">
        <div className="relative aspect-[16/9] rounded-[24px] overflow-hidden shadow-md bg-white border border-gray-200 flex items-center justify-center">
          <MapPin className="w-10 h-10 text-gray-400" />
          <span className="ml-2 text-gray-500 text-sm">Map placeholder</span>
        </div>
      </div>

      {children}

      <div className="sticky bottom-0 pb-4 bg-[#F7F7F7]">
        <div className="rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-600">Tổng số tiền</div>
            <div className="text-xl font-semibold text-[var(--primary)]">{formatVnd(totalPayable)}</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="mt-3 w-full h-16 rounded-2xl bg-[var(--primary)] text-white text-2xl uppercase font-anton font-semibold shadow-sm"
          >
            Complete Order
          </motion.button>
        </div>
      </div>
    </div>
  );
}
