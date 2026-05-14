import React from 'react';
import { motion } from 'framer-motion';

const RecentOrderCardShimmer = ({ cardCount = 3 }: { cardCount?: number }) => {
  const shimmerVariants = {
    initial: { backgroundPosition: '-200% 0' },
    animate: {
      backgroundPosition: '200% 0',
      transition: { duration: 2, ease: 'linear', repeat: Infinity },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 15, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
  };

  const ShimmerCard = ({ index }: { index: number }) => (
    <div className="relative w-[130px] flex-shrink-0 ml-3 first:ml-0">
      {/* Background Shell - Peeking out at the bottom */}
      <div className="absolute inset-0 bg-[#F9FAFB] rounded-[32px] rounded-b-[24px] shadow-[0_0_12px_rgba(0,0,0,0.08)]" />

      {/* Main Card Shimmer - Favorite style overlay */}
      <motion.div
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
        className="relative z-10 w-full aspect-[4/5] overflow-hidden rounded-[32px] bg-gray-100 shadow-md flex flex-col"
      >
        {/* Full Bleed Background Shimmer */}
        <motion.div
          className="absolute inset-0 z-0"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.7) 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 h-full p-3 flex flex-col justify-end">
          {/* Message Icon Placeholder */}
          <div className="absolute top-3 right-3 w-7 h-7 rounded-xl bg-black/10 backdrop-blur-md border border-white/10" />

          {/* Bottom Info Section */}
          <div className="space-y-1.5 relative z-20">
            {/* Restaurant Name Line */}
            <motion.div 
              className="h-4 w-4/5 bg-white/40 backdrop-blur-md rounded-md"
              style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.4) 75%)', backgroundSize: '200% 100%' }}
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
            {/* Dish List Line */}
            <motion.div 
              className="h-2 w-3/5 bg-white/20 backdrop-blur-sm rounded-full"
              style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 75%)', backgroundSize: '200% 100%' }}
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
            {/* Price Line */}
            <div className="pt-1">
              <motion.div 
                className="h-5 w-14 bg-white/50 backdrop-blur-md rounded-lg"
                style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.5) 75%)', backgroundSize: '200% 100%' }}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </div>
          </div>

          {/* Glossy protector gradient */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
      </motion.div>

      {/* Peeking Section (Driver Info) */}
      <div className="relative z-0 pt-2 pb-1.5 px-3 flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full bg-gray-200/80 shrink-0" />
        <div className="h-2 w-14 bg-gray-200/60 rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="flex">
      {Array.from({ length: cardCount }).map((_, i) => (
        <ShimmerCard key={i} index={i} />
      ))}
    </div>
  );
};

export default RecentOrderCardShimmer;
