import React from 'react';
import { motion } from 'framer-motion';

const RestaurantCardShimmer = ({ cardCount = 3 }: { cardCount?: number }) => {
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

  // Shimmer card component
  const ShimmerCard = ({ index }: { index: number }) => {
    return (
      <motion.div
        className="relative bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100"
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
        {/* Image */}
        <motion.div
          className="relative aspect-[16/9] bg-gray-200"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
          }}
        >
          {/* Code badge */}
          <div className="absolute top-3 left-3">
            <motion.div
              className="h-6 w-20 bg-white/80 rounded-full"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.9) 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <motion.div
              className="h-6 w-24 bg-white/80 rounded-full"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.9) 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Restaurant Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-4 w-40 bg-gray-200 rounded"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
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

          {/* Order Items */}
          <div className="space-y-2">
            <motion.div
              className="h-3 w-16 bg-gray-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between">
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
                <motion.div
                  className="h-3.5 w-16 bg-gray-200 rounded ml-2"
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

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Total & Date */}
          <div className="flex items-center justify-between">
            <motion.div
              className="h-3.5 w-24 bg-gray-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            <div className="text-right space-y-1">
              <motion.div
                className="h-3 w-12 bg-gray-100 rounded ml-auto"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
              <motion.div
                className="h-5 w-24 bg-gray-200 rounded"
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
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {Array.from({ length: cardCount }, (_, index) => (
        <ShimmerCard key={`restaurant-shimmer-${index}`} index={index} />
      ))}
    </>
  );
};

export default RestaurantCardShimmer;
