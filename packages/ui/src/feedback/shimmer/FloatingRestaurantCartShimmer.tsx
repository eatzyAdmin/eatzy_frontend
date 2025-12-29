import { motion } from "@repo/ui/motion";

export default function FloatingRestaurantCartShimmer() {
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
    <div className="fixed bottom-8 right-8 z-50 bg-white rounded-full shadow-2xl p-4 pr-6 flex items-center gap-3 border border-gray-100 min-w-[180px]">
      <div className="relative">
        <motion.div
          className="w-12 h-12 rounded-full bg-gray-200"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
      <div className="flex flex-col items-start mr-2 gap-1.5 flex-1">
        <motion.div
          className="h-3 w-16 bg-gray-100 rounded"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
            backgroundSize: '200% 100%',
          }}
        />
        <motion.div
          className="h-5 w-20 bg-gray-200 rounded"
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
  );
}
