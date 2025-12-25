import React from 'react';
import { motion } from 'framer-motion';

const TransactionCardShimmer = ({ cardCount = 3 }: { cardCount?: number }) => {
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

  // Shimmer card component matching TransactionCard structure
  const ShimmerCard = ({ index }: { index: number }) => {
    return (
      <motion.div
        className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 mb-3"
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
        {/* Left: Icon + Info */}
        <div className="flex items-center gap-3">
          {/* Icon circle */}
          <motion.div
            className="w-10 h-10 rounded-full bg-gray-200"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
              backgroundSize: '200% 100%',
            }}
          />
          <div className="flex flex-col gap-1">
            {/* Description */}
            <motion.div
              className="h-3.5 w-32 bg-gray-200 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            {/* Date time */}
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

        {/* Right: Amount */}
        <div className="text-right">
          <motion.div
            className="h-4 w-20 bg-gray-200 rounded mb-1"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full">
      {Array.from({ length: cardCount }, (_, index) => (
        <ShimmerCard key={`transaction-shimmer-${index}`} index={index} />
      ))}
    </div>
  );
};

export default TransactionCardShimmer;
