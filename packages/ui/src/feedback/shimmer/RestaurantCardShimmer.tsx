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
        className="relative overflow-hidden rounded-[32px] md:rounded-[40px] shadow-sm aspect-[4/5] md:aspect-[7/8] bg-gray-100"
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
        {/* Full Bleed Background Shimmer */}
        <motion.div
          className="absolute inset-0 z-0"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 h-full p-4 flex flex-col justify-between">
          {/* Top Row: Rating & Heart */}
          <div className="flex justify-between items-start">
            <motion.div
              className="h-7 md:h-9 w-12 md:w-16 bg-white/40 backdrop-blur-md rounded-[16px] md:rounded-[18px]"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.4) 75%)', backgroundSize: '200% 100%' }}
            />
            <motion.div
              className="w-8 h-8 md:w-10 md:h-10 bg-black/20 backdrop-blur-md rounded-2xl"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 75%)', backgroundSize: '200% 100%' }}
            />
          </div>

          {/* Bottom Info Section */}
          <div className="space-y-3 md:space-y-4">
            {/* Title & Address */}
            <div className="space-y-2">
              <motion.div
                className="h-6 md:h-8 w-3/4 bg-white/30 backdrop-blur-md rounded-lg"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 75%)', backgroundSize: '200% 100%' }}
              />
              <motion.div
                className="h-3 md:h-4 w-1/2 bg-white/10 backdrop-blur-md rounded-md"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 75%)', backgroundSize: '200% 100%' }}
              />
            </div>

            {/* Metrics Row */}
            <div className="flex items-center gap-4">
              <motion.div className="h-6 md:h-8 w-16 md:w-20 bg-white/20 rounded-md" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 75%)', backgroundSize: '200% 100%' }} />
              <div className="w-px h-6 bg-white/10" />
              <motion.div className="h-6 md:h-8 w-16 md:w-20 bg-white/20 rounded-md" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 75%)', backgroundSize: '200% 100%' }} />
            </div>

            <div className="h-px bg-white/10 w-full" />

            <motion.div
              className="h-4 md:h-5 w-32 bg-white/10 rounded-md"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 75%)', backgroundSize: '200% 100%' }}
            />
          </div>
        </div>

        {/* Glossy protector background gradient simulation */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
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
