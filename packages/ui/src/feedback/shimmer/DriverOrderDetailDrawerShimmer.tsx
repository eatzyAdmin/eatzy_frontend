import { motion } from "@repo/ui/motion";

export default function DriverOrderDetailDrawerShimmer() {
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
    <div className="flex flex-col h-full">
      {/* Header Shimmer */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="space-y-2">
          <motion.div className="h-8 w-48 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
          <motion.div className="h-4 w-32 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
        </div>
        <div className="p-2 bg-gray-100 rounded-full w-9 h-9" />
      </div>

      {/* Content Shimmer */}
      <div className="overflow-y-auto p-6 space-y-8 pb-32">
        {/* Stats Row Shimmer */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 border-r border-gray-200 last:border-0 border-dashed">
              <motion.div className="h-3 w-16 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
              <motion.div className="h-6 w-20 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
            </div>
          ))}
        </div>

        {/* Route Card Shimmer */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border-2 border-gray-200">
          <motion.div className="h-6 w-40 bg-gray-200 rounded mb-6" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
          <div className="space-y-6 pl-2">
            <div className="flex gap-4">
              <div className="w-3 h-3 rounded-full bg-gray-200 mt-1" />
              <div className="space-y-2 flex-1">
                <motion.div className="h-3 w-16 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                <motion.div className="h-4 w-3/4 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                <motion.div className="h-3 w-1/2 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-3 h-3 rounded-full bg-gray-200 mt-1" />
              <div className="space-y-2 flex-1">
                <motion.div className="h-3 w-16 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                <motion.div className="h-4 w-3/4 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                <motion.div className="h-3 w-1/2 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Shimmer */}
        <div className="p-5 border-2 border-gray-200 rounded-[24px]">
          <motion.div className="h-6 w-32 bg-gray-200 rounded mb-4" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
          <div className="bg-gray-50 p-4 space-y-4 rounded-xl">
            {[1, 2].map(i => (
              <div key={i} className="flex justify-between">
                <div className="flex gap-3 w-full">
                  <motion.div className="h-4 w-6 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                  <motion.div className="h-4 w-1/2 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                </div>
                <motion.div className="h-4 w-16 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
              </div>
            ))}
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between">
              <motion.div className="h-4 w-32 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
              <motion.div className="h-5 w-24 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
