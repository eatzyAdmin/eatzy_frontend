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

  // Shimmer card component
  const ShimmerCard = ({ index }: { index: number }) => {

    // Style config
    const cardStyle = {
      gradient: "from-gray-50/90 via-white/50 to-gray-50",
      border: "border-gray-100",
      shadow: "shadow-sm",
    };

    return (
      <motion.div
        className={`relative bg-gradient-to-br ${cardStyle.gradient} rounded-2xl ${cardStyle.shadow} p-5 border ${cardStyle.border} overflow-hidden mb-4`}
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
        {/* Header: Order ID & Time */}
        <div className="flex justify-between items-center mb-4">
          {/* Order ID bg */}
          <motion.div
            className="h-6 w-20 bg-gray-200 rounded-lg"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
              backgroundSize: '200% 100%',
            }}
          />
          {/* Time */}
          <motion.div
            className="h-4 w-16 bg-gray-100 rounded"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-4" />

        {/* Order Items */}
        <div className="space-y-3 mb-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex justify-between items-start">
              <div className="flex gap-3 w-full">
                {/* Quantity */}
                <motion.div
                  className="h-5 w-5 bg-gray-200 rounded shrink-0"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                    backgroundSize: '200% 100%',
                  }}
                />
                <div className="space-y-1 w-full">
                  {/* Item Name */}
                  <motion.div
                    className="h-5 w-3/4 bg-gray-200 rounded"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    style={{
                      background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                      backgroundSize: '200% 100%',
                    }}
                  />
                  {/* Note */}
                  <motion.div
                    className="h-3 w-1/2 bg-gray-100 rounded"
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
          ))}
        </div>

        {/* Total Price & Action */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          {/* Price */}
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
          {/* Button */}
          <motion.div
            className="h-9 w-24 bg-blue-100 rounded-xl"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #dbeafe 25%, rgba(255,255,255,0.8) 50%, #dbeafe 75%)',
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
