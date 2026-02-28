"use client";

import { ImageWithFallback, LoginForm, useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";
import { sileo } from "@/components/DynamicIslandToast";
import { useZodForm, loginSchema, type LoginFormData } from "@repo/lib";
import { motion } from "@repo/ui/motion";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { Utensils, ShieldCheck, Bike } from "@repo/ui/icons";

export default function LoginPageContent() {
  const router = useRouter();
  const { handleLogin, isLoading, error } = useLogin();

  const form = useZodForm<LoginFormData>({
    schema: loginSchema,
    mode: "onChange",
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
    <div className="min-h-screen w-full bg-[#fafafa] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden selection:bg-lime-500 selection:text-black">
      <motion.div
        layoutId="auth-container"
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full md:h-auto max-w-[1440px] bg-white md:rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col lg:flex-row relative"
      >
        {/* Full Container Background Texture - Clearly visible now */}
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none z-0">
          <ImageWithFallback
            src=""
            alt="Container Texture"
            placeholderMode="horizontal"
            fill
            className="object-cover grayscale contrast-125"
          />
        </div>

        {/* Left Column - Editorial Hero */}
        <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-black/20 z-10 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gray-900">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
              alt="Gourmet Food"
              fill
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

          {/* Decorative Corner Label */}
          <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
            <div className="absolute top-8 -right-8 w-48 py-2 bg-lime-500 text-black font-anton font-bold text-[10px] text-center uppercase tracking-widest rotate-45 shadow-xl">
              Authentic Style
            </div>
          </div>
        </div>

        {/* Right Column - Refined Form with Glassmorphism */}
        <div className="flex-1 flex flex-col bg-white/30 backdrop-blur-xl relative overflow-hidden z-10 border-l border-white/20">
          {/* Mobile Header Image Overlay */}
          <div className="lg:hidden h-64 md:h-80 relative overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop"
              alt="Gourmet Food Mobile"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/20 to-transparent" />
            <div className="absolute bottom-6 left-8">
              <h2 className="text-5xl font-anton text-black font-bold uppercase tracking-tighter leading-none">LOGIN</h2>
              <p className="text-gray-500 text-sm font-medium mt-1">Welcome back to Eatzy</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center px-8 py-12 pb-0 md:px-16 md:py-20 md:pb-0 max-w-xl mx-auto w-full">
            <div className="hidden lg:block mb-12">
              <div className="text-[10px] text-lime-600 font-anton font-bold uppercase tracking-[0.4em] mb-4 flex items-center">
                <span className="w-8 h-px bg-lime-500 mr-3" />
                Auth Gateway
              </div>
              <h2 className="text-6xl font-anton font-bold text-black uppercase tracking-tighter leading-none mb-4">SIGN <span className="text-gray-200">IN</span></h2>
              <p className="text-gray-400 font-medium italic">Experience the art of dining through our curated network.</p>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-8 md:p-10 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-white/40 relative group">
              {/* Floating Decoration */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-lime-500 text-black rounded-2xl shadow-xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-500 z-20">
                <Utensils className="w-5 h-5" />
              </div>

              <LoginForm
                form={form}
                onForgotPassword={() => router.push("/forgot-password")}
                onSubmit={onSubmit}
                isLoading={isLoading}
                error={error}
                onSuccess={() => { }}
                onRegister={handleRegisterClick}
              />
            </div>

            {/* <div className="mt-12 text-center lg:text-left flex flex-col gap-4">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="h-px flex-1 bg-gray-100 hidden lg:block" />
                <span className="text-[10px] font-anton text-gray-300 uppercase tracking-widest">Global Account Platform</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 opacity-40 grayscale pointer-events-none">
                <div className="flex items-center gap-2">
                  <Bike className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Secure Pay</span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Footer Decoration */}
          <div className="mt-auto p-8 flex items-center justify-between text-[8px] text-gray-300 font-anton uppercase tracking-[0.3em] select-none">
            <span>Customer Interface v4.0</span>
            <span>Eatzy Culinary Group © 2026</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
