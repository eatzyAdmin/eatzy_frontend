import React from 'react';
import { motion } from 'framer-motion';

const MessageItemShimmer = ({ itemCount = 6 }: { itemCount?: number }) => {
  const shimmerVariants = {
    initial: { backgroundPosition: '-200% 0' },
    animate: {
      backgroundPosition: '200% 0',
      transition: { duration: 2, ease: 'linear', repeat: Infinity },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 15, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
  };

  const ShimmerRow = ({ index }: { index: number }) => (
    <div className="group flex flex-col w-full">
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{
          delay: index * 0.05,
          duration: 0.5,
          type: "spring",
          damping: 18,
          stiffness: 120,
        }}
        className="w-full flex items-center gap-3 px-3 md:px-4 py-1"
      >
        {/* Avatar Placeholder */}
        <motion.div
          className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-100 my-3"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
          }}
        />

        {/* Info Container Placeholder */}
        <div className="flex-1 min-w-0 py-4 space-y-2.5">
          <div className="flex items-center justify-between">
            {/* Partner Name Line */}
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
            {/* Time Line */}
            <motion.div
              className="h-3 w-12 bg-gray-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
          
          <div className="flex items-center justify-between gap-4">
            {/* Last Message Line */}
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
        </div>
      </motion.div>

      {/* Full Width Separator - Matches real list */}
      <div className="mx-4 border-b-[1.5px] border-gray-200/80 last:hidden" />
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      {Array.from({ length: itemCount }).map((_, i) => (
        <ShimmerRow key={i} index={i} />
      ))}
    </div>
  );
};

export default MessageItemShimmer;
