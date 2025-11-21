"use client";

import { FeatureGrid } from "../features";
import { Button } from "@repo/ui";
import { Maximize2 } from "@repo/ui/icons";

interface FeaturesSectionProps {
  visible: boolean;
  onExplore: () => void;
}

export default function FeaturesSection({ visible, onExplore }: FeaturesSectionProps) {
  return (
    <section className="relative mt-12 mx-6 md:mt-24 md:mx-12 lg:mx-24 p-6 md:p-12 pt-12 md:pt-20 pb-12 bg-white/8 backdrop-blur-xl border border-white/20 rounded-[40px] md:rounded-[60px] shadow-2xl min-h-screen z-[5]">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Title */}
        <div
          className={`mb-12 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-center md:text-left mb-4 text-white group cursor-default">
            <span className="text-white inline-block relative">
              Why
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] group-hover:w-full transition-all duration-700"></span>
            </span>{" "}
            <span className="text-[var(--primary)] inline-block relative">
              Eatzy?
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-700 delay-300"></span>
            </span>
          </h2>
          <p className="text-white/80 text-xl mt-4">
            Nền tảng giao đồ ăn hàng đầu với trải nghiệm tuyệt vời cho người dùng
          </p>
        </div>

        {/* Feature Grid */}
        <FeatureGrid visible={visible} />

        {/* CTA Button */}
        <div
          className={`mt-12 flex justify-center transition-all duration-1000 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <Button
            variant="primary"
            size="lg"
            className="rounded-full gap-2"
            onClick={onExplore}
          >
            <Maximize2 size={16} />
            <span>Trải Nghiệm Ngay</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

