"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { motion } from "@repo/ui/motion";
import { useLoading } from "@repo/ui";
const DriverMapView = dynamic(() => import("@/features/map/DriverMapView"), { ssr: false });
import ConnectToggle from "@/features/online/ConnectToggle";
import OnlineStatusBadge from "@/features/online/OnlineStatusBadge";
import useOrderOffers from "@/features/orders/hooks/useOrderOffers";
import OrderOfferModal from "@/features/orders/components/OrderOfferModal";
import CurrentOrderPanel from "@/features/orders/components/CurrentOrderPanel";
import { LocateFixed, Bike, Search } from "@repo/ui/icons";
import type { DriverActiveOrder } from "@repo/types";
import { useDriverStatus } from "@/features/online/hooks/useDriverStatus";

export default function Page() {
  const { hide } = useLoading();

  // Driver status management
  const {
    isOnline: online,
    isLoading: isStatusLoading,
    toggleStatus
  } = useDriverStatus();

  const [locateVersion, setLocateVersion] = useState(0);
  const { currentOffer, activeOrder, countdown, acceptOffer, rejectOffer } = useOrderOffers(online);

  // Hide loading after 1.5s on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, 1500);
    return () => clearTimeout(timer);
  }, [hide]);

  return (
    <div className="w-full h-full">
      <DriverMapView locateVersion={locateVersion} activeOrder={activeOrder} />
      <div className="absolute left-4 right-4 bottom-[104px] space-y-3 pointer-events-none">
        <div className="flex items-center justify-between gap-3">
          <ConnectToggle online={online} onToggle={toggleStatus} className="pointer-events-auto" />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocateVersion((v) => v + 1)}
            className="backdrop-blur-xl bg-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40 border-white/20 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-auto"
          >
            <LocateFixed className="w-7 h-7 text-black" strokeWidth={2.5} />
          </motion.button>
        </div>
        {online && !activeOrder && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="rounded-[28px] bg-white/20 backdrop-blur-xl border border-white/40 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-4 flex items-center justify-center overflow-hidden pointer-events-auto"
          >
            <div className="flex items-center gap-4 text-black">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                <Search className="w-6 h-6 text-black" strokeWidth={2.8} />
              </div>
              <div className="flex flex-col">
                <div className="text-md font-bold tracking-tight leading-tight">
                  Đang tìm kiếm đơn hàng...
                </div>
              </div>
              <div className="ml-auto">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {activeOrder && (
          <div className="pointer-events-auto">
            <CurrentOrderPanel
              order={activeOrder}
            />
          </div>
        )}
      </div>
      <OnlineStatusBadge online={online} />

      <OrderOfferModal
        offer={currentOffer}
        countdown={countdown}
        onAccept={acceptOffer}
        onReject={rejectOffer}
      />
    </div>
  );
}
