import React from 'react';
import { motion } from 'framer-motion';

const CurrentOrderCardShimmer = ({ cardCount = 3 }: { cardCount?: number }) => {
  const shimmerVariants = {
    initial: { backgroundPosition: '-200% 0' },
    animate: {
      backgroundPosition: '200% 0',
      transition: { duration: 2, ease: 'linear', repeat: Infinity },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  const ShimmerCard = ({ index }: { index: number }) => (
    <div className="relative w-full mb-4">
      {/* Background Shell Shimmer */}
      <div className="absolute inset-0 z-0 bg-gray-50/50 rounded-[40px] rounded-b-[32px] border border-gray-100/50" />

      {/* Main Card Shimmer */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          ease: "easeOut"
        }}
        className="relative z-10 w-full h-[140px] flex flex-row overflow-hidden rounded-[40px] bg-white border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)]"
      >
        {/* Left: Image Placeholder */}
        <motion.div
          className="relative w-36 h-full flex-shrink-0 bg-gray-100"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(90deg, #f3f4f6 25%, #f9fafb 50%, #f3f4f6 75%)',
            backgroundSize: '200% 100%',
          }}
        >
          {/* Badge Placeholder */}
          <div className="absolute top-4 left-4 h-6 w-16 bg-white/60 rounded-3xl backdrop-blur-sm" />
          {/* Date Placeholder */}
          <div className="absolute bottom-3 right-3 h-5 w-16 bg-black/5 rounded-xl" />
        </motion.div>

        {/* Right: Info Section Placeholder */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gray-200/60 rounded-md" />
                <div className="h-2 w-12 bg-gray-100 rounded-full" />
              </div>
              <div className="h-5 w-3/4 bg-gray-100 rounded-lg" />
            </div>
            <div className="h-3 w-1/2 bg-gray-50 rounded-md opacity-60" />
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-50">
            <div className="h-2 w-20 bg-gray-50 rounded-full opacity-50" />
            <div className="h-6 w-28 bg-gray-100 rounded-md" />
          </div>
        </div>
      </motion.div>

      {/* Status Panel Shimmer */}
      <div className="relative z-10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100/80 flex items-center justify-center shadow-sm" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-3 w-16 bg-gray-200/50 rounded-md" />
              <div className="w-1 h-1 rounded-full bg-gray-200" />
              <div className="h-3 w-32 bg-gray-100/40 rounded-md" />
            </div>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-gray-100/40" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {Array.from({ length: cardCount }).map((_, i) => (
        <ShimmerCard key={i} index={i} />
      ))}
    </div>
  );
};

export default CurrentOrderCardShimmer;
