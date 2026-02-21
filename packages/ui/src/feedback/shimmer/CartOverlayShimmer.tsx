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

  const shimmerStyle = {
    background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
  };

  const primaryShimmerStyle = {
    background: 'linear-gradient(90deg, #78C841 25%, rgba(255,255,255,0.8) 50%, #78C841 75%)',
    backgroundSize: '200% 100%',
    opacity: 0.1
  };

  const darkShimmerStyle = {
    background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
    backgroundSize: '200% 100%',
  };

  return (
    <div className="relative w-full h-[150px] flex flex-row overflow-hidden rounded-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border-2 border-transparent bg-white">
      {/* Left Shimmer: Image Section */}
      <div className="relative w-32 md:w-36 h-full flex-shrink-0 bg-gray-50 overflow-hidden">
        <motion.div
          className="h-full w-full"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={shimmerStyle}
        />
        {/* Floating badge shimmer */}
        <div className="absolute top-3 left-3 w-10 h-4 bg-gray-200/50 rounded-lg backdrop-blur-md" />
      </div>

      {/* Right Shimmer: Content Section */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <motion.div
              className="h-5 w-3/4 bg-gray-200 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={darkShimmerStyle}
            />
          </div>
          <div className="space-y-2">
            <motion.div
              className="h-3 w-full bg-gray-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={shimmerStyle}
            />
            <motion.div
              className="h-3 w-2/3 bg-gray-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={shimmerStyle}
            />
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-gray-50 pt-3">
          <div className="space-y-1.5">
            <div className="w-10 h-2 bg-gray-100 rounded" />
            <motion.div
              className="h-6 w-24 bg-gray-200 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={darkShimmerStyle}
            />
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
