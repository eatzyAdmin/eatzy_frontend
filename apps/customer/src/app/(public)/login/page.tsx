"use client";

import { useRef } from "react";
import { LoginForm, LoginIllustration } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useZodForm, loginSchema, type LoginFormData } from "@repo/lib";
import { useTransitionStore } from "@/store/transitionStore";

export default function LoginPage() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const { startTransition } = useTransitionStore();

  const form = useZodForm<LoginFormData>({
    schema: loginSchema,
    mode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const handleRegisterClick = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      startTransition(rect, "/register");
      
      // Delay navigation to allow animation to start
      setTimeout(() => {
        router.push("/register");
      }, 100);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 md:p-8">
      {/* Main Card Container */}
      <div
        ref={cardRef}
        className="w-full max-w-7xl bg-gray-50 rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden animate-fade-in-up"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:min-h-[700px]">
          {/* Left Column - Illustration */}
          <div className="hidden lg:flex bg-gray-50 relative overflow-hidden">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--secondary)]/5"></div>
            
            {/* Floating orbs */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-[var(--primary)]/10 rounded-full blur-2xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-[var(--secondary)]/10 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            
            <LoginIllustration />
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-white rounded-r-[32px] md:rounded-r-[40px] shadow-xl relative">
            {/* Form Content */}
            <div className="relative z-10">
              <LoginForm
                form={form}
                onForgotPassword={() => router.push("/forgot-password")}
                onSuccess={() => router.push("/booking")}
                onRegister={handleRegisterClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
