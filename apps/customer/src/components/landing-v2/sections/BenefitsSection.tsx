"use client";

import { ArrowRight } from "@repo/ui/icons";
import { Button } from "@repo/ui";

interface BenefitsSectionProps {
  visible: boolean;
  onGetStarted: () => void;
}

export default function BenefitsSection({ visible, onGetStarted }: BenefitsSectionProps) {
  const benefits = [
    {
      title: "Giao Hàng Siêu Nhanh",
      description: "Đặt món và nhận trong vòng 25-30 phút",
      gradient: "from-emerald-400 to-teal-500",
      stat: "25-30",
      unit: "phút",
    },
    {
      title: "Ưu Đãi Hấp Dẫn",
      description: "Giảm giá lên đến 50% cho đơn hàng đầu tiên",
      gradient: "from-orange-400 to-red-500",
      stat: "50%",
      unit: "giảm giá",
    },
  ];

  return (
    <section className="relative z-10 py-6 md:py-12 m-6 md:m-12 lg:m-20 md:pt-8 rounded-[40px] md:rounded-[80px] shadow-2xl overflow-hidden bg-black/5 backdrop-blur-xl">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Title Section */}
        <div
          className={`flex flex-col md:flex-row justify-between py-4 mb-8 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="text-5xl font-bold text-[var(--primary)]">
                <span className="text-white font-semibold">Ưu Điểm </span>Eatzy
              </div>
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
          </div>

          <div className="mt-8 md:mt-0 max-w-xl text-right">
            <p className="text-white/80 text-2xl font-light">
              Trải nghiệm đặt món tuyệt vời với những tính năng độc đáo
            </p>
          </div>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer transition-all duration-1000 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-40"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.02] h-full min-h-[400px]">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient}`}>
                  <div className="absolute inset-0 bg-white/20" />
                  <div className="absolute top-6 right-14 bottom-6 left-14 rounded-3xl backdrop-blur-lg bg-white/30 z-0 transition-all duration-500 group-hover:bg-white/35"></div>
                </div>

                {/* Content */}
                <div className="relative p-8 md:p-16 lg:p-20 h-full flex flex-col items-center justify-center text-center">
                  <span
                    className="font-light border border-white text-white inline-block px-6 py-3 bg-black/10 backdrop-blur-sm rounded-full text-lg transition-all duration-300 group-hover:bg-white/30 mb-12"
                    style={{ textShadow: "0 4px 8px rgba(0,0,0,0.3)" }}
                  >
                    {benefit.title}
                  </span>

                  <h2
                    className="text-4xl md:text-6xl lg:text-7xl font-normal text-white transition-all duration-300 group-hover:scale-105"
                    style={{ textShadow: "0 4px 8px rgba(0,0,0,0.3)" }}
                  >
                    {benefit.stat}
                    <span className="text-xl md:text-2xl ml-2">{benefit.unit}</span>
                  </h2>

                  <p
                    className="mt-4 text-lg text-white/80 max-w-sm transition-all duration-300 group-hover:text-white/90"
                    style={{ textShadow: "0 4px 8px rgba(0,0,0,0.3)" }}
                  >
                    {benefit.description}
                  </p>

                  <div className="absolute bottom-56 right-8 w-12 h-12 rounded-full bg-white/0 flex items-center justify-center opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-white/90">
                    <ArrowRight size={20} className="text-gray-900" />
                  </div>
                </div>

                {/* Glowing effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`mt-12 text-center transition-all duration-1000 delay-400 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <Button
            variant="primary"
            size="lg"
            className="rounded-full gap-2 px-8"
            onClick={onGetStarted}
          >
            <span>Trải Nghiệm Ngay</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}

