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

  // Shimmer card component - MATCHING the refined layout
  const ShimmerCard = ({ index }: { index: number }) => {
    return (
      <motion.div
        className="relative overflow-hidden rounded-[36px] md:rounded-[2.5rem] shadow-sm h-[160px] md:h-auto flex flex-row md:block md:aspect-[7/8] bg-white md:bg-gray-100 border border-gray-100 md:border-none"
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
        {/* Image Placeholder */}
        <motion.div
          className="relative w-40 md:w-full h-full md:absolute md:inset-0 md:z-0 flex-shrink-0 bg-gray-200"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
          }}
        >
          {/* Mobile Status Badge Simulator */}
          <div className="md:hidden absolute top-3 left-3">
            <div className="h-7 w-20 bg-white/40 backdrop-blur-sm rounded-full flex items-center px-1">
              <div className="w-5 h-5 rounded-full bg-white/20 mr-1.5" />
              <div className="h-2 w-10 bg-white/20 rounded-full" />
            </div>
          </div>

          {/* Mobile Date Simulator (Now on bottom right) */}
          <div className="md:hidden absolute bottom-3 right-3">
            <div className="h-5 w-16 bg-black/10 backdrop-blur-md rounded-lg" />
          </div>
        </motion.div>

        {/* Content Section Shimmer */}
        <div className="relative flex-1 md:absolute md:inset-0 md:z-10 h-full p-4 md:p-6 flex flex-col justify-between min-w-0">
          {/* Top Row: Items Count and Status */}
          <div className="flex justify-between items-start">
            <motion.div
              className="hidden md:block h-9 w-32 bg-white/40 backdrop-blur-md rounded-[18px]"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.4) 75%)', backgroundSize: '200% 100%' }}
            />
            {/* Items Badge (Top Right Absolute on Mobile) */}
            <motion.div
              className="absolute top-4 right-4 md:relative md:top-0 md:right-0 h-6 md:h-8 w-14 md:w-20 bg-black/20 backdrop-blur-md rounded-lg md:rounded-xl border border-white/10"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 75%)', backgroundSize: '200% 100%' }}
            />
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              {/* Price block */}
              <div className="space-y-1">
                <div className="md:hidden h-2 w-16 bg-gray-100 rounded-full" />
                <motion.div
                  className="h-6 md:h-10 w-3/4 bg-gray-200 md:bg-white/30 rounded-lg"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }}
                />
              </div>

              {/* Restaurant Name Line */}
              <div className="h-4 md:h-6 w-1/2 bg-gray-100 md:bg-white/20 rounded-md" />

              {/* Dish List Line (Mobile) */}
              <div className="md:hidden h-3 w-4/5 bg-gray-50 rounded-md" />

              {/* Address Lines */}
              <div className="h-2.5 w-full bg-gray-50 md:bg-white/10 rounded-full" />
            </div>

            {/* Desktop Metrics simulator (New dynamic list style) */}
            <div className="hidden md:flex items-center gap-8 pt-2">
              <div className="space-y-1">
                <div className="h-6 w-16 bg-white/20 rounded-md" />
                <div className="h-2 w-10 bg-white/10 rounded-full" />
              </div>
              <div className="w-px h-10 bg-white/15" />
              <div className="space-y-1 flex-1">
                <div className="space-y-1">
                  <div className="h-4 w-full bg-white/20 rounded-md" />
                  <div className="h-4 w-2/3 bg-white/20 rounded-md" />
                </div>
                <div className="h-2 w-12 bg-white/10 rounded-full" />
              </div>
            </div>

            <div className="hidden md:block h-px bg-white/10 w-full" />

            {/* Footer Row (Desktop only) */}
            <div className="hidden md:flex justify-between items-center pt-1">
              <div className="h-9 w-28 bg-white/5 rounded-xl border border-white/10" />
              <div className="h-4 w-12 bg-white/10 rounded-md" />
            </div>
          </div>
        </div>

        {/* Global Desktop Gradient Simulator */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </motion.div>
    );
  };

  return (
    <>
      {Array.from({ length: cardCount }, (_, index) => (
        <ShimmerCard key={`order-shimmer-${index}`} index={index} />
      ))}
    </>
  );
};

export default OrderCardShimmer;
