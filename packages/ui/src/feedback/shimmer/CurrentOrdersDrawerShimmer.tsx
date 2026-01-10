import { motion } from "@repo/ui/motion";

export default function CurrentOrdersDrawerShimmer() {
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
    <div className="flex flex-col md:grid md:grid-cols-[20%_40%_40%] h-full md:h-[calc(88vh-72px)] overflow-hidden">
      {/* Column 1: List */}
      <div className="order-1 md:order-none w-full md:w-auto h-auto md:h-full overflow-x-auto md:overflow-y-auto flex md:flex-col border-b md:border-b-0 md:border-r border-gray-100 p-4 space-x-4 md:space-x-0 md:space-y-4 no-scrollbar flex-shrink-0 bg-white">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[300px] md:min-w-0 w-full md:w-auto flex-shrink-0 flex flex-col gap-2 p-4 border rounded-xl border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-7 h-7 rounded-full bg-gray-200"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                    backgroundSize: '200% 100%',
                  }}
                />
                <motion.div
                  className="h-4 w-20 bg-gray-200 rounded"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                    backgroundSize: '200% 100%',
                  }}
                />
              </div>
              <motion.div
                className="h-4 w-12 bg-gray-100 rounded-full"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>
            <motion.div
              className="h-3 w-32 bg-gray-100 rounded ml-1"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            <motion.div
              className="h-3 w-24 bg-gray-100 rounded ml-1"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Column 2: Map Shimmer */}
      <div className="order-2 md:order-none relative h-[30vh] md:h-full w-full flex-shrink-0 bg-[#f2f4f6] border-r border-gray-100 flex items-center justify-center overflow-hidden">
        {/* Abstract Map Background Elements */}
        <div className="absolute inset-0">
          {/* Parks */}
          <div className="absolute top-[15%] left-[10%] w-32 h-24 bg-green-100/60 rounded-xl transform -rotate-6" />
          <div className="absolute bottom-[20%] right-[15%] w-40 h-32 bg-green-100/60 rounded-2xl transform rotate-12" />

          {/* Water */}
          <div className="absolute top-[40%] right-[-10%] w-64 h-64 bg-blue-100/40 rounded-full blur-2xl" />

          {/* Roads Grid */}
          <div className="absolute inset-0 opacity-50">
            {/* Horizontal Roads */}
            <div className="absolute top-[30%] left-0 right-0 h-3 bg-white border-y border-gray-200" />
            <div className="absolute top-[60%] left-0 right-0 h-4 bg-white border-y border-gray-200" />

            {/* Vertical Roads */}
            <div className="absolute top-0 bottom-0 left-[40%] w-3 bg-white border-x border-gray-200" />
            <div className="absolute top-0 bottom-0 right-[35%] w-4 bg-white border-x border-gray-200" />

            {/* Diagonal Highway */}
            <div className="absolute top-[20%] left-[-20%] w-[150%] h-6 bg-white border-y border-gray-200 transform rotate-[25deg] origin-left" />
          </div>
        </div>

        {/* Route Line (Abstract) */}
        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40">
          <path d="M 180 300 Q 300 200 450 250" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="8 8" />
        </svg>

        {/* Animated Markers */}
        <div className="absolute inset-0 z-10">
          {/* Restaurant Marker (Orange) */}
          <div className="absolute top-[30%] left-[38%] transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="relative w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center z-20"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-7 h-7 rounded-lg bg-orange-100"
                style={{
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)'
                }}
              />
            </motion.div>
            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/10 rounded-full blur-[1px]" />
          </div>

          {/* User Marker (Blue) */}
          <div className="absolute top-[55%] right-[33%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-5 h-5 bg-blue-500 border-2 border-white rounded-full shadow-md z-20 relative" />
              <motion.div
                className="absolute inset-0 bg-blue-500 rounded-full z-10 opacity-40"
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </div>

        {/* Overlay Shimmer for dynamic feel */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      {/* Column 3: Details */}
      <div className="order-3 md:order-none relative flex-1 overflow-y-auto px-4 py-6 md:px-12 md:py-4 bg-white border-l border-gray-100 pb-20 md:pb-4">
        {/* Steps */}
        <div className="flex justify-between mb-8 overflow-hidden pt-2">
          {[1, 2, 3, 4, 5].map(step => (
            <div key={step} className="flex flex-col items-center gap-2">
              <motion.div
                className="w-10 h-10 rounded-full bg-gray-100"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
              <motion.div
                className="w-12 h-2 bg-gray-100 rounded"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-2 border-2 border-gray-100 p-6 rounded-[24px]">
          <motion.div
            className="h-5 w-40 bg-gray-200 rounded mb-6"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
              backgroundSize: '200% 100%',
            }}
          />

          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-start gap-3">
                <motion.div
                  className="w-8 h-8 rounded-full bg-gray-200"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                    backgroundSize: '200% 100%',
                  }}
                />
                <div className="flex-1 space-y-2">
                  <motion.div
                    className="h-4 w-3/4 bg-gray-200 rounded"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    style={{
                      background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
                      backgroundSize: '200% 100%',
                    }}
                  />
                  <motion.div
                    className="h-4 w-1/4 bg-gray-100 rounded ml-auto"
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

          <div className="my-6 h-px bg-gray-100" />

          <div className="space-y-2">
            <motion.div
              className="h-4 w-full bg-gray-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            <motion.div
              className="h-8 w-full bg-gray-200 rounded mt-4"
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
      </div>
    </div>
  );
}
