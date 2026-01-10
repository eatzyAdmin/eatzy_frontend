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
      <div className="max-w-[1400px] mx-auto md:pr-16 md:px-8 px-0 pt-0 md:pt-20 h-full">
        {/* Mobile Hero Shimmer Background */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[150px] bg-gray-200 md:hidden z-0"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
          }}
        />

        <div className="flex flex-col md:grid md:grid-cols-[30%_70%] gap-8 h-full bg-white md:bg-transparent pb-32 md:pb-0">
          {/* Left Column Shimmer */}
          <div className="relative md:overflow-y-auto no-scrollbar md:pr-2 space-y-6 mb-0 md:mb-12 shrink-0 px-4 pt-[60px] md:px-0 md:pt-0">
            <div className="flex gap-4 items-start md:block">
              {/* Mobile Image Shimmer */}
              <motion.div
                className="shrink-0 w-[120px] h-[120px] rounded-[20px] bg-gray-200 md:hidden"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                  backgroundSize: '200% 100%',
                }}
              />

              <div className="flex-1 min-w-0">
                {/* Title */}
                <motion.div
                  className="h-8 md:h-16 w-3/4 bg-gray-200 rounded-lg mb-3 md:mb-4"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                    backgroundSize: '200% 100%',
                  }}
                />

                {/* Tags */}
                <div className="flex gap-2 mb-3 md:mb-4">
                  {[1, 2, 3].map(i => (
                    <motion.div key={i} className="h-5 md:h-6 w-12 md:w-16 bg-gray-100 rounded-full" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                  ))}
                </div>

                {/* Description lines */}
                <div className="space-y-2 mb-4">
                  <motion.div className="h-4 w-full bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                  <motion.div className="h-4 w-5/6 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                </div>
              </div>
            </div>

            {/* Address */}
            <motion.div className="h-4 w-2/3 bg-gray-100 rounded mb-4 hidden md:block" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />

            {/* Rating */}
            <motion.div className="h-10 w-32 bg-gray-100 rounded-full mb-6 hidden md:block" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />

            {/* Small Illustration (Left) */}
            <motion.div
              className="rounded-[24px] aspect-[16/11] bg-gray-200 w-full hidden md:block"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
              }}
            />

            {/* Vouchers */}
            <div className="mt-6 space-y-3 hidden md:block">
              <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
              {[1, 2].map(i => (
                <motion.div key={i} className="h-20 w-full bg-white border border-gray-100 rounded-[14px]" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #fff 25%, #f9fafb 50%, #fff 75%)', backgroundSize: '200% 100%' }} />
              ))}
            </div>
          </div>

          {/* Right Column Shimmer */}
          <div className="relative overflow-y-visible md:overflow-y-auto no-scrollbar pl-0 md:pl-2 mb-12 px-4 md:px-0">
            {/* Main Hero Image Shimmer - Detailed - Desktop Only */}
            <div className="relative mb-6 hidden md:block">
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
              </div>
            </div>

            {/* Category Tabs Shimmer */}
            <div className="mb-6 flex gap-4 md:gap-8 py-4 border-b-2 border-gray-200 overflow-x-hidden">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  className="h-8 w-20 md:w-24 bg-gray-200 rounded shrink-0"
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
                <motion.div className="h-6 md:h-8 w-32 md:w-40 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                <motion.div className="h-6 w-16 bg-gray-100 rounded-full" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-[16px] md:rounded-[24px] overflow-hidden border border-gray-100 shadow-sm h-[260px] md:h-[320px] flex flex-col">
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
                    <div className="p-3 md:p-5 flex-1 flex flex-col">
                      <motion.div className="h-4 md:h-5 w-3/4 bg-gray-200 rounded mb-2" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                      <motion.div className="h-3 w-full bg-gray-100 rounded mb-4" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                      <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between">
                        <motion.div className="h-5 md:h-6 w-16 md:w-20 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                        <motion.div className="h-4 md:h-5 w-12 md:w-16 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
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
