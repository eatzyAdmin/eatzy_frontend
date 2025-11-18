"use client";

import { useEffect, useState } from "react";
import { Users, Star, Clock, TrendingUp, Gift, Zap } from "@repo/ui/icons";
import FeatureCard from "./FeatureCard";
import { FeatureCardData } from "../types";

interface FeatureGridProps {
  visible: boolean;
}

export default function FeatureGrid({ visible }: FeatureGridProps) {
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setParallax(Math.min(30, window.scrollY * 0.03));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features: (FeatureCardData & { gridClass: string })[] = [
    {
      title: "Khách hàng thân thiết",
      stats: "10,000+",
      description: "Người dùng đang sử dụng Eatzy mỗi ngày",
      icon: <Users size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-emerald-400 to-teal-500",
      tags: ["Đáng tin cậy"],
      gridClass: "col-span-12 sm:col-span-6 md:col-span-4 row-span-5",
    },
    {
      title: "Giao hàng nhanh chóng",
      subtitle: "Trung bình 25 phút",
      description: "Đặt món và nhận trong nháy mắt",
      icon: <Clock size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-lime-400 to-emerald-500",
      gridClass: "col-span-6 sm:col-span-6 md:col-span-2 row-span-2",
    },
    {
      title: "Ưu đãi hàng ngày",
      subtitle: "Giảm giá lên đến 50%",
      description: "Săn deal mỗi ngày, tiết kiệm thật nhiều",
      icon: <Gift size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-orange-400 to-red-500",
      gridClass: "col-span-6 sm:col-span-6 md:col-span-3 row-span-4",
    },
    {
      title: "Đánh giá cao",
      stats: "4.8⭐",
      description: "Hàng nghìn đánh giá tích cực từ người dùng",
      icon: <Star size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-yellow-400 to-orange-500",
      gridClass: "col-span-12 sm:col-span-6 md:col-span-3 row-span-5",
    },
    {
      title: "Tăng trưởng mạnh mẽ",
      subtitle: "200% YoY",
      description: "Phát triển nhanh chóng trên toàn quốc",
      icon: <TrendingUp size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-blue-400 to-indigo-500",
      gridClass: "col-span-12 sm:col-span-12 md:col-span-4 row-span-3",
    },
    {
      title: "Giao diện thân thiện",
      description: "Đặt món dễ dàng, trải nghiệm mượt mà",
      icon: <Zap size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-purple-400 to-pink-500",
      gridClass: "col-span-12 sm:col-span-12 md:col-span-7 row-span-4",
    },
    {
      title: "Thanh toán linh hoạt",
      description: "Nhiều phương thức, an toàn bảo mật",
      icon: <Zap size={16} className="text-white" />,
      gradient: "bg-gradient-to-br from-teal-400 to-cyan-500",
      gridClass: "col-span-12 sm:col-span-6 md:col-span-3 row-span-2",
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-3 md:gap-4 lg:gap-x-6 lg:gap-y-8 h-auto lg:h-[90vh] auto-rows-min lg:grid-rows-9">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`${feature.gridClass} transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <FeatureCard {...feature} index={index} parallaxOffset={parallax} />
        </div>
      ))}
    </div>
  );
}

