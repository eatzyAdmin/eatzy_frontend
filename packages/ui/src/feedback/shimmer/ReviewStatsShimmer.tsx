import React from 'react';
import { motion } from 'framer-motion';

const ReviewStatsShimmer = () => {
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

  return (
    <div className="w-[400px] flex-shrink-0 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Hero Rating Shimmer */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="text-4xl">🏆</span>
            {/* Big rating number */}
            <motion.div
              className="h-20 w-24 bg-gray-200 rounded-2xl"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            <span className="text-4xl">🏆</span>
          </div>

          {/* Title */}
          <motion.div
            className="h-5 w-40 bg-gray-200 rounded-lg mx-auto"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
              backgroundSize: '200% 100%',
            }}
          />

          {/* Description - 3 lines */}
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`h-3 bg-gray-100 rounded mx-auto ${i === 1 ? 'w-full' : i === 2 ? 'w-5/6' : 'w-4/6'}`}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
            ))}
          </div>
        </div>

        {/* Rating Distribution Shimmer */}
        <div className="space-y-2.5">
          {/* Header */}
          <motion.div
            className="h-4 w-32 bg-gray-200 rounded mb-3"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
              backgroundSize: '200% 100%',
            }}
          />

          {/* 5 rating bars */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2.5">
              {/* Star number */}
              <div className="w-2 h-3 bg-gray-200 rounded" />
              {/* Bar */}
              <motion.div
                className="flex-1 h-1 bg-gray-100 rounded-full"
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

        {/* Categories Shimmer */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2.5">
                {/* Icon */}
                <div className="w-4 h-4 bg-gray-200 rounded" />
                {/* Label */}
                <motion.div
                  className="h-3.5 w-20 bg-gray-100 rounded"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                    backgroundSize: '200% 100%',
                  }}
                />
              </div>
              {/* Score */}
              <motion.div
                className="h-3.5 w-8 bg-gray-200 rounded"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewStatsShimmer;
