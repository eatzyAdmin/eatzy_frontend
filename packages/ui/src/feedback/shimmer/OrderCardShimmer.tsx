import React from 'react';
import { motion } from 'framer-motion';

const OrderCardShimmer = ({ cardCount = 2 }) => {
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

  // Shimmer card component matching OrderCard structure exactly
  const ShimmerCard = ({ index }: { index: number }) => {
    return (
      <motion.div
        className="bg-white rounded-2xl p-4 shadow-md border-2 border-transparent mb-3"
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
        {/* Header: Code + Time | Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {/* Order Code - text-lg height ~28px */}
            <motion.div
              className="h-7 w-28 bg-gray-200 rounded-md mb-1"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            {/* Time - text-xs with icon, height ~16px */}
            <div className="flex items-center gap-1 mt-1">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <motion.div
                className="h-3 w-32 bg-gray-100 rounded"
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
          {/* Badge - px-3 py-1 */}
          <motion.div
            className="h-6 w-16 bg-primary/10 rounded-full"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #dbeafe 25%, rgba(255,255,255,0.8) 50%, #dbeafe 75%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* Address - mb-3 */}
        <div className="flex items-start gap-2 mb-3">
          {/* MapPin icon w-4 h-4 */}
          <div className="w-4 h-4 bg-gray-300 rounded mt-0.5 flex-shrink-0" />
          {/* Address text - text-sm, can be 2 lines */}
          <div className="flex-1 space-y-1">
            <motion.div
              className="h-3.5 w-full bg-gray-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            <motion.div
              className="h-3.5 w-3/4 bg-gray-100 rounded"
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

        {/* Items Preview - mb-3, space-y-1 */}
        <div className="mb-3 space-y-1">
          {/* Each item is flex items-center gap-2, text-xs */}
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              {/* Quantity - font-semibold */}
              <motion.div
                className="h-3 w-5 bg-gray-200 rounded"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
              {/* Item name */}
              <motion.div
                className="h-3 flex-1 bg-gray-100 rounded"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Price - pt-3, border-t */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            {/* Label "Tổng tiền" - text-sm */}
            <motion.div
              className="h-3.5 w-16 bg-gray-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            {/* Price value - text-lg, font-anton */}
            <motion.div
              className="h-5 w-24 bg-gray-200 rounded-lg"
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
        <ShimmerCard key={`order-shimmer-${index}`} index={index} />
      ))}
    </div>
  );
};

export default OrderCardShimmer;
