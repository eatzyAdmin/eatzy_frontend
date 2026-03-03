import React from "react";
import { motion } from "framer-motion";
import { MapPin, Plus } from "../../icons";

const SavedAddressesShimmer = () => {
  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: {
      x: "100%",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <MapPin size={12} />
            Địa chỉ giao hàng
          </span>
        </div>
        <h2 className="text-[56px] font-bold leading-none text-[#1A1A1A] uppercase" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
          ADDRESSES
        </h2>
        <p className="text-gray-500 font-medium">Lưu trữ địa chỉ giúp bạn đặt hàng nhanh chóng hơn</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[1, 2].map((idx) => (
          <div
            key={idx}
            className="p-6 bg-white border border-gray-100 rounded-[32px] overflow-hidden relative"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 relative overflow-hidden">
                <motion.div
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-6 w-32 bg-gray-100 rounded-lg relative overflow-hidden">
                  <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  />
                </div>
                <div className="h-4 w-3/4 bg-gray-50 rounded-lg relative overflow-hidden">
                  <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-xl bg-gray-50 relative overflow-hidden">
                  <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 relative overflow-hidden">
                  <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="w-full py-10 border-2 border-dashed border-gray-100 rounded-[32px] flex flex-col items-center justify-center opacity-50">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
            <Plus className="w-6 h-6 text-gray-300" />
          </div>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">Thêm địa chỉ mới</span>
        </div>
      </div>
    </div>
  );
};

export default SavedAddressesShimmer;
