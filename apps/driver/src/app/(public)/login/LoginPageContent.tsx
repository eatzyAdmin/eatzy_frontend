"use client";
import { LoginForm, useLoading, useNotification } from "@repo/ui";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { motion } from "@repo/ui/motion";
import { useRouter } from "next/navigation";
import { useZodForm, loginSchema, type LoginFormData } from "@repo/lib";
import { Button } from "@repo/ui";

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
        format: "excel",
        autoHideDuration: 3000
      });
      show("Đang chuyển hướng về trang chủ...");
      router.push("/home");
    }
  };

  return (
    <div className="min-h-screen w-full p-4">
      <div className="max-w-md mx-auto">
        <div className="pt-10 pb-6">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-[#1A1A1A]">Eatzy Driver</motion.h1>
          <div className="text-sm text-[#555]">Đăng nhập để bắt đầu</div>
        </div>
        <LoginForm
          form={form}
          onForgotPassword={() => router.push("/forgot-password")}
          onSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          onSuccess={() => { }} // handled by onSubmit
          onRegister={handleRegisterClick}
        />
        <div className="mt-6 flex items-center gap-3">
          <Button variant="secondary" size="lg" className="flex-1" type="button" onClick={handleRegisterClick}>Đăng ký</Button>
        </div>
      </div>
    </div>
  );
}
