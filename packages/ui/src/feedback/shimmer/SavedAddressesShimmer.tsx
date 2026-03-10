import React from "react";
import { motion } from "framer-motion";
import { MapPin, Plus } from "../../icons";

interface SavedAddressesShimmerProps {
  cardCount?: number;
}

const SavedAddressesShimmer = ({ cardCount = 3 }: SavedAddressesShimmerProps) => {
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
    <>
      {Array.from({ length: cardCount }).map((_, idx) => (
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
          className="group relative w-full h-[120px] flex flex-row overflow-hidden rounded-[36px] md:rounded-[40px] bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)] md:shadow-[0_0_25px_rgba(0,0,0,0.10)] border border-gray-100/30"
        >
          {/* Visual Identity Section (Left) */}
          <div className="relative w-28 md:w-32 h-full flex-shrink-0 bg-slate-50 flex items-center justify-center border-r border-gray-100 overflow-hidden">
            <motion.div
              className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            
            {/* Floating SAVED Badge Shimmer */}
            <div className="absolute top-3 left-3">
              <div className="w-14 h-5 bg-white/95 rounded-full shadow-sm border border-gray-100 overflow-hidden relative">
                 <motion.div
                  className="absolute inset-0"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    background: 'linear-gradient(90deg, transparent 25%, rgba(243,244,246,0.5) 50%, transparent 75%)',
                    backgroundSize: '200% 100%',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Info Section (Right) */}
          <div className="flex-1 p-3.5 md:p-5 flex flex-col justify-center min-w-0 pr-12 md:pr-14">
            <div className="space-y-2">
              <div className="h-2 w-8 bg-gray-100 rounded-full opacity-60" />
              <motion.div
                className="h-4 w-32 bg-gray-100 rounded-lg overflow-hidden"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.9) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
              <motion.div
                className="h-3 w-full bg-gray-50 rounded-full overflow-hidden"
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

          {/* Actions (Top Right) */}
          <div className="absolute top-3 right-3 md:top-4 md:right-4 flex items-center gap-1.5 px-1">
            <div className="w-8 h-8 rounded-2xl bg-gray-100/50" />
            <div className="hidden md:block w-8 h-8 rounded-2xl bg-gray-100/50" />
          </div>

          <div className="hidden md:block absolute bottom-4 right-4 bg-gray-50 h-8 w-8 rounded-full" />
        </motion.div>
      ))}

      {/* Desktop Add Placeholder Shimmer */}
      <motion.div 
        className="hidden md:flex w-full py-10 border-2 border-dashed border-gray-100/50 rounded-[40px] flex flex-col items-center justify-center opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
          <Plus className="w-6 h-6 text-gray-300" />
        </div>
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">Thêm địa chỉ mới</span>
      </motion.div>
    </>
  );
};

export default SavedAddressesShimmer;
