"use client";

import { LoginForm, useLoading, useNotification } from "@repo/ui";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useRouter } from "next/navigation";
import { useZodForm, loginSchema, type LoginFormData } from "@repo/lib";
import { motion } from "@repo/ui/motion";
import { Shield, ShieldCheck } from "@repo/ui/icons";

export default function LoginPageContent() {
  const router = useRouter();
  const { show } = useLoading();
  const { showNotification } = useNotification();
  const { handleLogin, isLoading, error } = useLogin();

  const form = useZodForm<LoginFormData>({
    schema: loginSchema,
    mode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    const success = await handleLogin(data);
    if (success) {
      showNotification({
        message: "Đăng nhập thành công!",
        type: "success",
        format: "Đăng nhập thành công.",
        autoHideDuration: 3000
      });
      show("Đang chuyển hướng về trang quản trị...");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="w-full max-w-md lg:max-w-5xl bg-white rounded-[40px] overflow-hidden shadow-2xl border border-white/20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px] lg:min-h-[640px]">
          {/* Left Column - Illustration (Desktop only) */}
          <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-lime-50 via-white to-lime-100">
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-lime-200/50 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-lime-300/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Content */}
            <div className="flex flex-col items-center justify-center w-full p-12">
              <div className="w-32 h-32 rounded-[32px] bg-lime-100 flex items-center justify-center mb-8 shadow-lg border border-lime-200">
                <Shield className="w-16 h-16 text-[var(--primary)]" />
              </div>
              <h2 className="text-3xl font-anton text-[#1A1A1A] mb-4">EATZY ADMIN</h2>
              <p className="text-gray-500 text-center max-w-xs">
                Quản trị hệ thống và giám sát toàn bộ nền tảng
              </p>

              {/* Safety Banner */}
              <div className="mt-8 bg-white/80 backdrop-blur-sm border border-lime-100/50 p-4 rounded-[20px] flex items-center gap-3 max-w-xs">
                <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  High-security access. <span className="font-bold text-[var(--primary)]">All actions are logged.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-[#F8F9FA] flex flex-col">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white px-8 py-6 border-b border-gray-100 flex flex-col items-center">
              <div className="w-20 h-20 rounded-[24px] bg-lime-100 flex items-center justify-center mb-4 shadow-sm border border-lime-200">
                <Shield className="w-10 h-10 text-[var(--primary)]" />
              </div>
              <h1 className="text-2xl font-anton font-bold text-[#1A1A1A]">ADMIN LOGIN</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded">Eatzy Admin</span>
                <span className="text-gray-300">|</span>
                <span className="text-sm font-medium text-gray-500">Control Panel</span>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block px-8 pt-8">
              <h1 className="text-3xl font-anton font-bold text-[#1A1A1A]">ADMIN LOGIN</h1>
              <p className="text-gray-500 mt-2">Truy cập vào hệ thống quản trị</p>
            </div>

            {/* Form Content */}
            <div className="flex-1 p-6 lg:p-8 space-y-5">
              <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-lime-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[var(--primary)]" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Administrator Access</h4>
                </div>

                <LoginForm
                  form={form}
                  onForgotPassword={() => router.push("/forgot-password")}
                  onSubmit={onSubmit}
                  isLoading={isLoading}
                  error={error}
                  onSuccess={() => { }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
