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
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  // Shimmer card component matching TransactionCard structure 1:1
  const ShimmerCard = ({ index }: { index: number }) => {
    return (
      <motion.div
        className="bg-white p-4 rounded-[24px] flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{
          delay: index * 0.05,
          duration: 0.4,
        }}
      >
        {/* Left: Icon + Info */}
        <div className="flex items-center gap-3">
          {/* Icon circle matching TransactionCard w-10 h-10 rounded-full */}
          <motion.div
            className="w-10 h-10 rounded-full bg-gray-100/80 shrink-0"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #f3f4f6 25%, #ffffff 50%, #f3f4f6 75%)',
              backgroundSize: '200% 100%',
            }}
          />
          <div className="flex flex-col gap-1.5 min-w-0">
            {/* Description shimmer block */}
            <motion.div
              className="h-3.5 w-32 bg-gray-100/80 rounded-md"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, #ffffff 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            {/* Date time shimmer block */}
            <motion.div
              className="h-2.5 w-24 bg-gray-50 rounded-md"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f9fafb 25%, #ffffff 50%, #f9fafb 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        </div>

        {/* Right: Amount block matching font-anton height */}
        <div className="text-right shrink-0">
          <motion.div
            className="h-5 w-24 bg-gray-100/80 rounded-lg"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #f3f4f6 25%, #ffffff 50%, #f3f4f6 75%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      </motion.div>
    );
  };

  // We return a Fragment with mapped cards and a gap wrapper for when it's the ONLY thing rendered.
  // When appended to a list, we use a utility class to handle the gap between the list items.
  return (
    <div className="flex flex-col gap-2 w-full">
      {Array.from({ length: cardCount }, (_, index) => (
        <ShimmerCard key={`transaction-shimmer-${index}`} index={index} />
      ))}
    </div>
  );
};

export default TransactionCardShimmer;
