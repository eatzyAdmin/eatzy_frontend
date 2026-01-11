import { motion } from "@repo/ui/motion";

export default function CheckoutShimmer() {
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
    <div className="h-screen flex flex-col bg-[#F7F7F7]">
      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:pr-16 md:px-8 pt-20 md:pt-12 h-full">
          <div className="flex flex-col md:grid md:grid-cols-[65%_35%] gap-8 h-full">
            {/* Left Column Shimmer */}
            <div className="relative overflow-y-auto no-scrollbar pr-0 md:pr-2 space-y-6 mb-20 md:mb-6">
              {/* Tabs Shimmer */}
              <div className="bg-[#F7F7F7] pt-2 mb-4 border-b-2 border-gray-200 pb-4 flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
                {[1, 2, 3, 4, 5, 6].map(i => (
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

              {/* Main Form Container Shimmer */}
              <div className="rounded-xl mx-0 md:rounded-[28px] md:mx-2 border-2 border-gray-200 bg-white overflow-hidden">
                {/* Address Section */}
                <div className="p-6 border-b-2 border-gray-100 space-y-3">
                  <motion.div className="h-6 w-32 bg-gray-200 rounded mb-2" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                  <motion.div className="h-12 w-full bg-gray-100 rounded-xl" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                </div>

                {/* Notes Section */}
                <div className="p-6 border-b-2 border-gray-100 space-y-3">
                  <motion.div className="h-6 w-24 bg-gray-200 rounded mb-2" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                  <motion.div className="h-10 w-full bg-gray-100 rounded-xl" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                </div>

                {/* Order List Section */}
                <div className="p-6 border-b-2 border-gray-100 space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="flex gap-4">
                      <motion.div className="w-16 h-16 rounded-xl bg-gray-200" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                      <div className="flex-1 space-y-2 py-1">
                        <motion.div className="h-4 w-1/2 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                        <motion.div className="h-4 w-1/3 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Method Section */}
                <div className="p-6 border-b-2 border-gray-100">
                  <motion.div className="h-6 w-40 bg-gray-200 rounded mb-4" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                  <div className="flex gap-4">
                    {[1, 2, 3].map(i => (
                      <motion.div key={i} className="h-16 w-32 bg-gray-100 rounded-xl" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                    ))}
                  </div>
                </div>

                {/* Promo & Summary Grid */}
                <div className="flex flex-col md:grid md:grid-cols-10 p-6 gap-6 items-stretch">
                  <div className="col-span-6 p-4 border border-dashed border-gray-200 rounded-2xl">
                    <motion.div className="h-5 w-24 bg-gray-200 rounded mb-4" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                    <div className="space-y-3">
                      {[1, 2].map(i => (
                        <motion.div key={i} className="h-16 w-full bg-gray-50 rounded-xl" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f9fafb 25%, #fff 50%, #f9fafb 75%)', backgroundSize: '200% 100%' }} />
                      ))}
                    </div>
                  </div>
                  <div className="col-span-4 p-4 border border-gray-200 rounded-2xl flex flex-col justify-between">
                    <div className="space-y-3">
                      <motion.div className="h-4 w-full bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                      <motion.div className="h-4 w-full bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                    </div>
                    <motion.div className="h-8 w-full bg-gray-200 rounded mt-4" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar Shimmer */}
            <div className="hidden md:flex rounded-[28px] border border-gray-200 bg-white p-6 h-fit min-h-[500px] flex-col">
              <motion.div className="h-8 w-3/4 bg-gray-200 rounded mb-6" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
              <motion.div className="h-48 w-full bg-gray-100 rounded-2xl mb-6" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />

              <div className="space-y-4 mt-auto">
                <motion.div className="h-12 w-full bg-gray-200 rounded-xl" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                <motion.div className="h-4 w-2/3 bg-gray-100 rounded mx-auto" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
