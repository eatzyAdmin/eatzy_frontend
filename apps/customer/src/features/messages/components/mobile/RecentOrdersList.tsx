"use client";

import { useCurrentOrders } from "@/features/orders/hooks/useCurrentOrders";
import RecentOrderCard from "./RecentOrderCard";
import { motion } from "@repo/ui/motion";
import { RecentOrderCardShimmer } from "@repo/ui";

/**
 * RecentOrdersList Component
 * Horizontal scrolling list of active orders for the mobile messages view.
 */
export default function RecentOrdersList({ isLoading: parentLoading }: { isLoading?: boolean }) {
  const { orders, isLoading: hookLoading } = useCurrentOrders();
  const isLoading = parentLoading || hookLoading;

  // If no orders and not loading, we don't show the section
  if (!isLoading && orders.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 py-1.5 pb-0 pl-4">
      <div className="flex items-center justify-between pr-4">
        <h4 className="font-bold text-[#1A1A1A] tracking-tight pl-1">
          Recent Orders
        </h4>
        {orders.length > 0 && (
          <span className="text-[9px] font-bold px-2 py-0.5 bg-lime-100 text-lime-600 rounded-full uppercase tracking-tighter">
            {orders.length} Active
          </span>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 pt-4 -mt-4 -ml-4 pl-4 pr-4">
        {isLoading ? (
          <RecentOrderCardShimmer cardCount={3} />
        ) : (
          orders.map((order) => (
            <RecentOrderCard
              key={order.id}
              order={order}
              onClick={() => {
                // Potential action: open order details or just a visual
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
