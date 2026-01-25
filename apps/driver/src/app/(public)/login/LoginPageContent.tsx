"use client";
import { LoginForm, useLoading, useNotification } from "@repo/ui";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { motion } from "@repo/ui/motion";
import { useRouter } from "next/navigation";
import { useZodForm, loginSchema, type LoginFormData } from "@repo/lib";
import { Button } from "@repo/ui";
import { Bike, ShieldCheck } from "@repo/ui/icons";

export default function LoginPageContent() {
  const router = useRouter();
  const { show } = useLoading();
  const { showNotification } = useNotification();
  const { handleLogin, isLoading, error } = useLogin();

  const form = useZodForm<LoginFormData>({
    schema: loginSchema,
    mode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false }
  });

  const handleRegisterClick = () => {
    show("Đang mở trang đăng ký...");
    router.push("/register");
  };

  const onSubmit = async (data: LoginFormData) => {
    const success = await handleLogin(data);
    if (success) {
      showNotification({
        message: "Đăng nhập thành công!",
        type: "success",
        format: "Đăng nhập thành công.",
        autoHideDuration: 3000
      });
      show("Đang chuyển hướng về trang chủ...");
      router.push("/home");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="w-full max-w-md bg-[#F8F9FA] rounded-[40px] overflow-hidden shadow-2xl border border-white/20"
      >
        {/* Header - Matching OrderDetailsModal */}
        <div className="bg-white px-8 py-6 border-b border-gray-100 flex flex-col items-center shadow-sm/50">
          <div className="w-20 h-20 rounded-[24px] bg-lime-100 flex items-center justify-center mb-4 shadow-sm border border-lime-200">
            <Bike className="w-10 h-10 text-[var(--primary)]" />
          </div>
          <h1 className="text-2xl font-anton font-bold text-[#1A1A1A]">LOGIN</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded text-mono">Eatzy Driver</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-medium text-gray-500">Partner App</span>
          </div>
        </div>

        {/* Content - Matching OrderDetailsModal style */}
        <div className="p-6 space-y-5">

          {/* Login Form Card */}
          <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                <Bike className="w-4 h-4 text-gray-500" />
              </div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông tin đăng nhập</h4>
            </div>

            <LoginForm
              form={form}
              onForgotPassword={() => router.push("/forgot-password")}
              onSubmit={onSubmit}
              isLoading={isLoading}
              error={error}
              onSuccess={() => { }}
              onRegister={undefined}
            />
          </div>


          {/* Register Section - Matching OrderCard style */}
          <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
            <div className="px-6 pt-4 border-b border-gray-50 bg-gray-50/30">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chưa có tài khoản?</h4>
            </div>
            <div className="p-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-2xl h-14 font-bold border-4 border-gray-100 hover:border-[var(--primary)]/40 hover:bg-gray-50/30 text-[#1A1A1A] transition-all duration-300"
                type="button"
                onClick={handleRegisterClick}
              >
                <span className="font-anton text-base">ĐĂNG KÝ TÀI XẾ</span>
              </Button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
