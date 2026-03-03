import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const TransactionRowShimmer = ({ className = "", index = 0 }: { className?: string; index?: number }) => {
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

  const rowVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    },
  };

  const shimmerStyle = (bg = '#f3f4f6', shimmer = 'rgba(255,255,255,0.7)') => ({
    background: `linear-gradient(90deg, ${bg} 25%, ${shimmer} 50%, ${bg} 75%)`,
    backgroundSize: '200% 100%',
  });

  return (
    <motion.div
      variants={rowVariants}
      initial="initial"
      animate="animate"
      className={`flex items-center gap-3 md:gap-4 py-4 md:py-5 px-1 md:px-4 ${className}`}
    >
      {/* Column 1: Icon Shimmer */}
      <div className="relative shrink-0">
        <motion.div
          className="w-10 h-10 md:w-12 md:h-12 rounded-2xl ring-4 ring-slate-50/30 border border-slate-100"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={shimmerStyle('#e5e7eb', 'rgba(255,255,255,0.8)')}
        />
      </div>

      {/* Column 2: Basic Info (Left) Shimmer */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <motion.div
          className="h-4.5 w-40 md:w-48 rounded-lg"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={shimmerStyle('#e5e7eb', 'rgba(255,255,255,0.8)')}
        />
        <motion.div
          className="h-3 w-24 md:w-32 rounded-lg"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={shimmerStyle('#f3f4f6', 'rgba(255,255,255,0.6)')}
        />
        {/* Mobile Balance Shimmer */}
        <motion.div
          className="flex md:hidden h-2.5 w-20 rounded-lg opacity-60"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={shimmerStyle('#f3f4f6', 'rgba(255,255,255,0.5)')}
        />
      </div>

      {/* Column 3: Balance After Shimmer (Desktop Only) */}
      <div className="hidden lg:flex shrink-0 w-[220px] justify-end pt-8 whitespace-nowrap ml-4">
        <motion.div
          className="h-3.5 w-32 rounded-lg opacity-60"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={shimmerStyle('#f3f4f6', 'rgba(255,255,255,0.5)')}
        />
      </div>

      {/* Column 4: Amount & Status Shimmer (Right Aligned) */}
      <div className="text-right flex flex-col justify-end shrink-0 min-w-[120px] ml-12">
        <motion.div
          className="h-5 w-24 rounded-lg mb-2 ml-auto"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={shimmerStyle('#e5e7eb', 'rgba(255,255,255,0.8)')}
        />
        <motion.div
          className="h-3 w-16 rounded-lg ml-auto"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={shimmerStyle('#f3f4f6', 'rgba(255,255,255,0.6)')}
        />
      </div>
    </motion.div>
  );
};
