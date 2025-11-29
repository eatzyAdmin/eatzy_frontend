"use client";
import { motion } from "@repo/ui/motion";
import { useEffect } from "react";
import { useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";

export default function RegisterPageContent({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();
  const { show, hide } = useLoading();

  const handleBack = () => { router.back(); };
  const handleSuccess = () => { document.cookie = "driver_auth=1; path=/"; router.push("/onboarding"); };
  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);
  return (
    <div className="min-h-screen w-full p-4">
      <div className="max-w-md mx-auto">
        <div className="pt-10 pb-6">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-[#1A1A1A]">Đăng ký tài xế mới</motion.h1>
          <div className="text-sm text-[#555]">Vui lòng cho chúng tôi biết về bạn</div>
        </div>
        {isOpen && (
          <div className="mt-6 flex items-center gap-3">
            <Button variant="outline" size="lg" className="flex-1" onClick={handleBack}>Quay lại</Button>
            <Button variant="primary" size="lg" className="flex-1" onClick={() => { show("Đang mở trình đăng ký..."); handleSuccess(); }}>Bắt đầu</Button>
          </div>
        )}
      </div>
    </div>
  );
}
