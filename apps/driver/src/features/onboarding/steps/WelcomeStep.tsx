"use client";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { Bike, Sparkles } from "@repo/ui/icons";
import { Button } from "@repo/ui";

export default function WelcomeStep() {
  const { data, next } = useOnboardingStore();
  const name = data.fullName ?? "Tài xế";
  return (
    <div className="p-6">
      <div className="mt-4 flex flex-col items-center text-center">
        <div className="flex items-center gap-2">
          <Bike className="w-7 h-7 text-[var(--primary)]" />
          <div className="text-2xl font-bold text-gray-900">Xin chào {name}!</div>
        </div>
        <div className="mt-2 text-gray-600">Chào mừng bạn đến với Eatzy Driver</div>
        <div className="mt-6 text-[#1A1A1A] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Hãy bắt đầu đăng ký tài xế 2 bánh ngay bây giờ</span>
        </div>
        <div className="mt-8 w-full flex gap-3">
          <Button variant="primary" size="lg" className="flex-1" onClick={next}>Bắt đầu đăng ký</Button>
        </div>
      </div>
    </div>
  );
}
