import { motion } from "@repo/ui/motion";

export default function OrderDetailDrawerShimmer() {
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
    <div className="flex h-full items-start overflow-hidden pt-8">
      {/* Left Column */}
      <div className="w-[65%] flex-shrink-0 space-y-6 h-full overflow-y-auto p-2 px-4 pl-16">
        <div className="flex gap-6 items-start">
          {/* Restaurant Info Shimmer */}
          <div className="flex flex-col gap-4 w-[240px] flex-shrink-0">
            <div className="bg-white rounded-[32px] p-5 border border-gray-100 h-[300px] flex flex-col items-center">
              <motion.div
                className="w-20 h-20 rounded-full bg-gray-100 mb-4"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
              <motion.div
                className="h-5 w-3/4 bg-gray-200 rounded mb-2"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
              <motion.div
                className="h-3 w-1/2 bg-gray-100 rounded mb-6"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
              <div className="w-full mt-auto space-y-2">
                <motion.div
                  className="h-3 w-full bg-gray-100 rounded"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                    backgroundSize: '200% 100%',
                  }}
                />
                <motion.div
                  className="h-3 w-full bg-gray-100 rounded"
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
          </div>

          {/* Items List Shimmer */}
          <div className="flex-1 rounded-[24px] p-8 border-2 border-gray-100 bg-white h-[500px]">
            <motion.div
              className="h-6 w-32 bg-gray-200 rounded mb-6"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
              }}
            />

            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gray-100"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    style={{
                      background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                      backgroundSize: '200% 100%',
                    }}
                  />
                  <div className="flex-1 space-y-2">
                    <motion.div
                      className="h-4 w-1/2 bg-gray-200 rounded"
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      style={{
                        background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                        backgroundSize: '200% 100%',
                      }}
                    />
                    <motion.div
                      className="h-3 w-1/3 bg-gray-100 rounded"
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
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
              <motion.div className="h-4 w-full bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
              <motion.div className="h-4 w-full bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
              <motion.div className="h-8 w-full bg-gray-200 rounded mt-4" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 space-y-6 h-full p-2 pl-4 pr-20">
        {/* Driver Shimmer */}
        <div className="bg-white rounded-[32px] p-6 border border-gray-100 h-[120px] flex items-center gap-4">
          <motion.div className="w-16 h-16 rounded-full bg-gray-200" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
          <div className="flex-1 space-y-2">
            <motion.div className="h-4 w-3/4 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
            <motion.div className="h-3 w-1/2 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
          </div>
        </div>

        {/* Route Shimmer */}
        <div className="rounded-[24px] p-8 border-2 border-gray-100 bg-white h-[200px] flex flex-col justify-center gap-4">
          <div className="flex gap-4">
            <motion.div className="w-8 h-8 rounded-full bg-gray-200" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
            <div className="flex-1 space-y-2">
              <motion.div className="h-4 w-1/3 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
              <motion.div className="h-3 w-3/4 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
            </div>
          </div>
          <motion.div className="w-0.5 h-8 bg-gray-100 ml-4" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(180deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '100% 200%' }} />
          <div className="flex gap-4">
            <motion.div className="w-8 h-8 rounded-full bg-gray-200" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
            <div className="flex-1 space-y-2">
              <motion.div className="h-4 w-1/3 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
              <motion.div className="h-3 w-3/4 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
