import { motion } from "@repo/ui/motion";

export default function OrderReviewTabShimmer() {
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

  const ShimmerCard = () => (
    <div className="bg-white rounded-[32px] p-8 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center h-[550px] relative overflow-hidden w-full">
      {/* Title Shimmer */}
      <motion.div
        className="h-6 w-40 bg-gray-200 rounded-lg mb-8"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        style={{
          background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
          backgroundSize: '200% 100%',
        }}
      />

      {/* Avatar Shimmer */}
      <div className="relative w-24 h-24 mb-6">
        <motion.div
          className="w-full h-full rounded-full bg-gray-100 border border-gray-100"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      {/* Name Shimmer */}
      <motion.div
        className="h-5 w-48 bg-gray-200 rounded-md mb-2"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        style={{
          background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
          backgroundSize: '200% 100%',
        }}
      />

      {/* Subtitle Shimmer */}
      <motion.div
        className="h-4 w-32 bg-gray-100 rounded-md mb-10"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        style={{
          background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
          backgroundSize: '200% 100%',
        }}
      />

      {/* Stars Shimmer */}
      <div className="flex gap-2 mb-10">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="w-10 h-10 rounded-full bg-gray-100"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
              backgroundSize: '200% 100%',
            }}
          />
        ))}
      </div>

      {/* Input Shimmer */}
      <motion.div
        className="w-full h-32 bg-gray-50 rounded-2xl mb-8"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        style={{
          background: 'linear-gradient(90deg, #f9fafb 25%, rgba(255,255,255,0.8) 50%, #f9fafb 75%)',
          backgroundSize: '200% 100%',
        }}
      />

      {/* Button Shimmer */}
      <motion.div
        className="w-full h-16 rounded-2xl bg-gray-200"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        style={{
          background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-full items-start overflow-y-auto md:overflow-hidden pt-4 gap-6 md:gap-0 px-4 md:px-0 bg-[#F7F7F7]">
      {/* Left Column Shimmer */}
      <div className="w-full md:flex-1 h-auto md:h-full p-0 md:p-4 md:pl-12 md:pr-6">
        <ShimmerCard />
      </div>

      {/* Divider */}
      <div className="hidden md:block w-[1px] h-[90%] my-auto bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-60 flex-shrink-0" />

      {/* Right Column Shimmer */}
      <div className="w-full md:flex-1 h-auto md:h-full p-0 md:p-4 md:pl-6 md:pr-12">
        <ShimmerCard />
      </div>
    </div>
  );
}
