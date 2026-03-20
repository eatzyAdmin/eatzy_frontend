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

  const darkShimmerStyle = {
    background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
    backgroundSize: '200% 100%',
  };

  return (
    <div className="relative w-full h-[140px] flex flex-row overflow-hidden rounded-[40px] bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
      {/* Left Shimmer: Image Section */}
      <div className="relative w-36 md:w-32 h-full flex-shrink-0 bg-gray-50 overflow-hidden">
        <motion.div
          className="h-full w-full"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={shimmerStyle}
        />

        {/* Badge shimmer */}
        <div className="absolute top-3 left-3 z-10">
          <div className="w-[60px] h-6 bg-white/95 rounded-full shadow-sm border border-gray-100 flex items-center justify-center">
            <motion.div
              className="w-8 h-2 bg-gray-100 rounded-full"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={shimmerStyle}
            />
          </div>
        </div>
      </div>

      {/* Right Shimmer: Content Section */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0 pr-12">
        <div className="space-y-1.5">
          {/* Label shimmer */}
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-3 h-3 rounded-full bg-gray-100" />
            <div className="w-12 h-2 bg-gray-100 rounded" />
          </div>

          {/* Title shimmer */}
          <motion.div
            className="h-5 w-3/4 bg-gray-200 rounded-lg"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={darkShimmerStyle}
          />

          {/* Subtitle shimmer */}
          <motion.div
            className="h-3 w-1/2 bg-gray-100 rounded-lg"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={shimmerStyle}
          />
        </div>

        {/* Bottom Shimmer: Price Section */}
        <div className="flex flex-col border-t border-gray-50 pt-2.5">
          <div className="w-10 h-2 bg-gray-50 rounded mb-1.5" />
          <motion.div
            className="h-6 w-32 bg-gray-200 rounded-lg"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={darkShimmerStyle}
          />
        </div>
      </div>

      {/* Action button shimmer (top right) */}
      <div className="absolute top-3 right-3 md:top-4 md:right-4 w-9 h-9 rounded-2xl bg-gray-50" />
    </div>
  );
}

