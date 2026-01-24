'use client';

import { motion } from '@repo/ui/motion';
import { TextShimmer } from '@repo/ui';

export function ConfigSkeleton() {
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

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <TextShimmer width={300} height={36} rounded="lg" />
          <TextShimmer width={500} height={18} rounded="md" />
        </div>
        <div className="h-14 w-40 bg-gray-200 rounded-2xl relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>
      </div>

      {/* Group Skeletons */}
      {[1, 2].map((group) => (
        <div key={group} className="bg-white rounded-[40px] border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gray-100" />
              <div className="h-6 w-48 bg-gray-100 rounded-lg" />
            </div>
            <div className="h-6 w-20 bg-gray-800 rounded-full" />
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-50 rounded-[28px] p-6 space-y-4">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-5 w-40 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-between items-end pt-4">
                  <div className="space-y-1">
                    <div className="h-3 w-12 bg-gray-200 rounded" />
                    <div className="h-8 w-24 bg-gray-300 rounded" />
                  </div>
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
