"use client";

import BackgroundTransition from "@/features/home/components/BackgroundTransition";
import { getCategoryBackgroundImage } from "@/features/home/data/mockRestaurants";

export default function Loading() {
  const img = getCategoryBackgroundImage("fish-seafood");
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <BackgroundTransition imageUrl={img} categoryName="" />
      <div className="relative z-10 flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 m-auto w-6 h-6 rotate-45">
              <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"></div>
              <div className="absolute inset-[2px] rounded-md bg-white"></div>
            </div>
          </div>
          <div className="text-base tracking-wide">Eatzy Magazine</div>
          <div className="text-sm text-white/80">Đang tải…</div>
        </div>
      </div>
    </div>
  );
}