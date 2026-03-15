"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { MapPin, X, AlertTriangle, ChevronRight } from "@repo/ui/icons";

interface DistanceWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxDistance: number;
  currentDistance: number;
  onSelectLocation?: () => void;
}

export default function DistanceWarningModal({
  isOpen,
  onClose,
  maxDistance,
  currentDistance,
  onSelectLocation,
}: DistanceWarningModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div
            className="fixed inset-0 z-[101] flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ y: "100dvh", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100dvh", opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full md:max-w-md bg-white rounded-t-[40px] md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-white/20"
            >
              {/* Header Style - Matching Floating Cart */}
              <div className="flex items-center justify-between px-6 py-6 pb-5 md:px-7 md:py-7 md:pb-6 text-[#154D1B] bg-[#E4F8D5] flex-shrink-0 rounded-t-[40px] md:rounded-t-[40px] rounded-b-[40px] md:rounded-b-[50px] shadow-sm">
                <div className="flex flex-col gap-1.5">
                  <div className="text-2xl sm:text-3xl font-anton font-bold uppercase tracking-tight leading-none">
                    KHOẢNG CÁCH QUÁ XA
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="px-2 py-0.5 bg-[#154D1B] rounded-xl shadow-sm">
                      <span className="text-[10px] font-black font-anton text-white uppercase tabular-nums">
                        WARNING
                      </span>
                    </div>
                    <div className="text-[10px] text-[#154D1B]/50 font-bold uppercase tracking-widest leading-none mt-0.5">
                      • DELIVERY LIMIT
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#154D1B] hover:shadow-md transition-all duration-300 shadow-sm"
                >
                  <X size={20} strokeWidth={3} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="px-4 py-5 pb-4 md:px-8 md:py-8 md:pb-8 text-center">
                <div className="w-16 h-16 rounded-3xl bg-orange-50 flex items-center justify-center mb-6 mx-auto border border-orange-100">
                  <AlertTriangle size={32} className="text-orange-500" strokeWidth={2.5} />
                </div>

                <p className="text-gray-500 text-[15px] font-medium leading-relaxed mb-8">
                  Vì lý do phục vụ trải nghiệm món ăn tốt nhất và đảm bảo chất lượng giao hàng, Eatzy giới hạn bán kính giao hàng tối đa là <span className="font-black text-xl text-[#154D1B] ml-0.5 ">{maxDistance}km</span>.
                  <br />
                  <span className="block mt-2 text-sm">
                    Vị trí của bạn đang cách quán <span className="font-bold text-orange-600 px-1.5 py-0.5 bg-orange-50 rounded-lg">{currentDistance.toFixed(1)}km</span>.
                  </span>
                </p>

                {/* Bottom Footer Section - Matching Floating Cart Footer */}
                <div className="bg-[#E4F8D5] rounded-[28px] p-1">
                  <div className="flex flex-col gap-1">
                    {/* Mobile: Select Location */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={onSelectLocation || onClose}
                      className="md:hidden group/btn relative w-full h-[60px] bg-[var(--primary)] hover:bg-[#A9E23D] text-[#154D1B] rounded-[24px] flex items-center justify-center px-6 shadow-[0_12px_30px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex items-center gap-3 relative z-10 transition-all">
                        <MapPin size={20} strokeWidth={2.5} />
                        <span className="text-xl font-anton font-black tracking-tight uppercase">
                          Chọn điểm giao khác
                        </span>
                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform duration-300" strokeWidth={3} />
                      </div>
                    </motion.button>

                    {/* Desktop: Got it */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="hidden md:flex group/btn relative w-full h-[60px] bg-[var(--primary)] hover:bg-[#A9E23D] text-[#154D1B] rounded-[24px] items-center justify-center px-6 shadow-[0_12px_30px_rgba(0,0,0,0.1)] transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 relative z-10 transition-all">
                        <span className="text-xl font-anton font-black tracking-tight uppercase">
                          Đã hiểu
                        </span>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Mobile Fallback */}
                <button
                  onClick={onClose}
                  className="md:hidden mt-6 w-full text-gray-400 font-bold text-sm tracking-widest uppercase hover:text-gray-600 transition-colors"
                >
                  Để sau
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

