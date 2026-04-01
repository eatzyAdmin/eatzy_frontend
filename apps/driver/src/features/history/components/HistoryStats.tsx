"use client";

import { useMemo } from "react";
import { formatVnd } from "@repo/lib";
import { DriverHistoryOrder } from "@repo/types";
import { Wallet, Bike, ChevronRight } from "@repo/ui/icons";
import { motion } from "@repo/ui/motion";

export default function HistoryStats({ orders }: { orders: DriverHistoryOrder[] }) {
  const stats = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        if (order.status === "DELIVERED") {
          acc.income += order.earnings;
          acc.trips += 1;
        }
        return acc;
      },
      { income: 0, trips: 0 }
    );
  }, [orders]);

  return (
    <div className="grid grid-cols-2 gap-2 mb-2">
      {/* Total Income Card */}
      <div
        className="bg-[#1A1A1A] rounded-[26px] p-5 text-white shadow-md shadow-black/5 relative overflow-hidden border border-white/5"
      >
        <div className="absolute -top-4 -right-4 p-4 opacity-[0.12] rotate-12">
          <Wallet className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-2">
            <p className="text-white/40 text-[13px] font-bold uppercase tracking-tight">
              Tổng Thu nhập
            </p>
          </div>
          <h3 className="text-2xl font-black font-anton tracking-tight text-[var(--primary)]">
            {formatVnd(stats.income)}
          </h3>
        </div>
      </div>

      {/* Trips Card */}
      <div
        className="bg-white rounded-[26px] p-5 text-[#1A1A1A] border-2 border-white shadow-sm relative overflow-hidden"
      >
        <div className="absolute -top-4 -right-4 p-4 opacity-[0.06] rotate-12">
          <Bike className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-2">
            <p className="text-gray-400 text-[13px] font-bold uppercase tracking-tight">
              Tổng Chuyến xe
            </p>
          </div>
          <h3 className="text-3xl font-black font-anton tracking-tight text-[#1A1A1A]">
            {stats.trips}
          </h3>
        </div>
      </div>
    </div>
  );
}
