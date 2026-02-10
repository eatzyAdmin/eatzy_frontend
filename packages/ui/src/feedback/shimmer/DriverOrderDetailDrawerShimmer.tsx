import { motion } from "@repo/ui/motion";

export default function DriverOrderDetailDrawerShimmer() {
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
    background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
    backgroundSize: '200% 100%'
  };

  const shimmerStyleDark = {
    background: 'linear-gradient(90deg, #374151 25%, rgba(255,255,255,0.15) 50%, #374151 75%)',
    backgroundSize: '200% 100%'
  };

  return (
    <div className="space-y-6">
      {/* Stats Row - bg-gray-900 p-5 rounded-[28px] */}
      <div className="flex items-center justify-between bg-gray-900 p-5 rounded-[28px] shadow-xl shadow-black/5">
        <div className="text-center flex-1 border-r border-white/10 px-2">
          <motion.div className="h-2 w-12 mx-auto rounded mb-1" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
          <motion.div className="h-5 w-16 mx-auto rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
        </div>
        <div className="text-center flex-1 border-r border-white/10 px-2">
          <motion.div className="h-2 w-14 mx-auto rounded mb-1" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
          <motion.div className="h-5 w-12 mx-auto rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
        </div>
        <div className="text-center flex-1 px-2">
          <motion.div className="h-2 w-12 mx-auto rounded mb-1" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
          <motion.div className="h-4 w-10 mx-auto rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
        </div>
      </div>

      {/* Route Details - bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200 */}
      <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gray-100" />
          <motion.div className="h-5 w-32 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
        </div>

        <div className="relative pl-3 space-y-6 mt-4">
          <div className="absolute left-[17px] top-4 bottom-16 w-0.5 bg-gray-100 border-l-[2px] border-dashed border-gray-300" />

          {/* Pickup */}
          <div className="relative flex gap-5">
            <div className="relative z-10 w-3 h-3 rounded-full bg-gray-200 mt-1.5 shrink-0" />
            <div className="flex-1 min-w-0 space-y-1">
              <motion.div className="h-2 w-10 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
              <motion.div className="h-4 w-32 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
              <motion.div className="h-3 w-48 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            </div>
          </div>

          {/* Dropoff */}
          <div className="relative flex gap-5">
            <div className="relative z-10 w-3 h-3 rounded-full bg-gray-200 mt-1.5 shrink-0 ring-4 ring-gray-50" />
            <div className="flex-1 min-w-0 space-y-1">
              <motion.div className="h-2 w-10 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
              <motion.div className="h-4 w-28 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
              <motion.div className="h-3 w-44 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            </div>
          </div>
        </div>
      </div>

      {/* Items Section - bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200 */}
      <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gray-100" />
          <motion.div className="h-5 w-36 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
        </div>

        {/* Items */}
        {[1, 2].map(i => (
          <div key={i} className="flex items-center justify-between mb-1">
            <div className="flex gap-4 items-center">
              <motion.div className="w-9 h-9 rounded-xl" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
              <motion.div className="h-4 w-24 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            </div>
            <motion.div className="h-4 w-16 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          </div>
        ))}

        <div className="h-px bg-gray-200/70 my-2" />

        {/* Summary */}
        <div className="space-y-2.5 pt-1">
          <div className="flex justify-between items-center">
            <motion.div className="h-3 w-14 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            <motion.div className="h-4 w-20 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          </div>
          <div className="flex justify-between items-center">
            <motion.div className="h-3 w-20 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            <motion.div className="h-4 w-20 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          </div>
        </div>

        <div className="h-px bg-gray-200/70 my-2" />

        {/* Total */}
        <div className="flex justify-between items-center pt-1">
          <motion.div className="h-4 w-24 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          <motion.div className="h-7 w-24 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
        </div>
      </div>

      {/* Payment Breakdown - bg-[#1A1A1A] rounded-[32px] p-5 */}
      <div className="bg-[#1A1A1A] rounded-[32px] p-5 shadow-2xl shadow-black/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-700 opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />

        <motion.div className="h-3 w-28 rounded mb-6" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />

        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-center">
            <motion.div className="h-3 w-24 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
            <motion.div className="h-4 w-20 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <motion.div className="h-3 w-28 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
              <motion.div className="h-4 w-8 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
            </div>
            <motion.div className="h-4 w-16 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
          </div>

          <div className="h-px bg-white/5 my-4" />

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <motion.div className="h-2 w-20 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
              <motion.div className="h-8 w-28 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
            </div>
            <motion.div className="h-7 w-16 rounded-xl" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
          </div>
        </div>
      </div>

      {/* End of report */}
      <div className="text-center pt-2 opacity-30">
        <motion.div className="h-2 w-20 mx-auto rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
      </div>
    </div>
  );
}
