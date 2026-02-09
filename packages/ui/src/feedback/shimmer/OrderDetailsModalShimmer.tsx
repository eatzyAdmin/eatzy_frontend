import React from 'react';
import { motion } from 'framer-motion';

/**
 * Shimmer loading content for OrderDetailsModal
 * This component renders ONLY the content shimmer (header + body)
 * to be used INSIDE the modal wrapper, not as a standalone modal
 */
const OrderDetailsModalShimmer = () => {
  // Shimmer animation variants - Identical to OrderHistoryCardShimmer
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

  // Reusable shimmer block component
  const ShimmerBlock = ({ className }: { className?: string }) => (
    <motion.div
      className={`bg-gray-200 rounded ${className}`}
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      style={{
        background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
        backgroundSize: '200% 100%',
      }}
    />
  );

  // Lighter shimmer for secondary elements
  const ShimmerBlockLight = ({ className }: { className?: string }) => (
    <motion.div
      className={`bg-gray-100 rounded ${className}`}
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      style={{
        background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
        backgroundSize: '200% 100%',
      }}
    />
  );

  return (
    <>
      {/* Header Shimmer */}
      <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm/50">
        <div>
          <ShimmerBlock className="h-7 w-44 rounded-lg mb-2" />
          <div className="flex items-center gap-2">
            <ShimmerBlockLight className="h-4 w-8 rounded" />
            <ShimmerBlock className="h-5 w-16 rounded" />
            <div className="w-px h-4 bg-gray-200" />
            <ShimmerBlockLight className="h-4 w-32 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShimmerBlock className="h-8 w-24 rounded-full" />
          <div className="w-12 h-12 rounded-full bg-gray-100" />
        </div>
      </div>

      {/* Scrollable Content Shimmer */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar pb-10">

        {/* Info Cards Grid - Customer & Driver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Customer Card */}
          <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <ShimmerBlock className="w-10 h-10 rounded-2xl" />
              <div>
                <ShimmerBlockLight className="h-3 w-16 rounded mb-1.5" />
                <ShimmerBlock className="h-4 w-28 rounded" />
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full mb-3" />

            <div className="mt-auto">
              <ShimmerBlockLight className="h-2.5 w-12 rounded mb-1" />
              <ShimmerBlock className="h-3.5 w-24 rounded" />
            </div>
          </div>

          {/* Driver Card */}
          <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <ShimmerBlock className="w-10 h-10 rounded-2xl" />
                <div>
                  <ShimmerBlockLight className="h-3 w-12 rounded mb-1.5" />
                  <ShimmerBlock className="h-4 w-32 rounded" />
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full mb-3" />

              <div className="flex items-center mt-auto">
                <div className="flex-1 pr-4">
                  <ShimmerBlockLight className="h-2.5 w-14 rounded mb-1" />
                  <ShimmerBlock className="h-3.5 w-20 rounded mb-0.5" />
                  <ShimmerBlockLight className="h-2.5 w-16 rounded" />
                </div>

                <div className="w-px h-8 bg-gray-100" />

                <div className="flex-1 pl-4">
                  <ShimmerBlockLight className="h-2.5 w-12 rounded mb-1" />
                  <ShimmerBlock className="h-3.5 w-24 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Route */}
        <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <ShimmerBlock className="h-4 w-28 rounded" />
          </div>
          <div className="p-5 flex gap-4">
            {/* Left Timeline Column */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shadow-sm flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              </div>
              <div className="w-0.5 flex-grow border-l-2 border-dotted border-gray-200 my-1" />
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shadow-sm flex-shrink-0">
                <div className="w-4 h-4 bg-gray-300 rounded" />
              </div>
            </div>

            {/* Right Content Column */}
            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div className="pb-6">
                <ShimmerBlockLight className="h-3 w-16 rounded mb-1.5" />
                <ShimmerBlock className="h-4 w-40 rounded mb-1" />
                <ShimmerBlockLight className="h-3 w-full max-w-xs rounded" />
              </div>

              <div>
                <ShimmerBlockLight className="h-3 w-16 rounded mb-1.5" />
                <ShimmerBlock className="h-4 w-52 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Safety Banner */}
        <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100/50 p-4 rounded-[24px] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <div className="w-4 h-4 bg-gray-200 rounded" />
          </div>
          <ShimmerBlockLight className="h-3 flex-1 rounded" />
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <ShimmerBlock className="h-4 w-24 rounded" />
            </div>
            <ShimmerBlock className="h-6 w-16 rounded-lg" />
          </div>

          <div className="p-2">
            {/* Order Items - 3 shimmer rows */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-[20px]">
                <div className="flex items-center gap-4">
                  <ShimmerBlock className="w-10 h-10 rounded-[14px]" />
                  <div>
                    <ShimmerBlock className="h-4 w-32 rounded mb-1" />
                    <ShimmerBlockLight className="h-3 w-20 rounded" />
                  </div>
                </div>
                <ShimmerBlock className="h-4 w-20 rounded" />
              </div>
            ))}
          </div>

          {/* Bill Summary */}
          <div className="bg-gray-50/50 p-6 space-y-3 border-t border-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <ShimmerBlockLight className="h-3.5 w-24 rounded" />
                <ShimmerBlock className="h-3.5 w-20 rounded" />
              </div>
            ))}

            <div className="h-px bg-gray-200 my-4" />

            <div className="flex justify-between items-center">
              <div>
                <ShimmerBlock className="h-4 w-28 rounded mb-1" />
                <ShimmerBlockLight className="h-3 w-20 rounded" />
              </div>
              <ShimmerBlock className="h-8 w-32 rounded" />
            </div>
          </div>
        </div>

        {/* Profit Info */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <ShimmerBlock className="h-4 w-32 rounded" />
          </div>

          <div className="p-6 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <ShimmerBlockLight className="h-3.5 w-36 rounded" />
                <ShimmerBlock className="h-3.5 w-24 rounded" />
              </div>
            ))}

            <div className="h-px bg-gray-100 my-2" />

            <div className="flex justify-between items-center">
              <ShimmerBlock className="h-4 w-24 rounded" />
              <ShimmerBlock className="h-7 w-28 rounded" />
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default OrderDetailsModalShimmer;
