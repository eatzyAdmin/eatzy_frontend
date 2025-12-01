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
import { LocateFixed, Bike } from "@repo/ui/icons";
import type { DriverActiveOrder } from "@repo/types";

export default function Page() {
  const { hide } = useLoading();
  const [online, setOnline] = useState(false);
  const [locateVersion, setLocateVersion] = useState(0);
  const [activeOrder, setActiveOrder] = useState<DriverActiveOrder | null>(null);
  const { currentOffer, countdown, acceptOffer, rejectOffer } = useOrderOffers(online, !!activeOrder);

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
      <div className="absolute left-4 right-4 bottom-[96px] space-y-3">
        <div className="flex items-center justify-between gap-3">
          <ConnectToggle online={online} onChange={setOnline} className="" />
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setLocateVersion((v) => v + 1)} className="bg-white shadow-xl w-12 h-12 rounded-2xl flex items-center justify-center border border-gray-200">
            <LocateFixed className="w-6 h-6 text-[#1A1A1A]" />
          </motion.button>
        </div>
        {!online && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 border border-gray-200 text-xs text-gray-700 px-3 py-2 rounded-xl w-fit">
            Bạn chưa bật kết nối
          </motion.div>
        )}
        {online && !activeOrder && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/85 backdrop-blur-xl border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-4">
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Bike className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-sm font-medium">Đang tìm đơn hàng phù hợp...</div>
            </div>
          </motion.div>
        )}
        {activeOrder && (
          <CurrentOrderPanel
            order={activeOrder}
            onComplete={() => {
              setActiveOrder(null);
            }}
          />
        )}
      </div>
      <OnlineStatusBadge online={online} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-4 left-4 text-sm text-gray-700 bg-white/80 border border-gray-200 rounded-xl px-3 py-2 shadow">
        <span className="font-semibold">Eatzy Driver</span>
      </motion.div>
      <OrderOfferModal
        offer={currentOffer}
        countdown={countdown}
        onAccept={() => { const order = acceptOffer(); if (order) setActiveOrder(order); }}
        onReject={() => { rejectOffer(); }}
      />
    </div>
  );
}
