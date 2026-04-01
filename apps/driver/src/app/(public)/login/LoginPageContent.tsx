"use client";

import { useState, useEffect } from "react";
import { ImageWithFallback, useLoading, useNotification } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useZodForm, loginSchema, type LoginFormData } from "@repo/lib";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ShieldCheck, ChevronRight, Eye, EyeOff, Bike, Mail } from "@repo/ui/icons";

export default function LoginPageContent() {
  const router = useRouter();
  const { show } = useLoading();
  const { showNotification } = useNotification();
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
                      ? "https://images.unsplash.com/photo-1512110593301-af5e8d98d4e1?q=80&w=2072&auto=format&fit=crop"
                      : activeTab === "register"
                        ? "https://images.unsplash.com/photo-1549413283-7c8584826b5c?q=80&w=2070&auto=format&fit=crop"
                        : "https://images.unsplash.com/photo-1510511459019-5dee997ddfdf?q=80&w=2070&auto=format&fit=crop"
                  }
                  alt="Driver Mobile Hero"
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
                className="relative z-10 w-full bg-white rounded-t-[48px] p-10 flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.15)] max-h-[85vh] overflow-y-auto no-scrollbar outline-none"
              >
                <div className="flex items-center justify-between mb-12">
                  <span className="text-gray-400 font-bold text-sm tracking-tight opacity-60">Drive with Eatzy, Earn easy!</span>
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-gray-900 font-black text-lg tracking-tighter flex items-center gap-1 active:scale-95 transition-all group"
                  >
                    <span>Join us</span>
                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={2.7} />
                  </button>
                </div>

                <div className="mb-10">
                  <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">Log in</h1>
                </div>

                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute left-2 top-2 bottom-2 w-11 h-11 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10 box-content">
                        <Bike size={16} strokeWidth={3} />
                      </div>
                      <input
                        type="email"
                        placeholder="driver e-mail"
                        {...form.register("email")}
                        className="w-full h-[64px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-4 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic"
                      />
                    </div>
                    {form.formState.errors.email && <p className="text-[10px] text-red-500 font-bold ml-6 uppercase">{form.formState.errors.email.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute left-2 top-2 bottom-2 w-11 h-11 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10 box-content">
                        <ShieldCheck size={16} strokeWidth={3.0} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="security password"
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
                        <span>Forgot password?</span>
                        <ChevronRight size={12} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col space-y-8">
                    <p className="text-[10px] text-gray-300 font-medium leading-relaxed max-w-xs ml-2">
                      Drive safely. Your security and data protection is our top priority while you navigate the city.
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
                            <span className="text-black/60 text-sm">Validating...</span>
                          </div>
                        ) : (
                          <>
                            <span className="tracking-tight">Start Driving Session</span>
                            <ChevronRight size={20} strokeWidth={3} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : activeTab === "register" ? (
              <motion.div
                key="register-redirect"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="relative z-10 w-full bg-white rounded-t-[48px] p-10 flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.15)] h-[50vh] justify-center items-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-lime-100 flex items-center justify-center rounded-3xl border-4 border-lime-200">
                  <Bike size={40} className="text-lime-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Become a Partner</h2>
                  <p className="text-gray-400 font-medium mt-2 italic px-8">Ready to join the fleet? Please visit our portal to complete your registration.</p>
                </div>
                <button
                  onClick={() => router.push("/register")}
                  className="w-full h-16 bg-black text-white rounded-full font-black text-lg flex items-center justify-center gap-3"
                >
                  <span>Apply Now</span>
                  <ChevronRight size={20} strokeWidth={3} />
                </button>
                <button onClick={() => setActiveTab("login")} className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">Back to login</button>
              </motion.div>
            ) : (
              <motion.div
                key="forgot-redirect"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="relative z-10 w-full bg-white rounded-t-[48px] p-10 flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.15)] h-[40vh] justify-center items-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-zinc-100 flex items-center justify-center rounded-full border-4 border-zinc-200">
                  <ShieldCheck size={32} className="text-zinc-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Security Portal</h2>
                <button
                  onClick={() => router.push("/forgot-password")}
                  className="w-full h-16 bg-black text-white rounded-full font-black text-lg flex items-center justify-center gap-3"
                >
                  <span>Go to Support</span>
                  <ChevronRight size={20} strokeWidth={3} />
                </button>
                <button onClick={() => setActiveTab("login")} className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">Back to login</button>
              </motion.div>
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

          <div className="flex-1 flex flex-col h-full bg-[#fafafa] relative overflow-hidden z-10">
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
              <div className="max-w-xl w-full mx-auto">
                <div className="mt-10 mb-3">
                  <h2 className="text-6xl font-anton font-bold text-black uppercase tracking-tighter leading-none mb-4">LOG IN <span className="text-gray-200">DRIVER</span></h2>
                  <p className="text-gray-400 font-medium italic">Welcome back partner. Your fleet is waiting for you.</p>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] border border-gray-100 relative group">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.2em] ml-2">Partner Email</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          {...form.register("email")}
                          placeholder="driver@eatzy.com"
                          className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 font-bold text-black focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all placeholder:text-gray-200"
                        />
                      </div>
                      {form.formState.errors.email && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">{form.formState.errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.2em] ml-2">Access Key</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                          <ShieldCheck size={18} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          {...form.register("password")}
                          placeholder="••••••••"
                          className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-12 font-bold text-black focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all placeholder:text-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {form.formState.errors.password && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">{form.formState.errors.password.message}</p>}

                      <div className="flex justify-end pt-1">
                        <button type="button" onClick={() => router.push("/forgot-password")} className="text-[10px] font-bold text-gray-300 hover:text-black uppercase tracking-widest">Forgot access?</button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
                      >
                        <span className="text-lg tracking-tight">Go Online Now</span>
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex items-center justify-center text-center">
                      <span className="text-xs text-gray-300 font-medium italic">New to the fleet? <button type="button" onClick={handleRegisterClick} className="text-black font-bold border-b border-black pb-0.5 ml-1">Join the community</button></span>
                    </div>
                  </form>
                </div>
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
