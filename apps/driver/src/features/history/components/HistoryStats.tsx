"use client";

import { useMemo } from "react";
import { formatVnd } from "@repo/lib";
import { DriverHistoryOrder } from "@repo/types";
import { Wallet, Bike } from "@repo/ui/icons";

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
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="bg-[var(--primary)] rounded-[24px] p-4 text-white shadow-lg shadow-[var(--primary)]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-20 rotate-12">
          <Wallet className="w-16 h-16" />
        </div>
        <div className="relative z-10">
          <p className="text-white/80 text-xs font-semibold mb-1 uppercase tracking-wider">Tổng thu nhập</p>
          <h3 className="text-2xl font-bold font-anton tracking-wide">
            {formatVnd(stats.income)}
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-4 text-[#1A1A1A] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-[0.08] rotate-12 text-[#1A1A1A]">
          <Bike className="w-16 h-16" />
        </div>
        <div className="relative z-10">
          <p className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wider">Số chuyến xe</p>
          <h3 className="text-3xl font-bold font-anton tracking-wide text-[#1A1A1A]">
            {stats.trips}
          </h3>
        </div>
      </div>
    </div>
  );
}
