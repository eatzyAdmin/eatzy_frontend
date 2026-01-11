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

  // Shimmer card component - FOR FAVORITES
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
          {/* Heart Badge (Top Right) */}
          <div className="absolute top-2 right-2 md:top-3 md:right-3">
            <motion.div
              className="w-8 h-8 md:w-10 md:h-10 bg-white/80 rounded-full"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.9) 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Rating Badge (Bottom Left) */}
          <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3">
            <motion.div
              className="h-5 w-10 md:h-6 md:w-12 bg-white/80 rounded-full"
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
        <div className="p-3 md:p-5 space-y-2 md:space-y-3">
          {/* Name */}
          <motion.div
            className="h-3 md:h-5 w-32 md:w-48 bg-gray-200 rounded"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
              backgroundSize: '200% 100%',
            }}
          />

          {/* Categories */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-5 w-16 md:h-6 md:w-20 bg-gray-100 rounded-full"
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

          {/* Description */}
          <div className="space-y-1 md:space-y-2">
            <motion.div
              className="h-2.5 md:h-3 w-full bg-gray-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            <motion.div
              className="hidden md:block h-3 w-3/4 bg-gray-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Address */}
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-gray-200" />
            <motion.div
              className="h-2.5 md:h-3 flex-1 bg-gray-100 rounded"
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
