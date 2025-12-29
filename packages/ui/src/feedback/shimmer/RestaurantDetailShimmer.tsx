import { motion } from "@repo/ui/motion";
import { ChefHat, Star } from "@repo/ui/icons";

export default function RestaurantDetailShimmer() {
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
    <div className="flex-1 overflow-hidden h-full">
      <div className="max-w-[1400px] mx-auto pr-16 px-8 pt-20 h-full">
        <div className="grid grid-cols-[30%_70%] gap-8 h-full">
          {/* Left Column Shimmer */}
          <div className="relative overflow-y-auto no-scrollbar pr-2 space-y-6 mb-12">
            {/* Title */}
            <motion.div
              className="h-16 w-3/4 bg-gray-200 rounded-lg mb-4"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            {/* Description lines */}
            <div className="space-y-2 mb-4">
              <motion.div className="h-4 w-full bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
              <motion.div className="h-4 w-5/6 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3].map(i => (
                <motion.div key={i} className="h-6 w-16 bg-gray-100 rounded-full" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
              ))}
            </div>

            {/* Address */}
            <motion.div className="h-4 w-2/3 bg-gray-100 rounded mb-4" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />

            {/* Rating */}
            <motion.div className="h-10 w-32 bg-gray-100 rounded-full mb-6" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />

            {/* Small Illustration (Left) */}
            <motion.div
              className="rounded-[24px] aspect-[16/11] bg-gray-200 w-full"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
              }}
            />

            {/* Vouchers */}
            <div className="mt-6 space-y-3">
              <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
              {[1, 2].map(i => (
                <motion.div key={i} className="h-20 w-full bg-white border border-gray-100 rounded-[14px]" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #fff 25%, #f9fafb 50%, #fff 75%)', backgroundSize: '200% 100%' }} />
              ))}
            </div>
          </div>

          {/* Right Column Shimmer */}
          <div className="relative overflow-y-auto no-scrollbar pl-2 mb-12">
            {/* Main Hero Image Shimmer - Detailed */}
            <div className="relative mb-6">
              <div className="aspect-[16/8] rounded-[24px] bg-gray-50 border border-gray-100 relative overflow-hidden flex items-center justify-center">
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

                {/* Decorative Elements */}
                <div className="absolute top-[-20%] left-[-10%] w-64 h-64 rounded-full bg-gray-100/50 blur-3xl" />
                <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 rounded-full bg-gray-100/50 blur-3xl" />

                {/* Center Hero Icon */}
                <div className="relative z-10 flex flex-col items-center gap-4 opacity-10">
                  <ChefHat className="w-24 h-24 text-gray-900" strokeWidth={1} />
                </div>

                {/* "Save" Button Placeholder */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm h-10 w-48 rounded-[12px] flex items-center gap-3 px-4 border border-gray-100/50">
                  <div className="w-5 h-5 rounded-full bg-gray-200" />
                  <div className="h-2.5 flex-1 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>

            {/* Category Tabs Shimmer */}
            <div className="mb-6 flex gap-8 py-4 border-b-2 border-gray-200">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  className="h-8 w-24 bg-gray-200 rounded"
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

            {/* Menu Grid Shimmer */}
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-4">
                <motion.div className="h-8 w-40 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                <motion.div className="h-6 w-16 bg-gray-100 rounded-full" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
              </div>

              <div className="grid grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm h-[320px] flex flex-col">
                    <motion.div
                      className="aspect-[4/3] bg-gray-200"
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      style={{
                        background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                        backgroundSize: '200% 100%',
                      }}
                    />
                    <div className="p-5 flex-1 flex flex-col">
                      <motion.div className="h-5 w-3/4 bg-gray-200 rounded mb-2" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                      <motion.div className="h-3 w-full bg-gray-100 rounded mb-4" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                      <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between">
                        <motion.div className="h-6 w-20 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                        <motion.div className="h-5 w-16 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
