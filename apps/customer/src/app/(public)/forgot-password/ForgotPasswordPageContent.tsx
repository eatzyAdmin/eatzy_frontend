"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { LoginIllustration } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useZodForm, emailVerificationSchema, type EmailVerificationData } from "@repo/lib";
import { FloatingLabelInput, Button } from "@repo/ui";
import { useState } from "react";

export default function ForgotPasswordPageContent({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();
  const [isSent, setIsSent] = useState(false);

  const form = useZodForm<EmailVerificationData>({
    schema: emailVerificationSchema,
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const handleBack = () => {
    router.back();
  };

  const onSubmit = (data: EmailVerificationData) => {
    // Mock behavior: mark as sent and show message
    // Real implementation should call an API to send reset link
    setIsSent(true);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
          <motion.div
            layoutId="auth-container"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.5,
            }}
            className="w-full max-w-4xl rounded-[32px] md:rounded-[40px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px] lg:min-h-[640px]">
              <div className="hidden lg:flex relative overflow-hidden bg-white/5 backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-[var(--secondary)]/10"></div>
                <div className="absolute top-10 right-10 w-24 h-24 bg-[var(--primary)]/20 rounded-full blur-2xl animate-pulse-slow"></div>
                <div className="absolute bottom-20 left-10 w-32 h-32 bg-[var(--secondary)]/20 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
                <LoginIllustration />
              </div>

              <div className="bg-white rounded-r-[32px] md:rounded-r-[40px] shadow-xl relative">
                <div className="relative z-10 p-8 md:p-12">
                  {isSent ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Yêu cầu đã được gửi</h3>
                      <p className="text-sm text-gray-600">Vui lòng kiểm tra email để nhận hướng dẫn đặt lại mật khẩu.</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="md" variant="primary" onClick={() => router.push("/login")}>
                          Quay về đăng nhập
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
                      <h3 className="text-xl font-semibold">Quên mật khẩu</h3>
                      <p className="text-sm text-gray-600">Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.</p>

                      <FloatingLabelInput label="Email" type="email" error={form.formState.errors.email?.message} {...form.register("email")} />

                      <div className="flex gap-2 items-center">
                        <Button size="md" type="submit">
                          Gửi yêu cầu
                        </Button>
                        <Button size="md" variant="ghost" onClick={handleBack} type="button">
                          Quay lại
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
