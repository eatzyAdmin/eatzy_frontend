"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";

export default function OnlineStatusBadge({ online, isLoading }: { online: boolean; isLoading?: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute left-4 bottom-10 px-3 py-2 rounded-xl text-sm shadow-xl border border-gray-100 bg-white/90 backdrop-blur-md flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
          <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Đang kiểm tra trạng thái...</span>
        </motion.div>
      ) : (
        <motion.div
          key={online ? "online" : "offline"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className={`absolute left-4 bottom-10 px-3 py-2 rounded-xl text-sm shadow-lg border backdrop-blur-sm ${online ? "bg-white border-emerald-200 text-[#1A1A1A]" : "bg-white border-gray-200 text-[#1A1A1A]"
            }`}
        >
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${online ? "bg-emerald-500" : "bg-red-500"}`} />
          <span className="font-bold">{online ? "Bạn đang online." : "Bạn đang offline."}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

