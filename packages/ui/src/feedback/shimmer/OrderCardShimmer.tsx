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

  const ShimmerCard = ({ index }: { index: number }) => {
    return (
      <motion.div
        className="bg-white rounded-[28px] p-5 shadow-md border-4 border-gray-50 mb-3"
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
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-2.5 w-16 bg-gray-100 rounded mb-2" /> {/* Label */}
            <motion.div
              className="h-7 w-24 bg-gray-200 rounded-lg"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
          <div className="h-6 w-16 bg-gray-100 rounded-lg" /> {/* Badge */}
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gray-100 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2 w-16 bg-gray-100 rounded" />
            <motion.div
              className="h-4 w-32 bg-gray-100 rounded"
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

        <div className="h-px bg-gray-100 w-full mb-4" />

        {/* Address */}
        <div className="mb-4">
          <div className="h-2.5 w-24 bg-gray-100 rounded mb-2" />
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <motion.div
                className="h-4 w-full bg-gray-100 rounded mb-1"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
              <div className="h-4 w-2/3 bg-gray-100 rounded" />
            </div>
          </div>
        </div>

        {/* Items Preview */}
        <div className="bg-gray-50/70 rounded-2xl p-3 mb-4">
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gray-200 flex-shrink-0" />
                <div className="h-4 flex-1 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-gray-200 rounded-full" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
          <motion.div
            className="h-6 w-24 bg-gray-200 rounded-lg"
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
        <ShimmerCard key={`order-shimmer-${index}`} index={index} />
      ))}
    </div>
  );
};

export default OrderCardShimmer;
