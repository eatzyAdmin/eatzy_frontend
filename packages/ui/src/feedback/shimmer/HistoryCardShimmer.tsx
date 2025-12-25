import React from 'react';
import { motion } from 'framer-motion';

const HistoryCardShimmer = ({ cardCount = 2 }: { cardCount?: number }) => {
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

  // Card animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
  };

  // Shimmer card component matching DriverHistoryCard structure
  const ShimmerCard = ({ index }: { index: number }) => {
    return (
      <motion.div
        className="bg-white rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4 mb-4"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{
          delay: index * 0.1,
          duration: 0.6,
          type: "spring",
          damping: 15,
          stiffness: 100,
        }}
      >
        {/* Top Row: Name & Earnings */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col flex-1">
            {/* Restaurant name */}
            <motion.div
              className="h-5 w-32 bg-gray-200 rounded-lg mb-1.5"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            {/* Date time */}
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-gray-200 rounded" />
              <motion.div
                className="h-3 w-24 bg-gray-100 rounded"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>
          </div>
          {/* Earnings */}
          <motion.div
            className="h-5 w-20 bg-gray-200 rounded-lg"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-50 -mx-5" />

        {/* Route Info */}
        <div className="space-y-3">
          {/* Pickup */}
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
            <motion.div
              className="h-3.5 flex-1 bg-gray-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
          {/* Dropoff */}
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
            <motion.div
              className="h-3.5 flex-1 bg-gray-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center gap-4 pt-1">
          {/* Distance badge */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
            <div className="w-3.5 h-3.5 bg-gray-200 rounded" />
            <motion.div
              className="h-3 w-10 bg-gray-200 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
          {/* Duration badge */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
            <div className="w-3.5 h-3.5 bg-gray-200 rounded" />
            <motion.div
              className="h-3 w-12 bg-gray-200 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full">
      {Array.from({ length: cardCount }, (_, index) => (
        <ShimmerCard key={`history-shimmer-${index}`} index={index} />
      ))}
    </div>
  );
};

export default HistoryCardShimmer;
