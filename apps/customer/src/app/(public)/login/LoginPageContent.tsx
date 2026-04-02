"use client";

import { useState, useEffect } from "react";
import { ImageWithFallback, useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";
import { sileo } from "@/components/DynamicIslandToast";
import { useZodForm, loginSchema, type LoginFormData } from "@repo/lib";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { Key } from "@repo/ui/icons";
import { useMobileExitGuard } from "@/hooks/useMobileExitGuard";
import CustomerLoginForm from "@/features/auth/components/CustomerLoginForm";
import MobileLoginDrawer from "@/components/auth/MobileLoginDrawer";
import MobileRegisterDrawer from "@/components/auth/MobileRegisterDrawer";
import MobileForgotPasswordDrawer from "@/components/auth/MobileForgotPasswordDrawer";

export default function LoginPageContent() {
  const router = useRouter();
  const { handleLogin, isLoading, error } = useLogin();
  
  // Enable double-back-to-exit on mobile login page
  useMobileExitGuard();

  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">("login");

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
        description: "Vui lòng đăng nhập lại để tiếp tục bữa tiệc hân hoan nhất!",
        duration: 5000,
      });
      window.localStorage.removeItem("auth_expired");
    }
  }, []);

  const form = useZodForm<LoginFormData>({
    schema: loginSchema,
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const { show, hide } = useLoading();

  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, 500);
    return () => clearTimeout(timer);
  }, [hide]);

  const handleRegisterClick = () => {
    router.push("/register");
  };

  const onSubmit = async (data: LoginFormData) => {
    const success = await handleLogin(data);
    if (success) {
      sileo.success({
        title: "Đăng nhập thành công!",
        description: "Đang chuyển hướng về trang chủ...",
        duration: 3000
      });
      show("Đang chuyển hướng về trang chủ...");
      router.push("/home");
    }
  };

  return (
    <div className="h-screen w-full bg-[#fafafa] flex items-center justify-center overflow-hidden selection:bg-lime-500 selection:text-black">
      {/* MOBILE VIEW */}
      {!isDesktop && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <ImageWithFallback
                  src={
                    activeTab === "login"
                      ? "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
                      : activeTab === "register"
                      ? "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
                      : "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop"
                  }
                  alt="Gourmet Mobile Hero"
                  fill
                  placeholderMode="horizontal"
                  className="object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <MobileLoginDrawer
                key="login-drawer"
                onSignUpClick={() => setActiveTab("register")}
                onForgotClick={() => setActiveTab("forgot")}
                onSubmit={onSubmit}
                isLoading={isLoading}
                error={error}
              />
            ) : activeTab === "register" ? (
              <MobileRegisterDrawer key="register-drawer" onBackToLogin={() => setActiveTab("login")} />
            ) : (
              <MobileForgotPasswordDrawer key="forgot-drawer" onBackToLogin={() => setActiveTab("login")} />
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
          <div className="flex w-[49%] p-2 h-full z-10 relative">
            <div className="w-full h-full relative rounded-[16px] overflow-hidden bg-gray-900 border border-gray-100/10">
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
                  alt="Gourmet Food"
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
                      Issue No. 01
                    </div>
                    <div className="h-px w-24 bg-white/20" />
                    <span className="text-[10px] text-white/40 font-anton uppercase tracking-[0.5em]">Global Presence</span>
                  </div>

                  <h1 className="text-[140px] font-anton font-bold text-white leading-[0.75] tracking-tighter uppercase mb-6 drop-shadow-2xl">
                    EAT<br />
                    <span className="text-lime-500 italic">ZY.</span>
                  </h1>
                  <p className="text-white/60 text-xl font-medium max-w-sm leading-relaxed italic">
                    &quot;Designing the future of culinary experiences, one plate at a time.&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-12">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-anton text-lime-500 uppercase tracking-widest mb-2">Security Verified</span>
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-white/80" />
                      <span className="text-sm text-white/80 font-medium tracking-tight">Encrypted Connection</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-white/30 font-anton uppercase tracking-[0.4em] rotate-180" style={{ writingMode: 'vertical-rl' }}>
                    Est. Twenty Twenty Six
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col h-full bg-[#fafafa] relative overflow-hidden z-10">
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
              <div className="max-w-xl w-full mx-auto">
                <div className="mt-10 mb-3">
                  <h2 className="text-6xl font-anton font-bold text-black uppercase tracking-tighter leading-none mb-4">SIGN IN <span className="text-gray-200">NOW</span></h2>
                  <p className="text-gray-400 font-medium italic">Experience the art of dining through our curated network.</p>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] border border-gray-100 relative group">
                  <CustomerLoginForm
                    form={form}
                    onForgotPassword={() => router.push("/forgot-password")}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    error={error}
                    onSuccess={() => { }}
                    onRegister={handleRegisterClick}
                  />
                </div>
              </div>
            </div>

            {/* Footer Decoration */}
            <div className="mt-auto p-8 flex items-center justify-between text-[10px] text-gray-300 font-anton uppercase tracking-[0.3em] select-none">
              <span>Customer Interface v4.0</span>
              <span>Eatzy Culinary Group © 2026</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
