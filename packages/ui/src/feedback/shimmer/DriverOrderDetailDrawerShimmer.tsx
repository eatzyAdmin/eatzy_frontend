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
    background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%'
  };

  const shimmerStyleDark = {
    background: 'linear-gradient(90deg, #374151 25%, rgba(255,255,255,0.15) 50%, #374151 75%)',
    backgroundSize: '200% 100%'
  };

  return (
    <div className="space-y-4">
      {/* 1. Stats Row - bg-gray-900 p-5 rounded-[28px] */}
      <div className="flex items-center justify-between bg-gray-900 p-5 rounded-[28px] shadow-xl shadow-black/5">
        <div className="text-center flex-1 border-r border-white/10 px-2">
          <motion.div className="h-1.5 w-8 mx-auto rounded-full mb-2 opacity-30" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
          <motion.div className="h-5 w-16 mx-auto rounded-lg" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
        </div>
        <div className="text-center flex-1 border-r border-white/10 px-2">
          <motion.div className="h-1.5 w-10 mx-auto rounded-full mb-2 opacity-30" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
          <motion.div className="h-5 w-12 mx-auto rounded-lg" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
        </div>
        <div className="text-center flex-1 px-2">
          <motion.div className="h-1.5 w-8 mx-auto rounded-full mb-2 opacity-30" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
          <motion.div className="h-4 w-10 mx-auto rounded-lg" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
        </div>
      </div>

      {/* 2. Route Details - bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200 */}
      <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gray-100" />
          <motion.div className="h-5 w-32 rounded-lg" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
        </div>

        <div className="flex gap-4 mt-6">
          {/* Visual Route Indicator */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100" />
            <div className="w-0.5 flex-grow border-l-2 border-dotted border-gray-100 my-1.5" />
            <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100" />
          </div>

          {/* Route Addresses */}
          <div className="flex-1 space-y-7 py-1">
             <div className="space-y-1.5">
               <div className="h-1.5 w-10 bg-gray-50 rounded-full" />
               <motion.div className="h-4 w-32 rounded-md" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
               <motion.div className="h-2.5 w-48 rounded-md opacity-40" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
             </div>
             <div className="space-y-1.5 pt-1">
               <div className="h-1.5 w-10 bg-gray-50 rounded-full" />
               <motion.div className="h-4 w-28 rounded-md" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
             </div>
          </div>
        </div>
      </div>

      {/* 3. Items Section - bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200 */}
      <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gray-100" />
            <motion.div className="h-5 w-40 rounded-lg" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          </div>
          <div className="w-12 h-6 rounded-lg bg-gray-50" />
        </div>

        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="flex gap-4 items-center">
                <motion.div className="w-10 h-10 rounded-[14px] bg-gray-50" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
                <div className="space-y-1">
                   <motion.div className="h-3.5 w-24 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
                   <motion.div className="h-2 w-32 rounded opacity-30" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
                </div>
              </div>
              <motion.div className="h-3.5 w-16 bg-gray-50 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            </div>
          ))}
        </div>

        <div className="h-px bg-gray-50 my-4" />

        <div className="space-y-2.5">
           <div className="flex justify-between items-center px-1">
             <div className="h-3 w-14 bg-gray-50 rounded" />
             <div className="h-3 w-16 bg-gray-100 rounded" />
           </div>
           <div className="flex justify-between items-center px-1">
             <div className="h-4 w-24 bg-gray-50 rounded" />
             <motion.div className="h-6 w-24 rounded-lg" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
           </div>
        </div>
      </div>

      {/* 4. Payment Audit - bg-[#1A1A1A] rounded-[32px] p-5 shadow-2xl shadow-black/20 */}
      <div className="bg-[#1A1A1A] rounded-[32px] p-5 shadow-2xl shadow-black/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800 opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <motion.div className="h-2 w-28 rounded-full mb-8 opacity-20" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
        
        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <div className="h-2 w-16 bg-gray-800 rounded-full" />
             <div className="h-3 w-20 bg-gray-800 rounded" />
           </div>
           <div className="h-px bg-white/5 my-4" />
           <div className="flex justify-between items-end">
              <div className="space-y-2">
                 <div className="h-2 w-16 bg-gray-800 rounded-full" />
                 <motion.div className="h-8 w-32 rounded-lg" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyleDark} />
              </div>
              <div className="h-8 w-16 bg-gray-800 rounded-xl" />
           </div>
        </div>
      </div>
    </div>
  );
}
