"use client";

import React from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { MapPin, ChevronRight } from "@repo/ui/icons";

interface DistanceWarningHomeProps {
  isOpen: boolean;
  distance: number | null;
  onClose: () => void;
  onChangeAddress: () => void;
}

/**
 * Ultra-Compact Glass Distance Warning
 */
export default function DistanceWarningHome({
  isOpen,
  distance,
  onClose,
  onChangeAddress,
}: DistanceWarningHomeProps) {
  // Format distance for display
  const formattedDistance = React.useMemo(() => {
    if (distance === null) return "";
    if (distance < 2000) {
      return `(cách ${Math.round(distance)}m)`;
    }
    return `(cách ${(distance / 1000).toFixed(1)}km)`;
  }, [distance]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center md:items-start pointer-events-none transition-all duration-300">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[6px] pointer-events-auto"
          />

          {/* Warning Content Area */}
          <div className="relative z-10 w-full pr-12 pl-3 pt-[15vh] md:pt-[10vh] md:pl-[205px] flex flex-col items-start max-w-[360px] md:max-w-[600px]">
            {/* Connection Tail - Sharp & Compact */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 5 }}
              className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-white/10 backdrop-blur-lg ml-12 md:ml-[120px] relative z-20"
            />

            {/* Main Compact Card */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="w-full bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[32px] p-4 md:p-5 shadow-2xl pointer-events-auto flex flex-col gap-4 max-w-[320px]"
            >
              {/* Succinct Message */}
              <p className="text-white text-sm font-bold text-center leading-normal px-2">
                Có vẻ địa chỉ này cách khá xa vị trí hiện tại của bạn {formattedDistance}.
              </p>

              {/* Action Button - Styled like RestaurantSlider button but compact */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onChangeAddress();
                  onClose();
                }}
                className="group relative flex items-center justify-center gap-2 px-6 py-2.5 bg-primary/70 border-2 border-white/10 backdrop-blur-md rounded-full text-white/90 font-semibold font-anton text-md uppercase shadow-lg shadow-black/10 transition-all hover:bg-white hover:text-[#1A1A1A]"
              >
                <MapPin className="w-4 h-4" strokeWidth={2.5} />
                Thay đổi địa chỉ
                <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
