"use client";
import { useState } from "react";
import { motion } from "@repo/ui/motion";
import { Power } from "@repo/ui/icons";

export default function ConnectToggle({ onChange }: { onChange?: (online: boolean) => void }) {
  const [online, setOnline] = useState(false);
  const toggle = () => { const next = !online; setOnline(next); onChange?.(next); };
  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.97 }}
      className={`absolute bottom-24 left-4 rounded-2xl px-4 py-3 shadow-xl border text-sm font-medium flex items-center gap-2 ${
        online ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-300" : "bg-white text-[#1A1A1A] border-gray-200"
      }`}
    >
      <Power size={18} />
      <span>{online ? "Tắt kết nối" : "Bật kết nối"}</span>
    </motion.button>
  );
}

