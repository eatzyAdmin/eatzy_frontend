"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "@repo/ui/motion";
const DriverMapView = dynamic(() => import("@/features/map/DriverMapView"), { ssr: false });
import ConnectToggle from "@/features/online/ConnectToggle";
import OnlineStatusBadge from "@/features/online/OnlineStatusBadge";

export default function Page() {
  const [online, setOnline] = useState(false);
  return (
    <div className="w-full h-full">
      <DriverMapView />
      <ConnectToggle onChange={setOnline} />
      <OnlineStatusBadge online={online} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-4 left-4 text-sm text-gray-700 bg-white/80 border border-gray-200 rounded-xl px-3 py-2 shadow">
        <span className="font-semibold">Eatzy Driver</span>
      </motion.div>
    </div>
  );
}
