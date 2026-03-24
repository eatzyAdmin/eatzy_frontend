"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, Store, ArrowLeft } from "@repo/ui/icons";
import { useRouter } from "next/navigation";

interface StoreClosedModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
}

export default function StoreClosedModal({
  isOpen,
  onClose,
  restaurantName
}: StoreClosedModalProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

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
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[600]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[601] flex items-end md:items-center justify-center p-0 md:p-4 will-change-transform"
          >
            <div className="relative w-full md:max-w-md bg-white rounded-t-[40px] md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-white/20">

              {/* Premium Header - Matching Style */}
              <div className="flex items-center justify-between px-6 py-6 pb-5 md:px-8 md:py-8 md:pb-7 text-[#154D1B] bg-[#E4F8D5] flex-shrink-0 rounded-t-[40px] md:rounded-t-[40px] rounded-b-[40px] md:rounded-b-[50px] shadow-sm">
                <div className="flex flex-col gap-1.5">
                  <div className="text-2xl sm:text-3xl font-anton font-bold uppercase tracking-tight leading-none">
                    CỬA HÀNG ĐÓNG CỬA
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="px-2 py-1 bg-[#154D1B] rounded-xl shadow-sm">
                      <span className="text-[10px] font-black font-anton text-white uppercase tracking-widest leading-none">
                        CLOSED
                      </span>
                    </div>
                    <div className="text-[10px] text-[#154D1B]/50 font-bold uppercase tracking-widest leading-none mt-0.5">
                      • STORE STATUS
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#154D1B] hover:shadow-lg transition-all duration-300 shadow-sm"
                >
                  <X size={20} strokeWidth={3} />
                </motion.button>
              </div>

              {/* Enhanced Content Area */}
              <div className="px-6 py-8 pb-6 md:px-10 md:py-10 md:pb-8 text-center bg-gradient-to-b from-white to-gray-50/50">
                <div className="mb-10 space-y-3">
                  <h3 className="text-[#1A1A1A] font-anton font-bold text-xl uppercase">
                    {restaurantName}
                  </h3>
                  <p className="text-gray-500 text-[15px] font-medium leading-relaxed px-2">
                    Nhà hàng hiện đang <span className="font-bold text-red-500 uppercase">tạm nghỉ</span>.
                    <br />
                    Món ngon cần thời gian chuẩn bị chu đáo hơn, bạn vui lòng quay lại sau hoặc chọn quán khác nhé!
                  </p>
                </div>

                {/* Bottom Action Section */}
                <div className="bg-[#E4F8D5] rounded-[32px] p-1.5 shadow-inner">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.back()}
                    className="group/btn relative w-full h-[64px] bg-[var(--primary)] hover:bg-[#A9E23D] text-[#154D1B] rounded-[28px] flex items-center justify-center px-8 shadow-[0_12px_30px_rgba(132,204,22,0.15)] transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <ArrowLeft size={22} strokeWidth={3} className="group-hover/btn:-translate-x-1 transition-transform" />
                      <span className="text-xl font-anton font-black tracking-tighter uppercase">
                        Quay lại
                      </span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
