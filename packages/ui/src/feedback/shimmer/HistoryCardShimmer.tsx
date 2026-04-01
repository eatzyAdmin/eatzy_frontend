import React from 'react';
import { motion } from 'framer-motion';

const HistoryCardShimmer = ({ cardCount = 3 }: { cardCount?: number }) => {
  // Shimmer animation variants
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

  const shimmerStyle = {
    background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
  };

  // Shimmer card component matching DriverHistoryCard structure
  const ShimmerCard = ({ index }: { index: number }) => {
    return (
      <div className="relative flex flex-col p-4 overflow-hidden rounded-[36px] bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)] border border-gray-50">
        {/* Header: Store Info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gray-100 shrink-0" />
            <div className="min-w-0 space-y-1.5">
              <div className="h-1.5 w-8 bg-gray-100 rounded-full" />
              <motion.div
                className="h-4 w-32 bg-gray-100 rounded-md"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={shimmerStyle}
              />
            </div>
          </div>

          <div className="text-right mt-1">
             <motion.div
                className="h-2 w-16 bg-gray-50 rounded-full ml-auto"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={shimmerStyle}
              />
          </div>
        </div>

        {/* Middle: Delivery Point */}
        <div className="flex items-center gap-2 px-0 mb-3">
          <div className="w-6 h-6 rounded-full bg-gray-50 shrink-0" />
          <motion.div
            className="h-3 w-48 bg-gray-100 rounded-md"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={shimmerStyle}
          />
        </div>

        {/* Footer: Items Summary & Earnings */}
        <div className="flex items-end justify-between pt-1 border-t border-gray-100/60">
          <div className="min-w-0 flex-1 space-y-2">
             <div className="flex items-center gap-2">
                <div className="h-1.5 w-10 bg-gray-50 rounded-full" />
                <div className="h-3 w-12 bg-gray-100 rounded-md" />
             </div>
             <motion.div
                className="h-2.5 w-[70%] bg-gray-50 rounded-md"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={shimmerStyle}
              />
          </div>

          <div className="text-right space-y-2">
            <div className="h-1.5 w-12 bg-gray-50 rounded-full ml-auto" />
            <motion.div
              className="h-6 w-24 bg-gray-100 rounded-lg ml-auto"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={shimmerStyle}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {Array.from({ length: cardCount }, (_, index) => (
        <ShimmerCard key={`history-shimmer-${index}`} index={index} />
      ))}
    </div>
  );
};

export default HistoryCardShimmer;
