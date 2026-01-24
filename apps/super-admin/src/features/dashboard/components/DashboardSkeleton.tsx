'use client';

import { motion } from "@repo/ui/motion";
import { TextShimmer, TransactionCardShimmer } from "@repo/ui";

export function DashboardSkeleton() {
  // Shimmer animation variants (following the repo style)
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

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-3">
            <TextShimmer width={300} height={32} rounded="lg" />
            <TextShimmer width={400} height={18} rounded="md" />
          </div>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="h-10 w-24 bg-gray-200 rounded-full overflow-hidden relative"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Left Column Skeleton */}
          <div className="space-y-6 xl:col-span-1">
            {/* Metric Card Stack Skeleton */}
            <div className="relative h-[220px]">
              <motion.div
                className="absolute inset-0 bg-gray-200 rounded-[32px] overflow-hidden shadow-lg"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                  backgroundSize: '200% 100%',
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </motion.div>
            </div>

            {/* Order Goal Card Skeleton */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden">
              <TextShimmer width={120} height={16} className="mb-6" />
              <div className="space-y-4">
                <div className="h-10 w-full bg-gray-100 rounded-xl relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                </div>
                <div className="flex justify-between">
                  <TextShimmer width={60} height={12} />
                  <TextShimmer width={40} height={12} />
                </div>
              </div>
            </div>

            {/* Order Trend Chart Skeleton */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-[280px]">
              <TextShimmer width={150} height={20} className="mb-8" />
              <div className="flex items-end justify-between h-[150px] gap-2">
                {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden"
                    style={{ height: `${h}%` }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-transparent via-white/40 to-transparent"
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="xl:col-span-2 space-y-8">
            {/* Overview Chart Skeleton */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 h-[380px]">
              <div className="flex justify-between mb-10">
                <TextShimmer width={200} height={24} />
                <div className="flex gap-2">
                  <TextShimmer width={60} height={24} rounded="full" />
                  <TextShimmer width={60} height={24} rounded="full" />
                </div>
              </div>
              <div className="h-[220px] w-full bg-gray-50 rounded-2xl relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
            </div>

            {/* Top Restaurants Skeleton */}
            <div className="space-y-4">
              <TextShimmer width={180} height={24} className="ml-2" />
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="min-w-[300px] h-[100px] bg-white rounded-[24px] shadow-sm border border-gray-100 p-4 flex gap-4 overflow-hidden relative"
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 shrink-0 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        variants={shimmerVariants}
                        initial="initial"
                        animate="animate"
                      />
                    </div>
                    <div className="flex-1 pt-1 space-y-2">
                      <TextShimmer width="80%" height={16} />
                      <TextShimmer width="40%" height={12} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activities Skeleton */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
              <TextShimmer width={220} height={24} className="mb-2" />
              <TransactionCardShimmer cardCount={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
