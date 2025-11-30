"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@repo/ui";
import Link from "next/link";
import { Play } from "@repo/ui/icons";

export default function HeroSection() {
  return (
    <section className="w-full min-h-[60vh] relative overflow-hidden bg-gradient-to-br from-black/50 to-transparent">
      <div className="absolute inset-0 z-0 opacity-70 lg:opacity-100">
        <img src="https://images.unsplash.com/photo-1541542684-6a084f10f2b7?auto=format&fit=crop&w=1600&q=80" alt="restaurant hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col gap-6 items-start">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">Nhà hàng A</h1>
        <p className="text-2xl md:text-3xl text-white/90 max-w-3xl">Ẩm thực tinh tế · Nguyên liệu tươi sạch · Hương vị đích thực</p>
        <p className="text-lg text-white/90 max-w-2xl">Trải nghiệm món ăn truyền thống kết hợp phong cách hiện đại, nguyên liệu tươi sạch và đầu bếp giàu kinh nghiệm.</p>

        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <Link href="/menu">
            <Button variant="primary" size="lg" className="rounded-full px-6">🍽 Xem Menu</Button>
          </Link>
          <a href="tel:+84000000000">
            <Button variant="ghost" size="lg" className="rounded-full px-6">📞 Đặt Bàn</Button>
          </a>
          <Link href="/menu">
            <Button variant="outline" size="lg" className="rounded-full px-6">🛵 Đặt Món Online</Button>
          </Link>
          <a href="#" className="ml-2 inline-flex items-center gap-2 text-sm text-white/90"> <Play size={14} /> Xem video</a>
        </div>
      </div>
    </section>
  );
}
