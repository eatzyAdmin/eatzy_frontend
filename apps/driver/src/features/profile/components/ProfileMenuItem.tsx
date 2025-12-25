"use client";

import { motion } from "@repo/ui/motion";
import { ChevronRight } from "@repo/ui/icons";
import { ReactNode } from "react";

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  subLabel?: string;
  onClick?: () => void;
  isDestructive?: boolean;
}

export default function ProfileMenuItem({ icon, label, subLabel, onClick, isDestructive = false }: MenuItemProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98, backgroundColor: "rgba(0,0,0,0.02)" }}
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] mb-3 last:mb-0"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600'}`}>
          {icon}
        </div>
        <div className="text-left">
          <div className={`font-bold text-sm ${isDestructive ? 'text-red-600' : 'text-[#1A1A1A]'}`}>{label}</div>
          {subLabel && <div className="text-xs text-gray-400 font-medium">{subLabel}</div>}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300" />
    </motion.button>
  );
}
