import { motion } from "@repo/ui/motion";
import { Store, Bike, ShieldCheck, Star } from "@repo/ui/icons";

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

  const shimmerStyle = {
    background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
  };

  const darkShimmerStyle = {
    background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)',
    backgroundSize: '200% 100%',
  };

  const RestaurantReviewShimmer = () => (
    <div className="bg-white/40 backdrop-blur-xl rounded-[40px] md:rounded-[44px] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-white/40 flex flex-col h-auto md:h-full overflow-hidden w-full max-w-[440px] mx-auto md:mx-0 relative">
      <div className="relative h-36 md:h-52 shrink-0 overflow-hidden bg-gray-900/50">
        <motion.div className="w-full h-full opacity-30" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #1f2937 25%, rgba(75,85,99,0.4) 50%, #1f2937 75%)', backgroundSize: '200% 100%' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
              <Store className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </div>
            <span className="text-[9px] md:text-[10px] font-anton text-white/50 uppercase tracking-[0.2em]">Series / Review</span>
          </div>
          <motion.div className="h-6 md:h-10 w-3/4 bg-white/20 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)', backgroundSize: '200% 100%' }} />
        </div>
      </div>
      <div className="p-4 md:p-8 flex-1 flex flex-col">
        <div className="mb-6 md:mb-8">
          <motion.div className="h-2 w-20 bg-gray-200/50 rounded mb-3" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          <motion.div className="h-6 md:h-8 w-1/2 bg-gray-200/50 rounded mb-2" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          <motion.div className="h-2 w-32 bg-gray-100/50 rounded italic" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
        </div>

        <div className="flex items-center gap-1 md:gap-2 mb-4 md:mb-10 p-3 md:p-4 bg-black/5 rounded-[28px] md:rounded-[32px] justify-center relative">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="p-2">
              <Star className="w-8 h-8 md:w-10 md:h-10 text-white fill-white/10" strokeWidth={1} />
            </div>
          ))}
        </div>

        <div className="w-full bg-white/60 border border-white/50 rounded-[28px] md:rounded-[32px] p-5 md:p-6 min-h-[120px] md:min-h-[140px] mb-4 md:mb-8 flex flex-col gap-2">
          <motion.div className="h-2 w-1/2 bg-gray-100/50 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
        </div>

        <div className="w-full h-14 md:h-16 rounded-[20px] md:rounded-[24px] bg-gray-200/50 text-white/40 flex items-center justify-center font-anton text-sm md:text-base tracking-wider">
          {/* Send icon mock */}
          <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full" />
          SUBMIT REVIEW
        </div>
      </div>
    </div>
  );

  const DriverReviewShimmer = () => (
    <div className="bg-white/40 backdrop-blur-xl rounded-[40px] md:rounded-[44px] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-white/40 flex flex-col h-auto md:h-full overflow-hidden w-full max-w-[440px] mx-auto md:mx-0 relative">
      <div className="relative h-36 md:h-52 shrink-0 overflow-hidden bg-gray-900/50">
        <motion.div className="absolute inset-0 opacity-20" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #1f2937 25%, rgba(75,85,99,0.4) 50%, #1f2937 75%)', backgroundSize: '200% 100%' }} />
        <div className="relative z-10 h-full p-5 md:p-8 flex items-center gap-4 md:gap-6">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full p-1 md:p-1.5 bg-gradient-to-tr from-lime-500/20 to-white/10 backdrop-blur-md border border-white/20 shadow-2xl shrink-0">
            <motion.div className="w-full h-full rounded-full bg-gray-800/50 border border-white/5" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #111827 25%, rgba(75,85,99,0.2) 50%, #111827 75%)', backgroundSize: '200% 100%' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/10 text-white shadow-sm">
                <Bike className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] md:text-[10px] font-anton text-white/40 uppercase tracking-[0.2em] truncate">Personnel Series Review</span>
            </div>
            <motion.div className="h-6 md:h-10 w-40 bg-white/10 rounded mb-2" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #374151 25%, rgba(255,255,255,0.05) 50%, #374151 75%)', backgroundSize: '200% 100%' }} />
            <motion.div className="h-4 w-24 bg-lime-500/10 rounded-md" variants={shimmerVariants} initial="initial" animate="animate" style={darkShimmerStyle} />
          </div>
        </div>
      </div>
      <div className="p-4 md:p-8 flex-1 flex flex-col">
        <div className="mb-6 md:mb-8">
          <motion.div className="h-2 w-20 bg-gray-200/50 rounded mb-3" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          <motion.div className="h-6 md:h-8 w-1/2 bg-gray-200/50 rounded mb-2" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          <motion.div className="h-2 w-32 bg-gray-100/50 rounded italic" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
        </div>

        <div className="flex items-center gap-1 md:gap-2 mb-4 md:mb-10 p-3 md:p-4 bg-black/5 rounded-[28px] md:rounded-[32px] justify-center relative">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="p-2">
              <Star className="w-8 h-8 md:w-10 md:h-10 text-white fill-white/10" strokeWidth={1} />
            </div>
          ))}
        </div>

        <div className="w-full bg-white/60 border border-white/50 rounded-[28px] md:rounded-[32px] p-5 md:p-6 min-h-[120px] md:min-h-[140px] mb-4 md:mb-8 flex flex-col gap-2">
          <motion.div className="h-2 w-1/2 bg-gray-100/50 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
        </div>

        <div className="w-full mt-auto h-14 md:h-16 rounded-[20px] md:rounded-[24px] bg-gray-200/50 text-white/40 flex items-center justify-center font-anton text-sm md:text-base tracking-wider">
          {/* Send icon mock */}
          <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full" />
          SUBMIT REVIEW
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-12 w-full max-w-7xl mx-auto">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-row items-stretch justify-center gap-8 md:gap-12">
        <div className="w-full max-w-[440px] shrink-0">
          <RestaurantReviewShimmer />
        </div>
        <div className="w-full max-w-[440px] shrink-0">
          <DriverReviewShimmer />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex flex-col gap-1 w-full overflow-hidden">
          <div className="flex gap-4 -mx-4 px-4 py-6 -my-6 overflow-hidden">
            <div className="shrink-0 flex items-stretch justify-center py-4 w-[calc(100vw-48px)]">
              <RestaurantReviewShimmer />
            </div>
            <div className="shrink-0 flex items-stretch justify-center py-4 w-[calc(100vw-48px)] opacity-40 scale-95 origin-left">
              <div className="w-full bg-white rounded-[40px] shadow-sm border border-gray-100/50" />
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-1">
            <div className="w-6 h-1.5 bg-[var(--primary)] rounded-full transition-all duration-300" />
            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
