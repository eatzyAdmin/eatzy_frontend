import React from "react";
import { motion } from "framer-motion";
import { MapPin, Plus } from "../../icons";

const SavedAddressesShimmer = () => {
  // Shimmer animation variants matching OrderHistoryCard
  const shimmerVariants = {
    initial: { backgroundPosition: '-200% 0' },
    animate: {
      backgroundPosition: '200% 0',
      transition: {
        duration: 2,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  };

  // Card entry animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div className="md:space-y-12">
      {/* Title section - hidden on mobile just like SavedAddressesSection */}
      <div className="hidden md:flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <MapPin size={12} />
            Địa chỉ giao hàng
          </span>
        </div>
        <h2 className="text-[56px] font-bold leading-none text-[#1A1A1A] uppercase" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
          ADDRESSES
        </h2>
        <p className="text-gray-500 font-medium text-sm">Lưu trữ địa chỉ giúp bạn đặt hàng nhanh chóng hơn</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4 mt-6 md:mt-0 px-3 md:px-0 pb-20 md:pb-0">
        {[1, 2, 3].map((idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{
              delay: idx * 0.1,
              duration: 0.6,
              type: "spring",
              damping: 15,
              stiffness: 100,
            }}
            className="group relative h-[120px] md:h-[135px] bg-white border border-gray-100/80 rounded-[40px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex p-4 md:p-5"
          >
            {/* Left side: Icon Shimmer Area */}
            <motion.div
              className="w-[85px] md:w-[95px] h-full flex items-center justify-center rounded-[32px] shrink-0 border border-gray-100/30"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />

            {/* Right side: Content Shimmer Area */}
            <div className="flex-1 ml-5 flex flex-col justify-center gap-3">
              {/* Title shimmer */}
              <motion.div
                className="h-4 w-32 bg-gray-100 rounded-lg relative overflow-hidden"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.9) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
              
              {/* Address lines shimmer */}
              <div className="space-y-2">
                <motion.div
                  className="h-3 w-full bg-gray-50 rounded-full relative overflow-hidden"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    background: 'linear-gradient(90deg, #f9fafb 25%, rgba(255,255,255,0.7) 50%, #f9fafb 75%)',
                    backgroundSize: '200% 100%',
                  }}
                />
                <motion.div
                  className="h-3 w-4/5 bg-gray-50 rounded-full relative overflow-hidden"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    background: 'linear-gradient(90deg, #f9fafb 25%, rgba(255,255,255,0.7) 50%, #f9fafb 75%)',
                    backgroundSize: '200% 100%',
                  }}
                />
              </div>
            </div>

            {/* Glossy top-right effect to match real cards */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-50/40 to-transparent opacity-30 pointer-events-none" />
          </motion.div>
        ))}

        {/* Desktop Add Placeholder Shimmer */}
        <motion.div 
          className="hidden md:flex w-full py-10 border-2 border-dashed border-gray-100/50 rounded-[40px] flex-col items-center justify-center opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
            <Plus className="w-6 h-6 text-gray-300" />
          </div>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">Thêm địa chỉ mới</span>
        </motion.div>
      </div>
    </div>
  );
};

export default SavedAddressesShimmer;
