import React from 'react';
import { motion } from 'framer-motion';

const ReviewItemShimmer = ({ count = 3 }: { count?: number }) => {
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

  // Shimmer item component matching review item structure
  const ShimmerItem = ({ index }: { index: number }) => {
    return (
      <motion.div
        className="space-y-3 pb-6 border-b border-gray-100 last:border-0"
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
        {/* Author Info */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
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
          <div className="flex-1 space-y-1">
            {/* Author name */}
            <motion.div
              className="h-4 w-32 bg-gray-200 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            {/* Subtitle */}
            <motion.div
              className="h-3 w-40 bg-gray-100 rounded"
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

        {/* Rating & Date */}
        <div className="flex items-center gap-2">
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

        {/* Review Content - 2-3 lines */}
        <div className="space-y-2">
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
            className="h-3.5 w-5/6 bg-gray-100 rounded"
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

        {/* Location */}
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-200 rounded" />
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
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 pt-2">
      {Array.from({ length: count }, (_, index) => (
        <ShimmerItem key={`review-shimmer-${index}`} index={index} />
      ))}
    </div>
  );
};

export default ReviewItemShimmer;
