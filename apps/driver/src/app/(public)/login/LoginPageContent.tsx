"use client";
import { LoginForm, useLoading } from "@repo/ui";
import { useEffect } from "react";
import { motion } from "@repo/ui/motion";
import { useRouter } from "next/navigation";
import { useZodForm, loginSchema, type LoginFormData } from "@repo/lib";
import { Button } from "@repo/ui";

export default function LoginPageContent() {
  const router = useRouter();
  const { show, hide } = useLoading();
  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);
  const form = useZodForm<LoginFormData>({ schema: loginSchema, mode: "onChange", defaultValues: { email: "", password: "", rememberMe: false } });
  const handleRegisterClick = () => { show("Đang mở trang đăng ký..."); router.push("/register"); };
  const handleSuccess = () => { show("Đang đăng nhập..."); document.cookie = "driver_auth=1; path=/"; router.push("/home"); };
  return (
    <div className="min-h-screen w-full p-4">
      <div className="max-w-md mx-auto">
        <div className="pt-10 pb-6">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-[#1A1A1A]">Eatzy Driver</motion.h1>
          <div className="text-sm text-[#555]">Đăng nhập để bắt đầu</div>
        </div>
        <LoginForm form={form} onForgotPassword={() => router.push("/forgot-password")} onSuccess={handleSuccess} onRegister={handleRegisterClick} />
        <div className="mt-6 flex items-center gap-3">
          <Button variant="secondary" size="lg" className="flex-1" onClick={handleRegisterClick}>Đăng ký</Button>
        </div>
      </div>
    </div>
  );
}
