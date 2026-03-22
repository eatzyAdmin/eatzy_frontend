import { motion } from "@repo/ui/motion";

export function RestaurantReviewShimmer() {
  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-[40px] md:rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-white/40 flex flex-col h-full overflow-hidden relative">
      {/* Header Shimmer */}
      <div className="relative h-36 md:h-52 shrink-0 overflow-hidden bg-gray-200 animate-pulse rounded-t-[40px] md:rounded-t-[48px] rounded-b-[40px] md:rounded-b-[48px]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] rounded-t-[40px] md:rounded-t-[48px] rounded-b-[40px] md:rounded-b-[48px]" />

        <div className="relative z-10 h-full p-5 md:p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-24 h-6 bg-white/20 rounded-full" />
            <div className="w-10 h-10 rounded-2xl bg-white/10" />
          </div>
          <div>
            <div className="w-32 h-3 bg-white/20 rounded-full mb-2" />
            <div className="w-48 h-10 bg-white/30 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Content Shimmer */}
      <div className="bg-white p-4 md:p-8 flex flex-col flex-1 rounded-b-[40px] md:rounded-b-[48px]">
        <div className="mb-4 md:mb-8">
          <div className="w-40 h-8 bg-gray-100 rounded-lg mb-2 animate-pulse" />
          <div className="w-64 h-3 bg-gray-50 rounded-full animate-pulse" />
        </div>

        {/* Stars Shimmer */}
        <div className="flex items-center gap-2 mb-4 md:mb-6 p-3 md:p-4 bg-black/5 rounded-[28px] md:rounded-[32px] justify-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
          ))}
        </div>

        {/* Textarea Shimmer */}
        <div className="relative mb-3 md:mb-8 flex-1">
          <div className="w-full h-32 bg-gray-50 border-2 border-white rounded-[28px] md:rounded-[32px] animate-pulse" />
        </div>

        {/* Button Shimmer */}
        <div className="w-full h-14 md:h-16 rounded-[20px] md:rounded-[24px] bg-gray-100 animate-pulse shadow-sm" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
