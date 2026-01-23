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
      whileTap={{ scale: 0.97 }}
      className={`rounded-2xl shadow-xl border text-sm font-medium flex items-center justify-center ${online ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white border-[var(--primary)]/50 w-12 h-12" : "bg-white text-[#1A1A1A] border-gray-200 px-4 py-3"
        } ${className ?? ""}`}
    >
      <Power size={18} />
      {!online && (<span className="ml-2">Bật kết nối</span>)}
    </motion.button>
  );
}
