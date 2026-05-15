"use client";

import { motion } from "@repo/ui/motion";
import { ArrowLeft } from "@repo/ui/icons";

interface MessagesMobileHeaderProps {
  onBack: () => void;
}

/**
 * MessagesMobileHeader Component
 * Clean header for the mobile messages view with the small, professional title style.
 * Mirrored 100% from the customer app.
 */
export default function MessagesMobileHeader({ onBack }: MessagesMobileHeaderProps) {
  return (
    <div className="px-3 py-3 flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </motion.button>

      <div>
        <h1 className="text-2xl font-anton font-bold text-[#1A1A1A] uppercase leading-none tracking-tight">
          MESSAGES
        </h1>
      </div>
    </div>
  );
}
