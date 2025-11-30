"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";

export default function OnlineStatusBadge({ online }: { online: boolean }) {
  return (
    <AnimatePresence>
      <motion.div
        key={online ? "online" : "offline"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className={`absolute left-4 bottom-10 px-3 py-2 rounded-xl text-sm shadow-lg border backdrop-blur-sm ${
          online ? "bg-white border-emerald-200 text-[#1A1A1A]" : "bg-white border-gray-200 text-[#1A1A1A]"
        }`}
      >
        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${online ? "bg-emerald-500" : "bg-red-500"}`} />
        <span>{online ? "Bạn đang online." : "Bạn đang offline."}</span>
      </motion.div>
    </AnimatePresence>
  );
}

