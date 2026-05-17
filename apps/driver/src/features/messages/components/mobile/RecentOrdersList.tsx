"use client";

import { useCurrentOrders } from "@/features/orders/hooks/useCurrentOrders";
import RecentOrderCard from "@/features/messages/components/mobile/RecentOrderCard";
import { RecentOrderCardShimmer, ShoppingBag, AlertCircle, RotateCcw } from "@repo/ui";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRouter } from "next/navigation";

/**
 * RecentOrdersList Component
 * Horizontal scrolling list of active orders for the mobile messages view.
 * Mirrored 100% from the customer app.
 */
export default function RecentOrdersList({ isLoading: parentLoading, onSelectChat }: { isLoading?: boolean, onSelectChat?: (chatId: string) => void }) {
  const { orders, isLoading: hookLoading, isError, refetch } = useCurrentOrders();
  const isLoading = parentLoading || hookLoading;
  const router = useRouter();

  // Handle Error State
  if (isError) {
    return (
      <div className="flex flex-col gap-3 px-6 py-6">
        <EmptyState
          icon={AlertCircle}
          title="Something went wrong"
          description="We couldn't load your recent orders. Please try again."
          buttonIcon={RotateCcw}
        />
      </div>
    );
  }

  // If no orders and not loading, we show the standard empty state
  if (!isLoading && orders.length === 0) {
    return (
      <div className="flex flex-col gap-3 px-6 py-6">
        <EmptyState
          icon={ShoppingBag}
          title="No Active Orders"
          description="You don't have any active orders right now. Ready to satisfy your cravings?"
        />
      </div>
    );
  }

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
              order={order as any}
              onClick={() => {
                if (onSelectChat) {
                  onSelectChat(`order_${order.id}`);
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
