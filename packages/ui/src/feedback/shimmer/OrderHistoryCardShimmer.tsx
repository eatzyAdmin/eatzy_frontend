import React from 'react';
import { motion } from 'framer-motion';

const OrderCardShimmer = ({ cardCount = 2 }) => {
  // Shimmer animation variants - Identical to RestaurantCardShimmer
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

  // Card animation variants - Identical to RestaurantCardShimmer
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
  };

  // Shimmer card component - MATCHING OrderHistoryCard.tsx Structure with RestaurantCardShimmer Style
  const ShimmerCard = ({ index }: { index: number }) => {
    return (
      <motion.div
        className="relative bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 flex flex-row h-[140px] md:flex-col md:h-auto"
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
        {/* Restaurant Image - Styled like RestaurantCardShimmer */}
        <motion.div
          className="relative w-32 flex-shrink-0 md:w-full md:aspect-[16/9] bg-gray-200"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
          }}
        >
          {/* Order Code - Styled with white/80 like RestaurantCardShimmer badges */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3">
            <motion.div
              className="bg-white/80 backdrop-blur-sm px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-full shadow-lg"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.9) 75%)',
                backgroundSize: '200% 100%',
                width: '3rem',
                height: '1.25rem',
              }}
            />
          </div>

          {/* Status Badge - Styled with white/80 like RestaurantCardShimmer badges */}
          <div className="absolute bottom-2 left-2 md:top-3 md:right-3 md:bottom-auto md:left-auto max-w-[calc(100%-16px)] md:max-w-none">
            <motion.div
              className="bg-white/80 backdrop-blur-sm px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-full shadow-lg flex items-center gap-1 md:gap-1.5"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.9) 75%)',
                backgroundSize: '200% 100%',
                width: '5rem',
                height: '1.25rem',
              }}
            >
              {/* Status Icon placeholder */}
              <div className="w-3 h-3 md:w-4 md:h-4 bg-white/50 rounded-full" />
            </motion.div>
          </div>
        </motion.div>

        {/* Order Details */}
        <div className="flex-1 p-3 flex flex-col justify-between md:p-5 md:block md:space-y-4 min-w-0">
          {/* Restaurant Info */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
              {/* Store icon placeholder */}
              <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded" />
            </div>
            <div className="flex-1 min-w-0">
              {/* Restaurant Name - Uses darker shimmer gradient */}
              <motion.div
                className="h-3.5 md:h-4 w-28 md:w-40 bg-gray-200 rounded mb-1"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
              {/* Address - Uses lighter shimmer gradient */}
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-300 rounded flex-shrink-0" />
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
          </div>

          {/* Order Items Preview */}
          <div className="space-y-1 md:space-y-2">
            {/* "Món ăn" label */}
            <motion.div
              className="hidden md:block h-3 w-14 bg-gray-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />

            <div className="space-y-1 md:space-y-1.5">
              {/* Items */}
              {[1, 2].map((i) => (
                <div key={i} className={`flex items-center justify-between text-sm ${i > 1 ? 'hidden md:flex' : 'flex'}`}>
                  <div className="flex items-center gap-1 md:gap-2 flex-1 min-w-0">
                    {/* Quantity */}
                    <motion.div
                      className="h-3 md:h-4.5 w-6 md:w-10 bg-gray-200 rounded"
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
                      className="h-3 md:h-3.5 flex-1 bg-gray-100 rounded"
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      style={{
                        background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                        backgroundSize: '200% 100%',
                      }}
                    />
                  </div>
                  {/* Price */}
                  <motion.div
                    className="hidden md:inline h-3.5 w-16 bg-gray-200 rounded ml-2"
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

              {/* "+X món khác..." Desktop */}
              <motion.div
                className="hidden md:block h-3 w-24 bg-gray-100 rounded"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />

              {/* "+X món khác..." Mobile */}
              <motion.div
                className="block md:hidden h-2.5 w-20 bg-gray-100 rounded"
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

          {/* Divider */}
          <div className="hidden md:block h-px bg-gray-100" />

          {/* Total & Date */}
          <div className="flex items-end md:items-center justify-between mt-2 md:mt-0">
            {/* Date */}
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-300 rounded" />
              <motion.div
                className="h-2.5 md:h-3 w-20 md:w-24 bg-gray-100 rounded"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>

            <div className="text-right">
              {/* "Tổng tiền" label */}
              <motion.div
                className="hidden md:block h-3 w-14 bg-gray-100 rounded mb-0.5"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
              {/* Total */}
              <motion.div
                className="h-4 md:h-5 w-20 md:w-24 bg-gray-200 rounded"
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
        <ShimmerCard key={`order-shimmer-${index}`} index={index} />
      ))}
    </>
  );
};

export default OrderCardShimmer;
