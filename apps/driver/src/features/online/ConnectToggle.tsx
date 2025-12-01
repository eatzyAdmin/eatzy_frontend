"use client";
import { useState } from "react";
import { motion } from "@repo/ui/motion";
import { Power } from "@repo/ui/icons";
import { SwipeConfirmationModal } from "@repo/ui";

export default function ConnectToggle({ online, onChange, className }: { online: boolean; onChange?: (online: boolean) => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [nextValue, setNextValue] = useState<boolean>(online);

  const requestToggle = () => { setNextValue(!online); setOpen(true); };
  const close = () => { if (!processing) setOpen(false); };
  const handleConfirm = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setOpen(false);
      onChange?.(nextValue);
    }, 1500);
  };

  return (
    <>
      <motion.button
        onClick={requestToggle}
        whileTap={{ scale: 0.97 }}
        className={`rounded-2xl shadow-xl border text-sm font-medium flex items-center justify-center ${
          online ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white border-[var(--primary)]/50 w-12 h-12" : "bg-white text-[#1A1A1A] border-gray-200 px-4 py-3"
        } ${className ?? ""}`}
      >
        <Power size={18} />
        {!online && (<span className="ml-2">Bật kết nối</span>)}
      </motion.button>
      <SwipeConfirmationModal
        isOpen={open}
        onClose={close}
        onConfirm={handleConfirm}
        title={online ? "Tắt kết nối" : "Bật kết nối"}
        description={online ? "Bạn có chắc muốn tắt kết nối?" : "Bạn có chắc muốn bật kết nối?"}
        confirmText={online ? "Vuốt để tắt" : "Vuốt để bật"}
        type={online ? "warning" : "success"}
        isProcessing={processing}
      />
    </>
  );
}
