import { motion } from "@repo/ui/motion";

export default function CartOverlayShimmer() {
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
    <div className="relative bg-white rounded-3xl p-4 shadow-sm border-4 border-gray-100">
      <div className="flex items-center gap-4">
        {/* Restaurant Image */}
        <div className="relative flex-shrink-0">
          <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-gray-100 border-4 border-gray-200">
            <motion.div
              className="h-full w-full bg-gray-200"
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

        {/* Content */}
        <div className="flex-1 min-w-0 py-1 space-y-2">
          <div className="flex items-start justify-between">
            <motion.div
              className="h-5 w-32 bg-gray-200 rounded"
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
            className="h-3 w-48 bg-gray-100 rounded"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
              backgroundSize: '200% 100%',
            }}
          />
          <div className="flex items-end justify-between pt-1">
            <motion.div
              className="h-6 w-16 bg-gray-100 rounded-lg"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            <motion.div
              className="h-6 w-24 bg-gray-200 rounded"
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
