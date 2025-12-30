import { motion } from "@repo/ui/motion";

export default function RestaurantMenuShimmer() {
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
    <div className="h-screen flex flex-col bg-[#F7F7F7] overflow-hidden">
      {/* Top Header Shimmer */}
      <div className="px-8 pt-8 pb-4 bg-white/50 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 shadow-sm shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-3">
            <motion.div className="h-10 w-64 bg-gray-200 rounded-lg" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
            <motion.div className="h-4 w-48 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <motion.div className="h-10 w-64 bg-white border border-gray-200 rounded-xl" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #fff 25%, #f9fafb 50%, #fff 75%)', backgroundSize: '200% 100%' }} />
            {/* Buttons */}
            <motion.div className="h-10 w-32 bg-white border border-gray-200 rounded-xl" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #fff 25%, #f9fafb 50%, #fff 75%)', backgroundSize: '200% 100%' }} />
            <motion.div className="h-10 w-40 bg-[var(--primary)]/20 rounded-xl" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, rgba(var(--primary), 0.1) 25%, rgba(var(--primary), 0.2) 50%, rgba(var(--primary), 0.1) 75%)', backgroundSize: '200% 100%' }} />
          </div>
        </div>

        {/* Category Tabs Shimmer */}
        <div className="flex items-center gap-2 overflow-hidden pb-1 pl-1">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <motion.div
              key={i}
              className="h-9 w-24 bg-gray-100 rounded-xl shrink-0"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, #fff 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Shimmer */}
      <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-[#F7F7F7]">
        {[1, 2].map(section => (
          <div key={section} className="space-y-6">
            <div className="flex items-center gap-4">
              <motion.div className="h-8 w-32 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
              <div className="h-px flex-1 bg-gray-200" />
              <motion.div className="h-6 w-20 bg-white rounded-lg border border-gray-200" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #fff 25%, #f9fafb 50%, #fff 75%)', backgroundSize: '200% 100%' }} />
            </div>

            <div className="grid grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(card => (
                <div key={card} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
                  {/* Image Shimmer */}
                  <div className="aspect-[4/3] relative bg-gray-100">
                    <motion.div className="absolute inset-0" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                  </div>
                  {/* Content Shimmer */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col">
                    <div className="space-y-2">
                      <motion.div className="h-6 w-3/4 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                      <motion.div className="h-4 w-1/2 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <motion.div className="h-3 w-full bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, #fff 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                      <motion.div className="h-3 w-2/3 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, #fff 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <motion.div className="h-6 w-24 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                      <motion.div className="h-5 w-16 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, #fff 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
