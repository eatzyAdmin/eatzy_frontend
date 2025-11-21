"use client";

import { useEffect, useState } from "react";

interface CategoriesSectionProps {
  visible: boolean;
}

export default function CategoriesSection({ visible }: CategoriesSectionProps) {
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setParallax(Math.min(30, window.scrollY * 0.03));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    {
      name: "Cơm & Bún",
      emoji: "🍚",
      gradient: "from-emerald-400 to-teal-500",
      description: "Các món cơm và bún truyền thống",
    },
    {
      name: "Đồ Ăn Nhanh",
      emoji: "🍔",
      gradient: "from-yellow-400 to-orange-500",
      description: "Burger, pizza, gà rán...",
    },
    {
      name: "Món Á",
      emoji: "🍜",
      gradient: "from-red-400 to-pink-500",
      description: "Phở, mì, sushi, dimsum...",
    },
    {
      name: "Đồ Uống",
      emoji: "🥤",
      gradient: "from-blue-400 to-cyan-500",
      description: "Trà sữa, cà phê, nước ép...",
    },
    {
      name: "Tráng Miệng",
      emoji: "🍰",
      gradient: "from-purple-400 to-pink-500",
      description: "Bánh ngọt, kem, chè...",
    },
    {
      name: "Lẩu & Nướng",
      emoji: "🍲",
      gradient: "from-orange-400 to-red-500",
      description: "Lẩu, nướng BBQ, hotpot...",
    },
  ];

  return (
    <section className="relative z-10 py-6 md:py-12 pt-12 md:pt-24 mb-6 md:mb-12 rounded-[40px] md:rounded-[80px] shadow-2xl overflow-hidden bg-white/8 backdrop-blur-xl border border-white/20 mx-6 md:mx-12 lg:mx-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Title */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <h2 className="text-3xl md:text-5xl font-light text-white mb-4">
            Khám Phá - <span className="text-[var(--primary)] font-semibold">Danh Mục Phong Phú</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mx-auto my-4 rounded-full"></div>
          <p className="text-white/80 text-xl font-light max-w-3xl mx-auto mb-8">
            Hàng nghìn món ăn đa dạng từ các nhà hàng uy tín, phục vụ mọi khẩu vị của bạn
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`relative bg-white/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:bg-white/60 hover:scale-[1.02] cursor-pointer ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
                transform: `translateY(-${parallax * (0.02 + index * 0.006)}px)`,
              }}
            >
              {/* Decorative gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${category.gradient} opacity-20 rounded-bl-full`}></div>

              <div className="relative z-10 p-6">
                {/* Emoji Icon */}
                <div className="text-5xl mb-4 transform transition-transform duration-300 hover:scale-110">{category.emoji}</div>

                {/* Category Info */}
                <h3 className="text-2xl font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-white/80">{category.description}</p>

                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-[var(--primary)]/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <svg
                    className="w-4 h-4 text-[var(--primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transform -translate-x-full hover:translate-x-full transition-all duration-1000"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

