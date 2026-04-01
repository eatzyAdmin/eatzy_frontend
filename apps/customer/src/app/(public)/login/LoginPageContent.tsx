"use client";

import { useState, useEffect } from "react";
import { ImageWithFallback, useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";
import { sileo } from "@/components/DynamicIslandToast";
import { useZodForm, loginSchema, type LoginFormData } from "@repo/lib";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { ShieldCheck, ChevronRight, Eye, EyeOff } from "@repo/ui/icons";
import CustomerLoginForm from "@/features/auth/components/CustomerLoginForm";
import MobileRegisterDrawer from "@/components/auth/MobileRegisterDrawer";
import MobileForgotPasswordDrawer from "@/components/auth/MobileForgotPasswordDrawer";

export default function LoginPageContent() {
  const router = useRouter();
  const { handleLogin, isLoading, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">("login");

  useEffect(() => {
    const checkViewport = () => setIsDesktop(window.innerWidth >= 1024);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const form = useZodForm<LoginFormData>({
    schema: loginSchema,
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const { show } = useLoading();

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
              <motion.div
                key="login-drawer"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 150, delay: 0.1 }}
                className="relative z-10 w-full bg-white rounded-t-[48px] p-10 flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.15)] max-h-[85vh] overflow-y-auto no-scrollbar"
              >
                <div className="flex items-center justify-between mb-12">
                  <span className="text-gray-400 font-bold text-sm tracking-tight opacity-60">Eat Eatzy, eat easy!</span>
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-gray-900 font-black text-lg tracking-tighter flex items-center gap-1 active:scale-95 transition-all group"
                  >
                    <span>Sign up</span>
                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={2.7} />
                  </button>
                </div>

                <div className="mb-10">
                  <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Log in</h1>
                </div>

                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                  onChange={() => { }}
                >
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute left-2 top-2 bottom-2 p-4 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10">
                        <span className="font-extrabold text-sm">@</span>
                      </div>
                      <input
                        type="email"
                        placeholder="e-mail address"
                        {...form.register("email")}
                        className="w-full h-[64px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-4 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic"
                      />
                    </div>
                    {form.formState.errors.email && <p className="text-[10px] text-red-500 font-bold ml-6 uppercase">{form.formState.errors.email.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute left-2 top-2 bottom-2 p-4 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10">
                        <ShieldCheck size={16} strokeWidth={3.0} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        {...form.register("password")}
                        className="w-full h-[64px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-16 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-black transition-all active:scale-95 z-10"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {form.formState.errors.password && <p className="mt-1 text-[10px] text-red-500 font-bold ml-6 uppercase">{form.formState.errors.password.message}</p>}

                    <div className="flex justify-end px-4">
                      <button
                        type="button"
                        onClick={() => setActiveTab("forgot")}
                        className="text-[11px] font-bold text-gray-400 hover:text-black transition-all flex items-center gap-1 uppercase tracking-widest group"
                      >
                        <span>Forgot password</span>
                        <ChevronRight size={12} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col space-y-8">
                    <p className="text-[10px] text-gray-300 font-medium leading-relaxed max-w-xs ml-2">
                      Eatzy ensures your privacy and personal data remains protected by advanced encryption systems.
                    </p>

                    <div className="space-y-6">
                      <button
                        type="submit"
                        disabled={isLoading || !form.formState.isValid}
                        className={`w-full h-16 rounded-full font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${(isLoading || !form.formState.isValid)
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : "bg-black text-white hover:bg-zinc-800 shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
                          }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span className="text-black/60 text-sm">Authenticating...</span>
                          </div>
                        ) : (
                          <>
                            <span className="tracking-tight">Continue to Explore</span>
                            <ChevronRight size={20} strokeWidth={3} className={!form.formState.isValid ? 'opacity-80' : ''} />
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          className="text-[11px] font-bold text-gray-400 border-b border-gray-100 pb-1 hover:text-black transition-colors"
                        >
                          Click here for more info.
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : activeTab === "register" ? (
              <MobileRegisterDrawer onBackToLogin={() => setActiveTab("login")} />
            ) : (
              <MobileForgotPasswordDrawer onBackToLogin={() => setActiveTab("login")} />
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
                      <ShieldCheck className="w-5 h-5 text-white/80" />
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
