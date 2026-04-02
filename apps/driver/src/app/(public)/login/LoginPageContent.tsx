"use client";

import { useState, useEffect } from "react";
import { ImageWithFallback, useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useZodForm, loginSchema, type LoginFormData } from "@repo/lib";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ShieldCheck } from "@repo/ui/icons";
import { sileo } from "@/components/DynamicIslandToast";
import { useMobileExitGuard } from "@/hooks/useMobileExitGuard";

// New Refactored Components
import MobileLoginDrawer from "@/features/auth/components/MobileLoginDrawer";
import MobileRegisterDrawer from "@/features/auth/components/MobileRegisterDrawer";
import MobileForgotPasswordDrawer from "@/features/auth/components/MobileForgotPasswordDrawer";
import DriverLoginForm from "@/features/auth/components/DriverLoginForm";

export default function LoginPageContent() {
  const router = useRouter();
  const { hide, show } = useLoading();
  const { handleLogin, isLoading, error } = useLogin();

  // Enable double-back-to-exit on mobile login page
  useMobileExitGuard();

  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">("login");

  // Sync loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, 500);
    return () => clearTimeout(timer);
  }, [hide]);

  // Responsive handling
  useEffect(() => {
    const checkViewport = () => setIsDesktop(window.innerWidth >= 1024);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Handle session expiration message from Interceptor
  useEffect(() => {
    const isExpired = window.localStorage.getItem("auth_expired");
    if (isExpired === "true") {
      sileo.error({
        title: "Phiên đăng nhập đã hết hạn",
        description: "Vui lòng đăng nhập lại để tiếp tục nhé!",
        duration: 5000,
      });
      window.localStorage.removeItem("auth_expired");
    }
  }, []);

  const form = useZodForm<LoginFormData>({
    schema: loginSchema,
    mode: "all",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    const success = await handleLogin(data);
    if (success) {
      sileo.success({
        title: "Đăng nhập thành công!",
        duration: 3000
      });
      show("Đang chuyển hướng về trang chủ...");
      router.push("/home");
    }
  };

  const handleRegisterClick = () => {
    if (isDesktop) {
      router.push("/register");
    } else {
      setActiveTab("register");
    }
  };

  return (
    <div className="h-screen w-full bg-[#fafafa] flex items-center justify-center overflow-hidden selection:bg-lime-500 selection:text-black">
      {/* MOBILE VIEW */}
      {!isDesktop && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end overflow-hidden">
          {/* Static Background Image for Driver App */}
          <div className="absolute inset-0 z-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1512110593301-af5e8d98d4e1?q=80&w=2072&auto=format&fit=crop"
              alt="Driver Mobile Hero"
              fill
              placeholderMode="horizontal"
              className="object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <MobileLoginDrawer
                key="login-drawer"
                form={form}
                onSubmit={onSubmit}
                onGoToRegister={() => setActiveTab("register")}
                onGoToForgot={() => setActiveTab("forgot")}
                isLoading={isLoading}
                error={error}
              />
            ) : activeTab === "register" ? (
              <MobileRegisterDrawer
                key="register-drawer"
                onBackToLogin={() => setActiveTab("login")}
              />
            ) : (
              <MobileForgotPasswordDrawer
                key="forgot-drawer"
                onBackToLogin={() => setActiveTab("login")}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* DESKTOP VIEW */}
      {isDesktop && (
        <motion.div
          layoutId="auth-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full h-full bg-[#fafafa] flex-col lg:flex-row relative"
        >
          {/* Left Side: Brand Visuals */}
          <div className="flex w-[49%] p-2 h-full z-10 relative">
            <div className="w-full h-full relative rounded-[16px] overflow-hidden bg-gray-900 border border-gray-100/10 shadow-2xl">
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1512110593301-af5e8d98d4e1?q=80&w=2072&auto=format&fit=crop"
                  alt="Driver Desktop Hero"
                  fill
                  placeholderMode="horizontal"
                  className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-[2s] scale-110 hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
              </div>

              <div className="relative z-10 w-full p-16 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-4 mb-12">
                    <div className="px-4 py-1.5 bg-lime-500 text-black font-anton font-bold text-xs tracking-widest uppercase rounded-full">
                      Partner Portal
                    </div>
                    <div className="h-px w-24 bg-white/20" />
                    <span className="text-[10px] text-white/40 font-anton uppercase tracking-[0.5em]">Global Logistics</span>
                  </div>

                  <h1 className="text-[140px] font-anton font-bold text-white leading-[0.75] tracking-tighter uppercase mb-6 drop-shadow-2xl">
                    DRIVE<br />
                    <span className="text-lime-500 italic">ZY.</span>
                  </h1>
                  <p className="text-white/60 text-xl font-medium max-w-sm leading-relaxed italic">
                    &quot;Empowering the next generation of logistics experts with technology and freedom.&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-12">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-anton text-lime-500 uppercase tracking-widest mb-2">Fleet Verified</span>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-white/80" />
                      <span className="text-sm text-white/80 font-medium tracking-tight">Encrypted Partner Link</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-white/30 font-anton uppercase tracking-[0.4em] rotate-180" style={{ writingMode: 'vertical-rl' }}>
                    Eatzy Driver v4.0
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Authentication Form */}
          <div className="flex-1 flex flex-col h-full bg-[#fafafa] relative overflow-hidden z-10">
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
              <div className="max-w-xl w-full mx-auto">
                <div className="mt-10 mb-3">
                  <h2 className="text-6xl font-anton font-bold text-black uppercase tracking-tighter leading-none mb-4">LOG IN <span className="text-gray-200">DRIVER</span></h2>
                  <p className="text-gray-400 font-medium italic">Welcome back partner. Your fleet is waiting for you.</p>
                </div>

                <DriverLoginForm
                  form={form}
                  onSubmit={onSubmit}
                  onForgotPassword={() => router.push("/forgot-password")}
                  onRegister={handleRegisterClick}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Footer Decoration */}
            <div className="mt-auto p-8 flex items-center justify-between text-[10px] text-gray-300 font-anton uppercase tracking-[0.3em] select-none">
              <span>Driver Interface v4.0</span>
              <span>Eatzy Fleet Management © 2026</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
