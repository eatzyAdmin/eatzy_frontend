"use client";

import { ArrowRight } from "@repo/ui/icons";
import { Button } from "@repo/ui";

interface HeroSectionProps {
  animationComplete: boolean;
  onGetStarted: () => void;
  onExplore: () => void;
}

export default function HeroSection({ animationComplete, onGetStarted, onExplore }: HeroSectionProps) {
  return (
    <main
      className={`relative z-10 flex flex-col items-center justify-center px-6 py-20 md:py-16 text-center transition-all duration-1000 delay-700 ${
        animationComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Subtitle */}
      <div className="mb-6 translate-y-6 text-lg text-white/80 font-normal">
        Khám phá hương vị tuyệt vời cùng <span className="text-[var(--primary)] text-4xl font-bold">Eatzy</span>
      </div>

      {/* Logo decoration */}
      <div className="hidden md:block md:pr-[570px] translate-y-4">
        <div className="relative w-7 h-7 transform rotate-45 rounded-md flex items-center justify-center hover:rotate-90 transition-all duration-300">
          <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"></div>
          <div className="absolute inset-[3px] rounded-md bg-gradient-to-br from-emerald-200 to-lime-200 shadow-lg"></div>
          <div className="absolute inset-[6px] rounded-md bg-white"></div>
          <svg
            className="absolute inset-0 m-auto w-5 h-5 transform -rotate-45 hover:scale-110 transition-transform"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>

      {/* Main heading */}
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight">
        Đặt Món Dễ Dàng
        <br />
        <span className="text-[var(--primary)]">Giao Nhanh Tận Nơi!</span>
      </h1>

      {/* Description */}
      <p className="text-lg text-white/80 max-w-2xl mb-12">
        Khám phá hàng nghìn nhà hàng và món ăn ngon, săn ưu đãi hấp dẫn và theo dõi đơn hàng thời gian thực. Tất cả
        trong một ứng dụng tiện lợi.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <Button
          variant="primary"
          size="lg"
          className="group rounded-full px-8 gap-2"
          onClick={onGetStarted}
        >
          <span>Đặt Món Ngay</span>
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Button>

        <Button
          variant="glass"
          size="lg"
          className="rounded-full px-8"
          onClick={onExplore}
        >
          Khám Phá Ưu Đãi
        </Button>
      </div>
    </main>
  );
}

