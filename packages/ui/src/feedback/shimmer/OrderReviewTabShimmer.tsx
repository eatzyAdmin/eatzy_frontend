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
    <div className="bg-white rounded-[40px] shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100/50 flex flex-col h-[550px] overflow-hidden w-full max-w-[440px] mx-auto md:mx-0">
      <div className="relative h-44 shrink-0 bg-gray-900 overflow-hidden">
        <motion.div className="w-full h-full opacity-40" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #1f2937 25%, rgba(75,85,99,0.4) 50%, #1f2937 75%)', backgroundSize: '200% 100%' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
        <div className="relative z-10 h-full p-8 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Đánh giá cửa hàng</span>
          </div>
          <motion.div className="h-8 w-3/4 bg-white/30 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 75%)', backgroundSize: '200% 100%' }} />
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col items-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-6 text-center">Bạn thấy món ăn thế nào?</p>
        <div className="flex gap-4 mb-10">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i}>
              <Star className="w-11 h-11 text-gray-100" strokeWidth={1.5} />
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-50/50 border-2 border-transparent rounded-[32px] p-6 min-h-[120px] mb-10 flex flex-col gap-2">
          <motion.div className="h-3 w-1/2 bg-gray-200/50 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
        </div>
        <div className="w-full h-16 rounded-[24px] bg-gray-200 text-white flex items-center justify-center font-anton text-xl tracking-wider opacity-40">
          GỬI ĐÁNH GIÁ
        </div>
      </div>
    </div>
  );

  const DriverReviewShimmer = () => (
    <div className="bg-white rounded-[44px] shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100/50 flex flex-col h-[550px] overflow-hidden w-full max-w-[440px] mx-auto md:mx-0">
      <div className="relative h-44 shrink-0 bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-90" />
        <div className="relative z-10 h-full p-6 flex items-center gap-5">
          <div className="w-24 h-24 rounded-full p-1 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shrink-0">
            <motion.div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center border border-white/10" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #1f2937 25%, rgba(75,85,99,0.4) 50%, #1f2937 75%)', backgroundSize: '200% 100%' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/10 text-white shadow-sm">
                <Bike className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Đánh giá tài xế</span>
            </div>
            <motion.div className="h-8 w-40 bg-white/20 rounded mb-2" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #374151 25%, rgba(255,255,255,0.1) 50%, #374151 75%)', backgroundSize: '200% 100%' }} />
            <div className="h-5 w-24 bg-[var(--primary)]/10 px-2 py-0.5 rounded-md flex items-center justify-center">
              <motion.div className="h-2 w-16 bg-[var(--primary)]/20 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={darkShimmerStyle} />
            </div>
          </div>
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col items-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-6 text-center">Tài xế có thân thiện không?</p>
        <div className="flex gap-4 mb-10">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i}>
              <Star className="w-11 h-11 text-gray-100" strokeWidth={1.5} />
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-50/50 border-2 border-transparent rounded-[32px] p-6 min-h-[120px] mb-10 flex flex-col gap-2">
          <motion.div className="h-3 w-1/2 bg-gray-200/50 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
        </div>
        <div className="w-full h-16 rounded-[24px] bg-gray-200 text-white flex items-center justify-center font-anton text-xl tracking-wider opacity-40">
          GỬI ĐÁNH GIÁ
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
