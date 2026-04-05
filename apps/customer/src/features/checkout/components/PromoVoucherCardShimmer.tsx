"use client";

import { motion } from "@repo/ui/motion";

export default function PromoVoucherCardShimmer() {
  return (
    <div className="w-full relative mb-4">
      <div className="relative w-full p-3.5 md:p-4 pr-12 md:pr-16 rounded-[28px] md:rounded-[32px] border-[3px] border-gray-100 bg-white flex items-stretch gap-4 z-10 shadow-[0_0_15px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Shimmer Overlay */}
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent z-20 pointer-events-none"
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            {/* Icon placeholder */}
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex-shrink-0" />
            {/* Title placeholder */}
            <div className="h-3 w-32 bg-gray-100 rounded-lg" />
          </div>

          <div className="flex items-baseline gap-2">
            {/* Value placeholder */}
            <div className="h-8 w-24 bg-gray-100 rounded-xl" />
            {/* Subtext placeholder */}
            <div className="h-4 w-16 bg-gray-50 rounded-lg" />
          </div>

          <div className="mt-2.5 flex items-center gap-2.5">
            {/* Bottom text placeholder */}
            <div className="h-3 w-20 bg-gray-50 rounded-lg" />
            <div className="w-1 h-1 rounded-full bg-gray-100" />
            <div className="h-3 w-28 bg-gray-50 rounded-lg" />
          </div>
        </div>

        {/* Selection indicator placeholder */}
        <div className="absolute top-1/2 right-4 md:right-5 -translate-y-1/2 w-7 h-7 md:w-9 md:h-9 rounded-full bg-gray-50" />
      </div>
    </div>
  );
}

export function PromoVoucherCardShimmerList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <PromoVoucherCardShimmer key={i} />
      ))}
    </>
  );
}
