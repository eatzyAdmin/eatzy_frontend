"use client";
import { motion } from "@repo/ui/motion";
import { Power } from "@repo/ui/icons";
import { useSwipeConfirmation } from "@repo/ui";

export default function ConnectToggle({ online, onToggle, className }: { online: boolean; onToggle?: () => Promise<void>; className?: string }) {
  const { confirm } = useSwipeConfirmation();

  const requestToggle = () => {
    confirm({
      title: online ? "Tắt kết nối" : "Bật kết nối",
      description: online ? "Bạn có chắc muốn tắt kết nối?" : "Bạn có chắc muốn bật kết nối?",
      confirmText: online ? "Vuốt để tắt" : "Vuốt để bật",
      type: online ? "warning" : "success",
      onConfirm: async () => {
        await onToggle?.();
      },
    });
  };

  return (
    <motion.button
      onClick={requestToggle}
      whileTap={{ scale: 0.95 }}
      className={`relative z-20 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40 border-white/20 transition-all duration-300 flex items-center justify-center ${online
        ? "bg-lime-500 text-black rounded-full w-14 h-14"
        : "bg-white/20 text-black rounded-[32px] px-6 h-14"
        } ${className ?? ""}`}
    >
      <div className={`flex items-center gap-3 ${online ? "" : "font-anton font-bold uppercase tracking-tighter text-lg"}`}>
        <Power size={online ? 28 : 20} strokeWidth={3} className="text-black" />
        {!online && (<span>Bật kết nối</span>)}
      </div>
    </motion.button>
  );
}
